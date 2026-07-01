import { useEffect, useRef, useState } from 'react';

/**
 * Returns true when navbar should be visible.
 * Hides on scroll down, shows on scroll up.
 */
export default function useScrollDirection(threshold = 72) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const update = () => {
      const currentY = window.scrollY;

      if (currentY <= 16) {
        setVisible(true);
      } else if (currentY > lastScrollY.current && currentY > threshold) {
        setVisible(false);
      } else if (currentY < lastScrollY.current) {
        setVisible(true);
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return visible;
}
