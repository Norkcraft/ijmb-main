import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import { MapPin } from "lucide-react";

const cities = [
  "Lagos", "Abuja", "Ibadan", "Ilorin", "Port Harcourt", "Benin", "Kano", "Kaduna",
  "Jos", "Enugu", "Owerri", "Aba", "Uyo", "Akure", "Ado-Ekiti", "Abeokuta",
  "Osogbo", "Minna", "Lokoja", "Makurdi",
];

const faqs = [
  { question: "How many IJMB centres are in Nigeria?", answer: "There are numerous approved IJMB study centres spread across all 36 states of Nigeria and the FCT. New centres are approved regularly." },
  { question: "How do I choose the right IJMB centre?", answer: "Consider proximity to your home, the centre's track record, quality of lecturers, available facilities, and the total fees charged." },
  { question: "Can I change my IJMB centre after registration?", answer: "Transfer between centres is possible in some cases but must be approved by the IJMB national office. It is best to choose your preferred centre from the start." },
];

const Centres = () => (
  <>
    <SEOHead
      title="IJMB Study Centres in Nigeria 2025 – Find Approved Centres"
      description="Find approved IJMB study centres across Nigeria. Lagos, Abuja, Kano, and 30+ cities. Register at an accredited centre near you."
      canonical="https://www.ijmb.info/ijmb-centres-in-nigeria"
    />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "IJMB Centres" }]} />

    <section className="section-padding">
      <div className="container-narrow">
        <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">IJMB Study Centres in Nigeria</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          IJMB study centres are located across Nigeria to provide accessible education for students seeking direct entry 
          admission into 200 level. Whether you are in the North, South, East, or West, there is an approved IJMB centre near you.
        </p>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-6">IJMB Centres by Location</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {cities.map((city) => (
            <Link
              key={city}
              to={`/ijmb-in-${city.toLowerCase().replace(/ /g, "-")}`}
              className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
            >
              <MapPin size={16} /> IJMB in {city}
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-heading font-bold mt-10 mb-4">How to Choose an IJMB Centre</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Choosing the right IJMB study centre is important for your success. Consider these factors when selecting your centre:
        </p>
        <ul className="space-y-2 text-muted-foreground mb-8">
          <li>• <strong>Accreditation:</strong> Ensure the centre is approved by ABU Zaria and the IJMB national office</li>
          <li>• <strong>Track record:</strong> Ask about the centre's pass rate and number of years in operation</li>
          <li>• <strong>Quality of lecturers:</strong> Experienced lecturers significantly improve your chances of success</li>
          <li>• <strong>Facilities:</strong> Check for adequate classrooms, library, and study spaces</li>
          <li>• <strong>Location:</strong> Choose a centre close to your residence or with affordable accommodation nearby</li>
          <li>• <strong>Fees:</strong> Compare fees between centres but don't sacrifice quality for lower prices</li>
        </ul>

        <InternalLinks exclude="/ijmb-centres-in-nigeria" />
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection />
  </>
);

export default Centres;
