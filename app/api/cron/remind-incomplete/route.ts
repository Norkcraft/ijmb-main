import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { sendEmail } from '@/lib/resendClient';
import { acceptanceFeeReminderEmail, incompleteApplicationReminderEmail } from '@/lib/emailTemplates';

export const maxDuration = 60;

// Vercel automatically injects CRON_SECRET and sends it as
// "Authorization: Bearer <secret>" on every cron invocation.
function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return auth === `Bearer ${secret}`;
}

const THREE_DAYS_AGO = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let sent = 0;
  let errors = 0;
  let acceptanceReminders = 0;

  // ── Group 1: Registered students who never started an application ──────────
  // Query everyone older than 3 days who hasn't been reminded yet.
  const { data: noAppProfiles, error: noAppError } = await supabaseServer
    .from('profiles')
    .select('id, email, full_name')
    .eq('role', 'student')
    .is('reminder_sent_at', null)
    .lt('created_at', THREE_DAYS_AGO);

  if (noAppError) {
    console.error('[cron/remind-incomplete] Error fetching profiles:', noAppError);
    return NextResponse.json({ message: 'DB error fetching profiles' }, { status: 500 });
  }

  if (noAppProfiles && noAppProfiles.length > 0) {
    // Filter to only those with no application record
    const profileIds = noAppProfiles.map((p) => p.id);
    const { data: existingApps } = await supabaseServer
      .from('applications')
      .select('user_id')
      .in('user_id', profileIds);

    const appliedIds = new Set((existingApps ?? []).map((a) => a.user_id));

    for (const profile of noAppProfiles) {
      if (appliedIds.has(profile.id)) continue;

      const name = profile.full_name || 'Student';
      const { html, subject } = incompleteApplicationReminderEmail(name, 'no_application');
      const result = await sendEmail({
        to: profile.email,
        subject,
        html,
        replyTo: 'support@ijmb.info',
        emailType: 'reminder_no_application',
      });

      if (result.success) {
        sent++;
        // Mark as reminded so they don't get a second email
        await supabaseServer
          .from('profiles')
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq('id', profile.id);
      } else {
        errors++;
        console.error(`[cron/remind-incomplete] Failed to email ${profile.email}:`, result.error);
      }
    }
  }

  // ── Group 2: Draft applications not submitted ─────────────────────────────
  // Query everyone with a draft older than 3 days who hasn't been reminded yet.
  const { data: draftApps, error: draftError } = await supabaseServer
    .from('applications')
    .select('id, user_id, profiles(email, full_name)')
    .eq('status', 'draft')
    .is('reminder_sent_at', null)
    .lt('updated_at', THREE_DAYS_AGO);

  if (draftError) {
    console.error('[cron/remind-incomplete] Error fetching draft applications:', draftError);
    return NextResponse.json({ message: 'DB error fetching draft applications' }, { status: 500 });
  }

  for (const app of draftApps ?? []) {
    const profile = Array.isArray(app.profiles) ? app.profiles[0] : app.profiles;
    if (!profile?.email) continue;

    const name = profile.full_name || 'Student';
    const { html, subject } = incompleteApplicationReminderEmail(name, 'draft');
    const result = await sendEmail({
      to: profile.email,
      subject,
      html,
      replyTo: 'support@ijmb.info',
      emailType: 'reminder_abandoned_draft',
    });

    if (result.success) {
      sent++;
      // Mark as reminded so they don't get a second email
      await supabaseServer
        .from('applications')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', app.id);
    } else {
      errors++;
      console.error(`[cron/remind-incomplete] Failed to email ${profile.email}:`, result.error);
    }
  }

  // Group 3: Students admitted for at least 24 hours whose acceptance fee
  // has not been paid. Paying acceptance changes the status to fees_pending,
  // so this exact status filter automatically excludes accepted offers.
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: admittedApps, error: admittedError } = await supabaseServer
    .from('applications')
    .select('id, application_number, first_name, surname, profiles(email, full_name)')
    .eq('status', 'admitted')
    .lt('updated_at', oneDayAgo);

  if (admittedError) {
    errors++;
    console.error('[cron/remind-incomplete] Error fetching admitted applications:', admittedError);
  } else {
    const recipients = Array.from(new Set((admittedApps ?? []).flatMap((app) => {
      const profile = Array.isArray(app.profiles) ? app.profiles[0] : app.profiles;
      return profile?.email ? [profile.email] : [];
    })));

    const remindedRecipients = new Set<string>();
    if (recipients.length > 0) {
      const { data: previousReminders, error: reminderLogError } = await supabaseServer
        .from('email_logs')
        .select('recipient')
        .eq('email_type', 'reminder_acceptance_fee')
        .eq('status', 'sent')
        .in('recipient', recipients);

      if (reminderLogError) {
        errors++;
        console.error('[cron/remind-incomplete] Error checking acceptance reminder logs:', reminderLogError);
      } else {
        for (const log of previousReminders ?? []) remindedRecipients.add(log.recipient);

        for (const app of admittedApps ?? []) {
          const profile = Array.isArray(app.profiles) ? app.profiles[0] : app.profiles;
          if (!profile?.email || remindedRecipients.has(profile.email)) continue;

          const name = [app.first_name, app.surname].filter(Boolean).join(' ') || profile.full_name || 'Student';
          const applicationId = app.application_number || app.id.split('-')[0].toUpperCase();
          const { html, subject } = acceptanceFeeReminderEmail(name, applicationId);
          const result = await sendEmail({
            to: profile.email,
            subject,
            html,
            replyTo: 'support@ijmb.info',
            emailType: 'reminder_acceptance_fee',
          });

          if (result.success) {
            sent++;
            acceptanceReminders++;
            remindedRecipients.add(profile.email);
          } else {
            errors++;
            console.error(`[cron/remind-incomplete] Failed acceptance reminder for ${profile.email}:`, result.error);
          }
        }
      }
    }
  }

  console.log(`[cron/remind-incomplete] Done — sent: ${sent}, acceptance reminders: ${acceptanceReminders}, errors: ${errors}`);
  return NextResponse.json({ sent, acceptanceReminders, errors });
}
