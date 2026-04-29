'use client';

import Link from "next/link";
import Image from "next/image";
import ijmbLogo from "@/assets/ijmb-logo.jpeg";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="max-w-7xl mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image src={ijmbLogo} alt="IJMB Logo" width={40} height={40} className="h-10 w-10 rounded-full" />
            <span className="font-heading font-bold text-lg">IJMB Info</span>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Your trusted source for IJMB registration, requirements, and updates across Nigeria.
            Gain direct entry admission into 200 level without UTME.
          </p>
        </div>
        <div>
          <h3 className="font-heading font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link href="/ijmb-registration" className="hover:opacity-100 transition-opacity">IJMB Registration</Link></li>
            <li><Link href="/ijmb-admission-requirements" className="hover:opacity-100 transition-opacity">Admission Requirements</Link></li>
            <li><Link href="/ijmb-fees" className="hover:opacity-100 transition-opacity">IJMB Fees</Link></li>
            <li><Link href="/ijmb-centres-in-nigeria" className="hover:opacity-100 transition-opacity">Study Centres</Link></li>
            <li><Link href="/universities-accepting-ijmb" className="hover:opacity-100 transition-opacity">Accepting Universities</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-heading font-bold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link href="/about" className="hover:opacity-100 transition-opacity">About Us</Link></li>
            <li><Link href="/blog" className="hover:opacity-100 transition-opacity">Blog & Updates</Link></li>
            <li><Link href="/ijmb-vs-jamb" className="hover:opacity-100 transition-opacity">IJMB vs JAMB</Link></li>
            <li><Link href="/faq" className="hover:opacity-100 transition-opacity">FAQ</Link></li>
            <li><Link href="/contact" className="hover:opacity-100 transition-opacity">Contact Us</Link></li>
            <li><Link href="/login" className="hover:opacity-100 transition-opacity">Student Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-heading font-bold mb-4">Popular Locations</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link href="/ijmb-in-anambra" className="hover:opacity-100 transition-opacity">IJMB in Anambra</Link></li>
            <li><Link href="/ijmb-in-ilorin" className="hover:opacity-100 transition-opacity">IJMB in Ilorin</Link></li>
            <li><Link href="/ijmb-in-lagos" className="hover:opacity-100 transition-opacity">IJMB in Lagos</Link></li>
            <li><Link href="/ijmb-in-abuja" className="hover:opacity-100 transition-opacity">IJMB in Abuja</Link></li>
            <li><Link href="/ijmb-in-port-harcourt" className="hover:opacity-100 transition-opacity">IJMB in Port Harcourt</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-70">
        <p>© {new Date().getFullYear()} IJMB Info. All rights reserved. | <Link href="/contact" className="underline">Contact Us</Link></p>
      </div>
    </div>
  </footer>
);

export default Footer;
