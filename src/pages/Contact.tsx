import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTASection from "@/components/CTASection";
import InternalLinks from "@/components/InternalLinks";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";

const Contact = () => (
  <>
    <SEOHead
      title="Contact IJMB Official Support – 2026/2027 Admission Enquiries"
      description="Need help with IJMB registration? Contact our official admission support team. Call, email or visit our head office for 2026/2027 admission guidance."
      canonical="https://www.ijmb.info/contact-us"
      keywords="Contact IJMB, IJMB support, IJMB admission office, IJMB helpline, IJMB office address"
    />
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />

    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">Contact Our Admission Support Team</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Do you have questions about the IJMB programme, registration process, or study centres? 
              Our dedicated admission officers are available to guide you through every step of your journey into 200 Level.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex gap-4 items-start p-4 bg-secondary/30 rounded-xl border hover:border-primary transition-colors">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Call Us</h3>
                  <p className="text-muted-foreground mb-1">Speak directly with an admission officer.</p>
                  <a href="tel:08000000000" className="text-lg font-bold text-primary hover:underline">080-0000-0000</a>
                  <p className="text-xs text-muted-foreground">Mon-Fri, 8am - 6pm</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-secondary/30 rounded-xl border hover:border-primary transition-colors">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                   <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email Support</h3>
                  <p className="text-muted-foreground mb-1">Send us your enquiries anytime.</p>
                  <a href="mailto:help@ijmb.info" className="text-lg font-bold text-primary hover:underline">help@ijmb.info</a>
                  <p className="text-xs text-muted-foreground">We reply within 24 hours</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-secondary/30 rounded-xl border hover:border-primary transition-colors">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                   <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Head Office</h3>
                  <p className="text-muted-foreground">
                    Plot 12, Educational Zone, <br />
                    Gwagwalada, Abuja, FCT.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
               <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                 <MessageSquare size={20} /> Quick Tip
               </h3>
               <p className="text-blue-800 text-sm">
                 Most questions are answered in our <Link to="/ijmb-faq" className="underline font-bold">Frequently Asked Questions</Link> section. 
                 Check it out for instant answers about fees, centres, and requirements.
               </p>
            </div>
          </div>

          <div className="bg-card border rounded-2xl shadow-sm p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input type="email" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <input type="tel" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none" placeholder="080..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <select className="w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-primary/20 outline-none">
                  <option>General Enquiry</option>
                  <option>Payment Issue</option>
                  <option>Centre Location</option>
                  <option>Admission Status</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea rows={4} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 outline-none" placeholder="How can we help you today?"></textarea>
              </div>

              <button className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </form>
          </div>
        </div>
        
        <InternalLinks />
      </div>
    </section>

    <CTASection />
  </>
);

export default Contact;
