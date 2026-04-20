'use client';

import React from 'react';
import { Folder, ChevronRight } from 'lucide-react';
import { Subject } from '@/types';

interface SubjectBoxProps {
  subject: Subject;
  onClick: () => void;
}

export default function SubjectBox({ subject, onClick }: SubjectBoxProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center bg-surface border border-border-custom rounded-xl p-3 text-left transition-all duration-300 hover:border-yellow-500/50 hover:bg-surface-2 hover:shadow-lg active:scale-[0.98] gap-4"
    >
      <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-all flex-shrink-0">
        <Folder className="w-5 h-5 text-yellow-500 fill-yellow-500/30" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-text-1 truncate group-hover:text-yellow-500 transition-colors">
          {subject.name}
        </h3>
        <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold text-text-3 uppercase tracking-wider">
          <span>{subject.videos.length} Videos</span>
          <span className="w-1 h-1 rounded-full bg-border-custom"></span>
          <span>{subject.pdfs.length} PDFs</span>
        </div>
      </div>
      
      <ChevronRight className="w-4 h-4 text-text-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all mr-2" />
    </button>
  );
}
