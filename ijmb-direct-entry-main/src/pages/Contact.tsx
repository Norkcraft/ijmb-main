import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import InternalLinks from "@/components/InternalLinks";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <SEOHead
        title="Contact IJMB – Get Help with Registration & Enquiries"
        description="Contact us for IJMB registration help, enquiries, and support. Reach us via phone, email, or our contact form."
        canonical="https://www.ijmb.info/contact"
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">Contact Us</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Have questions about IJMB registration, requirements, or fees? Our team is ready to help you 
                start your journey to 200 level admission. Reach out today.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold mb-1">Phone / WhatsApp</h3>
                    <p className="text-muted-foreground">+234 XXX XXX XXXX</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold mb-1">Email</h3>
                    <p className="text-muted-foreground">info@ijmb.info</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold mb-1">Office</h3>
                    <p className="text-muted-foreground">Nigeria (Nationwide service)</p>
                  </div>
                </div>
              </div>

              <InternalLinks />
            </div>

            <div>
              {submitted ? (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-primary" size={28} />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">We will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 lg:p-8 space-y-5">
                  <h2 className="font-heading font-bold text-xl mb-2">Send Us a Message</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                    <input type="tel" required className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="08X XXX XXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input type="email" required className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Message</label>
                    <textarea required rows={4} className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Your question about IJMB..." />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 font-bold rounded-lg cta-gradient text-accent-foreground hover:opacity-90 transition-opacity"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
