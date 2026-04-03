import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import studentsGroup from "@/assets/students-group.jpeg";
import studentAnkara from "@/assets/student-ankara.jpeg";
import { ArrowRight, CheckCircle, MapPin, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cityData: Record<string, { state: string; desc: string }> = {
  lagos: { state: "Lagos", desc: "Nigeria's commercial capital and largest city" },
  abuja: { state: "FCT - Abuja", desc: "Nigeria's capital city and administrative centre" },
  ibadan: { state: "Oyo", desc: "one of the largest cities in West Africa" },
  ilorin: { state: "Kwara", desc: "a major educational hub in North-Central Nigeria" },
  "port-harcourt": { state: "Rivers", desc: "the oil capital of Nigeria" },
  benin: { state: "Edo", desc: "a historic city and educational centre" },
  kano: { state: "Kano", desc: "the largest city in Northern Nigeria" },
  kaduna: { state: "Kaduna", desc: "a key educational and industrial centre" },
  jos: { state: "Plateau", desc: "known for its cool climate and quality education" },
  enugu: { state: "Enugu", desc: "the Coal City and eastern educational hub" },
  owerri: { state: "Imo", desc: "a vibrant city in South-East Nigeria" },
  aba: { state: "Abia", desc: "a major commercial hub in South-East Nigeria" },
  uyo: { state: "Akwa Ibom", desc: "a rapidly developing South-South city" },
  akure: { state: "Ondo", desc: "the Sunshine State capital" },
  "ado-ekiti": { state: "Ekiti", desc: "a major educational centre in the South-West" },
  abeokuta: { state: "Ogun", desc: "a historic city near Lagos" },
  osogbo: { state: "Osun", desc: "a cultural and educational centre in Yorubaland" },
  minna: { state: "Niger", desc: "the capital of Nigeria's largest state by landmass" },
  lokoja: { state: "Kogi", desc: "the confluence city where Rivers Niger and Benue meet" },
  makurdi: { state: "Benue", desc: "the Food Basket of the Nation's capital" },
};

const LocationPage = () => {
  const { city } = useParams<{ city: string }>();
  const location = useLocation();
  
  const slug = useMemo(() => {
    if (city) return city;
    // Extract from path if not in params (for static routes)
    const pathPart = location.pathname.split('/ijmb-in-')[1];
    return (pathPart || "").toLowerCase();
  }, [city, location.pathname]);

  const data = cityData[slug];
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cityName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  useEffect(() => {
    const fetchCentres = async () => {
      if (!data) return;
      setLoading(true);
      // Try to match state. Using ilike for partial matching if exact match fails
      // But our states are standardized in AdminCentres, so we should try to match that.
      // cityData has standard state names now.
      const { data: res } = await supabase
        .from('centres')
        .select('*')
        .eq('active', true)
        .ilike('state', `%${data.state}%`);
      
      setCentres(res || []);
      setLoading(false);
    };
    fetchCentres();
  }, [data]);

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
        title={`IJMB in ${cityName} – Complete Admission Guide & Study Centres`}
        description={`Apply for IJMB in ${cityName} today. Discover trusted IJMB centres in ${cityName}, admission requirements, subject combinations, fees and how to start your registration.`}
        canonical={`https://www.ijmb.info/ijmb-in-${slug}`}
        keywords={`IJMB in ${cityName}, IJMB admission ${cityName}, IJMB centre ${cityName}, IJMB registration ${cityName}, IJMB programme ${cityName}, IJMB study centre ${cityName}`}
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
                IJMB in {cityName} – Complete Admission Guide and Study Centres
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Looking for <strong>IJMB in {cityName}</strong>? This is the complete guide to registering for the Interim Joint Matriculation Board (IJMB) programme in {cityName}, {data.state}. 
                If you are seeking admission into 200 level without JAMB/UTME, our accredited IJMB centres in {cityName} provide the perfect pathway. 
                {cityName}, being {data.desc}, is an excellent location for your A-Level studies.
              </p>

              <h2 className="text-2xl font-heading font-bold mt-10 mb-4">What is the IJMB Programme?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Interim Joint Matriculation Board (IJMB) is an Advanced Level (A-Level) educational programme moderated by <strong>Ahmadu Bello University (ABU), Zaria</strong>. 
                It is designed to prepare candidates for admission into the second year (200 Level) of various degree programmes in Nigerian universities.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The programme runs for 9–12 months. Upon successful completion, students are issued an IJMB certificate, which is recognized by the National Universities Commission (NUC) and accepted by over 80% of federal, state, and private universities in Nigeria for Direct Entry admission.
              </p>

              {/* Dynamic Centres List */}
              <div className="my-8">
                <h2 className="text-2xl font-heading font-bold mb-4">Accredited IJMB Centres in {cityName}</h2>
                <p className="text-muted-foreground mb-4">
                  We have partnered with the best learning facilities to ensure you get quality education. Below are the available study centres where you can run your IJMB programme in {cityName}:
                </p>
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" /> Loading centres...</div>
                ) : centres.length > 0 ? (
                  <div className="grid gap-4">
                    {centres.map(centre => (
                      <Card key={centre.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                        <CardHeader className="py-3">
                          <CardTitle className="text-lg">{centre.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="py-3 text-sm text-muted-foreground">
                          <p className="mb-2"><MapPin size={14} className="inline mr-1" /> {centre.location}</p>
                          <div className="flex flex-wrap gap-4 mt-2">
                             <div className="bg-muted px-3 py-1 rounded-md">
                               <strong>Tuition:</strong> ₦{(centre.tuition_fee || 0).toLocaleString()}
                             </div>
                             <div className="bg-muted px-3 py-1 rounded-md">
                               <strong>Hostel:</strong> ₦{(centre.hostel_fee || 0).toLocaleString()}
                             </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-muted-foreground">
                      We are currently updating our list of accredited centres in {cityName}. 
                      You can still register online, and our admission officer will assign you to the nearest accredited centre in {data.state}.
                    </p>
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-heading font-bold mt-10 mb-4">IJMB Admission Requirements in {cityName}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To be eligible for the IJMB programme in {cityName}, candidates must meet the following basic requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                <li><strong>O-Level Results:</strong> Minimum of 5 Credits in WAEC, NECO, GCE, or NABTEB. This must include English Language and Mathematics.</li>
                <li><strong>Awaiting Result:</strong> Candidates awaiting their O-Level results are also eligible to apply.</li>
                <li><strong>Age Limit:</strong> There is no strict age limit, but candidates should be mature enough for university-level academic work.</li>
                <li><strong>Birth Certificate:</strong> A copy of your birth certificate or declaration of age.</li>
                <li><strong>Passport Photographs:</strong> Recent passport-sized photographs (usually 8 copies required at the centre).</li>
              </ul>
              
              <h2 className="text-2xl font-heading font-bold mt-10 mb-4">How to Apply for IJMB in {cityName}</h2>
              <p className="text-muted-foreground mb-4">Follow this step-by-step guide to complete your registration:</p>
              <div className="space-y-4 mb-8">
                {[
                  "Click the 'Register Now' button to visit the official portal.",
                  "Fill in your personal details, including your full name, phone number, and email address.",
                  "Pay the non-refundable application fee securely online.",
                  `Select '${cityName}' or '${data.state}' as your preferred study location.`,
                  "Upload your O-Level results (if available) and passport photograph.",
                  "Download and print your admission letter and registration slip.",
                  `Proceed to the assigned centre in ${cityName} for clearance and resumption.`
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 border rounded-lg bg-card">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <p className="text-muted-foreground pt-1">{step}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-heading font-bold mt-10 mb-4">IJMB Subject Combinations</h2>
              <p className="text-muted-foreground mb-4">
                Students must select three (3) A-Level subjects related to their intended course of study. Common combinations available in {cityName} centres include:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold mb-2">Medicine & Pharmacy</h3>
                  <p className="text-sm text-muted-foreground">Biology, Chemistry, Physics</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold mb-2">Engineering</h3>
                  <p className="text-sm text-muted-foreground">Mathematics, Physics, Chemistry</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold mb-2">Law</h3>
                  <p className="text-sm text-muted-foreground">Literature, Government, CRS/IRS</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold mb-2">Accounting & Business</h3>
                  <p className="text-sm text-muted-foreground">Accounting, Economics, Business Mgt</p>
                </div>
              </div>

              <h2 className="text-2xl font-heading font-bold mt-10 mb-4">Why Choose IJMB in {cityName}?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Studying in {cityName} offers several advantages. The city boasts excellent educational infrastructure, conducive learning environments, and access to experienced lecturers. 
                Our centres in {cityName} are equipped with standard laboratories and libraries to ensure students pass their examinations with high grades (12–15 points).
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
