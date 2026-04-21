'use client';

import { useEffect, useRef } from 'react';
import { THEMES } from '@brainbox/types';
import type { ThemeName } from '@brainbox/types';

// Resolves CSS Custom Properties to HEX for Canvas usage
const getCanvasColor = (cssVal: string) => {
  if (typeof window === 'undefined') return '#10a37f';
  const match = cssVal.match(/var\((--[\w-]+)\)/);
  if (match && match[1]) {
    const val = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
    return val || '#10a37f';
  }
  return cssVal;
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
}

/**
 * NeuralField is a high-performance background animation using HTML5 Canvas.
 * It simulates a cloud of connected particles that respond to mouse movement
 * and transition between different spatial modes (brain, wander, extension).
 */
export function NeuralField({ 
  theme, 
  mode = 'brain',
  speedMultiplier = 1,
  monochrome = false,
  particleCount
}: { 
  theme: ThemeName; 
  mode?: 'brain' | 'wander' | 'grid' | 'extension';
  speedMultiplier?: number;
  monochrome?: boolean;
  particleCount?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeColor = monochrome ? '#333333' : getCanvasColor(theme && THEMES[theme] ? THEMES[theme].color : 'var(--color-acc-chatgpt)');
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 150 });
  const particlesRef = useRef<Particle[]>([]);
  const prevModeRef = useRef<string>(mode);

  // mode and themeColor in deps — the mode defines particle distribution targets, 
  // and themeColor triggers updates to ensure all particles reflect the new visual style.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      const isMobile = width < 768;
      const numParticles = particleCount || (mode === 'brain' 
        ? (isMobile ? 200 : 600) 
        : (isMobile ? 100 : 300));

      const centerX = isMobile ? width * 0.5 : width * 0.7; 
      const centerY = isMobile ? height * 0.4 : height * 0.5;
      const radiusX = Math.min(width * (isMobile ? 0.35 : 0.25), isMobile ? 150 : 300);
      const radiusY = Math.min(height * (isMobile ? 0.25 : 0.3), isMobile ? 150 : 250);

      const isModeChange = prevModeRef.current !== mode;

      if (particlesRef.current.length === 0) {
        // Initial creation
        const newParticles: Particle[] = [];
        if (mode === 'brain') {
          for (let i = 0; i < numParticles; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random());
            const lobeOffset = Math.sin(angle * 4) * 20;
            const x = centerX + r * (radiusX + lobeOffset) * Math.cos(angle);
            const y = centerY + r * (radiusY + lobeOffset) * Math.sin(angle);

            newParticles.push({
              x: x + (Math.random() - 0.5) * 50,
              y: y + (Math.random() - 0.5) * 50,
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              baseX: x,
              baseY: y,
              size: Math.random() * 2 + 0.5,
              color: themeColor
            });
          }
        } else {
          for (let i = 0; i < numParticles; i++) {
            const startX = Math.random() * width;
            const startY = Math.random() * height;
            newParticles.push({
              x: startX,
              y: startY,
              vx: (Math.random() - 0.5) * 1,
              vy: (Math.random() - 0.5) * 1,
              baseX: startX,
              baseY: startY,
              size: Math.random() * 2 + 0.5,
              color: themeColor
            });
          }
        }
        particlesRef.current = newParticles;
      } else {
        // Transition existing particles
        particlesRef.current.forEach(p => {
          if (mode === 'brain') {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random());
            const lobeOffset = Math.sin(angle * 4) * 20;
            p.baseX = centerX + r * (radiusX + lobeOffset) * Math.cos(angle);
            p.baseY = centerY + r * (radiusY + lobeOffset) * Math.sin(angle);
          } else if (mode === 'extension') {
            // Scatter them across the whole screen
            p.baseX = Math.random() * width;
            p.baseY = Math.random() * height;
            
            // Give them a "kick" if we just switched to extension mode
            if (isModeChange) {
              const dx = p.x - centerX;
              const dy = p.y - centerY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const force = 15;
              if (dist > 0) {
                p.vx += (dx / dist) * force + (Math.random() - 0.5) * 10;
                p.vy += (dy / dist) * force + (Math.random() - 0.5) * 10;
              }
            }
          } else {
            p.baseX = Math.random() * width;
            p.baseY = Math.random() * height;
          }
          p.color = themeColor;
        });
      }
      prevModeRef.current = mode;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      ctx.lineWidth = 0.5;
      const connectionDistance = mode === 'brain' ? 40 : 80;

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p1 = particlesRef.current[i];
        if (!p1) continue;
        
        const dxMouse = mouseRef.current.x - p1.x;
        const dyMouse = mouseRef.current.y - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < mouseRef.current.radius) {
          const forceDirectionX = dxMouse / distMouse;
          const forceDirectionY = dyMouse / distMouse;
          const force = (mouseRef.current.radius - distMouse) / mouseRef.current.radius;
          
          p1.vx -= forceDirectionX * force * 0.5;
          p1.vy -= forceDirectionY * force * 0.5;
        }

        const returnSpeed = mode === 'brain' ? 0.01 : 0.005;
        const dxBase = p1.baseX - p1.x;
        const dyBase = p1.baseY - p1.y;
        p1.vx += dxBase * returnSpeed;
        p1.vy += dyBase * returnSpeed;

        // Add subtle random movement so they aren't completely static
        p1.vx += (Math.random() - 0.5) * 0.04;
        p1.vy += (Math.random() - 0.5) * 0.04;

        p1.vx *= 0.95;
        p1.vy *= 0.95;

        p1.x += p1.vx * speedMultiplier;
        p1.y += p1.vy * speedMultiplier;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = 0.8;
        ctx.fill();

        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          if (!p2) continue;
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = themeColor;
            ctx.globalAlpha = 1 - (dist / connectionDistance);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, themeColor, particleCount, speedMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}
