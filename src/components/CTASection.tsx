'use client';

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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
    <section className="bg-primary text-primary-foreground section-padding">
      <div ref={sectionRef} className="container-narrow text-center">
        <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">{title}</h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 font-bold text-base rounded-lg cta-gradient text-accent-foreground hover:opacity-90 transition-opacity"
          >
            Register for IJMB Now
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 font-bold text-base rounded-lg border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
