import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import { CheckCircle, XCircle } from "lucide-react";

const faqs = [
  { question: "Is IJMB better than JAMB?", answer: "IJMB is not necessarily 'better' but offers a more reliable path to admission. IJMB guarantees direct entry into 200 level, while JAMB/UTME places you in 100 level. IJMB eliminates the uncertainty of UTME scores and post-UTME screening." },
  { question: "Can I write both IJMB and JAMB?", answer: "Yes. You can register for IJMB while also writing UTME. This gives you two chances at university admission." },
  { question: "Is IJMB certificate permanent?", answer: "Yes. Your IJMB certificate does not expire and can be used for direct entry admission at any time." },
];

const IJMBvsJAMB = () => (
  <>
    <SEOHead
      title="IJMB vs JAMB 2026/2027 – Which is Better for Admission?"
      description="Detailed comparison of IJMB vs JAMB for Nigerian university admission. Discover which is better for gaining 200 level entry."
      canonical="https://www.ijmb.info/ijmb-vs-jamb"
    />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "IJMB vs JAMB" }]} />

    <section className="section-padding">
      <div className="container-narrow">
        <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">IJMB vs JAMB: Which Should You Choose?</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          Choosing between IJMB and JAMB (UTME) is one of the most important decisions for Nigerian students seeking 
          university admission. This comprehensive comparison will help you understand the advantages and differences.
        </p>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-6">IJMB vs JAMB Comparison Table</h2>
        <div className="overflow-x-auto mb-10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="text-left p-4 font-heading">Feature</th>
                <th className="text-left p-4 font-heading">IJMB</th>
                <th className="text-left p-4 font-heading">JAMB (UTME)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Entry Level", "200 Level (Direct Entry)", "100 Level"],
                ["Duration", "9 months", "One-day exam"],
                ["UTME Required?", "No", "Yes"],
                ["Acceptance", "200+ Universities", "All Universities"],
                ["Success Rate", "Very High (95%+)", "Unpredictable"],
                ["Certificate Validity", "Permanent", "Valid for 1 year"],
                ["Post-UTME", "Not required", "Required by most universities"],
                ["Cost", "₦80K – ₦150K (one-time)", "₦6,700+ per attempt"],
                ["Stress Level", "Low – Structured programme", "High – Competitive exam"],
                ["Re-attempt", "Rare – Most pass first time", "Common – Many write multiple times"],
              ].map(([feature, ijmb, jamb], i) => (
                <tr key={i} className="border-b border-border">
                  <td className="p-4 font-medium">{feature}</td>
                  <td className="p-4 text-muted-foreground">{ijmb}</td>
                  <td className="p-4 text-muted-foreground">{jamb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">Advantages of IJMB Over JAMB</h2>
        <div className="space-y-3 mb-8">
          {[
            "Skip 100 level entirely – enter university in 200 level directly",
            "No UTME stress – avoid the uncertainty of JAMB scores and cut-off marks",
            "Higher success rate – 95%+ of IJMB candidates gain admission",
            "Save one year – graduate one year earlier than UTME candidates",
            "No post-UTME screening required at most universities",
            "Certificate is permanent – use it anytime, no expiry",
            "Structured learning – 9 months of focused study with experienced lecturers",
            "Wide acceptance – over 200 Nigerian universities recognise IJMB",
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <CheckCircle size={18} className="text-primary flex-shrink-0 mt-1" />
              <p className="text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">When JAMB Might Be Better</h2>
        <div className="space-y-3 mb-8">
          {[
            "If you want to study at a university that only accepts UTME candidates for certain courses",
            "If you are confident of scoring very high in UTME (250+)",
            "If you prefer a one-day exam rather than a 9-month programme",
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <XCircle size={18} className="text-accent flex-shrink-0 mt-1" />
              <p className="text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">Our Recommendation</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          For most Nigerian students, IJMB is the smarter choice. It provides a guaranteed, reliable path to university 
          admission without the unpredictability of UTME. The 9-month programme also better prepares you for university-level 
          academics. You can even register for both IJMB and UTME simultaneously to maximise your chances.
        </p>

        <InternalLinks />
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection />
  </>
);

export default IJMBvsJAMB;
