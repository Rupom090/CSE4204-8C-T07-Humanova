'use client';

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

export interface FlowSectionProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  style = {},
  children,
  'aria-label': ariaLabel,
}) => (
  <section
    data-flow-section
    aria-label={ariaLabel}
    className={cx('relative min-h-screen w-full overflow-hidden', className)}
  >
    <div
      data-flow-inner
      className={cx(
        'flow-art-container relative flex min-h-screen w-full flex-col justify-between gap-6 px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw] border-t-4 border-white shadow-[0_-8px_30px_-6px_rgba(255,255,255,0.2)]',
        'will-change-transform',
      )}
      style={{ ...style }}
    >
      {children}
    </div>
  </section>
);

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  'aria-label': ariaLabel = 'Story scroll',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || reducedMotion) return;

    // Use GSAP's official built-in context API to scope selector operations
    // and automatically dispose of all animations & ScrollTriggers upon unmounting!
    const ctx = gsap.context(() => {
      const sections = Array.from(
        containerRef.current!.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
          const isEven = i % 2 === 0;
          const origin = isEven ? 'top right' : 'top left';
          const startRotation = isEven ? 12 : -12;

          gsap.fromTo(inner,
            {
              y: 100,
              rotation: startRotation,
              transformOrigin: origin
            },
            {
              y: 0,
              rotation: 0,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top top',
                scrub: 1.2,
              },
            }
          );
        }

        if (i < sections.length - 1) {
          ScrollTrigger.create({
            trigger: section,
            start: 'bottom bottom',
            end: 'bottom top',
            pin: true,
            pinSpacing: false,
          });
        }
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert(); // Safely reverts all GSAP animations and kills all ScrollTriggers inside this context!
    };
  }, [childCount(children), reducedMotion]);

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx('w-full overflow-x-hidden', className)}
    >
      {children}
    </main>
  );
};

export default FlowArt;
