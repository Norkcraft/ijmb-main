'use client';

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
}

const CTASection = ({
  title = "Ready to Start Your IJMB Journey?",
  subtitle = "Register now and gain direct entry admission into 200 level of any Nigerian university without UTME.",
}: CTASectionProps) => {
  const sectionRef = useScrollReveal<HTMLDivElement>({ y: 30 });

  return (
    <section className="section-padding bg-background">
      <div ref={sectionRef} className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#08271a] px-5 py-14 text-center text-primary-foreground shadow-[0_28px_80px_rgba(7,45,29,0.2)] sm:px-10 sm:py-16 lg:rounded-[2.5rem] lg:px-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(245,175,33,0.16),transparent_28%),radial-gradient(circle_at_5%_90%,rgba(255,255,255,0.07),transparent_24%)]" />
        <div className="relative">
        <h2 className="font-display mb-5 text-4xl font-bold leading-tight lg:text-5xl xl:text-6xl">{title}</h2>
        <p className="mx-auto mb-9 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{subtitle}</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-extrabold cta-gradient text-accent-foreground transition-all"
          >
            Register for IJMB Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.05] px-7 py-4 text-base font-bold backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
          >
            Contact Us
          </Link>
        </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
