'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PDFViewer from '@/components/PDFViewer';
import Navbar from '@/components/Navbar';
import { ChevronLeft } from 'lucide-react';

function ViewerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url');
  const title = searchParams.get('title') || 'Study Material';

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500">
        <p className="mb-4">No document selected for viewing.</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 bg-pink-600 text-white rounded-lg font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-black">
      {/* Return Header */}
      <div className="max-w-7xl mx-auto w-full px-4 py-4 border-b border-white/5">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group text-xs font-bold uppercase tracking-[0.2em]"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-all" />
          Back to Batch Content
        </button>
      </div>

      {/* PDF Section - Playing at the top */}
      <div className="w-full flex-grow bg-black flex flex-col px-4 py-8">
        <div className="max-w-7xl mx-auto w-full h-[85vh]">
           <PDFViewer url={url} title={title} />
        </div>
      </div>

      {/* Bottom Section - Empty/Blank as requested */}
      <div className="h-40 bg-black"></div>
    </div>
  );
}

export default function PDFViewerPage() {
  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div></div>}>
        <ViewerContent />
      </Suspense>
    </main>
  );
}
