'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BatchGrid from '@/components/BatchGrid';
import BatchCardSkeleton from '@/components/BatchCardSkeleton';
import { Batch } from '@/types';
import SplashScreen from '@/components/SplashScreen';
import WhatsAppModal from '@/components/WhatsAppModal';

export default function HomePage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  useEffect(() => {
    async function loadBatches() {
      try {
        const res = await fetch('/api/batches');
        const json = await res.json();
        setBatches(json.data || []);
      } catch (err) {
        console.error('Failed to load home batches:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBatches();
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => { setShowSplash(false); setShowWhatsApp(true); }} />;
  }

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      
      {showWhatsApp && (
        <WhatsAppModal 
          onClose={() => setShowWhatsApp(false)} 
          showIcon={true}
        />
      )}

      <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
        {/* HERO */}
        <section className="text-center space-y-2 max-h-[160px] flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-text-1">
            Study IQ — Free Access
          </h1>
          <p className="text-sm text-text-2 max-w-xl mx-auto">
            Browse all batches. Click any to see subjects, videos & PDFs.
          </p>
        </section>

        {/* STATS ROW */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
          <div className="flex-shrink-0 px-4 py-2 rounded-full border border-gold-custom/30 bg-gold-custom/5 text-xs font-bold text-gold-custom">
            📦 {batches.length.toLocaleString()} Batches
          </div>
          <div className="flex-shrink-0 px-4 py-2 rounded-full border border-border-custom bg-surface text-xs font-semibold text-text-2">
            🎬 Video Lectures
          </div>
          <div className="flex-shrink-0 px-4 py-2 rounded-full border border-border-custom bg-surface text-xs font-semibold text-text-2">
            📄 PDF Notes
          </div>
          <div className="flex-shrink-0 px-4 py-2 rounded-full border border-border-custom bg-surface text-xs font-semibold text-text-2">
            🆓 No Login Required
          </div>
        </div>

        {/* BATCH GRID */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <BatchCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <BatchGrid batches={batches} searchQuery={searchQuery} />
          )}
        </section>
      </div>

      <footer className="h-12 border-t border-border-custom mt-12 flex items-center justify-center">
        <p className="text-xs text-text-3 font-medium">
          © 2025 StudyIQ Platform — Free Educational Resource
        </p>
      </footer>
    </main>
  );
}
