import type { Metadata } from 'next';
import FAQPage from '@/pages/FAQPage';

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

export const metadata: Metadata = {
  title: `IJMB FAQ ${YEAR} – Frequently Asked Questions About IJMB`,
  description: 'Answers to all common questions about IJMB registration, fees, requirements, subject combinations, and direct entry admission into Nigerian universities.',
  keywords: ['IJMB FAQ', 'IJMB frequently asked questions', 'how does IJMB work', 'IJMB questions and answers', 'IJMB 2026 FAQ', 'is IJMB legit'],
  alternates: { canonical: 'https://www.ijmb.info/faq' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  openGraph: {
    title: `IJMB FAQ ${YEAR} – Frequently Asked Questions`,
    description: 'Everything you need to know about IJMB. Registration, fees, requirements, subject combinations and more — answered.',
    url: 'https://www.ijmb.info/faq',
    images: [{ url: 'https://www.ijmb.info/ijmb-logo.jpeg', width: 400, height: 400, alt: 'IJMB FAQ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `IJMB FAQ ${YEAR}`,
    description: 'All your IJMB questions answered. Registration, fees, requirements, universities.',
    images: ['https://www.ijmb.info/ijmb-logo.jpeg'],
  },
};

const faqs = [
  { question: 'What is IJMB?', answer: 'IJMB (Interim Joint Matriculation Board) is an Advanced Level programme administered by ABU Zaria that qualifies candidates for direct entry into 200 level of Nigerian universities without UTME.' },
  { question: 'Is IJMB legit and government recognised?', answer: 'Yes. IJMB is fully recognised by the Federal Government of Nigeria and the National Universities Commission (NUC). It is administered by Ahmadu Bello University (ABU) Zaria.' },
  { question: 'How much is IJMB form in 2026?', answer: 'The IJMB registration form fee is ₦5,500. Tuition fee is ₦350,000 per session. Hostel accommodation is ₦150,000 per session.' },
  { question: 'Who can register for IJMB?', answer: 'Anyone with at least 5 O-Level credits including English Language and Mathematics. Candidates awaiting O-Level results are also eligible.' },
  { question: 'How long is the IJMB programme?', answer: 'The IJMB programme runs for 9 months (one academic session). After completion you sit the IJMB A-Level examination.' },
  { question: 'Can I use IJMB for Medicine, Law or Engineering?', answer: 'Yes. IJMB is accepted for all courses including Medicine, Law, Engineering, Pharmacy, and Dentistry at most universities. You need 9+ points for competitive courses.' },
  { question: 'Is IJMB better than JAMB/UTME?', answer: 'IJMB places you directly in 200 level, saving you one full year. You avoid the annual UTME cycle and have a more predictable route to university admission.' },
  { question: 'Does UNILAG, UI, ABU or UNIBEN accept IJMB?', answer: 'Yes. All major Nigerian federal universities including UNILAG, UI (University of Ibadan), ABU Zaria, UNIBEN, UNILORIN, and 200+ others accept IJMB for direct entry.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};

export default function FAQRoutePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FAQPage />
    </>
  );
}
