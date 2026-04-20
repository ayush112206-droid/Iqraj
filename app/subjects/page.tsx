'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { Subject, Batch } from '@/types';
import { fetchCourseContent } from '@/lib/studyiq';
import { ChevronRight, Search, BookOpen, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

export default function AllSubjectsPage() {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<{subject: Subject, batch: Batch}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Helper inside component to avoid hoist issues
  const parseSubjectsFromItems = (items: any[]): Subject[] => {
    const subjectNames: string[] = [];
    const seen = new Set<string>();
    for (const item of items) {
      const subj = item.parentTitle || item.subject || "General";
      if (!subj) continue;
      if (!seen.has(subj)) {
        seen.add(subj);
        subjectNames.push(subj);
      }
    }
    return subjectNames.map(name => {
      const subjectItems = items.filter(i => (i.parentTitle || i.subject || "General") === name);
      return {
        name,
        videos: subjectItems.filter(i => i.videoUrl || i.video_url),
        pdfs:   subjectItems.filter(i => i.textUploadUrl || i.pdfUrl),
      };
    }).filter(s => s.videos.length > 0 || s.pdfs.length > 0);
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const batchesRes = await fetch('/api/batches');
        const batchesJson = await batchesRes.json();
        const topBatches: Batch[] = (batchesJson.data || []).slice(0, 10);

        const allSubjects: {subject: Subject, batch: Batch}[] = [];
        
        await Promise.all(topBatches.map(async (batch) => {
          try {
            const content = await fetchCourseContent(String(batch.id));
            const parsed = parseSubjectsFromItems(content.items);
            parsed.forEach(s => {
              allSubjects.push({ subject: s, batch });
            });
          } catch (e) {
            console.error(`Failed to fetch subjects for batch ${batch.id}`);
          }
        }));

        setSubjects(allSubjects);
      } catch (err) {
        console.error("Failed to load subjects", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects;
    const q = searchQuery.toLowerCase();
    return subjects.filter(s => 
      s.subject.name.toLowerCase().includes(q) || 
      s.batch.title.toLowerCase().includes(q)
    );
  }, [subjects, searchQuery]);

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-16 space-y-6">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-custom px-3 py-1 bg-primary-custom/10 border border-primary-custom/20 rounded-full">Explorer</span>
             <div className="h-px w-20 bg-border-custom"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9]">
            Discovery <br /> <span className="text-text-3">Library.</span>
          </h1>
          <p className="text-text-2 text-lg max-w-xl font-medium">
            Browse through all subjects from our premium batches. Start your journey by selecting a topic below.
          </p>
        </div>

        <div className="relative mb-12 group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-text-3 group-focus-within:text-primary-custom transition-all" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic or subject name..."
            className="w-full h-16 bg-surface border border-border-custom rounded-2xl pl-16 pr-6 text-xl font-bold text-white placeholder:text-text-3 outline-none focus:border-primary-custom/50 transition-all"
          />
          <div className="absolute top-1/2 -translate-y-1/2 right-4 h-8 px-3 rounded-lg border border-border-custom bg-bg flex items-center gap-2 text-[10px] font-bold text-text-3 uppercase tracking-widest hidden md:flex">
             <Clock className="w-3 h-3" /> Real-time Index
          </div>
        </div>

        <div className="flex flex-col gap-3 max-w-4xl">
          {loading ? (
             Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-16 bg-surface-2 animate-pulse rounded-xl border border-border-custom" />
             ))
          ) : (
            filteredSubjects.map((item, idx) => (
              <motion.button
                key={`${item.batch.id}-${idx}`}
                whileHover={{ scale: 1.01 }}
                onClick={() => router.push(`/batch/${item.batch.id}/${encodeURIComponent(item.subject.name)}`)}
                className="group relative flex items-center bg-surface border border-border-custom rounded-xl p-3 text-left transition-all duration-300 hover:border-yellow-500/50 hover:bg-surface-2 hover:shadow-lg active:scale-[0.98] gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-all flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-yellow-500 fill-yellow-500/10" />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-text-1 truncate group-hover:text-yellow-500 transition-colors">
                      {item.subject.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold text-text-3 uppercase tracking-wider">
                      <span>{item.subject.videos.length} Videos</span>
                      <span className="w-1 h-1 rounded-full bg-border-custom"></span>
                      <span>{item.subject.pdfs.length} PDFs</span>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center px-3 py-1.5 bg-bg border border-border-custom rounded-md shrink-0">
                    <span className="text-[9px] font-black text-text-3 uppercase tracking-widest mr-2">Batch:</span>
                    <span className="text-[10px] font-bold text-white max-w-[150px] truncate">{item.batch.title}</span>
                  </div>
                </div>
                
                <ChevronRight className="w-4 h-4 text-text-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </motion.button>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
