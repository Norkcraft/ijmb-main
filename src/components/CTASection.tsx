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
    <section className="relative bg-gradient-to-br from-primary via-primary to-emerald-900 text-primary-foreground section-padding overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div ref={sectionRef} className="relative container-narrow text-center">
        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-bold mb-5 leading-tight">{title}</h2>
        <p className="text-lg opacity-85 mb-10 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 font-bold text-base rounded-xl cta-gradient text-accent-foreground transition-all inline-flex items-center justify-center gap-2 group"
          >
            Register for IJMB Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 font-bold text-base rounded-xl border-2 border-primary-foreground/25 hover:bg-primary-foreground/10 hover:border-primary-foreground/40 transition-all inline-flex items-center justify-center backdrop-blur-sm"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
