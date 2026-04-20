'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-surface/30 rounded-xl border border-dashed border-border-custom">
      <BookOpen className="w-12 h-12 mb-4 text-text-3 opacity-20" />
      <p className="text-text-2 font-medium">{message}</p>
    </div>
  );
}
