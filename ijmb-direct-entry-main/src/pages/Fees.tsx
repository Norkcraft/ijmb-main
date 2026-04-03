import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import { CheckCircle } from "lucide-react";

const faqs = [
  { question: "How much is IJMB form?", answer: "The IJMB registration form and total fees typically range from ₦80,000 to ₦150,000 depending on the study centre location and inclusions. Contact us for the exact current fees." },
  { question: "Can I pay IJMB fees in instalments?", answer: "Some IJMB centres allow instalment payments. Typically, you can pay 60-70% during registration and the balance before resumption. Confirm with your chosen centre." },
  { question: "What does the IJMB fee cover?", answer: "The IJMB fee covers registration, tuition, study materials, examination fees, and administrative charges. Accommodation and feeding are usually separate." },
  { question: "Is IJMB cheaper than going through UTME?", answer: "Yes. When you consider the cost of years of JAMB registration, tutorials, and an extra year in 100 level, IJMB often works out more cost-effective." },
];

const Fees = () => (
  <>
    <SEOHead
      title="IJMB Fees Nigeria 2026/2027 – Complete Fee Breakdown"
      description="Current IJMB fees in Nigeria. Full breakdown of registration, tuition, and exam fees for the IJMB programme. Apply now."
      canonical="https://www.ijmb.info/ijmb-fees"
    />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "IJMB Fees" }]} />

    <section className="section-padding">
      <div className="container-narrow">
        <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">IJMB Fees in Nigeria 2026/2027</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          Understanding the IJMB fees is essential before you begin your registration. The total cost of the IJMB programme 
          in Nigeria varies by centre but remains affordable compared to private university tuition or years of repeated UTME attempts.
        </p>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">IJMB Fee Breakdown</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The IJMB fees typically include the following components. Note that fees may vary between study centres and locations across Nigeria:
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="text-left p-4 font-heading">Fee Component</th>
                <th className="text-left p-4 font-heading">Estimated Range</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Registration Form", "₦10,000 – ₦15,000"],
                ["Tuition Fee", "₦50,000 – ₦80,000"],
                ["Examination Fee", "₦15,000 – ₦25,000"],
                ["Study Materials", "₦5,000 – ₦10,000"],
                ["Administrative Charges", "₦5,000 – ₦10,000"],
                ["ID Card & Handbook", "₦2,000 – ₦5,000"],
                ["Total Estimated Fee", "₦80,000 – ₦150,000"],
              ].map(([item, range], i) => (
                <tr key={i} className={`border-b border-border ${i === 6 ? "bg-secondary font-bold" : ""}`}>
                  <td className="p-4 text-muted-foreground">{item}</td>
                  <td className="p-4 text-muted-foreground">{range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-accent/10 border border-accent/30 p-4 rounded-lg mb-8">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> These are estimated fees and may vary by centre. Some centres in Lagos and Abuja may charge higher 
            fees than centres in other locations. Contact us for the most current IJMB fees for your preferred centre.
          </p>
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">Additional Costs to Consider</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Beyond the IJMB programme fees, students should budget for these additional expenses:
        </p>
        <div className="space-y-3 mb-8">
          {[
            "Accommodation: ₦50,000 – ₦150,000 per session (varies by city and type)",
            "Feeding: ₦30,000 – ₦60,000 per session (estimated)",
            "Transportation: Varies by centre location",
            "JAMB Direct Entry Registration: ₦3,500 (required after IJMB completion)",
            "Textbooks and additional study materials: ₦10,000 – ₦20,000",
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <CheckCircle size={18} className="text-primary flex-shrink-0 mt-1" />
              <p className="text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">How to Pay IJMB Fees</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Payment of IJMB fees can be made through several methods:
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

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">Is IJMB Worth the Investment?</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Absolutely. The IJMB fees are a worthwhile investment when you consider that you will skip 100 level entirely and 
          enter 200 level directly. This saves you at least one year of university tuition, accommodation, and living expenses. 
          Many students who have spent years writing UTME without success find that IJMB is the most cost-effective and reliable 
          path to university admission in Nigeria.
        </p>

        <InternalLinks exclude="/ijmb-fees" />
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection />
  </>
);

export default Fees;
