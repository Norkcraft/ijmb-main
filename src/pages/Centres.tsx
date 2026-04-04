'use client';

import Link from "next/link";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import { MapPin, CheckCircle, Search, School } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cities = [
  "Lagos", "Abuja", "Ibadan", "Ilorin", "Port Harcourt", "Benin", "Kano", "Kaduna",
  "Jos", "Enugu", "Owerri", "Aba", "Uyo", "Akure", "Ado-Ekiti", "Abeokuta",
  "Osogbo", "Minna", "Lokoja", "Makurdi",
];

const faqs = [
  { question: "How many IJMB centres are in Nigeria?", answer: "There are numerous approved IJMB study centres spread across all 36 states of Nigeria and the FCT. New centres are approved regularly to meet the growing demand for the programme." },
  { question: "How do I choose the right IJMB centre?", answer: "Consider proximity to your home, the centre's track record, quality of lecturers, available facilities (laboratories and library), and the total fees charged including accommodation." },
  { question: "Can I change my IJMB centre after registration?", answer: "Transfer between centres is possible in some cases but must be approved by the IJMB national office. It is best to choose your preferred centre from the start to avoid administrative delays." },
  { question: "Are all IJMB centres accredited?", answer: "Not all centres claiming to offer IJMB are accredited. It is crucial to register through the official portal to ensure you are assigned to a genuine, accredited centre moderated by ABU Zaria." },
];

const Centres = () => (
  <>
    <SEOHead
      title="IJMB Study Centres in Nigeria 2026/2027 – Official List of Accredited Centres"
      description="Find the complete list of accredited IJMB study centres in Nigeria for 2026/2027. Locate approved centres in Lagos, Abuja, Ilorin, Port Harcourt and more."
      canonical="https://www.ijmb.info/ijmb-centres-in-nigeria"
      keywords="IJMB study centres in Nigeria, accredited IJMB centres, IJMB centres in Lagos, IJMB centres in Abuja, IJMB centres in Ilorin, official IJMB centres list"
    />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "IJMB Centres" }]} />

    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12">
           <div className="lg:col-span-8">
              <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">
                IJMB Study Centres in Nigeria – Official Accredited List 2026/2027
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                <strong>IJMB study centres in Nigeria</strong> are strategically located across the country to provide accessible quality education for students seeking direct entry admission into 200 level.
                Whether you are in the North, South, East, or West, there is an approved IJMB centre near you ready to help you achieve your university dreams.
              </p>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-10">
                 <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                   <CheckCircle className="text-primary" /> Why Register at an Accredited Centre?
                 </h2>
                 <p className="text-muted-foreground mb-4">
                   Registering at an accredited centre ensures your results are recognized by the Joint Admissions and Matriculation Board (JAMB) and the National Universities Commission (NUC).
                   Our platform connects you ONLY with fully accredited centres moderated by Ahmadu Bello University (ABU), Zaria.
                 </p>
                 <Link href="/register" className="text-primary font-bold hover:underline">
                   Start your registration now →
                 </Link>
              </div>

              <h2 className="text-2xl font-heading font-bold mt-10 mb-6">Find an IJMB Centre Near You</h2>
              <p className="text-muted-foreground mb-6">
                Select your preferred city below to view details about the IJMB programme in that location, including fees, address, and available subject combinations.
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {cities.map((city) => (
                  <Link
                    key={city}
                    href={`/ijmb-in-${city.toLowerCase().replace(/ /g, "-")}`}
                    className="group flex items-center justify-between px-5 py-4 bg-white border rounded-xl hover:border-primary hover:shadow-md transition-all"
                  >
                    <span className="font-medium flex items-center gap-2">
                      <MapPin size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      {city}
                    </span>
                    <Search size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>

              <h2 className="text-2xl font-heading font-bold mt-12 mb-4">How to Choose the Best IJMB Centre</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Choosing the right IJMB study centre is a critical decision that can influence your exam success. Consider these key factors when selecting your centre:
              </p>

              <div className="space-y-6 mb-10">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 font-bold text-primary">1</div>
                    <div>
                       <h3 className="font-bold text-lg">Accreditation Status</h3>
                       <p className="text-muted-foreground text-sm">Ensure the centre is officially approved by the IJMB national body. Unaccredited centres cannot register students for the final ABU examination.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 font-bold text-primary">2</div>
                    <div>
                       <h3 className="font-bold text-lg">Academic Facilities</h3>
                       <p className="text-muted-foreground text-sm">Science students must check for functional laboratories (Physics, Chemistry, Biology). All students need a good library and conducive classrooms.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 font-bold text-primary">3</div>
                    <div>
                       <h3 className="font-bold text-lg">Lecturer Quality</h3>
                       <p className="text-muted-foreground text-sm">Experienced lecturers who understand the IJMB syllabus and marking scheme significantly improve your chances of scoring 12+ points.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 font-bold text-primary">4</div>
                    <div>
                       <h3 className="font-bold text-lg">Accommodation & Security</h3>
                       <p className="text-muted-foreground text-sm">If you are traveling from another state, choose a centre with secure, comfortable hostel accommodation within the premises or nearby.</p>
                    </div>
                 </div>
              </div>

              <h2 className="text-2xl font-heading font-bold mt-10 mb-4">IJMB Centre Fees Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Fees vary depending on the location and facilities of the centre. Generally, centres in major cities like Lagos, Abuja, and Port Harcourt may have higher fees due to the cost of living and operations.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                   <thead className="bg-muted">
                      <tr>
                         <th className="p-3 text-left">Location Category</th>
                         <th className="p-3 text-left">Estimated Tuition</th>
                         <th className="p-3 text-left">Estimated Hostel</th>
                      </tr>
                   </thead>
                   <tbody>
                      <tr className="border-b">
                         <td className="p-3 font-medium">Major Cities (Lagos, Abuja, PH)</td>
                         <td className="p-3">₦100,000 – ₦150,000</td>
                         <td className="p-3">₦80,000 – ₦150,000</td>
                      </tr>
                      <tr className="border-b">
                         <td className="p-3 font-medium">State Capitals (Ibadan, Ilorin, Enugu)</td>
                         <td className="p-3">₦70,000 – ₦100,000</td>
                         <td className="p-3">₦50,000 – ₦80,000</td>
                      </tr>
                      <tr>
                         <td className="p-3 font-medium">Other Towns</td>
                         <td className="p-3">₦60,000 – ₦80,000</td>
                         <td className="p-3">₦30,000 – ₦50,000</td>
                      </tr>
                   </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">*Fees are estimates and subject to change. Visit specific city pages for detailed pricing.</p>

              <InternalLinks exclude="/ijmb-centres-in-nigeria" />
           </div>

           <div className="lg:col-span-4 space-y-8">
              <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <School className="text-primary" /> Popular Centres
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <Link href="/ijmb-in-ilorin" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                       <h4 className="font-bold text-primary">Ilorin Centre</h4>
                       <p className="text-xs text-muted-foreground">Kwara State • Excellent Science Labs</p>
                    </Link>
                    <Link href="/ijmb-in-lagos" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                       <h4 className="font-bold text-primary">Lagos Centre</h4>
                       <p className="text-xs text-muted-foreground">Ikeja/Palm Grove • Modern Facilities</p>
                    </Link>
                    <Link href="/ijmb-in-abuja" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                       <h4 className="font-bold text-primary">Abuja Centre</h4>
                       <p className="text-xs text-muted-foreground">Gwagwalada • Serene Environment</p>
                    </Link>
                    <Link href="/ijmb-in-ibadan" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                       <h4 className="font-bold text-primary">Ibadan Centre</h4>
                       <p className="text-xs text-muted-foreground">Oyo State • Affordable Fees</p>
                    </Link>
                 </CardContent>
              </Card>

              <div className="bg-secondary p-6 rounded-xl sticky top-24">
                 <h3 className="font-bold text-xl mb-2">Need Help Choosing?</h3>
                 <p className="text-muted-foreground text-sm mb-4">
                    Our admission officers can help you select the best centre based on your location, budget, and intended course of study.
                 </p>
                 <Link href="/contact" className="block w-full py-3 text-center bg-white border border-input rounded-lg font-bold hover:bg-gray-50 transition-colors">
                    Contact Support
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection />
  </>
);

export default Centres;
