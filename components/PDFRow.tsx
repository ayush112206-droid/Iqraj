'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentItem, getPdfUrl, getItemName } from '@/lib/studyiq';
import { FileText, ChevronDown } from 'lucide-react';

interface PDFRowProps {
  pdf: ContentItem;
  index: number;
}

export default function PDFRow({ pdf, index }: PDFRowProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const url = getPdfUrl(pdf);
  const name = getItemName(pdf);
  const serialNo = String(index + 1).padStart(2, '0');

  const handleOpenViewer = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/viewer/pdf?url=${encodeURIComponent(url)}&title=${encodeURIComponent(name)}`);
  };

  return (
    <div className="border border-border-custom rounded-lg overflow-hidden bg-surface hover:bg-surface-2 transition-all duration-150">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full h-fit py-3 px-3 flex items-center gap-3 text-left group"
      >
        <div className="w-8 h-8 rounded-full bg-green-custom/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-custom/20 transition-colors">
          <FileText className="w-4 h-4 text-green-custom" />
        </div>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="font-mono text-xs text-text-3 w-[20px]">{serialNo}</span>
          <span className="text-sm font-medium text-text-1 clamp-1 md:clamp-1 lg:clamp-1">
            <span className="md:hidden line-clamp-2">{name}</span>
            <span className="hidden md:block truncate">{name}</span>
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-text-3 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <div className={`transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-[100px] border-t border-border-custom' : 'max-h-0'} overflow-hidden`}>
        <div className="p-4 bg-black/20 flex items-center justify-center">
          <button
            onClick={handleOpenViewer}
            className="h-10 px-8 flex items-center justify-center gap-2 bg-pink-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-600/20 active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Read Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
