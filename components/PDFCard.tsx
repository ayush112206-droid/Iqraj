'use client';

import React, { useState } from 'react';
import { ContentItem } from '@/types';
import { FileText, Copy, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PDFCardProps {
  pdf: ContentItem;
  index: number;
}

export default function PDFCard({ pdf, index }: PDFCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const title = pdf.name || pdf.title || `Resource ${index + 1}`;
  const url = pdf.textUploadUrl || pdf.pdfUrl || '';
  const serialNo = String(index + 1).padStart(2, '0');

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <div 
      className={`border border-border-custom rounded-xl overflow-hidden transition-all duration-200 bg-[#111827] hover:bg-[#1F2937] ${isExpanded ? 'ring-1 ring-primary-custom/30' : ''}`}
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-4 p-4 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-lg bg-pdf-accent/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-pdf-accent" />
        </div>
        
        <div className="flex-grow flex items-center justify-between min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-text-muted text-sm">{serialNo}</span>
            <h4 className="text-text-primary font-medium truncate pr-2">
              {title}
            </h4>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-border-custom text-xs font-semibold text-text-secondary hover:text-white hover:border-text-secondary transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </button>
            {isExpanded ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-divider"
          >
            <div className="p-4 bg-black/20 space-y-3">
              <div className="flex items-center justify-between gap-4 bg-surface border border-border-custom p-3 rounded-lg">
                <code className="text-xs font-mono text-primary-custom break-all line-clamp-1 flex-grow">
                  {url || 'URL not available'}
                </code>
                {url && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button 
                      onClick={handleCopy}
                      className="p-2 hover:bg-surface-2 rounded-md transition-colors relative"
                    >
                      <Copy className="w-4 h-4 text-text-secondary" />
                      {copied && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-success text-white text-[10px] px-1.5 py-0.5 rounded animate-in fade-in zoom-in duration-200">
                          Copied!
                        </span>
                      )}
                    </button>
                    <button 
                      onClick={handleOpen}
                      className="p-2 hover:bg-surface-2 rounded-md transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-text-secondary" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
