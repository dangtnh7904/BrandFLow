"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AmbientParticles() {
  const [particles, setParticles] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const generated = Array.from({ length: 40 }).map((_, i) => {
      // Randomize initial positions and movement parameters
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = Math.random() * 3 + 1; // 1px to 4px
      const duration = Math.random() * 20 + 20; // 20s to 40s
      const delay = Math.random() * 10;
      const isCyan = Math.random() > 0.5;

      return { id: i, top, left, size, duration, delay, isCyan };
    });
    setParticles(generated);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${p.isCyan ? "bg-cyan-400" : "bg-blue-400"}`}
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: 0.15,
            boxShadow: p.isCyan ? "0 0 8px 2px rgba(6,182,212,0.3)" : "0 0 8px 2px rgba(59,130,246,0.3)"
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.05, 0.3, 0.05],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
