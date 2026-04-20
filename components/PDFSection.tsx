'use client';

import React from 'react';
import { ContentItem } from '@/types';
import PDFRow from './PDFRow';

interface PDFSectionProps {
  pdfs: ContentItem[];
}

export default function PDFSection({ pdfs }: PDFSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold text-text-1">📄 PDF Notes</h3>
        <span className="px-2 py-0.5 bg-green-custom/10 text-green-custom text-[11px] font-bold rounded-full border border-green-custom/20">
          {pdfs.length}
        </span>
      </div>
      
      {pdfs.length === 0 ? (
        <div className="py-8 text-center text-text-3 text-sm bg-surface/30 rounded-xl border border-dashed border-border-custom px-4">
          No PDF notes in this subject
        </div>
      ) : (
        <div className="space-y-2">
          {pdfs.map((pdf, index) => (
            <PDFRow key={pdf.contentId || index} pdf={pdf} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
