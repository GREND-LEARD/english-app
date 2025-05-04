'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

const Confetti = ({ trigger }) => {
  const containerRef = useRef(null);
  const confettiRef = useRef([]);
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    // Crear confeti
    const createConfetti = () => {
      const container = containerRef.current;
      const confettiCount = 100; // Aumentamos la cantidad
      
      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        
        // Formas aleatorias
        const shapes = ['square', 'circle', 'triangle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        confetti.className = 'absolute';
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        
        // Colores aleatorios con gradientes
        const colors = [
          'linear-gradient(45deg, #FF5252, #FFD740)',
          'linear-gradient(45deg, #64FFDA, #448AFF)',
          'linear-gradient(45deg, #B388FF, #FF80AB)',
          'linear-gradient(45deg, #FFD740, #FF5252)',
          'linear-gradient(45deg, #448AFF, #64FFDA)'
        ];
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Aplicar forma
        if (shape === 'circle') {
          confetti.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
          confetti.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        }
        
        container.appendChild(confetti);
        confettiRef.current.push(confetti);
      }
    };

    // Crear timeline para animaciones coordinadas
    timelineRef.current = anime.timeline({
      easing: 'easeOutExpo'
    });

    // Animación del confeti
    const animateConfetti = () => {
      // Explosión inicial
      timelineRef.current
        .add({
          targets: confettiRef.current,
          translateY: () => anime.random(-300, -100),
          translateX: () => anime.random(-200, 200),
          rotate: () => anime.random(-360, 360),
          scale: () => anime.random(0.5, 1.5),
          opacity: [0, 1],
          duration: () => anime.random(500, 1000),
          delay: anime.stagger(10),
          easing: 'easeOutExpo'
        })
        // Caída y dispersión
        .add({
          targets: confettiRef.current,
          translateY: () => anime.random(100, 300),
          translateX: () => anime.random(-200, 200),
          rotate: () => anime.random(-720, 720),
          scale: () => anime.random(0.2, 1),
          opacity: [1, 0],
          duration: () => anime.random(1000, 2000),
          delay: anime.stagger(20),
          easing: 'easeInExpo'
        });

      // Efecto de brillo
      anime({
        targets: confettiRef.current,
        boxShadow: [
          '0 0 0 rgba(255,255,255,0)',
          '0 0 20px rgba(255,255,255,0.8)',
          '0 0 0 rgba(255,255,255,0)'
        ],
        duration: () => anime.random(500, 1000),
        delay: anime.stagger(10),
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine'
      });
    };

    createConfetti();
    animateConfetti();

    // Limpieza
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      if (timelineRef.current) {
        timelineRef.current.pause();
      }
    };
  }, [trigger]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-50"
    />
  );
};

export default Confetti; 