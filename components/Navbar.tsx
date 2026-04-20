'use client';

import React from 'react';

import Link from 'next/link';

interface NavbarProps {
  batchCount?: number;
}

export default function Navbar({ batchCount }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 h-[60px] bg-bg/95 backdrop-blur-md border-b border-border-custom px-4 md:px-8">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl md:text-2xl font-bold text-text-1">
            📘 StudyIQ
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm font-bold text-text-3 hover:text-white transition-colors">Batches</Link>
            <Link href="/subjects" className="text-sm font-bold text-text-3 hover:text-white transition-colors">Subjects</Link>
          </div>
        </div>
        {batchCount !== undefined && (
          <div className="px-3 py-1 bg-surface border border-border-custom rounded-full text-xs md:text-sm font-semibold text-gold-custom">
            {batchCount.toLocaleString()} Courses
          </div>
        )}
      </div>
    </nav>
  );
}
