'use client';

import React from 'react';
import Link from 'next/link';
import { Batch } from '@/types';

interface BatchCardProps {
  batch: Batch;
}

const colors = [
  '#1e3a5f', '#1a4731', '#4a1942', '#4a3200', 
  '#1a3a4a', '#3d1f00', '#1f2d4a', '#2d1a4a'
];

export default function BatchCard({ batch }: BatchCardProps) {
  const topColor = colors[batch.id % 8];
  const initials = batch.title.substring(0, 2).toUpperCase();

  return (
    <Link 
      href={`/batch/${batch.id}`}
      className="block h-[160px] md:h-[148px] bg-surface border border-border-custom rounded-custom overflow-hidden transition-all duration-150 ease-out hover:-translate-y-[3px] hover:border-primary-custom shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
    >
      <div 
        className="h-[56px] flex items-center justify-between px-4"
        style={{ backgroundColor: topColor }}
      >
        <div className="text-lg font-bold text-white/50">{initials}</div>
        <div className="px-2 py-0.5 bg-black/20 rounded-full text-[10px] font-bold text-white/80">
          ID: {batch.id}
        </div>
      </div>
      <div className="h-[92px] p-[14px] flex flex-col justify-between">
        <h3 className="text-sm font-medium text-text-1 clamp-2 leading-tight">
          {batch.title}
        </h3>
        <div className="text-[12px] text-text-3">
          Tap to explore →
        </div>
      </div>
    </Link>
  );
}
