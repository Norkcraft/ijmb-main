import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import { CheckCircle, XCircle } from "lucide-react";

const faqs = [
  { question: "What are the minimum O-Level credits for IJMB?", answer: "You need a minimum of 5 O-Level credits in relevant subjects including English Language and Mathematics from WAEC, NECO, or NABTEB." },
  { question: "Can I use awaiting result for IJMB?", answer: "Yes. Candidates who are awaiting their O-Level results can apply for the IJMB programme. However, you must provide your results before the IJMB examination." },
  { question: "Is there an age requirement for IJMB?", answer: "Candidates should be at least 16 years old. There is no maximum age limit for the IJMB programme." },
  { question: "Do I need JAMB to register for IJMB?", answer: "No. You do not need a JAMB/UTME score to register for IJMB. However, you will need JAMB registration for direct entry processing after your IJMB exams." },
];

const Requirements = () => (
  <>
    <SEOHead
      title="IJMB Requirements 2026/2027 – Admission Requirements"
      description="Complete list of IJMB admission requirements. Learn what you need to register for the IJMB programme in Nigeria."
      canonical="https://www.ijmb.info/ijmb-admission-requirements"
    />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "IJMB Requirements" }]} />

    <section className="section-padding">
      <div className="container-narrow">
        <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">IJMB Admission Requirements 2026/2027</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          Understanding the IJMB requirements is the first step to gaining direct entry admission into 200 level. 
          The requirements for the IJMB programme are straightforward and accessible to most Nigerian students who have completed their secondary education.
        </p>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">Academic Requirements for IJMB</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The primary academic requirement for the IJMB programme is a valid O-Level certificate. Here are the specific IJMB requirements:
        </p>
        <div className="space-y-3 mb-8">
          {[
            "Minimum of 5 credits in O-Level (WAEC, NECO, or NABTEB) at not more than 2 sittings",
            "Credits must include English Language and Mathematics",
            "Credits in 3 subjects relevant to your desired course of study",
            "Awaiting result candidates may apply (results must be available before IJMB exam)",
            "Direct Entry candidates with NCE, ND, or other qualifications can also apply",
          ].map((req, i) => (
            <div key={i} className="flex gap-3 items-start">
              <CheckCircle size={18} className="text-primary flex-shrink-0 mt-1" />
              <p className="text-muted-foreground">{req}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">What You Do NOT Need for IJMB</h2>
        <div className="space-y-3 mb-8">
          {[
            "JAMB/UTME score – Not required for registration",
            "Post-UTME score – Not required",
            "University admission letter – Not required",
            "Specific JAMB score threshold – Not applicable",
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <XCircle size={18} className="text-destructive flex-shrink-0 mt-1" />
              <p className="text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">IJMB Subject Combinations</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Candidates are required to choose 3 A-Level subjects for the IJMB programme. Your subject combination should align 
          with your intended course of study at the university. Common IJMB subject combinations include:
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {[
            { course: "Medicine & Health Sciences", subjects: "Biology, Chemistry, Physics" },
            { course: "Engineering", subjects: "Mathematics, Physics, Chemistry" },
            { course: "Law", subjects: "Literature, Government, CRS/IRS" },
            { course: "Accounting & Finance", subjects: "Accounting, Economics, Business Studies" },
            { course: "Mass Communication", subjects: "Literature, Government, Economics" },
            { course: "Computer Science", subjects: "Mathematics, Physics, Computer Science" },
          ].map((combo) => (
            <div key={combo.course} className="bg-secondary p-4 rounded-lg">
              <div className="font-medium text-sm mb-1">{combo.course}</div>
              <div className="text-sm text-muted-foreground">{combo.subjects}</div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">Personal Requirements</h2>
        <div className="space-y-3 mb-8">
          {[
            "Must be at least 16 years of age at the time of registration",
            "Passport photographs (white background)",
            "Valid means of identification (NIN, voter's card, or international passport)",
            "Birth certificate or age declaration",
            "Evidence of payment of registration fee",
          ].map((req, i) => (
            <div key={i} className="flex gap-3 items-start">
              <CheckCircle size={18} className="text-primary flex-shrink-0 mt-1" />
              <p className="text-muted-foreground">{req}</p>
            </div>
          ))}
        </div>

        <InternalLinks exclude="/ijmb-admission-requirements" />
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection />
  </>
);

export default Requirements;
