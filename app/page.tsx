import type { Metadata } from 'next';
import Index from '@/pages/Index';

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

const faqs = [
  { question: "What is IJMB?", answer: "IJMB stands for Interim Joint Matriculation Board. It is an Advanced Level (A-Level) programme administered by Ahmadu Bello University (ABU) Zaria that qualifies candidates for direct entry admission into 200 level of Nigerian universities without writing UTME." },
  { question: "Is IJMB recognised by Nigerian universities?", answer: "Yes. IJMB is recognised by the Federal Government of Nigeria and accepted by over 200 federal, state, and private universities for direct entry admission." },
  { question: "Who can register for IJMB?", answer: "Any candidate with at least 5 O-Level credits including English Language and Mathematics can register for the IJMB programme." },
  { question: "How long is the IJMB programme?", answer: "The IJMB programme runs for approximately 9 months (one academic session). After completion, candidates write the IJMB examination administered by ABU Zaria." },
  { question: "Do I need JAMB for IJMB?", answer: "You do not need to write UTME to register for IJMB. However, you will need a JAMB Direct Entry form to process your university admission after passing the IJMB exams." },
  { question: "How much is IJMB registration?", answer: "The IJMB registration form fee is ₦5,500. Tuition fee is ₦350,000 per session. Hostel accommodation is ₦150,000 per session." },
  { question: "Can I use IJMB for Medicine or Law?", answer: "Yes. Many universities accept IJMB for Medicine, Law, Engineering, Pharmacy, and other competitive courses. You typically need to score 9 points or higher in your IJMB examinations." },
  { question: "Is IJMB the same as JUPEB?", answer: "No. IJMB is administered by Ahmadu Bello University (ABU) Zaria while JUPEB is administered by the University of Lagos (UNILAG). Both offer A-Level qualifications for direct entry but have different curricula and examination bodies." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://www.ijmb.info/#organization",
      name: "IJMB Info – Nigeria Direct Entry Portal",
      url: "https://www.ijmb.info",
      logo: {
        "@type": "ImageObject",
        url: "https://www.ijmb.info/ijmb-logo.jpeg",
        width: 400,
        height: 400,
      },
      description: "Nigeria's leading IJMB registration and information portal. Register for the IJMB A-Level programme and gain direct entry admission into 200 level without UTME.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "NG",
        addressRegion: "Nigeria",
      },
      sameAs: [
        "https://facebook.com/ijmbinfo",
        "https://twitter.com/ijmbinfo",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.ijmb.info/#website",
      name: "IJMB Info",
      url: "https://www.ijmb.info",
      publisher: { "@id": "https://www.ijmb.info/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://www.ijmb.info/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://www.ijmb.info/#webpage",
      url: "https://www.ijmb.info",
      name: `IJMB Registration ${YEAR} Nigeria – Direct Entry 200 Level Without UTME`,
      description: "Register for the IJMB programme in Nigeria and gain direct entry admission into 200 level without UTME. Accepted by 200+ universities nationwide.",
      isPartOf: { "@id": "https://www.ijmb.info/#website" },
      about: { "@id": "https://www.ijmb.info/#organization" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.ijmb.info" },
        ],
      },
    },
    {
      "@type": "Course",
      name: `IJMB A-Level Programme ${YEAR}`,
      description: "The Interim Joint Matriculation Board (IJMB) is a 9-month Advanced Level programme run by Ahmadu Bello University Zaria. It qualifies students for direct entry into 200 level at over 200 Nigerian universities without UTME.",
      provider: {
        "@type": "EducationalOrganization",
        name: "Ahmadu Bello University, Zaria",
        url: "https://abu.edu.ng",
      },
      offers: {
        "@type": "Offer",
        price: "5500",
        priceCurrency: "NGN",
        availability: "https://schema.org/InStock",
        url: "https://www.ijmb.info/register",
        validFrom: "2026-01-01",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "onsite",
        courseWorkload: "PT9M",
        location: {
          "@type": "Place",
          name: "IJMB Accredited Study Centres",
          address: { "@type": "PostalAddress", addressCountry: "NG" },
        },
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export const metadata: Metadata = {
  title: `IJMB Registration ${YEAR} Nigeria | Direct Entry 200 Level Without UTME`,
  description:
    `Register for IJMB ${YEAR} in Nigeria. Gain direct entry admission into 200 level without UTME. Accepted by 200+ federal and state universities. Form fee ₦5,500. Apply now.`,
  keywords: [
    "IJMB registration",
    "IJMB 2026",
    "IJMB programme Nigeria",
    "direct entry 200 level",
    "200 level without UTME",
    "what is IJMB",
    "IJMB meaning",
    "IJMB form fee",
    "IJMB application",
    "IJMB A-level Nigeria",
    "IJMB vs JAMB",
    "IJMB study centres",
    "direct entry admission Nigeria",
    "ABU Zaria IJMB",
  ],
  alternates: {
    canonical: "https://www.ijmb.info",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    title: `IJMB Registration ${YEAR} Nigeria | 200 Level Without UTME`,
    description:
      `Nigeria's leading IJMB registration portal. Apply for the ${YEAR} session and gain direct entry into 200 level at 200+ universities. No UTME required.`,
    url: "https://www.ijmb.info",
    siteName: "IJMB Info",
    images: [
      {
        url: "https://www.ijmb.info/ijmb-logo.jpeg",
        width: 400,
        height: 400,
        alt: `IJMB Registration Portal Nigeria ${YEAR} – Direct Entry 200 Level`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `IJMB Registration ${YEAR} Nigeria | 200 Level Without UTME`,
    description:
      "Register for IJMB and gain direct entry into 200 level without UTME. Accepted by 200+ Nigerian universities. Apply now.",
    images: ["https://www.ijmb.info/ijmb-logo.jpeg"],
    site: "@ijmbinfo",
    creator: "@ijmbinfo",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Index />
    </>
  );
}
