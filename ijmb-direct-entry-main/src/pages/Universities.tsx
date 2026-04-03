import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";

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
  { question: "Do all Nigerian universities accept IJMB?", answer: "Most federal, state, and private universities in Nigeria accept IJMB for direct entry admission. However, you should always verify with the specific university and check the JAMB brochure for the latest information." },
  { question: "Can I use IJMB for medical courses?", answer: "Yes. Many universities accept IJMB for Medicine, Pharmacy, Nursing, and other health science courses. You will need excellent IJMB scores (typically 9 points and above)." },
  { question: "How do I apply to universities with IJMB?", answer: "After passing your IJMB exams, you register for JAMB Direct Entry, select your preferred university and course, and apply. The university will then process your admission based on your IJMB score." },
];

const Universities = () => (
  <>
    <SEOHead
      title="Universities Accepting IJMB 2026/2027 – Complete List"
      description="Full list of federal, state, and private universities accepting IJMB for direct entry admission into 200 level in Nigeria."
      canonical="https://www.ijmb.info/universities-accepting-ijmb"
    />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Universities Accepting IJMB" }]} />

    <section className="section-padding">
      <div className="container-narrow">
        <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">Universities Accepting IJMB in Nigeria</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          Over 200 Nigerian universities accept the IJMB certificate for direct entry admission into 200 level. 
          This comprehensive list includes federal, state, and private universities that recognise IJMB qualifications.
        </p>

        <div className="bg-accent/10 border border-accent/30 p-4 rounded-lg mb-10">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This list is for informational purposes. University admission policies may change. 
            Always verify with the official JAMB brochure and the university's admission office before applying.
          </p>
        </div>

        <h2 className="text-2xl font-heading font-bold mt-8 mb-4">Federal Universities Accepting IJMB</h2>
        <div className="grid sm:grid-cols-2 gap-2 mb-10">
          {federalUnis.map((uni) => (
            <div key={uni} className="px-4 py-2.5 bg-secondary rounded-lg text-sm text-muted-foreground">{uni}</div>
          ))}
        </div>

        <h2 className="text-2xl font-heading font-bold mt-8 mb-4">State Universities Accepting IJMB</h2>
        <div className="grid sm:grid-cols-2 gap-2 mb-10">
          {stateUnis.map((uni) => (
            <div key={uni} className="px-4 py-2.5 bg-secondary rounded-lg text-sm text-muted-foreground">{uni}</div>
          ))}
        </div>

        <h2 className="text-2xl font-heading font-bold mt-8 mb-4">Private Universities Accepting IJMB</h2>
        <div className="grid sm:grid-cols-2 gap-2 mb-10">
          {privateUnis.map((uni) => (
            <div key={uni} className="px-4 py-2.5 bg-secondary rounded-lg text-sm text-muted-foreground">{uni}</div>
          ))}
        </div>

        <p className="text-muted-foreground leading-relaxed mb-6">
          And many more universities across Nigeria. The IJMB certificate is one of the most widely accepted qualifications 
          for direct entry admission in Nigeria, making it an excellent choice for students who want to skip UTME.
        </p>

        <InternalLinks exclude="/universities-accepting-ijmb" />
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection />
  </>
);

export default Universities;
