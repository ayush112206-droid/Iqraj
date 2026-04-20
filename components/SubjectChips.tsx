'use client';

import React from 'react';
import { Subject } from '@/types';

interface SubjectChipsProps {
  subjects: Subject[];
  selectedSubject: Subject | null;
  onSelect: (subject: Subject) => void;
}

export default function SubjectChips({ subjects, selectedSubject, onSelect }: SubjectChipsProps) {
  return (
    <div className="md:hidden flex items-center gap-2 p-4 overflow-x-auto scrollbar-hide border-b border-border-custom bg-bg">
      {subjects.map((subject, index) => {
        const isActive = selectedSubject?.name === subject.name;
        const truncatedName = subject.name.length > 20 ? subject.name.substring(0, 20) + '...' : subject.name;
        return (
          <button
            key={index}
            onClick={() => onSelect(subject)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-150 ${
              isActive 
                ? 'bg-primary-custom border-primary-custom text-white' 
                : 'bg-surface border-border-custom text-text-2'
            }`}
          >
            {truncatedName}
          </button>
        );
      })}
    </div>
  );
}
