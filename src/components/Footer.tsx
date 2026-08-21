'use client';

import Link from "next/link";
import Image from "next/image";
import ijmbLogo from "@/assets/ijmb-logo.jpeg";

const Footer = () => (
  <footer className="bg-gradient-to-br from-primary via-primary to-emerald-900 text-primary-foreground relative overflow-hidden">
    {/* Top gradient divider */}
    <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

    <div className="absolute inset-0 pattern-dots opacity-10 pointer-events-none" />

    <div className="relative max-w-7xl mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <Image src={ijmbLogo} alt="IJMB Logo" width={44} height={44} className="h-11 w-11 rounded-full ring-2 ring-white/20" />
            <div>
              <span className="font-heading font-bold text-lg block leading-none">IJMB Info</span>
              <span className="text-xs opacity-60 font-medium">Registration Portal</span>
            </div>
          </div>
          <p className="text-sm opacity-70 leading-relaxed">
            Your trusted source for IJMB registration, requirements, and updates across Nigeria.
            Gain direct entry admission into 200 level without UTME.
          </p>
        </div>
        <div>
          <h3 className="font-heading font-bold mb-5 text-accent/90">Quick Links</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/ijmb-registration" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB Registration</Link></li>
            <li><Link href="/ijmb-admission-requirements" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">Admission Requirements</Link></li>
            <li><Link href="/ijmb-fees" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB Fees</Link></li>
            <li><Link href="/ijmb-centres-in-nigeria" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">Study Centres</Link></li>
            <li><Link href="/universities-accepting-ijmb" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">Accepting Universities</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-heading font-bold mb-5 text-accent/90">Resources</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">About Us</Link></li>
            <li><Link href="/blog" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">Blog & Updates</Link></li>
            <li><Link href="/ijmb-vs-jamb" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB vs JAMB</Link></li>
            <li><Link href="/faq" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">FAQ</Link></li>
            <li><Link href="/contact" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">Contact Us</Link></li>
            <li><Link href="/login" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">Student Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-heading font-bold mb-5 text-accent/90">Popular Locations</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/ijmb-in-anambra" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB in Anambra</Link></li>
            <li><Link href="/ijmb-in-ilorin" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB in Ilorin</Link></li>
            <li><Link href="/ijmb-in-lagos" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB in Lagos</Link></li>
            <li><Link href="/ijmb-in-abuja" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB in Abuja</Link></li>
            <li><Link href="/ijmb-in-port-harcourt" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB in Port Harcourt</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-14 pt-8 border-t border-primary-foreground/15 text-center text-sm opacity-60">
        <p>&copy; {new Date().getFullYear()} IJMB Info. All rights reserved. | <Link href="/contact" className="underline hover:opacity-100 transition-opacity">Contact Us</Link></p>
      </div>
    </div>
  </footer>
);

export default Footer;
