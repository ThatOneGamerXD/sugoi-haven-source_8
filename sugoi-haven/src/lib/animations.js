import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-triggered reveals (blueprint §4): subtle, fast, never blocking scroll.
 * Any element with [data-reveal] fades/rises in; groups stagger via
 * [data-reveal-group]. Respects prefers-reduced-motion via gsap.matchMedia.
 */
export function usePageReveals(deps = []) {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      document.querySelectorAll("[data-reveal-group]").forEach(group => {
        const els = group.querySelectorAll("[data-reveal]");
        if (!els.length) return;
        gsap.fromTo(els, { opacity: 0, y: 22 }, {
          opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.15,
          scrollTrigger: { trigger: group, start: "top 82%", once: true },
        });
      });
      document.querySelectorAll("[data-reveal]:not([data-reveal-group] [data-reveal])").forEach(el => {
        gsap.fromTo(el, { opacity: 0, y: 22 }, {
          opacity: 1, y: 0, duration: 0.55, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-reveal]", { opacity: 1, y: 0 });
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 60);
    return () => { clearTimeout(t); mm.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { gsap, ScrollTrigger };
