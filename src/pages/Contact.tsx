'use client';

import Link from "next/link";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import { MessageSquare } from "lucide-react";

const WHATSAPP_LINK = "https://wa.link/udcjk0";

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

const Contact = () => (
  <>
    <SEOHead
      title={`Contact IJMB Official Support – ${YEAR} Admission Enquiries`}
      description={`Need help with IJMB registration? Chat with our official admission support team on WhatsApp for instant answers on ${YEAR} admission, fees, and study centres.`}
      canonical="https://www.ijmb.info/contact"
      keywords="Contact IJMB, IJMB WhatsApp, IJMB support, IJMB admission office, IJMB helpline"
    />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />

    <section className="section-padding">
      <div className="max-w-2xl mx-auto text-center">

        <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-5">
          Talk to Us on WhatsApp
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          Have a question about IJMB registration, fees, or study centres?
          Send us a message on WhatsApp — our admission officers are available and reply fast.
        </p>

        {/* WhatsApp CTA */}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:brightness-105 transition-all"
          style={{ backgroundColor: "#25D366" }}
        >
          {/* WhatsApp SVG icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 fill-current shrink-0">
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.129 6.744 3.047 9.379L1.054 31.27l6.1-1.957a15.9 15.9 0 008.85 2.691C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.35 22.617c-.393 1.107-1.943 2.025-3.188 2.293-.852.182-1.963.326-5.705-1.227-4.787-1.986-7.867-6.834-8.107-7.152-.229-.318-1.928-2.568-1.928-4.895s1.221-3.473 1.654-3.947c.434-.475.947-.594 1.262-.594.316 0 .631.002.908.016.291.016.682-.111 1.068.814.393.947 1.34 3.264 1.457 3.502.119.238.197.514.039.83-.158.318-.236.514-.475.791-.236.277-.498.619-.711.83-.238.238-.486.496-.209.971.277.475 1.234 2.035 2.65 3.299 1.82 1.623 3.354 2.127 3.83 2.365.475.238.752.197 1.029-.119.277-.316 1.182-1.379 1.498-1.854.316-.475.633-.395 1.068-.238.434.158 2.752 1.299 3.225 1.535.475.238.791.355.908.553.119.197.119 1.145-.275 2.252z"/>
          </svg>
          Chat with Us on WhatsApp
        </a>

        <p className="text-sm text-muted-foreground mt-5">
          Available Mon – Sat · Typically replies within minutes
        </p>

        {/* Quick Tip */}
        <div className="mt-12 bg-blue-50 border border-blue-100 p-6 rounded-xl text-left">
          <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
            <MessageSquare size={20} /> Quick Tip
          </h3>
          <p className="text-blue-800 text-sm">
            Most questions are answered in our{" "}
            <Link href="/faq" className="underline font-bold">
              Frequently Asked Questions
            </Link>{" "}
            section. Check it out for instant answers about fees, centres, and requirements.
          </p>
        </div>

      </div>

      <div className="max-w-6xl mx-auto mt-16">
        <InternalLinks />
      </div>
    </section>

    <CTASection />
  </>
);

export default Contact;
