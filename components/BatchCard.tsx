'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Batch } from '@/types';
import ActionModal from './ActionModal';

interface BatchCardProps {
  batch: Batch;
}

const colors = [
  '#1e3a5f', '#1a4731', '#4a1942', '#4a3200', 
  '#1a3a4a', '#3d1f00', '#1f2d4a', '#2d1a4a'
];

export default function BatchCard({ batch }: BatchCardProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const topColor = colors[batch.id % 8];
  const initials = batch.title.substring(0, 2).toUpperCase();

  return (
    <>
      <div className="flex flex-col h-[200px] bg-surface border border-border-custom rounded-custom overflow-hidden transition-all duration-150 ease-out hover:border-primary-custom shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
        <div 
          className="h-[56px] flex items-center justify-between px-4"
          style={{ backgroundColor: topColor }}
        >
          <div className="text-lg font-bold text-white/50">{initials}</div>
          <div className="px-2 py-0.5 bg-black/20 rounded-full text-[10px] font-bold text-white/80">
            ID: {batch.id}
          </div>
        </div>
        <div className="flex-1 p-[14px] flex flex-col justify-between">
          <h3 className="text-sm font-medium text-text-1 clamp-2 leading-tight">
            {batch.title}
          </h3>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full py-2 mt-2 bg-primary-custom text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-colors"
          >
            Let's Study
          </button>
        </div>
      </div>

      {showModal && (
        <ActionModal 
          onClose={() => setShowModal(false)}
          onContinue={() => router.push(`/batch/${batch.id}`)}
          title="Continue to Batch"
          continueText="Continue to Batch"
        />
      )}
    </>
  );
}
