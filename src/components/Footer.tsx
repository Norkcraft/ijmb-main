import { Link } from "react-router-dom";
import ijmbLogo from "@/assets/ijmb-logo.jpeg";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="max-w-7xl mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={ijmbLogo} alt="IJMB Logo" className="h-10 w-10 rounded-full" />
            <span className="font-heading font-bold text-lg">IJMB Info</span>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            Your trusted source for IJMB registration, requirements, and updates across Nigeria. 
            Gain direct entry admission into 200 level without UTME.
          </p>
        </div>
        <div>
          <h3 className="font-heading font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/ijmb-registration" className="hover:opacity-100 transition-opacity">IJMB Registration</Link></li>
            <li><Link to="/ijmb-admission-requirements" className="hover:opacity-100 transition-opacity">Admission Requirements</Link></li>
            <li><Link to="/ijmb-fees" className="hover:opacity-100 transition-opacity">IJMB Fees</Link></li>
            <li><Link to="/ijmb-centres-in-nigeria" className="hover:opacity-100 transition-opacity">Study Centres</Link></li>
            <li><Link to="/universities-accepting-ijmb" className="hover:opacity-100 transition-opacity">Accepting Universities</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-heading font-bold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/blog" className="hover:opacity-100 transition-opacity">Blog & Updates</Link></li>
            <li><Link to="/ijmb-vs-jamb" className="hover:opacity-100 transition-opacity">IJMB vs JAMB</Link></li>
            <li><Link to="/faq" className="hover:opacity-100 transition-opacity">FAQ</Link></li>
            <li><Link to="/contact" className="hover:opacity-100 transition-opacity">Contact Us</Link></li>
            <li><Link to="/login" className="hover:opacity-100 transition-opacity">Student Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-heading font-bold mb-4">Popular Locations</h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><Link to="/ijmb-in-lagos" className="hover:opacity-100 transition-opacity">IJMB in Lagos</Link></li>
            <li><Link to="/ijmb-in-abuja" className="hover:opacity-100 transition-opacity">IJMB in Abuja</Link></li>
            <li><Link to="/ijmb-in-ibadan" className="hover:opacity-100 transition-opacity">IJMB in Ibadan</Link></li>
            <li><Link to="/ijmb-in-kano" className="hover:opacity-100 transition-opacity">IJMB in Kano</Link></li>
            <li><Link to="/ijmb-in-port-harcourt" className="hover:opacity-100 transition-opacity">IJMB in Port Harcourt</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-70">
        <p>© {new Date().getFullYear()} IJMB Info. All rights reserved. | <Link to="/contact" className="underline">Contact Us</Link></p>
        <p className="mt-1">This is an informational website. Always verify details with official IJMB/JAMB sources.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
