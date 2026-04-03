import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
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
import { GraduationCap, CheckCircle, BookOpen, Users, ArrowRight, MapPin, Star } from "lucide-react";

const stats = [
  { value: 200, suffix: "+", label: "Partner Universities" },
  { value: 50, suffix: "K+", label: "Students Enrolled" },
  { value: 95, suffix: "%", label: "Success Rate" },
  { value: 36, suffix: "", label: "States Covered" },
];

const benefits = [
  { icon: GraduationCap, title: "Skip to 200 Level", desc: "Enter university directly into second year without writing UTME again." },
  { icon: CheckCircle, title: "No JAMB Required", desc: "IJMB certificate qualifies you for direct entry admission without UTME." },
  { icon: BookOpen, title: "Recognised Nationwide", desc: "Accepted by over 200 federal, state, and private universities across Nigeria." },
  { icon: Users, title: "Flexible Study Options", desc: "Study at accredited centres across Nigeria with experienced lecturers." },
];

const publicSteps = [
  { num: "01", title: "Register", desc: "Create your account, fill the application form, and upload required documents." },
  { num: "02", title: "Pay Form Fee (₦5,500)", desc: "Pay the registration form fee to submit your application for processing." },
  { num: "03", title: "Resume Studies", desc: "After admission approval, receive your admission letter and resume at your assigned centre." },
];

const testimonials = [
  { name: "Aisha Mohammed", uni: "ABU Zaria", quote: "IJMB gave me a second chance. I got into 200 level without UTME stress!", img: graduateFemale, emoji: "🎓" },
  { name: "Chidi Okonkwo", uni: "University of Lagos", quote: "I registered, studied hard, and got admitted. The process was smooth.", img: graduateMale, emoji: "🚀" },
  { name: "Fatima Ibrahim", uni: "University of Ilorin", quote: "Best decision I ever made. IJMB is legitimate and widely accepted.", img: studentLibrary, emoji: "💯" },
  { name: "Samuel Adeyemi", uni: "University of Ibadan", quote: "I was tired of JAMB wahala. IJMB was my shortcut to 200 level. No stress!", img: studentsLaptop, emoji: "⚡" },
  { name: "Blessing Okoro", uni: "UNIBEN", quote: "My friends didn't believe me until they saw my admission letter. IJMB is real!", img: graduateFemale, emoji: "✨" },
];

const faqs = [
  { question: "What is IJMB?", answer: "IJMB stands for Interim Joint Matriculation Board. It is an Advanced Level (A-Level) programme that qualifies candidates for direct entry admission into 200 level of Nigerian universities without writing UTME." },
  { question: "Is IJMB recognised by Nigerian universities?", answer: "Yes. IJMB is recognised by the Federal Government of Nigeria and accepted by over 200 federal, state, and private universities for direct entry admission." },
  { question: "Who can register for IJMB?", answer: "Any candidate with at least 5 O-Level credits including English and Mathematics can register for the IJMB programme." },
  { question: "How long is the IJMB programme?", answer: "The IJMB programme runs for approximately 9 months (one academic session). After completion, you write the IJMB examination." },
  { question: "Do I need JAMB for IJMB?", answer: "You do not need to write UTME to register for IJMB. However, you will need a JAMB registration to process your direct entry admission after passing the IJMB exams." },
  { question: "How much is IJMB registration?", answer: "The IJMB registration form fee is ₦5,500. Total programme fees (tuition, materials, exams) range from ₦80,000 to ₦150,000 depending on the study centre." },
  { question: "Can I use IJMB for Medicine or Law?", answer: "Yes! Many universities accept IJMB for Medicine, Law, Engineering, Pharmacy, and other competitive courses. You typically need high scores (9+ points)." },
  { question: "Is IJMB the same as JUPEB?", answer: "No. IJMB is run by ABU Zaria while JUPEB is run by UNILAG. Both offer A-Level qualifications for direct entry, but they have different curricula and exam bodies." },
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
  const heroRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useScrollReveal<HTMLDivElement>({ children: true, stagger: 0.12 });
  const stepsRef = useScrollReveal<HTMLDivElement>({ children: true, stagger: 0.15 });
  const testimonialsRef = useScrollReveal<HTMLDivElement>({ children: true, stagger: 0.12 });
  const whatIsRef = useScrollReveal<HTMLDivElement>({ y: 30 });
  const centresRef = useScrollReveal<HTMLDivElement>({ y: 30 });

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
        title="IJMB Registration Nigeria 2026/2027 – Gain 200 Level Admission"
        description="Register for IJMB programme in Nigeria. Gain direct entry admission into 200 level without UTME. Apply for 2026/2027 session now."
        canonical="https://www.ijmb.info"
        keywords="IJMB registration Nigeria, IJMB programme, direct entry admission, 200 level without UTME"
        schema={schema}
      />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img src={studentsWalking} alt="IJMB students walking on campus in Nigeria" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <span className="hero-badge inline-block px-4 py-1.5 text-sm font-medium bg-accent text-accent-foreground rounded-full mb-6">
              2026/2027 Registration Now Open
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 text-primary-foreground">
              Gain Admission into 200 Level{" "}
              <span className="text-accent">Without UTME</span>
            </h1>
            <p className="hero-desc text-lg lg:text-xl mb-8 leading-relaxed text-primary-foreground/90">
              The IJMB programme is your fastest path to university admission in Nigeria. 
              Register today and skip UTME completely with direct entry into 200 level.
            </p>
            <div className="hero-btns flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="px-8 py-4 font-bold text-base rounded-lg cta-gradient text-accent-foreground hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                Register Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/ijmb-admission-requirements"
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <StatItem key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* What is IJMB */}
      <section className="section-padding">
        <div ref={whatIsRef} className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
                What is <span className="text-primary">IJMB</span>?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                IJMB (Interim Joint Matriculation Board) is a nationally recognized Advanced Level programme 
                administered by Ahmadu Bello University (ABU) Zaria. It is designed for candidates who wish to 
                gain direct entry admission into 200 level of Nigerian universities without writing UTME.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The IJMB programme runs for nine months. Candidates study three A-level subjects at accredited 
                centres across Nigeria. Upon successful completion, graduates receive an IJMB certificate that 
                qualifies them for direct entry admission into over 200 universities nationwide.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Unlike UTME, which limits you to 100 level, the IJMB certificate gives you a competitive advantage 
                by placing you directly into second year. This saves time, money, and eliminates the stress of 
                repeated JAMB examinations.
              </p>
              <InternalLinks />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
              <img
                src={studentsLaptop}
                alt="IJMB students studying together on campus"
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
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
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              Why Choose IJMB Over UTME?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              IJMB registration gives you a faster, more reliable path to university admission in Nigeria.
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
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
              How to Register for IJMB
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              IJMB registration is straightforward. Follow these three simple steps to start your journey.
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
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-lg cta-gradient text-accent-foreground hover:opacity-90 transition-opacity"
            >
              Start Registration <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-alt section-padding overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-center mb-4">
            Success Stories from IJMB Students
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">Real students. Real results. No cap. 🎯</p>
          <div ref={testimonialsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={t.name}
                className={`relative group p-6 rounded-2xl border-2 border-border bg-card hover:border-primary/40 hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ${idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                {/* Decorative emoji */}
                <span className="absolute -top-4 -right-2 text-3xl opacity-80 group-hover:scale-125 transition-transform duration-300">{t.emoji}</span>
                
                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground font-medium leading-relaxed mb-5 text-[15px]">"{t.quote}"</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <img src={t.img} alt={`${t.name} IJMB graduate`} className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20" loading="lazy" />
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-xs text-primary font-medium">{t.uni}</div>
                  </div>
                </div>
              </div>
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
                src={studentsGroup}
                alt="IJMB students at a study centre in Nigeria"
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
                IJMB Study Centres Across Nigeria
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                IJMB approved study centres are located in major cities across all 36 states of Nigeria. 
                Whether you are in Lagos, Abuja, Kano, or Port Harcourt, there is an accredited centre near you.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Each centre provides quality tuition, study materials, and examination preparation to ensure 
                you achieve the best grades in your IJMB examinations.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Lagos", "Abuja", "Ibadan", "Kano", "Port Harcourt", "Ilorin"].map((city) => (
                  <Link
                    key={city}
                    to={`/ijmb-in-${city.toLowerCase().replace(/ /g, "-")}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <MapPin size={14} /> {city}
                  </Link>
                ))}
              </div>
              <Link
                to="/ijmb-centres-in-nigeria"
                className="text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All Centres <ArrowRight size={16} />
              </Link>
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
