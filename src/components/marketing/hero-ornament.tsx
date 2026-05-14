'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Lazy-load the 3D scene to keep initial bundle small.
// SSR is disabled because Three.js requires window/WebGL.
const CrystalScene = dynamic(
  () => import('./crystal-scene').then((m) => m.CrystalScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-gold-300/20 to-gold-500/10 blur-2xl" />
      </div>
    ),
  },
);

export function HeroOrnament() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      className="pointer-events-none absolute right-[-8%] top-[8%] hidden h-[640px] w-[640px] lg:block"
      aria-hidden
    >
      {/* radial glow behind the canvas */}
      <div className="pointer-events-none absolute inset-[15%] rounded-full bg-gold-400/10 blur-3xl" />
      <CrystalScene />
    </motion.div>
  );
}
