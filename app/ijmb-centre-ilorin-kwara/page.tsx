import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'IJMB Centre in Ilorin, Kwara State 2026 – Accredited Study Centre',
  description:
    'Our accredited IJMB study centre in Ilorin, Kwara State. Register for 2026/2027 and gain direct entry to UNILORIN, KWASU and other top universities without UTME.',
  keywords: [
    'IJMB Ilorin',
    'IJMB centre Ilorin Kwara',
    'IJMB Kwara State 2026',
    'UNILORIN IJMB direct entry',
    'register IJMB Ilorin',
    'IJMB study centre Ilorin',
  ],
  alternates: { canonical: 'https://www.ijmb.info/ijmb-centre-ilorin-kwara' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'IJMB Centre in Ilorin, Kwara State 2026 – Accredited Study Centre',
    description:
      'Our accredited IJMB study centre in Ilorin, Kwara State. Register for 2026/2027 and gain direct entry to UNILORIN and top Nigerian universities.',
    url: 'https://www.ijmb.info/ijmb-centre-ilorin-kwara',
    images: [{ url: 'https://www.ijmb.info/ijmb-logo.jpeg', width: 400, height: 400, alt: 'IJMB Study Centre Ilorin Kwara' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IJMB Centre in Ilorin, Kwara State 2026',
    description: 'Accredited IJMB study centre in Ilorin, Kwara. Register for 2026/2027 and gain direct entry to UNILORIN.',
    images: ['https://www.ijmb.info/ijmb-logo.jpeg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'IJMB Study Centre — Ilorin, Kwara',
  url: 'https://www.ijmb.info/ijmb-centre-ilorin-kwara',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ilorin',
    addressRegion: 'Kwara',
    addressCountry: 'NG',
  },
  description:
    'Accredited IJMB study centre in Ilorin, Kwara State offering A-Level programmes for direct entry university admission.',
  areaServed: 'Kwara State, Nigeria',
  telephone: 'Contact via portal',
};

export default function IlorinCentrePage() {
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
            <li className="text-foreground font-medium">Ilorin, Kwara</li>
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
            IJMB Study Centre — Ilorin, Kwara State
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Register for the IJMB A-Level programme at our accredited study centre in Ilorin, Kwara State. Study for 9 months and gain <strong className="text-foreground">direct entry into 200 Level</strong> at UNILORIN, KWASU, and top Nigerian universities — no UTME required.
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

      {/* UNILORIN Callout */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
            <h2 className="text-lg font-semibold text-primary mb-2">UNILORIN &amp; IJMB — A Perfect Match</h2>
            <p className="text-sm text-foreground leading-relaxed">
              UNILORIN is one of Nigeria&apos;s top-ranked federal universities. IJMB candidates from our Ilorin centre consistently gain direct entry into UNILORIN across all faculties — from Medicine and Engineering to Law and Social Sciences.
            </p>
          </div>
        </div>
      </section>

      {/* Why Ilorin */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-8 text-center">
            Why Study IJMB in Ilorin?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Home to UNILORIN', desc: 'University of Ilorin is one of Nigeria\'s most respected federal universities and strongly accepts IJMB.' },
              { title: 'North-Central Hub', desc: 'Ilorin is easily accessible from Kwara, Kogi, and Niger States.' },
              { title: 'Experienced Tutors', desc: 'Our lecturers are trained specifically in ABU Zaria examination patterns and past questions.' },
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
            Universities Near Ilorin That Accept IJMB
          </h2>
          <ul className="max-w-2xl mx-auto space-y-3">
            {[
              'University of Ilorin (UNILORIN) — top choice for Ilorin IJMB students',
              'Kwara State University (KWASU), Malete',
              'Al-Hikmah University, Ilorin',
              'University of Abuja (UNIABUJA) — also accepts IJMB direct entry',
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
            Ready to Join Our Ilorin Centre?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Slots are limited. Register online today and secure your place in the 2026/2027 IJMB session at our Ilorin, Kwara centre.
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
              { href: '/blog/ijmb-centre-ilorin-kwara-2026', label: 'Ilorin Centre Blog Guide' },
              { href: '/ijmb-city/ilorin', label: 'IJMB in Ilorin (City Page)' },
              { href: '/ijmb-centre-oko-anambra', label: 'Oko, Anambra Centre' },
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
