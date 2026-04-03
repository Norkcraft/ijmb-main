import { useEffect, useRef } from "react";
import gsap from "gsap";

const WhatsAppButton = () => {
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = btnRef.current;
    if (!el) return;

    // Entrance: slide up + fade in
    gsap.fromTo(el, { opacity: 0, y: 40, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 1.5, ease: "back.out(1.7)" });

    // Gentle pulse every 4s
    const pulse = gsap.to(el, {
      scale: 1.12,
      duration: 0.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      repeatDelay: 3.5,
      delay: 3,
    });

    return () => { pulse.kill(); };
  }, []);

  return (
    <a
      ref={btnRef}
      href="https://wa.link/udcjk0"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-[5.5rem] right-4 z-40 md:bottom-6 md:right-6 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-2xl hover:brightness-110 transition-shadow duration-300 opacity-0"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-7 h-7 fill-current">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.129 6.744 3.047 9.379L1.054 31.27l6.1-1.957a15.9 15.9 0 008.85 2.691C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.35 22.617c-.393 1.107-1.943 2.025-3.188 2.293-.852.182-1.963.326-5.705-1.227-4.787-1.986-7.867-6.834-8.107-7.152-.229-.318-1.928-2.568-1.928-4.895s1.221-3.473 1.654-3.947c.434-.475.947-.594 1.262-.594.316 0 .631.002.908.016.291.016.682-.111 1.068.814.393.947 1.34 3.264 1.457 3.502.119.238.197.514.039.83-.158.318-.236.514-.475.791-.236.277-.498.619-.711.83-.238.238-.486.496-.209.971.277.475 1.234 2.035 2.65 3.299 1.82 1.623 3.354 2.127 3.83 2.365.475.238.752.197 1.029-.119.277-.316 1.182-1.379 1.498-1.854.316-.475.633-.395 1.068-.238.434.158 2.752 1.299 3.225 1.535.475.238.791.355.908.553.119.197.119 1.145-.275 2.252z"/>
      </svg>
    </a>
  );
};

export default WhatsAppButton;
