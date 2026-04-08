import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
}

interface ConfettiProps {
  trigger: boolean;
  count?: number;
  duration?: number;
  origin?: { x: number; y: number };
  onComplete?: () => void;
}

const colors = ['#b5f727', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899'];

export const Confetti: React.FC<ConfettiProps> = ({
  trigger,
  count = 50,
  duration = 2000,
  origin = { x: 0.5, y: 0.5 },
  onComplete,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      
      const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: origin.x * 100,
        y: origin.y * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 30,
        velocityY: -Math.random() * 20 - 10,
      }));
      
      setParticles(newParticles);
      
      setTimeout(() => {
        setParticles([]);
        setIsActive(false);
        onComplete?.();
      }, duration);
    }
  }, [trigger, count, duration, origin, onComplete, isActive]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        overflow: 'hidden',
      }}
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
              scale: 0,
              rotate: particle.rotation,
            }}
            animate={{
              x: `${particle.x + particle.velocityX}%`,
              y: `${particle.y + particle.velocityY + 50}%`,
              scale: [0, 1, 1, 0],
              rotate: particle.rotation + 720,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: duration / 1000,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              background: particle.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              boxShadow: `0 0 ${particle.size}px ${particle.color}50`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Mini celebration component for step completion
export const StepCompleteCelebration: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      setTimeout(() => setShow(false), 800);
    }
  }, [trigger]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9997,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(181,247,39,0.3) 0%, transparent 70%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ fontSize: 40 }}
        >
          ✨
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Confetti;
