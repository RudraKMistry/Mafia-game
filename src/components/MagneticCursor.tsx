import { useEffect, useRef } from 'react';

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let requestRef: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHoveringLocal = false;
    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      
      if (!isVisible) {
        isVisible = true;
        if (cursorRef.current) cursorRef.current.style.opacity = '1';
      }
      
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('.cursor-pointer')) {
        if (!isHoveringLocal) {
          isHoveringLocal = true;
          if (circleRef.current) circleRef.current.style.opacity = '1';
          if (pathRef.current) pathRef.current.style.opacity = '0';
        }
      } else {
        if (isHoveringLocal) {
          isHoveringLocal = false;
          if (circleRef.current) circleRef.current.style.opacity = '0';
          if (pathRef.current) pathRef.current.style.opacity = '1';
        }
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
    };

    const updatePosition = () => {
      // Smooth lerp - extremely tight tracking
      currentX += (targetX - currentX) * 0.6; 
      currentY += (targetY - currentY) * 0.6;
      
      if (cursorRef.current) {
        // Direct DOM manipulation bypasses React render tree, smooth like butter
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${isHoveringLocal ? 2 : 1})`;
      }
      
      requestRef = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    requestRef = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(requestRef);
    };
  }, []);

  // Remove mix-blend-difference, it causes massive GPU lag on complex backgrounds
  return (
    <div 
      ref={cursorRef}
      className="fixed pointer-events-none z-[10000] will-change-transform opacity-0 transition-opacity duration-300"
      style={{ left: 0, top: 0, transform: `translate3d(-100px, -100px, 0) translate(-50%, -50%)` }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
         <circle ref={circleRef} cx="12" cy="12" r="10" className="opacity-0 transition-opacity duration-300" />
         <path ref={pathRef} d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" className="transition-opacity duration-300" />
      </svg>
      {/* Red glow trailing behind - removed blur CSS filter and used radial gradient for performance */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(220,38,38,1) 0%, rgba(220,38,38,0) 70%)' }}
      ></div>
    </div>
  );
}
