import { Link } from "react-router-dom";

const StickyMobileCTA = () => (
  <div className="sticky-mobile-cta">
    <Link
      to="/register"
      className="block w-full text-center py-3 font-bold text-sm rounded-lg cta-gradient text-accent-foreground"
    >
      Register for IJMB Now →
    </Link>
  </div>
);

export default StickyMobileCTA;
