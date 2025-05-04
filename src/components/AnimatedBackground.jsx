'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

const PARTICLE_COLORS = [
  'rgba(59,130,246,0.25)',   // azul
  'rgba(99,102,241,0.25)',  // índigo
  'rgba(139,92,246,0.25)',  // púrpura
  'rgba(236,72,153,0.25)',  // rosa
  'rgba(253,224,71,0.25)',  // amarillo
  'rgba(16,185,129,0.25)',  // verde
  'rgba(244,63,94,0.25)',   // rojo
  'rgba(255,255,255,0.18)'  // blanco
];

const AnimatedBackground = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    // Limpiar partículas previas
    if (containerRef.current) containerRef.current.innerHTML = '';
    particlesRef.current = [];

    // Crear partículas grandes y coloridas
    const container = containerRef.current;
    const particleCount = 80;
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 60 + 30; // 30px a 90px
      particle.className = 'absolute rounded-full pointer-events-none';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * width}px`;
      particle.style.top = `${Math.random() * height}px`;
      particle.style.background = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      particle.style.filter = 'blur(2px)';
      particle.style.mixBlendMode = 'screen';
      particle.style.opacity = Math.random() * 0.7 + 0.2;
      container.appendChild(particle);
      particlesRef.current.push(particle);
    }

    // Timeline de animación
    timelineRef.current = anime.timeline({
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine'
    });

    // Movimiento y efectos
    timelineRef.current
      .add({
        targets: particlesRef.current,
        translateX: () => anime.random(-200, 200),
        translateY: () => anime.random(-200, 200),
        scale: () => anime.random(0.7, 1.5),
        opacity: () => anime.random(0.2, 0.7),
        duration: 4000,
        delay: anime.stagger(20)
      })
      .add({
        targets: particlesRef.current,
        scale: () => anime.random(0.8, 1.8),
        filter: [
          'blur(2px)',
          'blur(8px)',
          'blur(2px)'
        ],
        duration: 3000,
        easing: 'easeInOutQuad',
        delay: anime.stagger(20)
      });

    // Efecto de resplandor
    anime({
      targets: particlesRef.current,
      boxShadow: [
        '0 0 0px 0px #fff0',
        '0 0 40px 10px #fff8',
        '0 0 0px 0px #fff0'
      ],
      duration: 4000,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine',
      delay: anime.stagger(30)
    });

    // Limpieza
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
      if (timelineRef.current) timelineRef.current.pause();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{
        background: 'radial-gradient(circle at 60% 40%, #0f172a 0%, #18181b 100%)',
        border: '4px solid red',
        backgroundColor: 'rgba(255,0,0,0.2)',
        transition: 'background 1s'
      }}
    />
  );
};

export default AnimatedBackground; 