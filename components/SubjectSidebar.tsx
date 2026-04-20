'use client';

import React from 'react';
import { Subject } from '@/types';
import { Folder } from 'lucide-react';

interface SubjectSidebarProps {
  subjects: Subject[];
  selectedSubject: Subject | null;
  onSelect: (subject: Subject) => void;
}

export default function SubjectSidebar({ subjects, selectedSubject, onSelect }: SubjectSidebarProps) {
  return (
    <aside className="hidden md:block w-[260px] sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto border-r border-border-custom scrollbar-thin">
      <div className="p-4 border-b border-border-custom text-sm font-semibold text-text-1 flex items-center gap-2">
        <Folder className="w-4 h-4" />
        Subjects
      </div>
      <div className="flex flex-col">
        {subjects.map((subject, index) => {
          const isActive = selectedSubject?.name === subject.name;
          return (
            <button
              key={index}
              onClick={() => onSelect(subject)}
              className={`h-[64px] px-4 text-left flex flex-col justify-center gap-1 border-l-4 transition-all duration-150 ${
                isActive 
                  ? 'bg-surface-2 border-primary-custom text-primary-custom' 
                  : 'bg-transparent border-transparent hover:bg-surface-2 text-text-2'
              }`}
            >
              <div className={`text-sm font-medium truncate ${isActive ? 'text-primary-custom' : 'text-text-1'}`}>
                {subject.name}
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="flex items-center gap-1 text-red-custom/80">🎬 {subject.videos.length}</span>
                <span className="text-text-3">·</span>
                <span className="flex items-center gap-1 text-green-custom/80">📄 {subject.pdfs.length}</span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
