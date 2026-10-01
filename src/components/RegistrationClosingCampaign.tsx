'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Clock3, GraduationCap, Phone, ShieldCheck } from 'lucide-react';
import admissionsGuidance from '@/assets/04-ijmb-admissions-guidance.png';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

const WHATSAPP_NUMBER = '2348056994540';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hello Dynamic College of Advance Studies, I would like to register for IJMB. Please send me the registration details.',
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
const DISMISSED_KEY = 'ijmb-closing-campaign-dismissed-session-v1';

function WhatsAppMark({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.129 6.744 3.047 9.379L1.054 31.27l6.1-1.957a15.9 15.9 0 008.85 2.691C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.35 22.617c-.393 1.107-1.943 2.025-3.188 2.293-.852.182-1.963.326-5.705-1.227-4.787-1.986-7.867-6.834-8.107-7.152-.229-.318-1.928-2.568-1.928-4.895s1.221-3.473 1.654-3.947c.434-.475.947-.594 1.262-.594.316 0 .631.002.908.016.291.016.682-.111 1.068.814.393.947 1.34 3.264 1.457 3.502.119.238.197.514.039.83-.158.318-.236.514-.475.791-.236.277-.498.619-.711.83-.238.238-.486.496-.209.971.277.475 1.234 2.035 2.65 3.299 1.82 1.623 3.354 2.127 3.83 2.365.475.238.752.197 1.029-.119.277-.316 1.182-1.379 1.498-1.854.316-.475.633-.395 1.068-.238.434.158 2.752 1.299 3.225 1.535.475.238.791.355.908.553.119.197.119 1.145-.275 2.252z" />
    </svg>
  );
}

function rememberDismissal() {
  window.sessionStorage.setItem(DISMISSED_KEY, 'true');
}

export function CampaignAnnouncementBar() {
  return (
    <aside className="relative z-40 overflow-hidden border-b border-red-200 bg-[#fff1f2] text-[#9f1239]" aria-label="Registration announcement">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(190,18,60,0.09),transparent_35%)]" />
      <div className="relative mx-auto flex min-h-12 max-w-7xl items-center justify-between gap-2.5 px-3 py-2 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-100 text-[#b91c1c]">
            <Clock3 className="h-4 w-4" />
          </span>
          <p className="min-w-0 text-[0.78rem] leading-tight sm:text-sm">
            <strong className="block font-heading font-extrabold text-[#991b1b] sm:inline">IJMB registration closes soon.</strong>{' '}
            <span className="hidden text-[#9f1239]/75 sm:inline">Enquiries are still being accepted for this session.</span>
          </p>
        </div>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-3 text-xs font-extrabold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-4">
          <WhatsAppMark className="h-4 w-4" />
          <span className="hidden min-[390px]:inline">WhatsApp</span>
        </a>
      </div>
    </aside>
  );
}

const nextSteps = [
  'Confirm that you meet the entry requirements',
  'Choose a suitable accredited study centre',
  'Complete your registration for this session',
];

export function RegistrationClosingSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbf9_0%,#eef7f1_100%)] px-3 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24" aria-labelledby="registration-closing-title">
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[1.6rem] border border-white/70 bg-[#0a271b] text-white shadow-[0_32px_90px_rgba(7,45,29,0.24)] sm:rounded-[2.25rem] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative order-2 px-5 py-8 sm:px-9 sm:py-11 lg:order-1 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.08),transparent_34%)]" />
          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-accent sm:text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent motion-reduce:animate-none" /> Registration update
            </div>
            <h2 id="registration-closing-title" className="font-display max-w-2xl text-[2.15rem] font-bold leading-[1.05] sm:text-5xl lg:text-[3.45rem]">
              Still waiting for admission?
              <span className="mt-1 block text-accent">Your IJMB journey can start now.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              IJMB provides an established Direct Entry route into Nigerian universities. Registration for the current session is closing soon, and prospective students, parents and guardians can still speak with our admissions team.
            </p>
            <div className="mt-7 grid gap-2.5 sm:grid-cols-3">
              {nextSteps.map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.065] p-3.5 backdrop-blur-md">
                  <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent font-heading text-xs font-black text-accent-foreground">{index + 1}</span>
                  <p className="text-sm leading-5 text-white/80">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-4 font-extrabold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <WhatsAppMark /> Send WhatsApp message
              </a>
              <Link href="/register" className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] px-6 py-4 font-bold text-white backdrop-blur-lg transition hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Register online <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative order-1 min-h-[245px] overflow-hidden sm:min-h-[340px] lg:order-2 lg:min-h-full">
          <Image src={admissionsGuidance} alt="Admissions guidance for an IJMB student and parent" fill placeholder="blur" sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071f15] via-[#071f15]/20 to-transparent lg:bg-gradient-to-r lg:from-[#0a271b] lg:via-transparent lg:to-transparent" />
          <div className="glass-dark absolute inset-x-4 bottom-4 rounded-2xl p-4 sm:inset-x-6 sm:bottom-6 sm:p-5 lg:inset-x-8 lg:bottom-8">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground"><ShieldCheck className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="font-heading text-sm font-extrabold text-white sm:text-base">Dynamic College of Advance Studies</p>
                <p className="mt-1 text-xs leading-relaxed text-white/65 sm:text-sm">Registration support for prospective IJMB students.</p>
                <a href="tel:+2348056994540" className="mt-2 inline-flex items-center gap-1.5 text-sm font-extrabold text-accent hover:underline sm:text-base"><Phone className="h-4 w-4" /> 0805 699 4540</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CampaignPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(DISMISSED_KEY)) return;
    const timer = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) rememberDismissal();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bottom-0 left-0 top-auto max-h-[92dvh] w-full max-w-none translate-x-0 translate-y-0 overflow-y-auto overflow-x-hidden rounded-b-none rounded-t-[1.75rem] border border-red-400/35 bg-[linear-gradient(145deg,rgba(127,29,29,0.98),rgba(69,10,10,0.98))] p-0 text-white shadow-[0_30px_100px_rgba(69,10,10,0.5)] backdrop-blur-2xl sm:bottom-auto sm:left-[50%] sm:top-[50%] sm:w-[calc(100%-2rem)] sm:max-w-2xl sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-[2rem] [&>button]:right-4 [&>button]:top-4 [&>button]:z-30 [&>button]:rounded-full [&>button]:bg-black/30 [&>button]:p-2.5 [&>button]:text-white [&>button]:opacity-100 [&>button]:backdrop-blur-md [&>button]:hover:bg-black/50 sm:[&>button]:right-5 sm:[&>button]:top-5">
        <div className="grid sm:grid-cols-[0.8fr_1.2fr]">
          <div className="relative min-h-[150px] sm:min-h-full">
            <Image src={admissionsGuidance} alt="Admissions guidance for students and parents" fill placeholder="blur" sizes="(max-width: 640px) 100vw, 260px" className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#7f1d1d] via-transparent to-black/10 sm:bg-gradient-to-r sm:from-transparent sm:to-[#7f1d1d]/70" />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md sm:bottom-6 sm:left-6"><GraduationCap className="h-4 w-4 text-accent" /> Direct Entry pathway</span>
          </div>
          <div className="relative px-5 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-9">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white"><Clock3 className="h-3.5 w-3.5" /> Registration closing soon</span>
            <DialogTitle className="font-display mt-4 text-[2rem] font-bold leading-[1.05] text-white sm:text-[2.65rem]">Don&apos;t keep waiting for admission.</DialogTitle>
            <DialogDescription className="mt-3 text-sm leading-6 text-white/70 sm:text-base sm:leading-7">Speak with the admissions team about joining the current IJMB session and your route to Direct Entry university admission.</DialogDescription>
            <ul className="mt-5 space-y-2.5">
              {['Get registration guidance', 'Confirm requirements and study centre', 'Begin your application with confidence'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-white/[0.82]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[#991b1b]"><Check className="h-3 w-3 stroke-[3]" /></span>{item}
                </li>
              ))}
            </ul>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={rememberDismissal} className="mt-6 flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-4 text-base font-extrabold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><WhatsAppMark /> Send WhatsApp message</a>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
              <p className="text-xs font-bold text-white/55">Dynamic College of Advance Studies</p>
              <a href="tel:+2348056994540" className="inline-flex items-center gap-1.5 text-sm font-extrabold text-accent hover:underline"><Phone className="h-3.5 w-3.5" /> 0805 699 4540</a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { WHATSAPP_URL };
