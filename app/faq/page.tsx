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
  { question: 'What is IJMB?', answer: 'IJMB stands for Interim Joint Matriculation Board. It is an Advanced Level programme run by Ahmadu Bello University (ABU) Zaria that qualifies candidates for direct entry admission into 200 level of Nigerian universities without writing UTME.' },
  { question: 'Is IJMB recognised by Nigerian universities?', answer: 'Yes. IJMB is approved by the Federal Government of Nigeria and recognised by over 200 federal, state, and private universities for direct entry admission.' },
  { question: 'Who can register for IJMB?', answer: 'Anyone with at least 5 O-Level credits including English and Mathematics from WAEC, NECO, or NABTEB. Awaiting result candidates may also apply.' },
  { question: 'How long is the IJMB programme?', answer: 'The IJMB programme runs for approximately 9 months (one academic session).' },
  { question: 'Do I need JAMB to register for IJMB?', answer: 'No. You do not need a JAMB/UTME score to register for IJMB. However, after passing IJMB, you will need JAMB registration for direct entry processing.' },
  { question: 'How much does IJMB cost?', answer: 'The IJMB registration form fee is ₦10,000. Tuition fee is ₦350,000 per session. Hostel accommodation is ₦150,000 per session.' },
  { question: 'Can I use IJMB for Medicine?', answer: 'Yes. Many universities accept IJMB for Medicine, Dentistry, Pharmacy, and other health courses. You typically need high scores (9+ points).' },
  { question: 'Where are IJMB centres located?', answer: 'IJMB centres are spread across Nigeria including Lagos, Abuja, Ibadan, Kano, Port Harcourt, Ilorin, Jos, Enugu, and many more cities.' },
  { question: 'Is IJMB better than JAMB?', answer: 'IJMB offers a more reliable path to admission with a 95%+ success rate. You enter 200 level directly, save one year, and avoid UTME stress.' },
  { question: 'Can I write IJMB and JAMB at the same time?', answer: 'Yes. You can register for both IJMB and UTME simultaneously to maximise your chances of admission.' },
  { question: 'What subjects can I study in IJMB?', answer: 'IJMB offers subjects across Sciences, Arts, Social Sciences, and Commercial. You choose 3 subjects relevant to your desired university course.' },
  { question: 'Does IJMB certificate expire?', answer: 'No. Your IJMB certificate is permanent and can be used for direct entry admission at any time.' },
  { question: 'What is the IJMB grading system?', answer: 'IJMB uses an A-Level grading system: A (5 points), B (4 points), C (3 points), D (2 points), E (1 point). Maximum possible score is 15 points.' },
  { question: 'Can I change my course after IJMB?', answer: 'You can apply for a different course than initially planned, as long as your IJMB subject combination is relevant to the new course.' },
  { question: 'When does IJMB registration close?', answer: 'IJMB registration typically runs from January to September each year. Early registration is advised to secure your preferred centre.' },
  { question: 'What happens after I pass IJMB?', answer: 'After passing IJMB, you register for JAMB Direct Entry, select your university, and apply for admission. Your IJMB score is used for placement into 200 level.' },
  { question: 'Can I do IJMB online?', answer: 'IJMB is primarily a physical classroom programme. However, registration can be done online. You must attend classes at an approved centre.' },
  { question: 'Is IJMB the same as JUPEB?', answer: 'No. IJMB is run by ABU Zaria while JUPEB is run by the University of Lagos. Both offer A-Level qualifications for direct entry, but they have different curricula and examination bodies.' },
  { question: 'Can I use IJMB for Law or Engineering?', answer: 'Yes. IJMB is accepted for Law, Engineering, and virtually all courses. Just ensure your subject combination matches the faculty requirements of your target university.' },
  { question: 'What is the minimum IJMB score for admission?', answer: 'Most universities require a minimum of 8 points (out of 15) for competitive courses. Some courses accept 5-6 points. Higher scores give you better chances.' },
  { question: 'Can I register for IJMB with awaiting result?', answer: 'Yes. Candidates awaiting their O-Level results can register for IJMB. However, you must provide your results before writing the IJMB examination.' },
  { question: 'Is accommodation provided at IJMB centres?', answer: 'Some centres provide hostel accommodation while others do not. Check with your preferred centre for accommodation availability and costs.' },
  { question: 'How do I pay for IJMB registration?', answer: 'You can pay the ₦10,000 registration form fee online through our portal. Programme fees are paid directly to your chosen study centre.' },
  { question: 'Can I transfer my IJMB centre?', answer: 'Centre transfers are possible but subject to availability and approval. Contact the admin team if you need to change your study centre.' },
  { question: 'What if I fail the IJMB examination?', answer: "If you don't achieve the required score, you can re-sit the IJMB examination in the next session. Your registration remains valid." },
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
