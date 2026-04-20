'use client';

import React, { useState } from 'react';
import { Download, ExternalLink, FileText, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  title: string;
}

export default function PDFViewer({ url, title }: PDFViewerProps) {
  const [loading, setLoading] = useState(true);

  // Using the proxy method from server.ts
  const proxiedUrl = `/api/proxy/pdf?url=${encodeURIComponent(url)}`;

  return (
    <div className="w-full h-full flex flex-col bg-zinc-800 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header (Inspired by the provided viewer) */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-zinc-900/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
            <FileText className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-tight line-clamp-1">{title}</h1>
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <span>Secure Proxy active</span>
              <span>•</span>
              <span>Referer Header Enforced</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.open(proxiedUrl, '_blank')}
            className="p-2.5 rounded-xl bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white hover:border-pink-500 transition-all"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <a
            href={proxiedUrl}
            download
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-pink-700 shadow-lg shadow-pink-600/20 transition-all"
          >
             <Download className="w-4 h-4" />
             Download
          </a>
        </div>
      </div>

      {/* Viewer Area */}
      <div className="relative flex-grow bg-zinc-700">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-zinc-800">
             <RefreshCw className="w-10 h-10 text-pink-500 animate-spin mb-4" />
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Rendering secure document...</span>
          </div>
        )}
        
        {/* Using the standard iframe approach but with the proxy URL that injects headers */}
        <iframe
          src={`${proxiedUrl}#toolbar=1`}
          className="w-full h-full border-none"
          onLoad={() => setLoading(false)}
          title={title}
        />
      </div>

      {/* Footer Branding from server.ts vibe */}
      <div className="px-6 py-2 border-t border-white/10 bg-zinc-900/50 flex items-center justify-center">
         <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">
            Mr. Kagra x RWA Secure Vault
         </div>
      </div>
    </div>
  );
}
