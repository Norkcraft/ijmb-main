import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'IJMB Centre in Oko, Anambra State 2026 – Accredited Study Centre',
  description:
    'Our accredited IJMB study centre in Oko, Anambra State. Register for IJMB 2026/2027, study for 9 months, and gain direct entry into 200 level at NAU, COOU and top Nigerian universities.',
  keywords: [
    'IJMB Oko',
    'IJMB centre Oko Anambra',
    'IJMB Anambra State 2026',
    'register IJMB Anambra',
    'IJMB study centre Anambra',
    'direct entry Anambra',
  ],
  alternates: { canonical: 'https://www.ijmb.info/ijmb-centre-oko-anambra' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'IJMB Centre in Oko, Anambra State 2026 – Accredited Study Centre',
    description:
      'Our accredited IJMB study centre in Oko, Anambra State. Register for 2026/2027 and gain direct entry into NAU, COOU and top Nigerian universities.',
    url: 'https://www.ijmb.info/ijmb-centre-oko-anambra',
    images: [{ url: 'https://www.ijmb.info/ijmb-logo.jpeg', width: 400, height: 400, alt: 'IJMB Study Centre Oko Anambra' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IJMB Centre in Oko, Anambra State 2026',
    description: 'Accredited IJMB study centre in Oko, Anambra. Register for 2026/2027 and gain direct entry to 200 level.',
    images: ['https://www.ijmb.info/ijmb-logo.jpeg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'IJMB Study Centre — Oko, Anambra',
  url: 'https://www.ijmb.info/ijmb-centre-oko-anambra',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Oko',
    addressRegion: 'Anambra',
    addressCountry: 'NG',
  },
  description:
    'Accredited IJMB study centre in Oko, Anambra State offering A-Level programmes for direct entry university admission.',
  areaServed: 'Anambra State, Nigeria',
  telephone: 'Contact via portal',
};

export default function OkoCentrePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-muted/50 border-b border-border py-3">
        <div className="max-w-6xl mx-auto px-4">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li className="text-muted-foreground/50">/</li>
            <li><Link href="/ijmb-centres-in-nigeria" className="hover:text-primary transition-colors">Study Centres</Link></li>
            <li className="text-muted-foreground/50">/</li>
            <li className="text-foreground font-medium">Oko, Anambra</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            2026/2027 Intake Open
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary mb-4">
            IJMB Study Centre — Oko, Anambra State
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Register for the IJMB A-Level programme at our accredited study centre in Oko, Anambra State. Study for 9 months and gain <strong className="text-foreground">direct entry into 200 Level</strong> at NAU, COOU, and top Nigerian universities — no UTME required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Register Now
            </Link>
            <Link
              href="/ijmb-centres-in-nigeria"
              className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-xl font-semibold hover:border-primary hover:text-primary transition-colors"
            >
              View All Centres
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-10 px-4 border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <p className="text-2xl sm:text-3xl font-bold text-primary">9 Months</p>
              <p className="text-sm text-muted-foreground mt-1">Programme Duration</p>
            </div>
            <div className="p-4">
              <p className="text-2xl sm:text-3xl font-bold text-primary">200 Level</p>
              <p className="text-sm text-muted-foreground mt-1">Direct Entry</p>
            </div>
            <div className="p-4">
              <p className="text-2xl sm:text-3xl font-bold text-primary">ABU Zaria</p>
              <p className="text-sm text-muted-foreground mt-1">Examining Body</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Oko */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-8 text-center">
            Why Study IJMB in Oko, Anambra?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Academic Excellence', desc: 'Anambra State has one of Nigeria\'s most competitive academic environments.' },
              { title: 'Close to NAU & COOU', desc: 'Nnamdi Azikiwe University and COOU are nearby — ideal for direct entry applicants.' },
              { title: 'Experienced A-Level Tutors', desc: 'Our lecturers are dedicated to helping you score high in ABU Zaria examinations.' },
              { title: 'Hostel Available', desc: 'On-campus hostel accommodation available for students who need it.' },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Combinations */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-8 text-center">
            Available Subject Combinations
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                title: 'Sciences',
                subjects: ['Biology', 'Chemistry', 'Physics / Mathematics'],
                note: 'For Medicine, Pharmacy, Engineering, Nursing',
              },
              {
                title: 'Social Sciences',
                subjects: ['Economics', 'Mathematics', 'Government / Commerce'],
                note: 'For Accounting, Business Admin, Economics',
              },
              {
                title: 'Arts & Law',
                subjects: ['Literature in English', 'Government', 'Economics / History'],
                note: 'For Law, Mass Comm, History, English',
              },
            ].map((combo) => (
              <div key={combo.title} className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-primary mb-3">{combo.title}</h3>
                <ul className="space-y-1 mb-3">
                  {combo.subjects.map((s) => (
                    <li key={s} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> {s}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground">{combo.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Universities */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 text-center">
            Universities Near Oko That Accept IJMB
          </h2>
          <ul className="max-w-2xl mx-auto space-y-3">
            {[
              'Nnamdi Azikiwe University (NAU), Awka',
              'Chukwuemeka Odumegwu Ojukwu University (COOU), Anambra',
              'University of Nigeria Nsukka (UNN) — accepts IJMB direct entry',
              'Enugu State University of Science and Technology (ESUT)',
            ].map((uni) => (
              <li key={uni} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <span className="text-primary font-bold mt-0.5">✓</span>
                <span className="text-sm text-foreground">{uni}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-4">
            Ready to Join Our Oko Centre?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Slots are limited. Register online today and secure your place in the 2026/2027 IJMB session at our Oko, Anambra centre.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Related Pages</p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/blog/ijmb-centre-oko-anambra-2026', label: 'Oko Centre Blog Guide' },
              { href: '/blog/ijmb-in-anambra-state', label: 'IJMB in Anambra State' },
              { href: '/ijmb-centre-ilorin-kwara', label: 'Ilorin, Kwara Centre' },
              { href: '/ijmb-centres-in-nigeria', label: 'All IJMB Centres' },
              { href: '/ijmb-admission-requirements', label: 'Admission Requirements' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-primary hover:underline border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
