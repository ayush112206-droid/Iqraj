'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import Navbar from '@/components/Navbar';
import { ChevronLeft, Download, X, Film, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

function DownloadSection({ url, title }: { url: string, title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [qualities, setQualities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQualities = async () => {
    setIsOpen(true);
    if (qualities.length > 0) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/qualities?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.success && data.qualities) {
        setQualities(data.qualities);
      }
    } catch (e) {
      console.error('Failed to fetch qualities', e);
    } finally {
      setLoading(false);
    }
  };

  const formatBitrate = (bw: number) => {
    if (!bw) return "Auto";
    return (bw / 1000000).toFixed(1) + ' Mbps';
  };

  const formatSize = (mb?: number) => {
    if (!mb) return "";
    if (mb > 1024) return (mb / 1024).toFixed(1) + ' GB';
    return mb.toFixed(1) + ' MB';
  };

  return (
    <>
      <div className="flex-grow bg-[#050505] shadow-[inset_0_20px_40px_rgba(0,0,0,0.8)] border-t border-white/5 pt-16 pb-20">

        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
           <div className="flex flex-col items-center justify-center p-8 border border-white/10 rounded-3xl bg-zinc-900/50 max-w-sm w-full mx-auto shadow-2xl backdrop-blur-sm transition-transform hover:scale-[1.02]">
              <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,45,85,0.1)] border border-pink-500/20">
                <Download className="w-7 h-7 text-pink-500" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Offline Viewing</h3>
              <p className="text-zinc-500 text-xs mb-8 px-2 text-center leading-relaxed">Download the full video module as a high-quality multimedia file. Compatible with all native media players like VLC.</p>
              
              <button 
                onClick={fetchQualities}
                className="w-full flex items-center justify-center gap-3 py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all focus:ring-4 focus:ring-pink-600/30 active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                Select Download Quality
              </button>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10 bg-zinc-800/50">
                <div className="flex items-center gap-3">
                  <Film className="w-5 h-5 text-pink-500" />
                  <h3 className="text-white font-bold tracking-tight">Download Video</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-zinc-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-pink-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Analyzing Stream...</span>
                  </div>
                ) : qualities.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 text-sm">
                    No qualities found. Try downloading directly.
                    <a 
                      href={`/api/proxy/download?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
                      className="mt-4 block w-full py-3 bg-pink-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px]"
                    >
                      Download Default Quality
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {qualities.map((q, i) => (
                      <a
                        key={i}
                        href={`/api/proxy/download?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&bandwidth=${q.bandwidth}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-800 transition-colors group"
                      >
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-lg leading-none mb-1 group-hover:text-pink-500 transition-colors">
                            {q.height ? `${q.height}p` : q.resolution}
                          </span>
                          <span className="text-zinc-500 text-[10px] font-mono tracking-wider">
                            {q.estimatedSizeMB ? formatSize(q.estimatedSizeMB) : 'High Definition File'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-zinc-400 text-xs font-mono">{formatBitrate(q.bandwidth)}</span>
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-pink-600 transition-colors">
                            <Download className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function PlayerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url');
  const title = searchParams.get('title') || 'Educational Video';

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500">
        <p className="mb-4">No video selected for playback.</p>
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

      {/* Video Section - Playing at the top */}
      <div className="w-full bg-black flex items-center justify-center">
        <div className="w-full max-w-7xl px-0 md:px-4 py-0 md:py-8">
           <VideoPlayer url={url} title={title} />
        </div>
      </div>

      {/* Bottom Section - Download Panel */}
      <DownloadSection url={url} title={title} />
    </div>
  );
}

export default function VideoViewerPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black"><div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div></div>}>
        <PlayerContent />
      </Suspense>
    </main>
  );
}
