'use client';

import Link from "next/link";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import {
  GraduationCap,
  Target,
  Users,
  Award,
  CheckCircle,
  BookOpen,
  TrendingUp,
  Heart,
} from "lucide-react";

const WHATSAPP_LINK = "https://wa.link/udcjk0";

const stats = [
  { value: "500+", label: "Students Enrolled" },
  { value: "95%", label: "Pass Rate" },
  { value: "10+", label: "Years of Experience" },
  { value: "200+", label: "Partner Universities" },
];

const whyChooseUs = [
  {
    icon: <GraduationCap size={28} />,
    title: "Experienced Tutors",
    desc: "Our faculty are seasoned educators with deep knowledge of the IJMB curriculum and proven track records of helping students excel.",
  },
  {
    icon: <TrendingUp size={28} />,
    title: "Proven Results",
    desc: "Year after year, our students achieve outstanding A-Level scores that earn them direct 200-Level admission into top Nigerian universities.",
  },
  {
    icon: <Heart size={28} />,
    title: "Personalised Support",
    desc: "From registration through to university admission, we walk alongside every student — no one is left behind.",
  },
  {
    icon: <Award size={28} />,
    title: "Affordable Fees",
    desc: "We believe quality education should be accessible. Our fee structure is transparent, competitive, and flexible.",
  },
];

const values = [
  "Academic excellence through dedicated teaching",
  "Integrity and transparency in all student dealings",
  "Accessibility — quality IJMB education for every Nigerian",
  "Student-centred support from enrolment to admission",
];

const About = () => (
  <>
    <SEOHead
      title="About Dynamic School of Advanced Studies – IJMB Study Centre"
      description="Dynamic School of Advanced Studies is a leading IJMB study centre helping Nigerian students gain direct 200-Level university admission without UTME. Learn about our mission, story, and team."
      canonical="https://www.ijmb.info/about"
      keywords="Dynamic School of Advanced Studies, IJMB study centre, IJMB school Nigeria, about IJMB portal, IJMB study centre Nigeria"
    />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

    {/* Hero */}
    <section
      className="text-primary-foreground py-20 lg:py-28"
      style={{ background: "var(--hero-gradient)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/15 border border-white/25">
          IJMB Study Centre
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
          Dynamic School of<br className="hidden sm:block" /> Advanced Studies
        </h1>
        <p className="text-lg lg:text-xl opacity-85 leading-relaxed max-w-2xl mx-auto mb-10">
          Empowering Nigerian students to bypass UTME and gain direct 200-Level
          university admission through the IJMB programme — professionally,
          affordably, and with unwavering support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3.5 rounded-lg font-bold text-sm cta-gradient text-accent-foreground hover:opacity-90 transition-opacity"
          >
            Start Your IJMB Journey →
          </Link>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-lg font-bold text-sm bg-white/15 border border-white/30 hover:bg-white/25 transition-colors"
          >
            Chat Us on WhatsApp
          </a>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-primary text-primary-foreground py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold" style={{ color: "hsl(40, 92%, 55%)" }}>
                {s.value}
              </p>
              <p className="text-sm opacity-80 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Our Purpose</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything we do is guided by two simple commitments: a clear mission and a bold vision.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="p-6 md:p-8 bg-secondary/40 rounded-2xl border border-border">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Target size={26} />
              </div>
              <h3 className="text-xl font-heading font-bold">Our Mission</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To provide every Nigerian student with a credible, structured, and supportive
              pathway to direct 200-Level university admission through the IJMB A-Level programme —
              without the pressure and uncertainty of UTME.
            </p>
          </div>
          {/* Vision */}
          <div className="p-6 md:p-8 bg-secondary/40 rounded-2xl border border-border">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <BookOpen size={26} />
              </div>
              <h3 className="text-xl font-heading font-bold">Our Vision</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To be Nigeria's most trusted IJMB study centre — a place where every student,
              regardless of background, can access world-class A-Level tuition and confidently
              walk into a university of their choice.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Our Story */}
    <section className="section-padding" style={{ backgroundColor: "hsl(var(--section-alt))" }}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-4">
          <Users size={18} /> Our Story
        </div>
        <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
          Built Around One Goal: Your University Admission
        </h2>
        <div className="text-muted-foreground leading-relaxed space-y-4 text-left md:text-center">
          <p>
            Dynamic School of Advanced Studies was founded with a single conviction — that every
            serious Nigerian student deserves a clear, reliable route into higher education.
            The IJMB programme offered exactly that: a nationally recognised A-Level qualification
            that opens the doors to 200-Level admission across more than 200 universities, without
            the bottleneck of UTME.
          </p>
          <p>
            Over the years, we have grown from a small tutoring outfit into a fully structured IJMB
            study centre, combining experienced subject tutors, well-designed study materials, and
            hands-on admission guidance. Our students come from across Nigeria, and they leave with
            the grades, the confidence, and the placement they worked hard for.
          </p>
          <p>
            Today, through this portal, we extend that same quality experience online — making it
            easier than ever to register, track your progress, and stay connected with your tutors
            wherever you are in Nigeria.
          </p>
        </div>
      </div>
    </section>

    {/* Our Values */}
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mb-4">What We Stand For</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our values are not just words on a wall — they shape how we teach, how we
              communicate, and how we support every student on their journey.
            </p>
            <ul className="space-y-4">
              {values.map((v) => (
                <li key={v} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-5 bg-primary text-primary-foreground rounded-2xl">
              <p className="text-lg font-heading font-bold mb-1">No UTME. No Stress.</p>
              <p className="text-sm opacity-80">
                IJMB gives you a direct route to 200 Level — skip the JAMB queue and focus on real academic work.
              </p>
            </div>
            <div className="p-5 bg-secondary/50 rounded-2xl border">
              <p className="text-lg font-heading font-bold mb-1 text-primary">Accepted Nationwide</p>
              <p className="text-sm text-muted-foreground">
                Our graduates gain admission into federal, state, and private universities across all 36 states.
              </p>
            </div>
            <div className="p-5 rounded-2xl border" style={{ background: "hsl(40, 92%, 50% / 0.08)" }}>
              <p className="text-lg font-heading font-bold mb-1">Trusted Across Nigeria</p>
              <p className="text-sm text-muted-foreground">
                We operate fully within the official IJMB framework set by Ahmadu Bello University, Zaria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="section-padding" style={{ backgroundColor: "hsl(var(--section-alt))" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Why Students Choose Us</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Thousands of students have trusted Dynamic School of Advanced Studies with their future. Here's why.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item) => (
            <div
              key={item.title}
              className="p-6 bg-card rounded-2xl border hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="bg-primary/10 text-primary p-3 rounded-xl inline-flex mb-4">
                {item.icon}
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Strip */}
    <section className="section-padding">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">
          Ready to Begin Your Journey?
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Join hundreds of students who are already on the path to 200-Level admission.
          Register today or chat with us on WhatsApp — we're ready to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3.5 rounded-lg font-bold text-sm cta-gradient text-accent-foreground hover:opacity-90 transition-opacity"
          >
            Register for IJMB Now →
          </Link>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-lg font-bold text-sm border-2 border-primary text-primary hover:bg-primary/5 transition-colors"
          >
            Chat Us on WhatsApp
          </a>
        </div>
      </div>
    </section>

    <section className="section-padding pt-0">
      <div className="max-w-6xl mx-auto">
        <InternalLinks />
      </div>
    </section>
  </>
);

export default About;
