'use client';

import React, { useState } from 'react';
import { Subject } from '@/types';
import VideoSection from './VideoSection';
import PDFSection from './PDFSection';
import { PlayCircle, FileText } from 'lucide-react';

interface ContentPanelProps {
  subject: Subject | null;
}

export default function ContentPanel({ subject }: ContentPanelProps) {
  const [activeTab, setActiveTab] = useState<'videos' | 'pdfs'>('videos');

  if (!subject) return null;

  return (
    <div className="flex-1 min-w-0">
      <div className="p-4 md:p-8 border-b border-border-custom">
        <h2 className="text-xl md:text-2xl font-bold text-text-1 mb-2">📂 {subject.name}</h2>
        <div className="flex items-center gap-4 text-xs md:text-sm font-medium">
          <div className="flex items-center gap-1 text-red-custom">🎬 {subject.videos.length} Video Lectures</div>
          <div className="text-text-3">·</div>
          <div className="flex items-center gap-1 text-green-custom">📄 {subject.pdfs.length} PDF Notes</div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden flex p-4 bg-surface/50 border-b border-border-custom">
        <div className="flex w-full bg-surface-2 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'videos' ? 'bg-primary-custom text-white' : 'text-text-2'
            }`}
          >
            <PlayCircle className="w-4 h-4" /> Videos ({subject.videos.length})
          </button>
          <button
            onClick={() => setActiveTab('pdfs')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'pdfs' ? 'bg-primary-custom text-white' : 'text-text-2'
            }`}
          >
            <FileText className="w-4 h-4" /> PDFs ({subject.pdfs.length})
          </button>
        </div>
      </div>

      {/* Content Layout */}
      <div className="p-4 md:p-8">
        <div className="md:grid md:grid-cols-[1fr_1px_1fr] md:gap-8 lg:gap-12 md:items-start relative">
          <div className={`${activeTab === 'videos' ? 'block' : 'hidden md:block'} space-y-8`}>
            <VideoSection videos={subject.videos} />
          </div>

          {/* Vertical Divider - Desktop Only */}
          <div className="hidden md:block w-px self-stretch bg-border-custom"></div>

          <div className={`${activeTab === 'pdfs' ? 'block' : 'hidden md:block'} space-y-8 mt-8 md:mt-0`}>
            <PDFSection pdfs={subject.pdfs} />
          </div>
        </div>
      </div>
    </div>
  );
}
