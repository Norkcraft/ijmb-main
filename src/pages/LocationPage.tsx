'use client';

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import studentsGroup from "@/assets/students-group.jpeg";
import studentAnkara from "@/assets/student-ankara.jpeg";
import { ArrowRight, CheckCircle, MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StaticCentre {
  name: string;
  location: string;
  phone: string;
  tuition: string;
  hostel: string;
  features: string[];
}

interface CityInfo {
  state: string;
  desc: string;
  highlights: string[];
  centres: StaticCentre[];
}

const cityData: Record<string, CityInfo> = {
  lagos: {
    state: "Lagos",
    desc: "Nigeria's commercial capital and largest city",
    highlights: ["Largest study network in Nigeria", "Multiple centre options across the state", "Close proximity to UNILAG, LASU & LASPOTECH"],
    centres: [
      { name: "IJMB Lagos Mainland Centre", location: "Yaba, Lagos Mainland", phone: "08012345601", tuition: "₦95,000", hostel: "₦50,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB Lagos Island Centre", location: "Surulere, Lagos Island", phone: "08012345602", tuition: "₦100,000", hostel: "₦55,000", features: ["Computer Lab", "24/7 Security", "Hostel Available"] },
      { name: "IJMB Ikeja Study Centre", location: "Ikeja, Lagos State", phone: "08012345603", tuition: "₦90,000", hostel: "N/A", features: ["Science Labs", "Experienced Tutors", "Day Students Only"] },
    ],
  },
  abuja: {
    state: "FCT - Abuja",
    desc: "Nigeria's capital city and administrative centre",
    highlights: ["Serene learning environment", "Close to ABU Zaria headquarters", "Multiple universities in the FCT"],
    centres: [
      { name: "IJMB Abuja Central Centre", location: "Gwagwalada, FCT Abuja", phone: "08012345611", tuition: "₦90,000", hostel: "₦48,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB Garki Study Centre", location: "Garki, Abuja", phone: "08012345612", tuition: "₦95,000", hostel: "₦50,000", features: ["Computer Lab", "Modern Facilities", "Hostel Available"] },
    ],
  },
  ibadan: {
    state: "Oyo",
    desc: "one of the largest cities in West Africa",
    highlights: ["Home to University of Ibadan", "Rich academic culture", "Affordable cost of living for students"],
    centres: [
      { name: "IJMB Ibadan Main Centre", location: "Bodija, Ibadan", phone: "08012345621", tuition: "₦85,000", hostel: "₦45,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB UI Road Centre", location: "UI Road, Ibadan", phone: "08012345622", tuition: "₦88,000", hostel: "₦46,000", features: ["Experienced Tutors", "Hostel Available", "Near University of Ibadan"] },
    ],
  },
  ilorin: {
    state: "Kwara",
    desc: "a major educational hub in North-Central Nigeria",
    highlights: ["Home to University of Ilorin", "Affordable and student-friendly city", "Excellent IJMB pass rate history"],
    centres: [
      { name: "IJMB Ilorin Central Centre", location: "GRA, Ilorin", phone: "08012345631", tuition: "₦80,000", hostel: "₦42,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB Unilorin Road Centre", location: "Unity Road, Ilorin", phone: "08012345632", tuition: "₦82,000", hostel: "₦44,000", features: ["Qualified Lecturers", "Hostel Available", "Near UNILORIN"] },
    ],
  },
  "port-harcourt": {
    state: "Rivers",
    desc: "the oil capital of Nigeria",
    highlights: ["Gateway to South-South universities", "Close to UNIPORT and RSUST", "Strong science and engineering tradition"],
    centres: [
      { name: "IJMB Port Harcourt Centre", location: "Rumuola, Port Harcourt", phone: "08012345641", tuition: "₦90,000", hostel: "₦48,000", features: ["Science Labs", "Hostel Available", "Experienced Faculty"] },
      { name: "IJMB Eleme Centre", location: "GRA Phase 2, Port Harcourt", phone: "08012345642", tuition: "₦92,000", hostel: "₦50,000", features: ["Computer Lab", "Library", "Hostel Available"] },
    ],
  },
  benin: {
    state: "Edo",
    desc: "a historic city and educational centre",
    highlights: ["Home to University of Benin (UNIBEN)", "Vibrant student community", "Strong arts and social science tradition"],
    centres: [
      { name: "IJMB Benin City Centre", location: "Ugbowo, Benin City", phone: "08012345651", tuition: "₦83,000", hostel: "₦44,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB Sapele Road Centre", location: "Sapele Road, Benin City", phone: "08012345652", tuition: "₦85,000", hostel: "₦45,000", features: ["Qualified Lecturers", "Hostel Available", "Near UNIBEN"] },
    ],
  },
  kano: {
    state: "Kano",
    desc: "the largest city in Northern Nigeria",
    highlights: ["Largest northern city study network", "Home to Bayero University Kano (BUK)", "Strong business and commercial studies tradition"],
    centres: [
      { name: "IJMB Kano Main Centre", location: "Bompai, Kano", phone: "08012345661", tuition: "₦80,000", hostel: "₦42,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB BUK Road Centre", location: "Zaria Road, Kano", phone: "08012345662", tuition: "₦82,000", hostel: "₦43,000", features: ["Experienced Faculty", "Hostel Available", "Near Bayero University"] },
    ],
  },
  kaduna: {
    state: "Kaduna",
    desc: "a key educational and industrial centre",
    highlights: ["Home to Kaduna State University", "Central location in Northern Nigeria", "Established academic tradition"],
    centres: [
      { name: "IJMB Kaduna Central Centre", location: "Ungwan Rimi, Kaduna", phone: "08012345671", tuition: "₦80,000", hostel: "₦42,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB Barnawa Centre", location: "Barnawa, Kaduna", phone: "08012345672", tuition: "₦82,000", hostel: "₦44,000", features: ["Qualified Lecturers", "Hostel Available"] },
    ],
  },
  jos: {
    state: "Plateau",
    desc: "known for its cool climate and quality education",
    highlights: ["Home to University of Jos (UNIJOS)", "Serene cool climate ideal for study", "Strong science programme history"],
    centres: [
      { name: "IJMB Jos Main Centre", location: "Rayfield, Jos", phone: "08012345681", tuition: "₦80,000", hostel: "₦42,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB Unijos Road Centre", location: "Bauchi Road, Jos", phone: "08012345682", tuition: "₦82,000", hostel: "₦43,000", features: ["Experienced Tutors", "Hostel Available", "Near UNIJOS"] },
    ],
  },
  enugu: {
    state: "Enugu",
    desc: "the Coal City and eastern educational hub",
    highlights: ["Home to UNN and ESUT", "Major academic city in South-East", "Excellent arts and humanities tradition"],
    centres: [
      { name: "IJMB Enugu Main Centre", location: "Independence Layout, Enugu", phone: "08012345691", tuition: "₦82,000", hostel: "₦44,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB Trans-Ekulu Centre", location: "Trans-Ekulu, Enugu", phone: "08012345692", tuition: "₦83,000", hostel: "₦44,000", features: ["Qualified Faculty", "Hostel Available"] },
    ],
  },
  owerri: {
    state: "Imo",
    desc: "a vibrant city in South-East Nigeria",
    highlights: ["Home to FUTO and Imo State University", "Fast-growing educational hub", "Vibrant student community"],
    centres: [
      { name: "IJMB Owerri Central Centre", location: "World Bank, Owerri", phone: "08012345701", tuition: "₦82,000", hostel: "₦44,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB FUTO Road Centre", location: "Ihiagwa, Owerri", phone: "08012345702", tuition: "₦84,000", hostel: "₦45,000", features: ["Modern Facilities", "Hostel Available", "Near FUTO"] },
    ],
  },
  aba: {
    state: "Abia",
    desc: "a major commercial hub in South-East Nigeria",
    highlights: ["Growing academic centre in Abia State", "Close to Abia State University", "Affordable study environment"],
    centres: [
      { name: "IJMB Aba Study Centre", location: "Ogbor Hill, Aba", phone: "08012345711", tuition: "₦80,000", hostel: "₦42,000", features: ["Science Labs", "Library", "Hostel Available"] },
    ],
  },
  uyo: {
    state: "Akwa Ibom",
    desc: "a rapidly developing South-South city",
    highlights: ["Home to University of Uyo (UNIUYO)", "Modern facilities and infrastructure", "Peaceful learning environment"],
    centres: [
      { name: "IJMB Uyo Main Centre", location: "Ewet Housing, Uyo", phone: "08012345721", tuition: "₦82,000", hostel: "₦44,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB UNIUYO Road Centre", location: "Nwaniba Road, Uyo", phone: "08012345722", tuition: "₦83,000", hostel: "₦45,000", features: ["Experienced Tutors", "Hostel Available", "Near UNIUYO"] },
    ],
  },
  akure: {
    state: "Ondo",
    desc: "the Sunshine State capital",
    highlights: ["Home to FUTA (Federal University of Technology)", "Strong science and technology tradition", "Growing educational sector"],
    centres: [
      { name: "IJMB Akure Central Centre", location: "OSSC Road, Akure", phone: "08012345731", tuition: "₦80,000", hostel: "₦42,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB FUTA Road Centre", location: "Alagbaka, Akure", phone: "08012345732", tuition: "₦82,000", hostel: "₦43,000", features: ["Tech Labs", "Hostel Available", "Near FUTA"] },
    ],
  },
  "ado-ekiti": {
    state: "Ekiti",
    desc: "a major educational centre in the South-West",
    highlights: ["Land of Honour — home to Ekiti State University", "Strong academic culture", "Affordable and student-friendly"],
    centres: [
      { name: "IJMB Ado-Ekiti Main Centre", location: "Ajilosun, Ado-Ekiti", phone: "08012345741", tuition: "₦78,000", hostel: "₦40,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB EKSU Road Centre", location: "Iworoko Road, Ado-Ekiti", phone: "08012345742", tuition: "₦80,000", hostel: "₦42,000", features: ["Qualified Lecturers", "Hostel Available", "Near EKSU"] },
    ],
  },
  abeokuta: {
    state: "Ogun",
    desc: "a historic city near Lagos",
    highlights: ["Home to Federal University of Agriculture Abeokuta (FUNAAB)", "Near Lagos, easy access", "Strong agriculture and science tradition"],
    centres: [
      { name: "IJMB Abeokuta Centre", location: "Oke-Ilewo, Abeokuta", phone: "08012345751", tuition: "₦83,000", hostel: "₦44,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB FUNAAB Road Centre", location: "Alabata Road, Abeokuta", phone: "08012345752", tuition: "₦85,000", hostel: "₦45,000", features: ["Agric Labs", "Hostel Available", "Near FUNAAB"] },
    ],
  },
  osogbo: {
    state: "Osun",
    desc: "a cultural and educational centre in Yorubaland",
    highlights: ["Home to Osun State University", "Culturally rich study environment", "Affordable fees"],
    centres: [
      { name: "IJMB Osogbo Main Centre", location: "Station Road, Osogbo", phone: "08012345761", tuition: "₦78,000", hostel: "₦40,000", features: ["Science Labs", "Library", "Hostel Available"] },
    ],
  },
  minna: {
    state: "Niger",
    desc: "the capital of Nigeria's largest state by landmass",
    highlights: ["Home to Federal University of Technology Minna (FUT Minna)", "Expanding academic community", "Affordable living costs"],
    centres: [
      { name: "IJMB Minna Study Centre", location: "Bosso, Minna", phone: "08012345771", tuition: "₦78,000", hostel: "₦40,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB FUT Road Centre", location: "Gidan Kwano, Minna", phone: "08012345772", tuition: "₦80,000", hostel: "₦42,000", features: ["Tech Labs", "Hostel Available", "Near FUT Minna"] },
    ],
  },
  lokoja: {
    state: "Kogi",
    desc: "the confluence city where Rivers Niger and Benue meet",
    highlights: ["Home to Kogi State University", "Strategic location in North-Central Nigeria", "Growing educational infrastructure"],
    centres: [
      { name: "IJMB Lokoja Centre", location: "Adankolo, Lokoja", phone: "08012345781", tuition: "₦78,000", hostel: "₦40,000", features: ["Science Labs", "Library", "Hostel Available"] },
    ],
  },
  makurdi: {
    state: "Benue",
    desc: "the Food Basket of the Nation's capital",
    highlights: ["Home to Benue State University and Federal University of Agriculture", "Peaceful academic environment", "Affordable cost of living"],
    centres: [
      { name: "IJMB Makurdi Main Centre", location: "High Level, Makurdi", phone: "08012345791", tuition: "₦78,000", hostel: "₦40,000", features: ["Science Labs", "Library", "Hostel Available"] },
      { name: "IJMB BSU Road Centre", location: "Otukpo Road, Makurdi", phone: "08012345792", tuition: "₦80,000", hostel: "₦42,000", features: ["Qualified Lecturers", "Hostel Available", "Near BSU"] },
    ],
  },
};

const LocationPage = ({ city: cityProp }: { city?: string }) => {
  const params = useParams();
  const pathname = usePathname();

  const slug = useMemo(() => {
    if (cityProp) return cityProp.toLowerCase();
    if (params?.city) return Array.isArray(params.city) ? params.city[0] : params.city;
    const pathPart = (pathname ?? '').split('/ijmb-in-')[1];
    return (pathPart || "").toLowerCase();
  }, [cityProp, params, pathname]);

  const data = cityData[slug];

  // Live centres from Supabase (override static data when available)
  const [liveCentres, setLiveCentres] = useState<any[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);

  const cityName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  useEffect(() => {
    const fetchCentres = async () => {
      if (!data) return;
      setLoadingLive(true);
      const { data: res } = await supabase
        .from('centres')
        .select('*')
        .eq('active', true)
        .ilike('state', `%${data.state}%`);
      setLiveCentres(res || []);
      setLoadingLive(false);
    };
    fetchCentres();
  }, [data]);

  if (!data) {
    return (
      <div className="section-padding text-center">
        <h1 className="text-2xl font-heading font-bold">Location not found</h1>
        <p className="text-muted-foreground mt-2 mb-6">We don't have a page for that city yet. Browse all available centres below.</p>
        <Link href="/ijmb-centres-in-nigeria" className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-lg cta-gradient text-accent-foreground">
          View All Centres <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // Use live Supabase data if available, otherwise use static data
  const displayCentres = liveCentres.length > 0 ? null : data.centres;

  const faqs = [
    { question: `Is there an IJMB centre in ${cityName}?`, answer: `Yes. There are ${data.centres.length} approved IJMB study centres in ${cityName}, ${data.state} listed on this page. Students from ${cityName} and surrounding areas can register and attend classes locally.` },
    { question: `How much is IJMB in ${cityName}?`, answer: `IJMB tuition fees in ${cityName} range from ${data.centres[0]?.tuition} to ${data.centres[data.centres.length - 1]?.tuition}. This covers tuition and study materials. Hostel is optional and costs between ${data.centres[0]?.hostel} per session.` },
    { question: `Can I register for IJMB online from ${cityName}?`, answer: `Yes. You can complete your IJMB registration entirely online. After paying the form fee, our admission team will assign you to an accredited centre in ${cityName} or the nearest available centre in ${data.state}.` },
    { question: `What subjects are available for IJMB in ${cityName}?`, answer: `IJMB centres in ${cityName} offer all standard A-Level subject combinations across Sciences, Arts, Social Sciences, and Commercial tracks. You select 3 subjects based on your intended university course.` },
    { question: `Which universities near ${cityName} accept IJMB?`, answer: `All federal and state universities near ${cityName} accept IJMB for direct entry admission. This includes universities in ${data.state} and any other Nigerian university that offers Direct Entry.` },
  ];

  return (
    <>
      <SEOHead
        title={`IJMB in ${cityName} 2026/2027 – Accredited Study Centres & Registration`}
        description={`Find ${data.centres.length} accredited IJMB study centres in ${cityName}, ${data.state}. Register for IJMB 2026/2027, gain direct entry into 200 level without UTME. Fees from ${data.centres[0]?.tuition}.`}
        canonical={`https://www.ijmb.info/ijmb-in-${slug}`}
        keywords={`IJMB in ${cityName}, IJMB centre ${cityName}, IJMB registration ${cityName}, IJMB programme ${cityName}, direct entry ${cityName}`}
      />
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Centres", href: "/ijmb-centres-in-nigeria" },
        { label: `IJMB in ${cityName}` }
      ]} />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-10">

              {/* Hero intro */}
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin size={16} className="text-primary" /> {data.state} State
                </div>
                <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">
                  IJMB in {cityName} — Study Centres & 2026/2027 Registration
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Looking for <strong className="text-foreground">IJMB in {cityName}</strong>? You are in the right place. This page lists all accredited IJMB study centres in {cityName}, {data.state} — {data.desc} — along with fees, admission requirements, and how to register for the <strong className="text-foreground">2026/2027 session</strong>.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {data.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-primary/5 border border-primary/20 text-primary px-3 py-1.5 rounded-full">
                      <CheckCircle size={13} /> {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Centres List */}
              <div>
                <h2 className="text-2xl font-heading font-bold mb-2">
                  Accredited IJMB Study Centres in {cityName}
                </h2>
                <p className="text-muted-foreground mb-6">
                  The following are approved IJMB study centres currently accepting students in {cityName}, {data.state} for the 2026/2027 session:
                </p>

                {/* Show live Supabase data if available */}
                {!loadingLive && liveCentres.length > 0 ? (
                  <div className="grid gap-4">
                    {liveCentres.map(centre => (
                      <Card key={centre.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                        <CardHeader className="py-3 pb-1">
                          <CardTitle className="text-lg">{centre.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4 text-sm text-muted-foreground">
                          <p className="mb-3"><MapPin size={13} className="inline mr-1" /> {centre.location}</p>
                          <div className="flex flex-wrap gap-3">
                            <span className="bg-muted px-3 py-1 rounded-md text-xs"><strong>Tuition:</strong> ₦{(centre.tuition_fee || 0).toLocaleString()}</span>
                            <span className="bg-muted px-3 py-1 rounded-md text-xs"><strong>Hostel:</strong> ₦{(centre.hostel_fee || 0).toLocaleString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  /* Static hardcoded centre data */
                  <div className="grid gap-5">
                    {data.centres.map((centre, i) => (
                      <Card key={i} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                        <CardHeader className="py-4 pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg leading-snug">{centre.name}</CardTitle>
                            <Badge variant="outline" className="text-xs shrink-0 text-green-700 border-green-300 bg-green-50">Accepting Students</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-5 space-y-3 text-sm">
                          <p className="flex items-center gap-2 text-muted-foreground">
                            <MapPin size={14} className="text-primary shrink-0" /> {centre.location}
                          </p>
                          <p className="flex items-center gap-2 text-muted-foreground">
                            <Phone size={14} className="text-primary shrink-0" /> {centre.phone}
                          </p>
                          <div className="flex flex-wrap gap-3 pt-1">
                            <span className="bg-primary/5 border border-primary/20 px-3 py-1 rounded-md text-xs font-medium">
                              Tuition: {centre.tuition}
                            </span>
                            {centre.hostel !== "N/A" && (
                              <span className="bg-primary/5 border border-primary/20 px-3 py-1 rounded-md text-xs font-medium">
                                Hostel: {centre.hostel}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {centre.features.map((f, fi) => (
                              <span key={fi} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                <CheckCircle size={11} className="text-primary" /> {f}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="mt-6 p-4 bg-muted/40 rounded-xl border text-sm text-muted-foreground flex items-start gap-3">
                  <Clock size={16} className="text-primary mt-0.5 shrink-0" />
                  <p>Centre details are updated regularly. To confirm availability for the 2026/2027 session or to speak with an admission officer, <Link href="/contact" className="text-primary font-medium hover:underline">contact us here</Link>.</p>
                </div>
              </div>

              {/* About the Programme */}
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">About the IJMB Programme in {cityName}</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The <strong className="text-foreground">Interim Joint Matriculation Board (IJMB)</strong> is a nationally recognised Advanced Level (A-Level) programme administered by <strong className="text-foreground">Ahmadu Bello University (ABU) Zaria</strong>. It is designed for candidates seeking <strong className="text-foreground">direct entry admission into 200 level</strong> at Nigerian universities without writing UTME.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The programme runs for <strong className="text-foreground">9 months</strong>. Students in {cityName} study three A-Level subjects at an accredited centre, sit the IJMB examination, and upon passing, qualify for Direct Entry admission into any of Nigeria's 200+ universities.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {cityName}, being {data.desc}, has a strong tradition of academic excellence. Students in {data.state} who register for IJMB gain a competitive advantage — entering university a full year ahead of UTME candidates.
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">IJMB Admission Requirements in {cityName}</h2>
                <p className="text-muted-foreground mb-4">To register for IJMB at any centre in {cityName}, candidates must meet these requirements:</p>
                <ul className="space-y-3">
                  {[
                    { title: "O-Level Results", desc: "Minimum of 5 Credits in WAEC, NECO, GCE, or NABTEB including English Language and Mathematics." },
                    { title: "Awaiting Results", desc: "Candidates still awaiting their O-Level results are eligible to register and submit results later." },
                    { title: "Age Requirement", desc: "No strict age limit. Candidates must be ready for university-level academic study." },
                    { title: "Valid ID / Birth Certificate", desc: "A copy of your National ID, birth certificate, or declaration of age." },
                    { title: "Passport Photographs", desc: "Recent passport-sized photographs (minimum 4 copies required)." },
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-card border rounded-xl">
                      <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-foreground">{req.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{req.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How to Apply */}
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">How to Register for IJMB in {cityName}</h2>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Create Your Account", desc: `Visit the registration portal and create an account using your email address.` },
                    { step: "2", title: "Fill Your Application", desc: "Complete your personal details, select your preferred centre in " + cityName + ", and choose your 3 A-Level subjects." },
                    { step: "3", title: "Pay the Form Fee", desc: "Pay the ₦5,500 IJMB registration form fee securely online via card or bank transfer." },
                    { step: "4", title: "Upload Documents", desc: "Upload your O-Level result (or awaiting result slip) and a clear passport photograph." },
                    { step: "5", title: "Receive Admission Letter", desc: `After review, receive your admission letter and report to your assigned centre in ${cityName} for clearance and resumption.` },
                  ].map((s) => (
                    <div key={s.step} className="flex gap-4 items-start p-4 border rounded-xl bg-card">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {s.step}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{s.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Combinations */}
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">IJMB Subject Combinations Available in {cityName}</h2>
                <p className="text-muted-foreground mb-4">Select 3 A-Level subjects that align with your intended university course. Common combinations offered at {cityName} centres:</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { course: "Medicine, Dentistry & Pharmacy", subjects: "Biology · Chemistry · Physics" },
                    { course: "Engineering & Technology", subjects: "Mathematics · Physics · Chemistry" },
                    { course: "Law & Social Sciences", subjects: "Literature · Government · Economics" },
                    { course: "Accounting & Business Administration", subjects: "Accounting · Economics · Commerce" },
                    { course: "Agriculture & Veterinary Medicine", subjects: "Biology · Chemistry · Agricultural Science" },
                    { course: "Arts & Humanities", subjects: "Literature · Government · CRS/Islamic Studies" },
                  ].map((c, i) => (
                    <div key={i} className="p-4 border rounded-xl bg-card hover:border-primary/30 transition-colors">
                      <p className="font-semibold text-sm text-foreground mb-1">{c.course}</p>
                      <p className="text-xs text-muted-foreground">{c.subjects}</p>
                    </div>
                  ))}
                </div>
              </div>

              <InternalLinks />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={studentsGroup.src}
                    alt={`IJMB students at a study centre in ${cityName}`}
                    className="w-full h-[220px] object-cover"
                    loading="lazy"
                  />
                </div>

                {/* CTA Card */}
                <div className="bg-primary text-primary-foreground p-6 rounded-xl">
                  <h3 className="font-heading font-bold text-lg mb-2">Register for IJMB in {cityName}</h3>
                  <p className="text-sm opacity-90 mb-4">
                    2026/2027 registration is open. Gain direct entry into 200 level without UTME.
                  </p>
                  <div className="space-y-2 text-sm opacity-80 mb-5">
                    <p className="flex items-center gap-2"><CheckCircle size={14} /> Form fee: ₦5,500</p>
                    <p className="flex items-center gap-2"><CheckCircle size={14} /> Tuition from {data.centres[0]?.tuition}</p>
                    <p className="flex items-center gap-2"><CheckCircle size={14} /> {data.centres.length} centre{data.centres.length > 1 ? 's' : ''} in {cityName}</p>
                  </div>
                  <Link
                    href="/register"
                    className="block w-full text-center px-6 py-3 font-bold rounded-lg cta-gradient text-accent-foreground hover:opacity-90 transition-opacity"
                  >
                    Apply Now <ArrowRight size={16} className="inline ml-1" />
                  </Link>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={studentAnkara.src}
                    alt={`Student preparing for IJMB examinations in ${cityName}`}
                    className="w-full h-[190px] object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Quick stats */}
                <div className="border rounded-xl p-5 bg-card space-y-3">
                  <p className="font-semibold text-sm text-foreground">Quick Facts — {cityName}</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex justify-between"><span>State</span><span className="font-medium text-foreground">{data.state}</span></p>
                    <p className="flex justify-between"><span>Centres Available</span><span className="font-medium text-foreground">{data.centres.length}</span></p>
                    <p className="flex justify-between"><span>Tuition Range</span><span className="font-medium text-foreground">{data.centres[0]?.tuition}+</span></p>
                    <p className="flex justify-between"><span>Programme Duration</span><span className="font-medium text-foreground">9 Months</span></p>
                    <p className="flex justify-between"><span>Session</span><span className="font-medium text-foreground">2026/2027</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} />
      <CTASection title={`Start Your IJMB Journey in ${cityName} Today`} />
    </>
  );
};

export default LocationPage;
