'use client';

import React from 'react';
import { Subject } from '@/types';
import { Folder, Play, FileText } from 'lucide-react';

interface SubjectListProps {
  subjects: Subject[];
  activeSubject: number;
  setActiveSubject: (index: number) => void;
}

export default function SubjectList({ subjects, activeSubject, setActiveSubject }: SubjectListProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-text-secondary text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <Folder className="w-4 h-4" />
          Subjects
        </h3>
        <span className="bg-surface-2 text-text-muted text-[10px] px-1.5 py-0.5 rounded-md border border-border-custom">
          {subjects.length}
        </span>
      </div>

      <div className="space-y-1">
        {subjects.map((subject, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSubject(idx)}
            className={`w-full text-left p-3 rounded-xl transition-all group relative border ${
              activeSubject === idx 
                ? 'bg-surface-2 border-primary-custom/30 text-white' 
                : 'bg-transparent border-transparent text-text-secondary hover:bg-surface-2 hover:text-text-primary'
            }`}
          >
            {activeSubject === idx && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-custom rounded-r-full"></div>
            )}
            
            <div className="flex flex-col gap-1">
              <span className={`font-semibold text-sm line-clamp-1 ${activeSubject === idx ? 'text-primary-custom' : ''}`}>
                {subject.name}
              </span>
              <div className="flex items-center gap-3 text-[10px] font-medium opacity-70">
                <div className="flex items-center gap-1">
                  <Play className="w-3 h-3" />
                  <span>{subject.videos.length} Videos</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>{subject.pdfs.length} PDFs</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
