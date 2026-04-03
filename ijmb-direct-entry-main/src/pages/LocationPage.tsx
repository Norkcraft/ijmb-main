import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import studentsGroup from "@/assets/students-group.jpeg";
import studentAnkara from "@/assets/student-ankara.jpeg";
import { ArrowRight, CheckCircle, MapPin } from "lucide-react";

const cityData: Record<string, { state: string; desc: string }> = {
  lagos: { state: "Lagos State", desc: "Nigeria's commercial capital and largest city" },
  abuja: { state: "FCT", desc: "Nigeria's capital city and administrative centre" },
  ibadan: { state: "Oyo State", desc: "one of the largest cities in West Africa" },
  ilorin: { state: "Kwara State", desc: "a major educational hub in North-Central Nigeria" },
  "port-harcourt": { state: "Rivers State", desc: "the oil capital of Nigeria" },
  benin: { state: "Edo State", desc: "a historic city and educational centre" },
  kano: { state: "Kano State", desc: "the largest city in Northern Nigeria" },
  kaduna: { state: "Kaduna State", desc: "a key educational and industrial centre" },
  jos: { state: "Plateau State", desc: "known for its cool climate and quality education" },
  enugu: { state: "Enugu State", desc: "the Coal City and eastern educational hub" },
  owerri: { state: "Imo State", desc: "a vibrant city in South-East Nigeria" },
  aba: { state: "Abia State", desc: "a major commercial hub in South-East Nigeria" },
  uyo: { state: "Akwa Ibom State", desc: "a rapidly developing South-South city" },
  akure: { state: "Ondo State", desc: "the Sunshine State capital" },
  "ado-ekiti": { state: "Ekiti State", desc: "a major educational centre in the South-West" },
  abeokuta: { state: "Ogun State", desc: "a historic city near Lagos" },
  osogbo: { state: "Osun State", desc: "a cultural and educational centre in Yorubaland" },
  minna: { state: "Niger State", desc: "the capital of Nigeria's largest state by landmass" },
  lokoja: { state: "Kogi State", desc: "the confluence city where Rivers Niger and Benue meet" },
  makurdi: { state: "Benue State", desc: "the Food Basket of the Nation's capital" },
};

const LocationPage = () => {
  const { city } = useParams<{ city: string }>();
  const slug = city || "";
  const data = cityData[slug];
  const cityName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  if (!data) {
    return (
      <div className="section-padding text-center">
        <h1 className="text-2xl font-heading font-bold">Location not found</h1>
        <Link to="/" className="text-primary mt-4 inline-block">Go Home</Link>
      </div>
    );
  }

  const faqs = [
    { question: `Is there an IJMB centre in ${cityName}?`, answer: `Yes. There are approved IJMB study centres in ${cityName}, ${data.state}. Students from ${cityName} and surrounding areas can register and attend classes locally.` },
    { question: `How much is IJMB in ${cityName}?`, answer: `IJMB fees in ${cityName} typically range from ₦80,000 to ₦150,000. This covers registration, tuition, materials, and examination fees. Exact fees vary by centre.` },
    { question: `Can I register for IJMB online from ${cityName}?`, answer: `Yes. You can begin your IJMB registration online from anywhere in Nigeria, including ${cityName}. After online registration, you will attend classes at your chosen centre.` },
    { question: `What subjects are available for IJMB in ${cityName}?`, answer: `IJMB centres in ${cityName} offer subjects across Sciences, Arts, Social Sciences, and Commercial. You choose 3 A-Level subjects relevant to your desired university course.` },
  ];

  return (
    <>
      <SEOHead
        title={`IJMB in ${cityName} – Register for Direct Entry Admission`}
        description={`Register for IJMB in ${cityName}, ${data.state}. Gain direct entry into 200 level without UTME. Apply for 2026/2027 session.`}
        canonical={`https://www.ijmb.info/ijmb-in-${slug}`}
        keywords={`IJMB in ${cityName}, IJMB registration ${cityName}, IJMB centre ${cityName}`}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Centres", href: "/ijmb-centres-in-nigeria" }, { label: `IJMB in ${cityName}` }]} />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <MapPin size={16} className="text-primary" /> {data.state}
              </div>
              <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">
                IJMB in {cityName}: Register for Direct Entry
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Are you in {cityName} and looking for a way to gain admission into 200 level without UTME? 
                The IJMB programme is available in {cityName}, {data.desc}. Students from {cityName} and across {data.state} can 
                register for IJMB and enjoy the benefits of direct entry admission into any Nigerian university.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-10 mb-4">About IJMB in {cityName}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Interim Joint Matriculation Board (IJMB) programme is well-established in {cityName}. Approved study centres 
                in {cityName} provide quality A-Level education that prepares students for the IJMB examinations. Upon successful 
                completion, graduates can apply for direct entry admission into 200 level of over 200 Nigerian universities.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {cityName} is an excellent location for IJMB students because of its educational infrastructure, experienced 
                lecturers, and vibrant student community. Many students from {data.state} and neighbouring states choose to study 
                IJMB in {cityName} due to the quality of available centres.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-10 mb-4">How to Register for IJMB in {cityName}</h2>
              <div className="space-y-3 mb-8">
                {[
                  "Confirm you have at least 5 O-Level credits (including English and Mathematics)",
                  "Choose 3 A-Level subjects relevant to your desired university course",
                  `Select an approved IJMB centre in ${cityName}`,
                  "Complete the online registration form with your personal details",
                  "Upload your O-Level result and passport photograph",
                  "Pay the IJMB registration fee",
                  `Resume at your chosen centre in ${cityName} on the specified date`,
                ].map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <p className="text-muted-foreground pt-0.5">{step}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-heading font-bold mt-10 mb-4">IJMB Requirements in {cityName}</h2>
              <div className="space-y-2 mb-8">
                {[
                  "Minimum of 5 O-Level credits including English and Mathematics",
                  "WAEC, NECO, or NABTEB result accepted",
                  "Awaiting result candidates can also apply",
                  "No JAMB/UTME score required for registration",
                  "Must be at least 16 years old",
                ].map((req, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <CheckCircle size={16} className="text-primary flex-shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground">{req}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-heading font-bold mt-10 mb-4">IJMB Fees in {cityName}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The total cost of the IJMB programme in {cityName} ranges from ₦80,000 to ₦150,000. This fee typically covers 
                registration, tuition, study materials, and examination charges. Some centres in {cityName} offer instalment 
                payment options. Additional costs such as accommodation and feeding vary depending on the area of {cityName} 
                where your centre is located.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                For exact and up-to-date IJMB fees in {cityName}, <Link to="/contact" className="text-primary underline">contact us</Link> or 
                visit our <Link to="/ijmb-fees" className="text-primary underline">fees page</Link>.
              </p>

              <InternalLinks />
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img src={studentsGroup} alt={`IJMB students in ${cityName}`} className="w-full h-[250px] object-cover" loading="lazy" />
                </div>
                <div className="bg-primary text-primary-foreground p-6 rounded-xl">
                  <h3 className="font-heading font-bold text-lg mb-3">Register for IJMB in {cityName}</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Start your IJMB journey today. Gain 200 level admission without UTME.
                  </p>
                  <Link
                    to="/ijmb-registration"
                    className="block w-full text-center px-6 py-3 font-bold rounded-lg cta-gradient text-accent-foreground hover:opacity-90 transition-opacity"
                  >
                    Register Now <ArrowRight size={16} className="inline ml-1" />
                  </Link>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img src={studentAnkara} alt={`Student preparing for IJMB in ${cityName}`} className="w-full h-[200px] object-cover" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} />
      <CTASection title={`Start Your IJMB Journey in ${cityName}`} />
    </>
  );
};

export default LocationPage;
