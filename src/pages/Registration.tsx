'use client';

import Link from "next/link";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import studentLibrary from "@/assets/student-library.jpeg";
import { CheckCircle, FileText, ArrowRight } from "lucide-react";

const faqs = [
  { question: "How do I register for IJMB online?", answer: "Visit our registration page, fill in your details including O-Level results, select your preferred subjects and study centre, make payment, and submit your application." },
  { question: "When does IJMB registration open?", answer: "IJMB registration typically opens between January and September each year. The 2026/2027 session registration is currently open." },
  { question: "Can I register for IJMB without JAMB?", answer: "Yes. You do not need a JAMB score or UTME result to register for the IJMB programme. However, you will need JAMB for direct entry processing after completing IJMB." },
  { question: "What documents do I need for IJMB registration?", answer: "You need your O-Level result (WAEC/NECO/NABTEB), passport photographs, birth certificate or age declaration, and a valid means of identification." },
  { question: "Is IJMB registration form free?", answer: "No. There is a registration fee that covers your application processing, study materials, and examination registration. See our fees page for current amounts." },
];

const Registration = () => (
  <>
    <SEOHead
      title="IJMB Registration Form 2026/2027 – Apply Online Now"
      description="Complete your IJMB registration form online. Step-by-step guide to register for the IJMB programme and gain 200 level admission."
      canonical="https://www.ijmb.info/ijmb-registration"
      keywords="IJMB registration form, IJMB registration 2026/2027, register for IJMB online"
    />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "IJMB Registration" }]} />

    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">
              IJMB Registration Form 2026/2027
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              The IJMB registration form for the 2026/2027 academic session is now available. Register today to secure your spot
              in the Interim Joint Matriculation Board programme and gain direct entry admission into 200 level of any Nigerian university without writing UTME.
            </p>

            <h2 className="text-2xl font-heading font-bold mt-10 mb-4">How to Register for IJMB</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Registering for the IJMB programme is simple and straightforward. Follow these steps to complete your IJMB registration form:
            </p>
            <div className="space-y-4 mb-8">
              {[
                "Confirm you meet the IJMB admission requirements (minimum 5 O-Level credits)",
                "Choose 3 A-Level subjects relevant to your desired university course",
                "Select your preferred IJMB study centre in Nigeria",
                "Complete the IJMB registration form with your personal details",
                "Upload your O-Level result, passport photograph, and identification",
                "Pay the IJMB registration fee online or at an approved centre",
                "Receive your registration confirmation and admission letter",
                "Resume at your chosen IJMB centre on the specified date",
              ].map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <p className="text-muted-foreground pt-1">{step}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-heading font-bold mt-10 mb-4">IJMB Registration Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Before completing the IJMB registration form, ensure you meet these eligibility criteria:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Minimum of 5 O-Level credits in relevant subjects including English Language and Mathematics",
                "WAEC, NECO, or NABTEB result (awaiting result candidates may also apply)",
                "Must be at least 16 years old at the time of registration",
                "No JAMB/UTME score is required for IJMB registration",
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-muted-foreground">
                  <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-heading font-bold mt-10 mb-4">Documents Required for IJMB Registration</h2>
            <ul className="space-y-3 mb-8">
              {[
                "Original and photocopy of O-Level result (WAEC/NECO/NABTEB)",
                "4 recent passport photographs (white background)",
                "Birth certificate or sworn age declaration",
                "Valid means of identification (National ID, voter's card, or international passport)",
                "Evidence of payment of IJMB registration fee",
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-muted-foreground">
                  <FileText size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-heading font-bold mt-10 mb-4">Why Register for IJMB?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The IJMB programme offers candidates a guaranteed path to university admission. With your IJMB certificate, you can:
            </p>
            <ul className="space-y-2 mb-8 text-muted-foreground">
              <li>• Gain admission into 200 level directly (skip 100 level completely)</li>
              <li>• Apply to over 200 Nigerian universities including UNILAG, ABU, UI, UNILORIN</li>
              <li>• Avoid the stress and uncertainty of writing UTME repeatedly</li>
              <li>• Complete your degree one year faster than UTME candidates</li>
              <li>• Access both federal and state university admissions through direct entry</li>
            </ul>

            <InternalLinks exclude="/ijmb-registration" />
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img src={studentLibrary.src} alt="Student completing IJMB registration form" className="w-full h-[250px] object-cover" loading="lazy" />
              </div>
              <div className="bg-primary text-primary-foreground p-6 rounded-xl">
                <h3 className="font-heading font-bold text-lg mb-3">Start Your Registration</h3>
                <p className="text-sm opacity-90 mb-4">
                  The 2026/2027 IJMB registration is open. Secure your spot now.
                </p>
                <Link
                  href="/register"
                  className="block w-full text-center px-6 py-3 font-bold rounded-lg cta-gradient text-accent-foreground hover:opacity-90 transition-opacity"
                >
                  Apply Now <ArrowRight size={16} className="inline ml-1" />
                </Link>
              </div>
              <div className="bg-secondary p-6 rounded-xl">
                <h3 className="font-heading font-bold mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/ijmb-admission-requirements" className="text-primary hover:underline">→ IJMB Requirements</Link></li>
                  <li><Link href="/ijmb-fees" className="text-primary hover:underline">→ IJMB Fees</Link></li>
                  <li><Link href="/ijmb-centres-in-nigeria" className="text-primary hover:underline">→ Study Centres</Link></li>
                  <li><Link href="/universities-accepting-ijmb" className="text-primary hover:underline">→ Accepting Universities</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection />
  </>
);

export default Registration;
