'use client';

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import studentsGroup from "@/assets/students-group.jpeg";
import studentsWalking from "@/assets/students-walking.jpeg";
import graduateFemale from "@/assets/graduate-female.jpeg";
import graduateMale from "@/assets/graduate-male.jpeg";
import studentLibrary from "@/assets/student-library.jpeg";
import studentsLaptop from "@/assets/students-laptop.jpeg";
import { useScrollReveal, useCountUp } from "@/hooks/useScrollReveal";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, CheckCircle, BookOpen, Users, ArrowRight, MapPin, Star, ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";

const yr = new Date().getFullYear();
const YEAR = `${yr}/${yr + 1}`;

const stats = [
  { value: 200, suffix: "+", label: "Universities Nationwide" },
  { value: 50, suffix: "K+", label: "Students Enrolled" },
  { value: 95, suffix: "%", label: "Admission Success Rate" },
  { value: 36, suffix: "", label: "States Covered" },
];

const benefits = [
  { icon: GraduationCap, title: "Enter at 200 Level", desc: "Bypass 100 level entirely. Your IJMB certificate places you directly into second year at university." },
  { icon: CheckCircle, title: "No UTME Required", desc: "IJMB qualifies you for Direct Entry admission. No more failed JAMB attempts or UTME stress." },
  { icon: BookOpen, title: "Accepted by 200+ Universities", desc: "Recognised by all federal, state, and private universities in Nigeria that offer Direct Entry admission." },
  { icon: Users, title: "Study Centres Nationwide", desc: "Accredited IJMB centres in all 36 states. Study close to home with qualified A-Level tutors." },
];

const publicSteps = [
  { num: "01", title: "Create Your Account", desc: "Register online, fill in your personal and academic details, and upload your O-Level result and passport photograph." },
  { num: "02", title: "Pay the Form Fee", desc: "Pay the ₦10,000 IJMB registration form fee securely online. Your application is then submitted for review and processing." },
  { num: "03", title: "Get Admitted & Start", desc: "Receive your admission letter, get assigned to an accredited study centre, and begin your 9-month A-Level programme." },
];

const testimonials = [
  { name: "Aisha Mohammed", uni: "Ahmadu Bello University, Zaria", course: "Medicine & Surgery", quote: "IJMB provided a clear and credible path into 200 level. The registration process was seamless and the programme is genuinely well-structured." },
  { name: "Chidi Okonkwo", uni: "University of Lagos", course: "Computer Science", quote: "From registration to admission, everything was handled professionally. I gained direct entry and have not looked back since." },
  { name: "Fatima Ibrahim", uni: "University of Ilorin", course: "Law", quote: "I had concerns about acceptance, but my admission letter put every doubt to rest. IJMB is recognised and respected across universities." },
  { name: "Samuel Adeyemi", uni: "University of Ibadan", course: "Economics", quote: "The direct entry route through IJMB is underrated. It saved me time and gave me a stronger academic foundation than I expected." },
  { name: "Blessing Okoro", uni: "University of Benin", course: "Pharmacy", quote: "A legitimate, structured programme with real outcomes. My university placement was confirmed within weeks of completing the process." },
];

const faqs = [
  { question: "What is IJMB?", answer: "IJMB stands for Interim Joint Matriculation Board. It is an Advanced Level (A-Level) programme administered by Ahmadu Bello University (ABU) Zaria that qualifies candidates for direct entry admission into 200 level of Nigerian universities without writing UTME." },
  { question: "Is IJMB recognised by Nigerian universities?", answer: "Yes. IJMB is recognised by the Federal Government of Nigeria and accepted by over 200 federal, state, and private universities for direct entry admission into 200 level." },
  { question: "Who can register for IJMB?", answer: "Any candidate with at least 5 O-Level credits including English Language and Mathematics can register for the IJMB programme. There is no age restriction." },
  { question: "How long is the IJMB programme?", answer: "The IJMB programme runs for approximately 9 months (one academic session). After completion, candidates sit for the IJMB A-Level examination administered by ABU Zaria." },
  { question: "Do I need JAMB for IJMB?", answer: "You do not need to write UTME to register for IJMB. However, you will need a JAMB Direct Entry form to process your university admission after passing the IJMB examinations." },
  { question: "How much is IJMB registration?", answer: "The IJMB registration form fee is ₦10,000. Tuition fee is ₦350,000 per session. Hostel accommodation is ₦150,000 per session." },
  { question: "Can I use IJMB for Medicine or Law?", answer: "Yes. Many universities accept IJMB for Medicine, Law, Engineering, Pharmacy, and other competitive courses. You typically need to score 9 points or higher in your IJMB A-Level examinations." },
  { question: "Is IJMB the same as JUPEB?", answer: "No. IJMB is administered by Ahmadu Bello University (ABU) Zaria while JUPEB is administered by the University of Lagos (UNILAG). Both offer A-Level qualifications for direct entry but have different curricula and examination bodies." },
];

const StatItem = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const countRef = useCountUp(value);
  return (
    <div>
      <div className="text-3xl lg:text-4xl font-heading font-bold text-accent">
        <span ref={countRef as React.RefObject<HTMLSpanElement>}>0</span>{suffix}
      </div>
      <div className="text-sm mt-1 opacity-80">{label}</div>
    </div>
  );
};

const Index = () => {
  const { user, profile } = useAuth();
  const isStudent = user && profile?.role !== 'super_admin' && profile?.role !== 'coordinator';
  const displayName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  const heroRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useScrollReveal<HTMLDivElement>({ children: true, stagger: 0.12 });
  const stepsRef = useScrollReveal<HTMLDivElement>({ children: true, stagger: 0.15 });
  const whatIsRef = useScrollReveal<HTMLDivElement>({ y: 30 });
  const centresRef = useScrollReveal<HTMLDivElement>({ y: 30 });

  // Testimonials slider
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number, dir: 'left' | 'right') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setAnimating(false);
    }, 350);
  }, [animating]);

  const prev = useCallback(() => {
    const idx = (activeIdx - 1 + testimonials.length) % testimonials.length;
    goTo(idx, 'left');
  }, [activeIdx, goTo]);

  const next = useCallback(() => {
    const idx = (activeIdx + 1) % testimonials.length;
    goTo(idx, 'right');
  }, [activeIdx, goTo]);

  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, []);

  // Hero entrance animation
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = heroRef.current;
    if (!el) return;

    const badge = el.querySelector('.hero-badge');
    const h1 = el.querySelector('h1');
    const p = el.querySelector('.hero-desc');
    const btns = el.querySelector('.hero-btns');

    gsap.set([badge, h1, p, btns], { opacity: 0, y: 30 });
    gsap.to(badge, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' });
    gsap.to(h1, { opacity: 1, y: 0, duration: 0.7, delay: 0.4, ease: 'power3.out' });
    gsap.to(p, { opacity: 1, y: 0, duration: 0.7, delay: 0.6, ease: 'power3.out' });
    gsap.to(btns, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'power3.out' });
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        name: "IJMB Info",
        url: "https://www.ijmb.info",
        logo: "https://www.ijmb.info/ijmb-logo.jpeg",
        description: "Nigeria's leading IJMB registration and information portal",
        sameAs: [
          "https://facebook.com/ijmbinfo",
          "https://twitter.com/ijmbinfo"
        ],
        address: {
          "@type": "PostalAddress",
          addressCountry: "NG"
        }
      },
      {
        "@type": "WebSite",
        name: "IJMB Info",
        url: "https://www.ijmb.info",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.ijmb.info/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(f => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer
          }
        }))
      }
    ],
  };

  return (
    <>
      <SEOHead
        title={`IJMB Registration Nigeria ${YEAR} – Gain 200 Level Admission`}
        description={`Register for IJMB programme in Nigeria. Gain direct entry admission into 200 level without UTME. Apply for ${YEAR} session now.`}
        canonical="https://www.ijmb.info"
        keywords="IJMB registration Nigeria, IJMB programme, direct entry admission, 200 level without UTME"
        schema={schema}
      />

      {/* Logged-in student banner */}
      {isStudent && (
        <div className="bg-primary text-primary-foreground px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-lg">🎓</span>
              <span>Welcome back, <strong>{displayName}</strong>! You're logged in as a student.</span>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-bold hover:opacity-90 transition-opacity shrink-0"
            >
              <LayoutDashboard size={15} />
              Go to My Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img src={studentsWalking.src} alt="IJMB students walking on campus in Nigeria" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <span className="hero-badge inline-block px-4 py-1.5 text-sm font-medium bg-accent text-accent-foreground rounded-full mb-6">
              {YEAR} Registration Now Open
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 text-primary-foreground">
              IJMB Registration {YEAR} —{" "}
              <span className="text-accent">200 Level Without UTME</span>
            </h1>
            <p className="hero-desc text-lg lg:text-xl mb-8 leading-relaxed text-primary-foreground/90">
              The IJMB A-Level programme is Nigeria's most trusted path to Direct Entry university admission.
              Skip UTME, enter 200 level, and join 50,000+ students who have already gained admission through IJMB.
            </p>
            <div className="hero-btns flex flex-col sm:flex-row gap-4">
              {isStudent ? (
                <Link
                  href="/dashboard"
                  className="px-8 py-4 font-bold text-base rounded-lg cta-gradient text-accent-foreground hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                >
                  <LayoutDashboard size={18} /> Go to My Dashboard
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="px-8 py-4 font-bold text-base rounded-lg cta-gradient text-accent-foreground hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                >
                  Register Now <ArrowRight size={18} />
                </Link>
              )}
              <Link
                href="/ijmb-admission-requirements"
                className="px-8 py-4 font-bold text-base rounded-lg border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 transition-colors inline-flex items-center justify-center"
              >
                View Requirements
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats with counter animation */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
            {stats.map((s) => (
              <StatItem key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-border bg-muted/30 py-5">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: horizontal scroll. sm+: centered wrap */}
          <div className="overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-x-6 sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-3 px-4 sm:px-6 lg:px-8 text-sm text-muted-foreground w-max sm:w-auto">
              {[
                "Administered by ABU Zaria",
                "Federal Government Recognised",
                "Accepted by 200+ Universities",
                "50,000+ Students Enrolled",
                "All 36 States Covered",
              ].map((label) => (
                <div key={label} className="flex items-center gap-2 font-medium text-foreground whitespace-nowrap">
                  <CheckCircle size={15} className="text-primary flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What is IJMB */}
      <section className="section-padding">
        <div ref={whatIsRef} className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">About the Programme</p>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
                What is <span className="text-primary">IJMB</span>?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">IJMB (Interim Joint Matriculation Board)</strong> is a nationally recognised Advanced Level (A-Level) programme
                administered by <strong className="text-foreground">Ahmadu Bello University (ABU) Zaria</strong>. It is the most widely accepted direct entry qualification in Nigeria, designed for candidates who want to gain
                university admission into <strong className="text-foreground">200 level without writing UTME</strong>.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The IJMB programme runs for <strong className="text-foreground">nine months</strong>. Students study three A-Level subjects at an accredited IJMB study centre, then sit for the IJMB examination.
                A pass qualifies you for <strong className="text-foreground">Direct Entry admission</strong> into over 200 federal, state, and private universities across Nigeria.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Unlike UTME, which places you at 100 level and requires scoring high in a highly competitive exam every year,
                IJMB places you <strong className="text-foreground">directly into second year</strong> — saving you one full year of university and eliminating the uncertainty of repeated JAMB attempts.
              </p>
              <InternalLinks />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
              <img
                src={studentsLaptop.src}
                alt="IJMB students studying A-Level subjects at an accredited study centre in Nigeria"
                className="w-full h-[220px] sm:h-[320px] lg:h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why IJMB */}
      <section className="section-alt section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Why IJMB</p>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              Why Choose IJMB Over UTME?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              IJMB gives you a faster, more reliable route to university admission in Nigeria — without the annual JAMB cycle.
            </p>
          </div>
          <div ref={benefitsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-card p-6 rounded-xl border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <b.icon className="text-primary" size={24} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Register - 3-step public flow */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">How It Works</p>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              How to Register for IJMB {YEAR}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              IJMB registration is straightforward. Complete these three steps online and start your Direct Entry journey today.
            </p>
          </div>
          <div ref={stepsRef} className="grid sm:grid-cols-3 gap-8">
            {publicSteps.map((s) => (
              <div key={s.num} className="relative text-center">
                <div className="text-7xl font-heading font-bold text-primary/10 mb-2">{s.num}</div>
                <h3 className="font-heading font-bold text-xl mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-lg cta-gradient text-accent-foreground hover:opacity-90 transition-opacity"
            >
              Start Registration <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="section-alt section-padding overflow-hidden">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Student Outcomes</p>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">What Our Students Say</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Testimonials from students admitted to Nigerian universities through the IJMB Direct Entry programme.
            </p>
          </div>

          {/* Slide */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div
                key={activeIdx}
                className={`p-6 sm:p-10 md:p-14 transition-all duration-350 ${
                  animating
                    ? direction === 'right'
                      ? 'opacity-0 translate-x-8'
                      : 'opacity-0 -translate-x-8'
                    : 'opacity-100 translate-x-0'
                }`}
                style={{ transition: 'opacity 0.35s ease, transform 0.35s ease' }}
              >
                {/* Large quote mark */}
                <div className="text-7xl font-serif leading-none text-primary/15 mb-4 select-none">&ldquo;</div>

                {/* Quote text */}
                <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light mb-10 max-w-2xl">
                  {testimonials[activeIdx].quote}
                </p>

                {/* Author row */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {/* Initials avatar */}
                    <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {testimonials[activeIdx].name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonials[activeIdx].name}</p>
                      <p className="text-sm text-muted-foreground">{testimonials[activeIdx].course} &mdash; {testimonials[activeIdx].uni}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Prev / Next buttons */}
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 sm:left-0 sm:-translate-x-5 w-10 h-10 rounded-full bg-background border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-0 sm:translate-x-5 w-10 h-10 rounded-full bg-background border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > activeIdx ? 'right' : 'left')}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIdx
                    ? 'w-6 h-2 bg-primary'
                    : 'w-2 h-2 bg-border hover:bg-muted-foreground'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Centres Preview */}
      <section className="section-padding">
        <div ref={centresRef} className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
              <img
                src={studentsGroup.src}
                alt="IJMB students at a study centre in Nigeria"
                className="w-full h-[220px] sm:h-[320px] lg:h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
                IJMB Accredited Study Centres Across Nigeria
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                IJMB accredited study centres are located in major cities across all 36 states of Nigeria.
                Our accredited IJMB study centres are located in <strong className="text-foreground">Oko, Anambra State</strong> and <strong className="text-foreground">Ilorin, Kwara State</strong> — and we work with approved centres across all 36 states of Nigeria.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Each accredited centre provides structured A-Level tuition, study materials, and examination preparation guided by experienced lecturers — giving you the best chance of scoring high in your IJMB exams and securing your preferred university course.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                <Link href="/ijmb-centre-oko-anambra" className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">Oko, Anambra State</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Accredited centre · Slots available</p>
                  </div>
                </Link>
                <Link href="/ijmb-centre-ilorin-kwara" className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={15} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">Ilorin, Kwara State</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Accredited centre · UNILORIN nearby</p>
                  </div>
                </Link>
              </div>
              <Link
                href="/ijmb-centres-in-nigeria"
                className="text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All Centres <ArrowRight size={16} />
              </Link>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Learn More</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/blog/ijmb-centre-oko-anambra-2026" className="text-xs text-primary hover:underline">→ Oko Centre Guide</Link>
                  <Link href="/blog/ijmb-centre-ilorin-kwara-2026" className="text-xs text-primary hover:underline">→ Ilorin Centre Guide</Link>
                  <Link href="/blog/what-is-ijmb-complete-guide" className="text-xs text-primary hover:underline">→ What is IJMB?</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} />
      <CTASection />
    </>
  );
};

export default Index;
