'use client';

import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import { CheckCircle, AlertCircle, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

const federalUnis = [
  "University of Lagos (UNILAG)", "Ahmadu Bello University (ABU) Zaria", "University of Ibadan (UI)",
  "University of Nigeria, Nsukka (UNN)", "University of Ilorin (UNILORIN)", "University of Benin (UNIBEN)",
  "University of Jos (UNIJOS)", "University of Calabar (UNICAL)", "University of Port Harcourt (UNIPORT)",
  "Bayero University Kano (BUK)", "Federal University of Technology, Minna", "Federal University of Technology, Akure",
  "Obafemi Awolowo University (OAU)", "University of Maiduguri", "Usmanu Danfodiyo University, Sokoto",
  "Federal University, Oye-Ekiti", "Federal University, Lokoja", "Federal University, Lafia",
];

const stateUnis = [
  "Lagos State University (LASU)", "Olabisi Onabanjo University (OOU)", "Ekiti State University (EKSU)",
  "Adekunle Ajasin University, Akungba", "Ladoke Akintola University of Technology (LAUTECH)",
  "Osun State University", "Delta State University, Abraka", "Ambrose Alli University, Ekpoma",
  "Rivers State University", "Cross River University of Technology", "Kaduna State University",
  "Kogi State University", "Nasarawa State University", "Benue State University",
];

const privateUnis = [
  "Covenant University", "Babcock University", "Lead City University", "Afe Babalola University",
  "Bowen University", "Bells University of Technology", "Caleb University",
  "Redeemer's University", "Crawford University", "Achievers University",
];

const faqs = [
  { question: "Do all Nigerian universities accept IJMB?", answer: "Over 80% of Nigerian universities accept IJMB for Direct Entry. This includes most federal, state, and private universities. A few universities like UI and UNILAG may have specific grade requirements (e.g., 12 points and above)." },
  { question: "Can I study Medicine with IJMB?", answer: "Yes. Medicine, Pharmacy, Nursing, Law, and Engineering are available for IJMB candidates. However, these courses are competitive, so you need high points (13–15 points) to secure admission." },
  { question: "How do I apply for Direct Entry with IJMB?", answer: "After collecting your IJMB certificate, you will purchase the JAMB Direct Entry (DE) form, select your preferred university, and upload your IJMB result. You do not need to write UTME." },
];

const Universities = () => (
  <>
    <SEOHead
      title={`List of Universities Accepting IJMB for Direct Entry ${YEAR}`}
      description="Complete and updated list of federal, state, and private universities accepting IJMB for 200 level direct entry admission in Nigeria."
      canonical="https://www.ijmb.info/universities-accepting-ijmb"
      keywords="Universities accepting IJMB, IJMB direct entry list, does UNILAG accept IJMB, federal universities accepting IJMB"
    />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Universities Accepting IJMB" }]} />

    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">
          Universities Accepting IJMB for Direct Entry {YEAR}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          One of the biggest advantages of the <strong>Interim Joint Matriculation Board (IJMB)</strong> programme is its wide acceptance.
          Currently, over <strong>80% of Nigerian universities</strong> accept the IJMB certificate for admission into 200 Level via Direct Entry.
          This means you can secure university admission without writing JAMB UTME.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
           <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-blue-800">
             <AlertCircle size={20} /> Important Note on Admission
           </h2>
           <p className="text-blue-800/80 mb-0">
             While most universities accept IJMB, each institution sets its own <strong>cut-off points</strong>.
             Competitive courses like Medicine and Law typically require <strong>13 points and above</strong>, while other courses may accept <strong>5–8 points</strong>.
             Always aim for the highest possible score.
           </p>
        </div>

        <h2 className="text-2xl font-heading font-bold mt-8 mb-4 flex items-center gap-2">
          <GraduationCap className="text-primary" /> Federal Universities Accepting IJMB
        </h2>
        <p className="text-muted-foreground mb-4">
          Federal universities are the most sought-after due to their prestige and lower tuition fees. The following federal institutions accept IJMB results:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          {federalUnis.map((uni) => (
            <div key={uni} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg text-sm border hover:border-primary transition-colors">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
              {uni}
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-heading font-bold mt-8 mb-4 flex items-center gap-2">
          <BookOpen className="text-primary" /> State Universities Accepting IJMB
        </h2>
        <p className="text-muted-foreground mb-4">
          State universities offer excellent alternatives and often have slightly more flexible admission requirements for IJMB candidates.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          {stateUnis.map((uni) => (
            <div key={uni} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg text-sm border hover:border-primary transition-colors">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
              {uni}
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-heading font-bold mt-8 mb-4 flex items-center gap-2">
          <CheckCircle className="text-primary" /> Private Universities Accepting IJMB
        </h2>
        <p className="text-muted-foreground mb-4">
          Almost all private universities in Nigeria accept IJMB. They offer faster academic calendars and modern facilities.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          {privateUnis.map((uni) => (
            <div key={uni} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg text-sm border hover:border-primary transition-colors">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
              {uni}
            </div>
          ))}
        </div>

        <div className="bg-secondary p-8 rounded-2xl text-center mb-10">
           <h3 className="text-2xl font-bold mb-4">Don't See Your Preferred University?</h3>
           <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
             The list above is not exhaustive. Most universities in Nigeria accept IJMB.
             If your school of choice is not listed, it likely still accepts the programme.
             You can contact us to verify specific university requirements.
           </p>
           <Link href="/contact" className="inline-block px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90">
             Verify My University
           </Link>
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">Does UNILAG Accept IJMB?</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          <strong>Yes, the University of Lagos (UNILAG) accepts IJMB</strong> for direct entry admission.
          However, UNILAG is highly competitive. To stand a good chance, you typically need to score <strong>12 points and above</strong>
          in your IJMB final examination. Additionally, you must have the correct O-Level subject combination.
        </p>

        <h2 className="text-2xl font-heading font-bold mt-4 mb-4">Does UI Accept IJMB?</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          <strong>Yes, the University of Ibadan (UI) accepts IJMB.</strong> Similar to UNILAG, UI requires high points.
          Candidates are also expected to participate in the university's Direct Entry screening exercise.
        </p>

        <InternalLinks exclude="/universities-accepting-ijmb" />
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection />
  </>
);

export default Universities;
