'use client';

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import studentsGroup from "@/assets/students-group.jpeg";
import studentAnkara from "@/assets/student-ankara.jpeg";
import { ArrowRight, CheckCircle, MapPin, Star, GraduationCap } from "lucide-react";

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

interface CityInfo {
  state: string;
  desc: string;
  highlights: string[];
  universities: string[];
  tip: string;
  region: string;
  population: string;
  uniqueIntro: string;
}

const cityData: Record<string, CityInfo> = {
  lagos: {
    state: "Lagos",
    desc: "Nigeria's commercial capital and largest city",
    highlights: ["Largest study network in Nigeria", "Multiple centre options across the state", "Close proximity to UNILAG, LASU & LASPOTECH"],
    universities: ["University of Lagos (UNILAG)", "Lagos State University (LASU)", "Pan-Atlantic University", "Lagos State University of Science & Technology (LASUSTECH)"],
    tip: "Lagos IJMB centres fill up fast — register as early as possible and specify whether you prefer a Mainland or Island centre to avoid a long daily commute. Registration closes once a centre reaches capacity.",
    region: "South-West",
    population: "over 15 million residents",
    uniqueIntro: "Lagos is Nigeria's commercial capital and the most densely populated city in Africa, home to UNILAG and LASU — two universities with strong IJMB direct entry quotas. Studying IJMB in Lagos means access to some of the best A-Level tutors in the country, a competitive academic environment, and the highest concentration of accredited centres nationwide.",
  },
  abuja: {
    state: "FCT - Abuja",
    desc: "Nigeria's capital city and administrative centre",
    highlights: ["Serene learning environment", "Close to ABU Zaria headquarters", "Multiple universities in the FCT"],
    universities: ["University of Abuja (UNIABUJA)", "Baze University", "Nile University of Nigeria", "African University of Science & Technology (AUST)"],
    tip: "Abuja centres are in high demand among FCT students — secure your spot before the first month of each intake. The proximity to ABU Zaria (the IJMB examining body) also makes administrative follow-ups easier for Abuja-based students.",
    region: "North-Central / FCT",
    population: "over 3 million residents",
    uniqueIntro: "Abuja, Nigeria's serene capital city, hosts some of the most well-equipped IJMB study centres in the country, serving students from across the FCT and neighbouring states like Nasarawa and Niger. Its proximity to Ahmadu Bello University Zaria — the institution that administers IJMB — makes Abuja a particularly strategic city for candidates who want easy access to official examination updates and administrative support.",
  },
  ibadan: {
    state: "Oyo",
    desc: "one of the largest cities in West Africa",
    highlights: ["Home to University of Ibadan", "Rich academic culture", "Affordable cost of living for students"],
    universities: ["University of Ibadan (UI)", "Ladoke Akintola University of Technology (LAUTECH)", "The Polytechnic Ibadan", "Bowen University"],
    tip: "Ibadan is home to the oldest university in Nigeria — IJMB students targeting UI should aim for 12 points or above in their A-Level examinations, as UI's direct entry cut-off is highly competitive. Start preparing past questions early and choose a centre known for strong Science or Arts tutoring.",
    region: "South-West",
    population: "over 3 million residents",
    uniqueIntro: "Ibadan, the capital of Oyo State and one of the largest cities in West Africa, is home to the University of Ibadan — Nigeria's premier and oldest university. This makes Ibadan one of the most academically competitive cities for IJMB candidates, as thousands of students each year target UI's direct entry programme through IJMB A-Levels.",
  },
  ilorin: {
    state: "Kwara",
    desc: "a major educational hub in North-Central Nigeria",
    highlights: ["Home to University of Ilorin", "Affordable and student-friendly city", "Excellent IJMB pass rate history"],
    universities: ["University of Ilorin (UNILORIN)", "Kwara State University (KWASU)", "Al-Hikmah University", "Landmark University"],
    tip: "UNILORIN is regarded as one of the most IJMB-friendly universities in Nigeria, with a well-structured direct entry process. Choose your three A-Level subjects specifically to match your intended UNILORIN faculty — the Medicine and Law faculties require particularly high IJMB scores.",
    region: "North-Central",
    population: "over 800,000 residents",
    uniqueIntro: "Ilorin, the capital of Kwara State, is a major educational hub in North-Central Nigeria and home to the University of Ilorin — one of the universities most consistently accepting IJMB candidates for direct entry. The city's peaceful, student-friendly atmosphere and comparatively lower cost of living make it a popular choice for IJMB candidates from across the North-Central and South-West zones.",
  },
  "port-harcourt": {
    state: "Rivers",
    desc: "the oil capital of Nigeria",
    highlights: ["Gateway to South-South universities", "Close to UNIPORT and RSUST", "Strong science and engineering tradition"],
    universities: ["University of Port Harcourt (UNIPORT)", "Rivers State University (RSU)", "Ignatius Ajuru University of Education", "Ken Saro-Wiwa Polytechnic"],
    tip: "Port Harcourt's strong engineering and petroleum culture means most IJMB students here opt for Physics, Chemistry, and Mathematics. Choose a centre with functional science laboratories — this is critical for practical preparation for UNIPORT's demanding direct entry requirements.",
    region: "South-South",
    population: "over 1.9 million residents",
    uniqueIntro: "Port Harcourt, the capital of Rivers State and Nigeria's oil capital, has a strong tradition of science and engineering education driven by its proximity to the petroleum industry. IJMB students in Port Harcourt predominantly target UNIPORT and RSU, both of which actively accept IJMB candidates for direct entry into their highly competitive engineering, sciences, and medical programmes.",
  },
  benin: {
    state: "Edo",
    desc: "a historic city and educational centre",
    highlights: ["Home to University of Benin (UNIBEN)", "Vibrant student community", "Strong arts and social science tradition"],
    universities: ["University of Benin (UNIBEN)", "Benson Idahosa University", "Ambrose Alli University", "Wellspring University"],
    tip: "UNIBEN is one of Nigeria's most sought-after universities for direct entry admission — IJMB students targeting UNIBEN for Medicine, Law, or Engineering must score 12 points or above in their A-Level examinations. Register early at a centre with experienced science tutors to maximise your score.",
    region: "South-South",
    population: "over 1.5 million residents",
    uniqueIntro: "Benin City, the capital of Edo State and a historically rich city in South-South Nigeria, is home to the University of Benin — one of the country's leading federal universities with a strong direct entry intake via IJMB. Students from Benin City and across Edo State benefit from several accredited IJMB study centres offering competitive tuition across the sciences, arts, and social sciences.",
  },
  kano: {
    state: "Kano",
    desc: "the largest city in Northern Nigeria",
    highlights: ["Largest northern city study network", "Home to Bayero University Kano (BUK)", "Strong business and commercial studies tradition"],
    universities: ["Bayero University Kano (BUK)", "Northwest University Kano", "Yusuf Maitama Sule University (YMSU)", "Kano University of Science & Technology (KUST)"],
    tip: "Bayero University Kano (BUK) has a dedicated direct entry quota for IJMB candidates and is one of the most accessible federal universities in the North-West for direct entry. Register as early as possible — Kano IJMB centres are among the busiest in Northern Nigeria.",
    region: "North-West",
    population: "over 4 million residents",
    uniqueIntro: "Kano, Nigeria's second most populous city and the commercial capital of the North, is home to Bayero University Kano — one of the top federal universities in Northern Nigeria that actively accepts IJMB for direct entry. The city's well-established academic culture and growing number of accredited IJMB centres make it an excellent base for students from Kano and across the North-West seeking to gain 200-level admission without UTME.",
  },
  kaduna: {
    state: "Kaduna",
    desc: "a key educational and industrial centre",
    highlights: ["Home to Kaduna State University", "Central location in Northern Nigeria", "Established academic tradition"],
    universities: ["Ahmadu Bello University Zaria (ABU)", "Kaduna State University (KASU)", "Nigerian Defence Academy (NDA)", "Joseph Sarwuan Tarka University"],
    tip: "Kaduna and Zaria host ABU — the very institution that administers IJMB examinations. Studying here gives you unmatched proximity to the national IJMB office and ABU direct entry, which has one of the largest IJMB direct entry intakes in Nigeria.",
    region: "North-West",
    population: "over 1.5 million residents",
    uniqueIntro: "Kaduna State, and particularly the city of Zaria within it, holds a uniquely special significance for IJMB candidates: it is home to Ahmadu Bello University (ABU) — the very institution that administers the IJMB A-Level programme and examinations nationwide. Students based in Kaduna have the strategic advantage of proximity to the IJMB national office, ABU's direct entry admission process, and a strong academic ecosystem that has supported IJMB students for decades.",
  },
  jos: {
    state: "Plateau",
    desc: "known for its cool climate and quality education",
    highlights: ["Home to University of Jos (UNIJOS)", "Serene cool climate ideal for study", "Strong science programme history"],
    universities: ["University of Jos (UNIJOS)", "Plateau State University (PLASU)", "Bingham University", "University of Mkar"],
    tip: "UNIJOS accepts IJMB for nearly all faculties and is the primary direct entry destination for Jos-based students. The University's direct entry process is well-structured — ensure you meet the faculty-specific IJMB point requirements before finalising your subject combination.",
    region: "North-Central",
    population: "over 900,000 residents",
    uniqueIntro: "Jos, the capital of Plateau State and one of Nigeria's most scenic and temperate cities, offers a calm and focused environment ideal for IJMB study. The city is home to the University of Jos, which maintains an active IJMB direct entry programme across multiple faculties, and several accredited IJMB centres serving students from Plateau, Benue, and neighbouring states.",
  },
  enugu: {
    state: "Enugu",
    desc: "the Coal City and eastern educational hub",
    highlights: ["Home to UNN and ESUT", "Major academic city in South-East", "Excellent arts and humanities tradition"],
    universities: ["University of Nigeria Nsukka (UNN)", "Enugu State University of Science & Technology (ESUT)", "Godfrey Okoye University", "Caritas University"],
    tip: "UNN Nsukka is one of the South-East's most popular universities for IJMB direct entry — it accepts students across sciences, arts, law, and social sciences. Enugu centres with strong academic reputations tend to produce higher A-Level scores; ask about a centre's recent pass rate before registering.",
    region: "South-East",
    population: "over 900,000 residents",
    uniqueIntro: "Enugu, the capital of Enugu State and a major educational city in South-East Nigeria, sits at the heart of a region with a historically strong culture of academic excellence. The city's IJMB study centres serve thousands of candidates annually, with many targeting direct entry at UNN — one of the most respected federal universities in the South-East — as well as ESUT and several private universities in the region.",
  },
  owerri: {
    state: "Imo",
    desc: "a vibrant city in South-East Nigeria",
    highlights: ["Home to FUTO and Imo State University", "Fast-growing educational hub", "Vibrant student community"],
    universities: ["Federal University of Technology Owerri (FUTO)", "Imo State University (IMSU)", "Afe Babalola University (ABUAD)", "Eastern Palm University"],
    tip: "FUTO is one of Nigeria's leading technology universities and actively accepts IJMB for direct entry into Engineering, Computer Science, and Science programmes. IJMB students targeting FUTO must score 12+ points in relevant science subjects — choose an Owerri centre with strong physics, maths, and chemistry tutoring.",
    region: "South-East",
    population: "over 400,000 residents",
    uniqueIntro: "Owerri, the capital of Imo State, is home to the Federal University of Technology Owerri (FUTO) — one of Nigeria's top specialised technology universities and a primary destination for IJMB direct entry students from the South-East. The city's growing number of accredited IJMB centres reflects the high demand for the programme among Imo State students seeking to bypass UTME and enter 200-level of their chosen engineering or science programme.",
  },
  aba: {
    state: "Abia",
    desc: "a major commercial hub in South-East Nigeria",
    highlights: ["Growing academic centre in Abia State", "Close to Abia State University", "Affordable study environment"],
    universities: ["Abia State University (ABSU)", "Michael Okpara University of Agriculture (MOUAU)", "Federal University of Technology Owerri (FUTO)", "Gregory University Uturu"],
    tip: "ABSU and MOUAU are the two most popular IJMB direct entry destinations for students from Aba. Choose your A-Level combination based on your target university and faculty — agriculture students should take Biology, Chemistry, and Agricultural Science for MOUAU.",
    region: "South-East",
    population: "over 700,000 residents",
    uniqueIntro: "Aba, the commercial nerve centre of Abia State and one of the most economically active cities in South-East Nigeria, is a growing hub for IJMB candidates targeting universities like ABSU and MOUAU. The city's vibrant student population and accessible IJMB centres make it a practical base for candidates from across Abia State and neighbouring Imo seeking direct entry admission.",
  },
  uyo: {
    state: "Akwa Ibom",
    desc: "a rapidly developing South-South city",
    highlights: ["Home to University of Uyo (UNIUYO)", "Modern facilities and infrastructure", "Peaceful learning environment"],
    universities: ["University of Uyo (UNIUYO)", "Akwa Ibom State University (AKSU)", "Pan-Atlantic University", "Ritman University"],
    tip: "UNIUYO is the primary IJMB direct entry destination for students from Uyo and Akwa Ibom State. The university has a structured direct entry process — ensure your IJMB subject combination aligns with your chosen UNIUYO faculty before completing your registration.",
    region: "South-South",
    population: "over 500,000 residents",
    uniqueIntro: "Uyo, the capital of Akwa Ibom State and one of the fastest-developing state capitals in South-South Nigeria, is home to the University of Uyo — a federal university with an active IJMB direct entry programme across its many faculties. The city's expanding infrastructure and commitment to education have supported the growth of accredited IJMB centres serving candidates from across Akwa Ibom and neighbouring Cross River State.",
  },
  akure: {
    state: "Ondo",
    desc: "the Sunshine State capital",
    highlights: ["Home to FUTA (Federal University of Technology)", "Strong science and technology tradition", "Growing educational sector"],
    universities: ["Federal University of Technology Akure (FUTA)", "Ondo State University of Medical Sciences (OUMSCO)", "Joseph Ayo Babalola University (JABU)", "Elizade University"],
    tip: "FUTA is one of Nigeria's most competitive technology universities for direct entry — IJMB students targeting FUTA Engineering must aim for 12+ points in Mathematics, Physics, and Chemistry. Akure centres with science laboratory facilities are strongly recommended.",
    region: "South-West",
    population: "over 420,000 residents",
    uniqueIntro: "Akure, the capital of Ondo State and home to the Federal University of Technology Akure (FUTA), is a key academic city in South-West Nigeria for students pursuing science and technology careers. IJMB candidates in Akure benefit from a focused academic environment and proximity to FUTA, which consistently accepts IJMB candidates for direct entry into its highly competitive engineering and applied sciences programmes.",
  },
  "ado-ekiti": {
    state: "Ekiti",
    desc: "a major educational centre in the South-West",
    highlights: ["Land of Honour — home to Ekiti State University", "Strong academic culture", "Affordable and student-friendly"],
    universities: ["Ekiti State University (EKSU)", "Afe Babalola University (ABUAD)", "Federal University Oye-Ekiti (FUOYE)", "Crown Hill University"],
    tip: "Ado-Ekiti has three major universities within reach — EKSU, ABUAD, and FUOYE — all of which accept IJMB for direct entry. ABUAD in particular has a strong track record of IJMB intake and a structured admissions process; ensure your subject combination matches the faculty requirements.",
    region: "South-West",
    population: "over 400,000 residents",
    uniqueIntro: "Ado-Ekiti, the capital of Ekiti State, is an educational city with three IJMB-accepting universities within easy reach, making it one of the most option-rich destinations for direct entry candidates in South-West Nigeria. The city's culture of education and its several accredited IJMB centres create an excellent environment for candidates who want to gain 200-level admission without sitting UTME.",
  },
  abeokuta: {
    state: "Ogun",
    desc: "a historic city near Lagos",
    highlights: ["Home to Federal University of Agriculture Abeokuta (FUNAAB)", "Near Lagos, easy access", "Strong agriculture and science tradition"],
    universities: ["Federal University of Agriculture Abeokuta (FUNAAB)", "Moshood Abiola University of Science & Technology (MAUTECH)", "Bells University of Technology", "Crescent University"],
    tip: "FUNAAB is Nigeria's leading agricultural university and accepts IJMB candidates every session — the recommended subject combination for FUNAAB-bound students is Biology, Chemistry, and Agricultural Science. Register early as FUNAAB-bound IJMB students from Abeokuta fill up quickly.",
    region: "South-West",
    population: "over 600,000 residents",
    uniqueIntro: "Abeokuta, the capital of Ogun State and a city with deep historical roots in education, is home to FUNAAB — the Federal University of Agriculture, one of Nigeria's top specialised universities with a strong IJMB direct entry programme. Students across Ogun State and neighbouring Lagos use Abeokuta's accredited IJMB centres as a gateway to direct entry admission into FUNAAB, Bells University, and Crescent University.",
  },
  osogbo: {
    state: "Osun",
    desc: "a cultural and educational centre in Yorubaland",
    highlights: ["Home to Osun State University", "Culturally rich study environment", "Affordable fees"],
    universities: ["Osun State University (UNIOSUN)", "Obafemi Awolowo University Ile-Ife (OAU)", "Redeemer's University", "Bowen University"],
    tip: "OAU Ile-Ife is one of Nigeria's most prestigious universities and is within reach for IJMB students in Osogbo — however, OAU's direct entry cut-off is extremely competitive and requires 12+ IJMB points. Osogbo's calm environment is ideal for the focused preparation needed to hit that target.",
    region: "South-West",
    population: "over 800,000 residents",
    uniqueIntro: "Osogbo, the capital of Osun State and a UNESCO-recognised cultural city, is strategically located near OAU Ile-Ife — one of Nigeria's most prestigious and sought-after universities for direct entry admission through IJMB. The city's peaceful, culturally rich atmosphere makes it an excellent base for serious IJMB candidates who want a focused study environment while remaining close to top-tier South-West universities.",
  },
  minna: {
    state: "Niger",
    desc: "the capital of Nigeria's largest state by landmass",
    highlights: ["Home to Federal University of Technology Minna (FUT Minna)", "Expanding academic community", "Affordable living costs"],
    universities: ["Federal University of Technology Minna (FUT Minna)", "Ibrahim Badamasi Babangida University (IBBU)", "Niger State Polytechnic", "Confluence University of Science & Technology"],
    tip: "FUT Minna has strong IJMB direct entry intake for Engineering, Computing, and Sciences — students must take Mathematics, Physics, and Chemistry for most FUT Minna engineering programmes. Choose an IJMB centre in Minna with functional science laboratories to maximise your examination score.",
    region: "North-Central",
    population: "over 400,000 residents",
    uniqueIntro: "Minna, the capital of Niger State and home to the Federal University of Technology Minna, is a growing academic hub in North-Central Nigeria for students seeking direct entry into science and technology programmes. FUT Minna actively accepts IJMB candidates each session, and the city's expanding network of accredited IJMB centres reflects the growing demand from Niger State students seeking to gain 200-level admission without UTME.",
  },
  lokoja: {
    state: "Kogi",
    desc: "the confluence city where Rivers Niger and Benue meet",
    highlights: ["Home to Kogi State University", "Strategic location in North-Central Nigeria", "Growing educational infrastructure"],
    universities: ["Federal University Lokoja (FULOKOJA)", "Kogi State University (KSU)", "Prince Abubakar Audu University (PAAU)", "Salem University"],
    tip: "Lokoja's central location in Nigeria makes it accessible to students from Kogi, Benue, Anambra, and Niger states — multiple universities across these states accept IJMB for direct entry. Check each university's specific cut-off points and ensure your subject combination is aligned before finalising registration.",
    region: "North-Central",
    population: "over 300,000 residents",
    uniqueIntro: "Lokoja, the capital of Kogi State and Nigeria's first colonial administrative capital, sits at the strategic confluence of the Rivers Niger and Benue — making it a natural crossroads for students from multiple neighbouring states. Its IJMB study centres serve candidates from Kogi, Benue, Anambra, and Niger states, all of whom can access federal and state universities in those regions through IJMB direct entry.",
  },
  makurdi: {
    state: "Benue",
    desc: "the Food Basket of the Nation's capital",
    highlights: ["Home to Benue State University and Federal University of Agriculture", "Peaceful academic environment", "Affordable cost of living"],
    universities: ["Benue State University (BSU)", "Joseph Sarwuan Tarka University Makurdi (JOSTUM)", "Federal University of Agriculture Makurdi (FUAM)", "University of Mkar"],
    tip: "FUAM is one of Nigeria's leading agricultural universities and consistently accepts IJMB candidates for direct entry — Biology, Chemistry, and Agricultural Science is the recommended subject combination for FUAM-bound students. BSU is also a strong option with an active IJMB direct entry quota.",
    region: "North-Central",
    population: "over 300,000 residents",
    uniqueIntro: "Makurdi, the capital of Benue State and home to the Federal University of Agriculture Makurdi (FUAM), is the academic heart of one of Nigeria's most agriculturally rich states. IJMB candidates in Makurdi enjoy access to BSU, FUAM, and JOSTUM — all of which accept IJMB for direct entry — making this city a strong base for students targeting agricultural, science, and social science programmes at 200 level.",
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

  const cityName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

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

  const faqs = [
    {
      question: `Is there an IJMB centre in ${cityName}?`,
      answer: `Yes. There are accredited IJMB study centres in ${cityName}, ${data.state} available for the ${YEAR} session. Students from ${cityName} and surrounding areas can register and attend classes locally. Contact us to confirm current availability and get assigned to a centre near you.`
    },
    {
      question: `How much is IJMB in ${cityName}?`,
      answer: `The IJMB registration form fee is ₦10,000 nationwide. Tuition fees vary by centre but are generally affordable — contact us after registering for a full breakdown of costs for your assigned centre in ${cityName}, ${data.state}.`
    },
    {
      question: `Which universities near ${cityName} accept IJMB?`,
      answer: `Several universities near ${cityName} accept IJMB for direct entry into 200 level, including ${data.universities.slice(0, 3).join(', ')}. A valid IJMB result is accepted by over 200 federal, state, and private universities across Nigeria.`
    },
    {
      question: `Can I register for IJMB online from ${cityName}?`,
      answer: `Yes. Registration is completed entirely online. After paying the ₦10,000 form fee, our team will assign you to an accredited centre in ${cityName} or the nearest approved centre in ${data.state} State.`
    },
    {
      question: `What subjects should I take for IJMB in ${cityName}?`,
      answer: `Your subject combination depends on your intended university course. Science students targeting ${data.universities[0]} typically take Biology, Chemistry, and Physics or Mathematics. Arts students take Literature, Government, and CRS or Economics. Our admissions team can advise on the best combination for your target university once you register.`
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://www.ijmb.info" },
                  { "@type": "ListItem", position: 2, name: "IJMB Centres", item: "https://www.ijmb.info/ijmb-centres-in-nigeria" },
                  { "@type": "ListItem", position: 3, name: `IJMB in ${cityName}`, item: `https://www.ijmb.info/ijmb-in-${slug}` },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              },
              {
                "@type": "EducationalOrganization",
                name: `IJMB Study Centres in ${cityName}`,
                description: `Accredited IJMB study centres in ${cityName}, ${data.state}. Register for IJMB ${YEAR} and gain direct entry into 200 level without UTME.`,
                url: `https://www.ijmb.info/ijmb-in-${slug}`,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: cityName,
                  addressRegion: data.state,
                  addressCountry: "NG",
                },
                areaServed: cityName,
              },
            ],
          }),
        }}
      />

      <SEOHead
        title={`IJMB in ${cityName} ${YEAR} – Accredited Study Centres & Registration`}
        description={`Register for IJMB in ${cityName}, ${data.state}. Accredited study centres for ${YEAR} session. Gain direct entry into 200 level without UTME. Universities near ${cityName} accepting IJMB include ${data.universities[0]}.`}
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
                  <MapPin size={16} className="text-primary" /> {data.state} State &mdash; {data.region}
                </div>
                <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">
                  IJMB in {cityName} — Study Centres & {YEAR} Registration
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Looking for <strong className="text-foreground">IJMB in {cityName}</strong>? You are in the right place. This page lists all accredited IJMB study centres in {cityName}, {data.state} — {data.desc} — along with fees, admission requirements, and how to register for the <strong className="text-foreground">{YEAR} session</strong>.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {data.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-primary/5 border border-primary/20 text-primary px-3 py-1.5 rounded-full">
                      <CheckCircle size={13} /> {h}
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Study IJMB in {cityName}? */}
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">Why Study IJMB in {cityName}?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{data.uniqueIntro}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {cityName} has accredited IJMB study centres serving students from {data.state} State and the wider {data.region} region. With {data.universities.length} universities nearby that accept IJMB for direct entry, candidates in {cityName} have some of the best university options available after completing their A-Levels.
                </p>

                {/* Stat row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 bg-primary/5 border border-primary/15 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground mb-1">Region</p>
                    <p className="font-bold text-sm text-foreground leading-tight">{data.region}</p>
                  </div>
                  <div className="p-4 bg-primary/5 border border-primary/15 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground mb-1">Population</p>
                    <p className="font-bold text-sm text-foreground leading-tight">{data.population}</p>
                  </div>
                  <div className="p-4 bg-primary/5 border border-primary/15 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground mb-1">Nearby Universities</p>
                    <p className="font-bold text-sm text-foreground leading-tight">{data.universities.length}+ accepting IJMB</p>
                  </div>
                  <div className="p-4 bg-primary/5 border border-primary/15 rounded-xl text-center">
                    <p className="text-xs text-muted-foreground mb-1">Programme</p>
                    <p className="font-bold text-sm text-foreground leading-tight">9 Months A-Level</p>
                  </div>
                </div>
              </div>

              {/* Option A: University Entry Requirements */}
              <div>
                <h2 className="text-2xl font-heading font-bold mb-2">
                  Universities Near {cityName} That Accept IJMB
                </h2>
                <p className="text-muted-foreground mb-6">
                  After completing your IJMB A-Levels, you can apply for direct entry into 200 level at any of these universities near {cityName} — no UTME required.
                </p>

                <div className="space-y-3 mb-6">
                  {data.universities.map((uni, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-card border rounded-xl hover:border-primary/30 transition-colors">
                      <GraduationCap size={18} className="text-primary shrink-0" />
                      <span className="font-medium text-sm text-foreground">{uni}</span>
                    </div>
                  ))}
                </div>

                {/* IJMB Points requirement table */}
                <h3 className="text-lg font-heading font-bold mb-3">IJMB Points Required by Course</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  IJMB is graded A–E across 3 subjects (max 15 points). The table below shows the minimum points typically required at the universities listed above:
                </p>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-primary/5 border-b">
                        <th className="text-left p-3 font-semibold text-foreground">Course / Faculty</th>
                        <th className="text-center p-3 font-semibold text-foreground whitespace-nowrap">Min. Points</th>
                        <th className="text-left p-3 font-semibold text-foreground hidden sm:table-cell">Recommended Subjects</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        { course: "Medicine, Dentistry & Pharmacy", points: "15", subjects: "Biology · Chemistry · Physics" },
                        { course: "Law", points: "12", subjects: "Literature · Government · Economics" },
                        { course: "Engineering & Technology", points: "12", subjects: "Maths · Physics · Chemistry" },
                        { course: "Computer Science & IT", points: "10", subjects: "Maths · Physics · Chemistry" },
                        { course: "Sciences (Biology, Chemistry, etc.)", points: "9", subjects: "Any 3 relevant science subjects" },
                        { course: "Agriculture & Vet Medicine", points: "9", subjects: "Biology · Chemistry · Agric Science" },
                        { course: "Accounting & Business Admin", points: "9", subjects: "Accounting · Economics · Commerce" },
                        { course: "Arts, Education & Humanities", points: "9", subjects: "Literature · Government · CRS/History" },
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                          <td className="p-3 font-medium text-foreground">{row.course}</td>
                          <td className="p-3 text-center">
                            <span className="inline-block bg-primary/10 text-primary font-bold text-xs px-2 py-1 rounded-full">{row.points} pts</span>
                          </td>
                          <td className="p-3 text-muted-foreground hidden sm:table-cell">{row.subjects}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3 bg-muted/40 border rounded-xl p-3">
                  Points are indicative. Exact cut-offs vary by university and year. Our admissions team will advise on the right subject combination for your specific target university in {cityName} when you register.
                </p>
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

              {/* City-specific Pro Tip callout */}
              <div className="flex items-start gap-4 p-5 bg-amber-50 border border-amber-200 rounded-xl">
                <Star size={20} className="text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-amber-900 mb-1">Pro Tip for {cityName} Students</p>
                  <p className="text-sm text-amber-800 leading-relaxed">{data.tip}</p>
                </div>
              </div>

              {/* How to Apply */}
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">How to Register for IJMB in {cityName}</h2>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Create Your Account", desc: `Visit the registration portal and create an account using your email address.` },
                    { step: "2", title: "Fill Your Application", desc: "Complete your personal details, select your preferred centre in " + cityName + ", and choose your 3 A-Level subjects." },
                    { step: "3", title: "Pay the Form Fee", desc: "Pay the ₦10,000 IJMB registration form fee securely online via card or bank transfer." },
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
                    {YEAR} registration is open. Gain direct entry into 200 level without UTME.
                  </p>
                  <div className="space-y-2 text-sm opacity-80 mb-5">
                    <p className="flex items-center gap-2"><CheckCircle size={14} /> Form fee: ₦10,000</p>
                    <p className="flex items-center gap-2"><CheckCircle size={14} /> Accredited centres in {cityName}</p>
                    <p className="flex items-center gap-2"><CheckCircle size={14} /> {data.universities.length}+ universities accepting IJMB</p>
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
                    <p className="flex justify-between"><span>Region</span><span className="font-medium text-foreground">{data.region}</span></p>
                    <p className="flex justify-between"><span>Nearby Universities</span><span className="font-medium text-foreground">{data.universities.length}+</span></p>
                    <p className="flex justify-between"><span>Form Fee</span><span className="font-medium text-foreground">₦10,000</span></p>
                    <p className="flex justify-between"><span>Tuition Fee</span><span className="font-medium text-foreground">₦350,000</span></p>
                    <p className="flex justify-between"><span>Hostel Fee</span><span className="font-medium text-foreground">₦150,000</span></p>
                    <p className="flex justify-between"><span>Programme Duration</span><span className="font-medium text-foreground">9 Months</span></p>
                    <p className="flex justify-between"><span>Session</span><span className="font-medium text-foreground">{YEAR}</span></p>
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
