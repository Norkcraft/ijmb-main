'use client';

import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import { CheckCircle, Mail } from "lucide-react";

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

const faqs = [
  { question: "How much is IJMB form?", answer: "The IJMB registration form fee is ₦10,000. Tuition and accommodation fees vary by centre — contact us at support@ijmb.info for a full breakdown." },
  { question: "Can I pay IJMB fees in instalments?", answer: "Some IJMB centres allow instalment payments. Confirm with your chosen centre or contact us at support@ijmb.info for guidance." },
  { question: "What does the IJMB fee cover?", answer: "The IJMB registration form fee covers your application. Tuition, study materials, examination fees, and accommodation are centre-specific — reach out to us for details." },
  { question: "Is IJMB cheaper than going through UTME?", answer: "Yes. When you consider the cost of repeated JAMB registration, tutorials, and spending an extra year in 100 level, IJMB is significantly more cost-effective and time-saving." },
];

const Fees = () => (
  <>
    <SEOHead
      title={`IJMB Registration Form Fee ${YEAR} – How Much Does IJMB Cost?`}
      description={`The IJMB registration form fee is ₦10,000 for the ${YEAR} session. Start your IJMB application today and gain direct entry to 200 level. Contact us for full fee details.`}
      canonical="https://www.ijmb.info/ijmb-fees"
    />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "IJMB Fees" }]} />

    <section className="section-padding">
      <div className="container-narrow">
        <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">IJMB Fees in Nigeria {YEAR}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          The IJMB programme is one of the most affordable and reliable routes to university admission in Nigeria.
          With a single form fee to get started, you can secure your place and begin your journey to direct 200-level entry.
        </p>

        {/* Registration Form Fee Highlight */}
        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">IJMB Registration Form Fee</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          To begin your IJMB application, all you need to pay is the registration form fee:
        </p>

        <div className="flex justify-center mb-8">
          <div className="border-2 border-primary rounded-2xl shadow-md p-10 text-center max-w-sm w-full bg-white">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-medium">Registration Form Fee</p>
            <div className="text-5xl font-extrabold text-primary mb-3">₦10,000</div>
            <p className="text-muted-foreground text-sm">One-time payment to start your application</p>
          </div>
        </div>

        <div className="bg-accent/10 border border-accent/30 p-5 rounded-lg mb-10 text-center">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Tuition and accommodation fees vary by centre.{" "}
            <a
              href="mailto:support@ijmb.info"
              className="text-primary font-semibold underline hover:opacity-80 transition-opacity"
            >
              Email us at support@ijmb.info
            </a>{" "}
            for a personalised breakdown.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="flex justify-center mb-12">
          <a
            href="mailto:support@ijmb.info?subject=IJMB%20Fee%20Enquiry&body=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20IJMB%20fees%20and%20how%20to%20register."
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-base shadow hover:opacity-90 transition-opacity"
          >
            <Mail size={20} />
            Get Full Fee Details — Email Us
          </a>
        </div>

        {/* Benefits of starting */}
        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">What You Get with IJMB</h2>
        <div className="space-y-3 mb-10">
          {[
            "Skip 100 level entirely — enter university at 200 level",
            "Gain admission to over 40 federal and state universities in Nigeria",
            "Study at your own pace across a flexible 9-month programme",
            "A more affordable and faster path than repeated JAMB attempts",
            "Full support from registration to admission",
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <CheckCircle size={18} className="text-primary flex-shrink-0 mt-1" />
              <p className="text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">How to Pay IJMB Fees</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Payment of IJMB fees can be made through several convenient methods:
        </p>
        <div className="space-y-3 mb-8">
          {[
            "Bank transfer to the official IJMB centre account",
            "Online payment through the centre's payment portal",
            "Direct payment at the IJMB centre office",
            "Mobile payment (some centres accept mobile transfers)",
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <CheckCircle size={18} className="text-primary flex-shrink-0 mt-1" />
              <p className="text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">IJMB vs Other Admission Routes</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Comparing IJMB to other routes shows just how practical and cost-efficient it is for Nigerian students:
        </p>
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse text-sm shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="text-left p-4 font-heading">Route</th>
                <th className="text-left p-4 font-heading">Starting Cost</th>
                <th className="text-left p-4 font-heading">Entry Level</th>
                <th className="text-left p-4 font-heading">Time to Degree</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["IJMB (this programme)", "₦10,000 form fee", "200 Level", "3 years after IJMB"],
                ["JAMB UTME (1 attempt)", "₦5k – ₦10k", "100 Level", "4 years"],
                ["JAMB UTME (3 failed attempts)", "₦15k–₦30k + 3 years lost", "100 Level if admitted", "7 years total"],
                ["Private university (direct)", "High upfront fees", "100 Level", "4–5 years"],
                ["Foundation programme (abroad)", "Very high fees", "Year 1 overseas", "4 years"],
              ].map(([route, cost, level, time], i) => (
                <tr key={i} className={`border-b border-border ${i === 0 ? 'bg-green-50' : 'hover:bg-muted/20'} transition-colors`}>
                  <td className={`p-4 font-medium ${i === 0 ? 'text-green-800' : ''}`}>{route}</td>
                  <td className={`p-4 ${i === 0 ? 'text-green-700 font-bold' : ''}`}>{cost}</td>
                  <td className="p-4">{level}</td>
                  <td className="p-4 text-muted-foreground">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">Is IJMB Worth the Investment?</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Absolutely. IJMB is designed to save you time and money. By entering university at 200 level, you skip
          an entire year of tuition, accommodation, and living costs — while also bypassing the stress and uncertainty of
          repeated UTME attempts.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Students who have spent years writing JAMB without success consistently find IJMB to be the most
          reliable and cost-effective path to university admission in Nigeria. The programme is recognised by over 40
          universities — giving you genuine options, not just a backup plan.
        </p>

        <div className="flex justify-center mb-8">
          <a
            href="mailto:support@ijmb.info?subject=IJMB%20Fee%20Enquiry&body=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20IJMB%20fees%20and%20how%20to%20register."
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-base shadow hover:opacity-90 transition-opacity"
          >
            <Mail size={20} />
            Have questions? Email support@ijmb.info
          </a>
        </div>

        <InternalLinks exclude="/ijmb-fees" />
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection />
  </>
);

export default Fees;
