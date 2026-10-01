'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Check, Clock3, MessageCircle, Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

const WHATSAPP_NUMBER = '2348056994540';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hello Dynamic College of Advance Studies, I want to register for IJMB. Please send me the registration details.',
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
const DISMISSED_KEY = 'ijmb-closing-campaign-dismissed';

function WhatsAppMark({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.129 6.744 3.047 9.379L1.054 31.27l6.1-1.957a15.9 15.9 0 008.85 2.691C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.35 22.617c-.393 1.107-1.943 2.025-3.188 2.293-.852.182-1.963.326-5.705-1.227-4.787-1.986-7.867-6.834-8.107-7.152-.229-.318-1.928-2.568-1.928-4.895s1.221-3.473 1.654-3.947c.434-.475.947-.594 1.262-.594.316 0 .631.002.908.016.291.016.682-.111 1.068.814.393.947 1.34 3.264 1.457 3.502.119.238.197.514.039.83-.158.318-.236.514-.475.791-.236.277-.498.619-.711.83-.238.238-.486.496-.209.971.277.475 1.234 2.035 2.65 3.299 1.82 1.623 3.354 2.127 3.83 2.365.475.238.752.197 1.029-.119.277-.316 1.182-1.379 1.498-1.854.316-.475.633-.395 1.068-.238.434.158 2.752 1.299 3.225 1.535.475.238.791.355.908.553.119.197.119 1.145-.275 2.252z" />
    </svg>
  );
}

export function CampaignAnnouncementBar() {
  return (
    <aside className="relative z-40 overflow-hidden bg-[#102a20] text-white" aria-label="Registration announcement">
      <div className="absolute inset-y-0 left-0 w-1 bg-accent" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground sm:flex">
            <Clock3 className="h-4 w-4" />
          </span>
          <p className="text-sm leading-snug">
            <strong className="font-heading text-accent">IJMB registration is closing soon.</strong>{' '}
            <span className="hidden text-white/75 md:inline">Secure your place for this session while enrolment is still open.</span>
          </p>
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <WhatsAppMark className="h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp us</span>
          <span className="sm:hidden">Enquire</span>
        </a>
      </div>
    </aside>
  );
}

export function RegistrationClosingSection() {
  return (
    <section className="relative overflow-hidden bg-[#f6faf7] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="registration-closing-title">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#102a20] text-white shadow-2xl shadow-primary/15 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="relative p-7 sm:p-10 lg:p-14">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-2 text-sm font-bold text-accent">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            Limited registration window
          </div>
          <h2 id="registration-closing-title" className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Still waiting for admission? <span className="text-accent">This is your next step.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            IJMB offers an alternative pathway into university through Direct Entry. Registration for this session is closing soon, so now is the time to secure your place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-bold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <WhatsAppMark /> Send WhatsApp message
            </a>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Register online <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between border-t border-white/10 bg-white/[0.055] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Why act now</p>
            <ul className="mt-6 space-y-4">
              {['Secure your place for this session', 'Start your IJMB journey', 'Take a proactive step towards university admission'].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/85">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-white">Dynamic College of Advance Studies</p>
            <a href="tel:+2348056994540" className="mt-2 inline-flex items-center gap-2 text-lg font-bold text-accent hover:underline">
              <Phone className="h-4 w-4" /> 0805 699 4540
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CampaignPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname !== '/') return;
    if (window.sessionStorage.getItem(DISMISSED_KEY)) return;

    const timer = window.setTimeout(() => setOpen(true), 1800);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) window.sessionStorage.setItem(DISMISSED_KEY, 'true');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto overflow-hidden border-0 bg-[#102a20] p-0 text-white shadow-2xl sm:rounded-[1.75rem] [&>button]:right-5 [&>button]:top-5 [&>button]:z-20 [&>button]:rounded-full [&>button]:bg-white/10 [&>button]:p-2 [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:bg-white/20">
        <div className="relative overflow-hidden px-6 pb-7 pt-10 sm:px-9 sm:pb-9 sm:pt-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-[#25D366]/15 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-accent-foreground">
              <Clock3 className="h-3.5 w-3.5" /> Closing soon
            </span>
            <DialogTitle className="mt-5 max-w-md font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
              Don&apos;t let this admission opportunity pass you by.
            </DialogTitle>
            <DialogDescription className="mt-4 text-base leading-relaxed text-white/70">
              IJMB registration for this session is running out. Secure your place and take a practical step towards Direct Entry university admission.
            </DialogDescription>

            <div className="my-6 grid gap-2.5 sm:grid-cols-3">
              {['Secure your place', 'Start your journey', 'Move towards admission'].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-3 text-sm font-medium text-white/85">
                  <Check className="h-4 w-4 shrink-0 text-accent" /> {item}
                </div>
              ))}
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => window.sessionStorage.setItem(DISMISSED_KEY, 'true')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-4 text-base font-extrabold text-white shadow-lg shadow-black/20 transition hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <WhatsAppMark /> Send WhatsApp message
            </a>
            <div className="mt-4 flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/55">Dynamic College of Advance Studies</p>
              <a href="tel:+2348056994540" className="inline-flex items-center gap-1.5 text-sm font-bold text-accent hover:underline">
                <Phone className="h-3.5 w-3.5" /> 0805 699 4540
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { WHATSAPP_URL };
