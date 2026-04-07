'use client';

import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import { CheckCircle, XCircle, ArrowRight, ShieldCheck, Zap, Clock } from "lucide-react";
import Link from "next/link";

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

const faqs = [
  { question: "Is IJMB better than JAMB?", answer: "For many students, IJMB is better because it offers a guaranteed path to 200 Level (Direct Entry) admission. Unlike JAMB which is highly unpredictable and competitive for 100 Level, IJMB provides a structured academic programme where hard work directly translates to admission." },
  { question: "Can I write both IJMB and JAMB?", answer: "Yes! In fact, we encourage it. You can register for IJMB to secure your A-Level result while also writing JAMB UTME. This gives you two independent chances of gaining admission in the same year." },
  { question: "Is IJMB certificate permanent?", answer: "Yes. Unlike JAMB UTME results which expire after one year, your IJMB certificate is valid for life. You can use it to apply for Direct Entry admission in any future academic session." },
  { question: "Does IJMB require Post-UTME?", answer: "Most universities do not conduct post-UTME exams for Direct Entry candidates. They usually conduct a screening of your credentials (IJMB result and O-Levels). However, a few schools like UNILAG and UI may have a written test." },
];

const IJMBvsJAMB = () => (
  <>
    <SEOHead
      title={`IJMB vs JAMB ${YEAR} – The Ultimate Comparison Guide`}
      description="IJMB vs JAMB: Which is better for admission? Discover why IJMB is the smarter alternative to UTME for gaining 200 level university admission in Nigeria."
      canonical="https://www.ijmb.info/ijmb-vs-jamb"
      keywords="IJMB vs JAMB, is IJMB better than JAMB, IJMB vs UTME, advantages of IJMB, direct entry vs UTME"
    />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "IJMB vs JAMB" }]} />

    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">IJMB vs JAMB: The Ultimate Comparison Guide</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          Choosing between <strong>IJMB</strong> and <strong>JAMB (UTME)</strong> is one of the most critical decisions for a Nigerian student seeking university admission.
          While JAMB is the traditional route, IJMB has emerged as a powerful, reliable alternative that allows students to <strong>bypass 100 Level entirely</strong>.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
           <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
                 <ShieldCheck /> The IJMB Advantage
              </h2>
              <p className="text-green-800/80 mb-4">
                 IJMB offers a guaranteed academic pathway. It is a 9-month programme where you receive lectures, practicals, and preparation. Success depends on your effort, not luck or computer errors.
              </p>
              <ul className="space-y-2">
                 <li className="flex gap-2 text-sm text-green-900"><CheckCircle size={16} /> Admission into 200 Level</li>
                 <li className="flex gap-2 text-sm text-green-900"><CheckCircle size={16} /> Result does not expire</li>
                 <li className="flex gap-2 text-sm text-green-900"><CheckCircle size={16} /> Accepted by 80% of universities</li>
              </ul>
           </div>

           <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-orange-800 mb-3 flex items-center gap-2">
                 <XCircle size={20} /> The JAMB Reality
              </h2>
              <p className="text-orange-800/80 mb-4">
                 JAMB UTME is a one-day examination. Technical glitches, strict cut-off marks, and high competition mean even brilliant students often miss admission and have to wait another year.
              </p>
              <ul className="space-y-2">
                 <li className="flex gap-2 text-sm text-orange-900"><XCircle size={16} /> Admission into 100 Level</li>
                 <li className="flex gap-2 text-sm text-orange-900"><XCircle size={16} /> Result expires after 1 year</li>
                 <li className="flex gap-2 text-sm text-orange-900"><XCircle size={16} /> High failure/rejection rate</li>
              </ul>
           </div>
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-6">Detailed Comparison: IJMB vs JAMB</h2>
        <div className="overflow-x-auto mb-10">
          <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="text-left p-4 font-heading">Feature</th>
                <th className="text-left p-4 font-heading w-1/3">IJMB Programme</th>
                <th className="text-left p-4 font-heading w-1/3">JAMB (UTME)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Entry Level", "200 Level (Direct Entry)", "100 Level (Freshman)"],
                ["Duration", "9-10 months of lectures", "One-day examination"],
                ["Mode of Entry", "Direct Entry (DE) Form", "UTME Form"],
                ["Acceptance", "Accepted by Federal, State & Private Universities", "Accepted by all, but highly competitive"],
                ["Certificate Validity", "Valid for Life (Permanent)", "Valid for 1 year only"],
                ["Exam Difficulty", "Requires study but has high pass rate", "Unpredictable due to cut-off marks"],
                ["Admission Chances", "Very High (Over 90% placement)", "Low (Less than 30% admitted annually)"],
                ["Cost Effectiveness", "Higher initial fee but saves 1 year tuition", "Cheap form but costly repeats/delays"],
              ].map(([feature, ijmb, jamb], i) => (
                <tr key={i} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-bold text-muted-foreground">{feature}</td>
                  <td className="p-4 font-medium text-green-700 bg-green-50/30">{ijmb}</td>
                  <td className="p-4 text-muted-foreground">{jamb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">Why Smart Students Choose IJMB</h2>
        <p className="text-muted-foreground mb-6">
          Every year, over 1.5 million students write JAMB, but less than 500,000 gain admission. The rest are forced to sit at home.
          <strong>IJMB breaks this cycle.</strong>
        </p>
        <div className="space-y-4 mb-8">
          <div className="flex gap-4 items-start p-4 border rounded-xl hover:shadow-md transition-shadow">
             <div className="bg-primary/10 p-3 rounded-full text-primary"><Clock size={24} /></div>
             <div>
                <h3 className="font-bold text-lg mb-1">Save Time</h3>
                <p className="text-muted-foreground text-sm">By securing admission into 200 Level, you recover the year you spent doing the programme. You graduate at the same time as your mates who got admission immediately.</p>
             </div>
          </div>
          <div className="flex gap-4 items-start p-4 border rounded-xl hover:shadow-md transition-shadow">
             <div className="bg-primary/10 p-3 rounded-full text-primary"><Zap size={24} /></div>
             <div>
                <h3 className="font-bold text-lg mb-1">Academic Preparation</h3>
                <p className="text-muted-foreground text-sm">IJMB is an Advanced Level course. The syllabus covers 100 Level university work in detail. When you eventually gain admission, you will find 200 Level much easier than your peers.</p>
             </div>
          </div>
        </div>

        <div className="bg-secondary p-8 rounded-2xl text-center mb-10">
           <h3 className="text-2xl font-bold mb-4">Ready to Secure Your Admission?</h3>
           <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
             Don't gamble with your future. Register for IJMB today and guarantee your university admission next year.
           </p>
           <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3 cta-gradient text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg">
             Start Registration <ArrowRight size={18} />
           </Link>
        </div>

        <InternalLinks />
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection />
  </>
);

export default IJMBvsJAMB;
