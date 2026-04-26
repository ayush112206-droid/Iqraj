'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500); // Show for 2.5 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg"
    >
      <div className="absolute top-12 text-center">
        <h1 className="text-3xl font-black tracking-[0.2em] text-text-1 uppercase">Study IQ</h1>
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-3xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shadow-xl">
           <BookOpen className="w-12 h-12 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-black text-text-1 uppercase tracking-tight">VIP Study</h2>
      </div>

      <div className="absolute bottom-12 text-text-3 text-sm font-medium">
        Powered by Raj
      </div>
    </motion.div>
  );
}
