'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, LayoutGrid } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SubjectBox from '@/components/SubjectBox';
import ContentPanel from '@/components/ContentPanel';
import { Subject, parseSubjects } from '@/lib/studyiq';

export default function BatchDetailPage() {
  const params = useParams();
  const batchId = params.batchId as string;
  
  const [items, setItems] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        const res = await fetch(`/api/course/${batchId}`);
        const json = await res.json();
        if (json.success) {
          setItems(json.items);
          setCourseTitle(json.courseTitle);
        }
      } catch (err) {
        console.error('Failed to load course content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [batchId]);

  const subjects = useMemo(() => parseSubjects(items), [items]);

  const totalVideos = items.filter((i: any) => i.videoUrl || i.video_url).length;
  const totalPdfs = items.filter((i: any) => i.textUploadUrl || i.pdfUrl).length;

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <Navbar />

      {/* TOP BAR */}
      <header className="w-full bg-bg border-b border-border-custom px-4 py-4 md:py-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-1 text-text-3 hover:text-text-1 transition-colors text-sm font-bold uppercase tracking-widest"
            >
              <ChevronLeft className="w-4 h-4" />
              Batches
            </Link>
            <div className="h-4 w-px bg-border-custom hidden sm:block"></div>
            
            {selectedSubject ? (
              <button 
                onClick={() => setSelectedSubject(null)}
                className="flex items-center gap-2 text-text-1 font-bold truncate group"
              >
                <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                   <span className="truncate max-w-[150px] md:max-w-none">{courseTitle || `Batch ID: ${batchId}`}</span>
                   <span className="text-text-3">/</span>
                </div>
                <span className="text-primary-custom underline underline-offset-4 decoration-2">{selectedSubject.name}</span>
              </button>
            ) : (
              <h1 className="text-lg font-bold text-text-1 truncate flex-1 min-w-[200px]">
                {loading ? 'Loading course...' : (courseTitle || `Batch ID: ${batchId}`)}
              </h1>
            )}

            <div className="px-2 py-0.5 bg-surface border border-border-custom rounded-full text-[10px] font-bold text-text-3">
              ID: {batchId}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="px-3 py-1 rounded-full bg-red-custom/10 border border-red-custom/20 text-xs font-bold text-red-custom flex items-center gap-2">
              🎬 {totalVideos} Videos
            </div>
            <div className="px-3 py-1 rounded-full bg-green-custom/10 border border-green-custom/20 text-xs font-bold text-green-custom flex items-center gap-2">
              📄 {totalPdfs} PDFs
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
               <div className="w-10 h-10 border-2 border-primary-custom border-t-transparent rounded-full animate-spin"></div>
               <span className="text-[10px] font-black text-text-3 uppercase tracking-[0.2em] animate-pulse">Syncing Library...</span>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {selectedSubject ? (
              <ContentPanel subject={selectedSubject} />
            ) : (
              <div className="p-6 md:p-12 space-y-10">
                <div className="flex items-center justify-between border-b border-border-custom pb-6">
                   <div>
                      <h2 className="text-2xl font-bold text-text-1">Course Directory</h2>
                      <p className="text-text-3 text-sm font-medium mt-1">Select a subject folder to view its contents.</p>
                   </div>
                   <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface border border-border-custom rounded-xl text-[10px] font-black text-text-3 uppercase tracking-widest">
                      <LayoutGrid className="w-4 h-4" /> List View
                   </div>
                </div>

                <div className="flex flex-col gap-3 max-w-3xl">
                  {subjects.map((subject, idx) => (
                    <SubjectBox 
                      key={idx} 
                      subject={subject} 
                      onClick={() => setSelectedSubject(subject)} 
                    />
                  ))}
                </div>

                {subjects.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-text-3 font-medium">No subjects found in this batch.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="h-12 border-t border-border-custom mt-auto flex items-center justify-center">
        <p className="text-xs text-text-3 font-medium">
          © 2025 StudyIQ Platform — Free Educational Resource
        </p>
      </footer>
    </main>
  );
}
