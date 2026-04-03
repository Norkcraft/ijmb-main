import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ijmbLogo from "@/assets/ijmb-logo.jpeg";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Registration", href: "/ijmb-registration" },
  { label: "Requirements", href: "/ijmb-admission-requirements" },
  { label: "Fees", href: "/ijmb-fees" },
  { label: "Centres", href: "/ijmb-centres-in-nigeria" },
  { label: "Universities", href: "/universities-accepting-ijmb" },
  { label: "IJMB vs JAMB", href: "/ijmb-vs-jamb" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2" aria-label="IJMB Home">
            <img src={ijmbLogo} alt="IJMB Logo" className="h-10 w-10 lg:h-12 lg:w-12 rounded-full object-cover" />
            <span className="font-heading font-bold text-lg lg:text-xl text-primary">IJMB</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.href
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground hover:text-primary hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link
                to={isAdmin ? "/portal-admin" : "/dashboard"}
                className="ml-2 px-5 py-2.5 text-sm font-bold rounded-lg cta-gradient text-accent-foreground hover:opacity-90 transition-opacity"
              >
                {isAdmin ? "Admin Panel" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="ml-2 px-4 py-2 text-sm font-medium rounded-md text-primary hover:bg-secondary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/ijmb-registration"
                  className="px-5 py-2.5 text-sm font-bold rounded-lg cta-gradient text-accent-foreground hover:opacity-90 transition-opacity"
                >
                  Register Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 text-sm font-medium rounded-md ${
                  location.pathname === link.href
                    ? "text-primary bg-secondary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link
                to={isAdmin ? "/portal-admin" : "/dashboard"}
                onClick={() => setOpen(false)}
                className="block w-full text-center mt-3 px-5 py-3 text-sm font-bold rounded-lg cta-gradient text-accent-foreground"
              >
                {isAdmin ? "Admin Panel" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium rounded-md text-primary"
                >
                  Login
                </Link>
                <Link
                  to="/ijmb-registration"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center mt-3 px-5 py-3 text-sm font-bold rounded-lg cta-gradient text-accent-foreground"
                >
                  Register Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
