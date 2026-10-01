'use client';

import Link from "next/link";
import Image from "next/image";
import ijmbLogo from "@/assets/ijmb-logo.jpeg";

const Footer = () => (
  <footer className="relative overflow-hidden bg-[#061d14] text-primary-foreground">
    <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.8fr] lg:gap-12 lg:pb-16">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <Image src={ijmbLogo} alt="IJMB Logo" width={44} height={44} className="h-11 w-11 rounded-xl ring-1 ring-white/15" />
            <div>
              <span className="font-heading font-bold text-lg block leading-none">IJMB Info</span>
              <span className="text-xs opacity-60 font-medium">Registration Portal</span>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/60">
            Your trusted source for IJMB registration, requirements, and updates across Nigeria.
            Gain direct entry admission into 200 level without UTME.
          </p>
        </div>
        <div>
          <h3 className="mb-5 font-heading text-sm font-extrabold uppercase tracking-[0.12em] text-white">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/ijmb-registration" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB Registration</Link></li>
            <li><Link href="/ijmb-admission-requirements" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">Admission Requirements</Link></li>
            <li><Link href="/ijmb-fees" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB Fees</Link></li>
            <li><Link href="/ijmb-centres-in-nigeria" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">Study Centres</Link></li>
            <li><Link href="/universities-accepting-ijmb" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">Accepting Universities</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-5 font-heading text-sm font-extrabold uppercase tracking-[0.12em] text-white">Resources</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/about" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">About Us</Link></li>
            <li><Link href="/blog" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">Blog & Updates</Link></li>
            <li><Link href="/ijmb-vs-jamb" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB vs JAMB</Link></li>
            <li><Link href="/faq" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">FAQ</Link></li>
            <li><Link href="/contact" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">Contact Us</Link></li>
            <li><Link href="/login" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">Student Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-5 font-heading text-sm font-extrabold uppercase tracking-[0.12em] text-white">Popular Locations</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/ijmb-in-anambra" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB in Anambra</Link></li>
            <li><Link href="/ijmb-in-ilorin" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB in Ilorin</Link></li>
            <li><Link href="/ijmb-in-lagos" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB in Lagos</Link></li>
            <li><Link href="/ijmb-in-abuja" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB in Abuja</Link></li>
            <li><Link href="/ijmb-in-port-harcourt" className="opacity-70 hover:opacity-100 hover:translate-x-1 inline-block transition-all">IJMB in Port Harcourt</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-7 text-center text-sm text-white/45 sm:text-left">
        <p>&copy; {new Date().getFullYear()} IJMB Info. All rights reserved. | <Link href="/contact" className="underline hover:opacity-100 transition-opacity">Contact Us</Link></p>
      </div>
    </div>
  </footer>
);

export default Footer;
