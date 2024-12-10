"use client";
import React from "react";
import { motion } from "framer-motion";
import UploadPhoto from "@/app/components/UploadPhoto";

// Componente para estrella brillante animada
const ShimmeringStar = ({ cx, cy, size = 0.15 }) => {
  return (
    <motion.g>
      <motion.circle
        cx={cx}
        cy={cy}
        r={size}
        fill="white"
        initial={{ opacity: 0.4 }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: Math.random() * 5 + 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={size * 3}
        fill="url(#star-shimmer)"
        initial={{ opacity: 0.1 }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: Math.random() * 6 + 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.g>
  );
};

// Componente para partículas flotantes animadas
const FloatingParticle = ({ cx, cy, size }) => (
  <motion.circle
    cx={cx}
    cy={cy}
    r={size}
    fill="white"
    initial={{ opacity: 0.2, x: cx, y: cy }}
    animate={{
      opacity: [0.2, 0.4, 0.2],
      x: [cx, cx + Math.random() * 2 - 1, cx],
      y: [cy, cy + Math.random() * 2 - 1, cy],
    }}
    transition={{
      duration: Math.random() * 6 + 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default function Home() {
  const shimmeringStars = Array.from({ length: 40 }, () => ({
    cx: Math.random() * 100,
    cy: Math.random() * 100,
    size: Math.random() * 0.15 + 0.05,
  }));

  const floatingParticles = Array.from({ length: 50 }, () => ({
    cx: Math.random() * 100,
    cy: Math.random() * 100,
    size: Math.random() * 0.08 + 0.02,
  }));

  return (
    <div className="min-h-screen w-full relative">
      <svg
        className="fixed inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="star-shimmer" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF00FF" />
            <stop offset="20%" stopColor="#CC00CC" />
            <stop offset="35%" stopColor="#660066" />
            <stop offset="45%" stopColor="#300030" />
            <stop offset="55%" stopColor="#200020" />
            <stop offset="65%" stopColor="#300030" />
            <stop offset="70%" stopColor="#000066" />
            <stop offset="80%" stopColor="#000080" />
            <stop offset="90%" stopColor="#000099" />
            <stop offset="100%" stopColor="#0000AA" />
          </linearGradient>
          <filter id="star-glow">
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="background-blur">
            <feGaussianBlur stdDeviation="4" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                     0 1 0 0 0
                     0 0 1 0 0
                     0 0 0 0.9 0"
            />
          </filter>
        </defs>

        <rect width="100" height="100" fill="black" />

        <g filter="url(#background-blur)">
          <rect
            width="100"
            height="100"
            fill="url(#bg-gradient)"
            opacity="0.85"
          />
          <circle cx="20" cy="20" r="30" fill="#660066" opacity="0.3" />
          <circle cx="80" cy="80" r="30" fill="#000080" opacity="0.3" />
        </g>

        <g filter="url(#star-glow)">
          {Array.from({ length: 150 }).map((_, i) => (
            <circle
              key={`static-star-${i}`}
              cx={Math.random() * 100}
              cy={Math.random() * 100}
              r={Math.random() * 0.1 + 0.02}
              fill="white"
              opacity={Math.random() * 0.3 + 0.1}
            />
          ))}
        </g>

        <g>
          {shimmeringStars.map((star, i) => (
            <ShimmeringStar
              key={`shimmering-star-${i}`}
              cx={star.cx}
              cy={star.cy}
              size={star.size}
            />
          ))}
        </g>

        {/* Partículas flotantes en movimiento */}
        <g>
          {floatingParticles.map((particle, i) => (
            <FloatingParticle
              key={`floating-particle-${i}`}
              cx={particle.cx}
              cy={particle.cy}
              size={particle.size}
            />
          ))}
        </g>
      </svg>

      <div className="relative">
        <UploadPhoto />
      </div>
    </div>
  );
}
