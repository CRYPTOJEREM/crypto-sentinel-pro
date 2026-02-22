import { useState, useEffect, useRef } from 'react';

export default function useAnimatedValue(target, duration = 800) {
  const [value, setValue] = useState(0);
  const animRef = useRef(null);
  const prevRef = useRef(0);

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const start = prevRef.current;
    const diff = target - start;
    if (Math.abs(diff) < 0.5) {
      setValue(target);
      prevRef.current = target;
      return;
    }

    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Apple-style ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = start + diff * eased;
      setValue(Math.round(current));

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        prevRef.current = target;
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [target, duration]);

  return value;
}
