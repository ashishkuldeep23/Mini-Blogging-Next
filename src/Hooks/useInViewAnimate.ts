import { LegacyRef, RefObject, useEffect, useRef, useState } from "react";

// type RefTypes =
//   | HTMLDivElement
//   | HTMLParagraphElement
//   | HTMLSpanElement
//   | HTMLImageElement;

// type RefTypes = LegacyRef<
//   HTMLDivElement | HTMLParagraphElement | HTMLSpanElement | HTMLImageElement
// >  ;

type RefTypes =
  | HTMLDivElement
  | HTMLParagraphElement
  | HTMLSpanElement
  | HTMLImageElement
  | null;

export default function useInViewAnimate(threshold: number = 0.2): { ref: RefObject<RefTypes>; inView: boolean } {
  const ref = useRef<RefTypes>(null);

  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold,
      }
    );

    ref?.current && observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
