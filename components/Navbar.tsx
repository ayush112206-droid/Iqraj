'use client';

import React from 'react';
import Link from 'next/link';
import { User, Menu, MessageCircle } from 'lucide-react';
import { WHATSAPP_CHANNEL_URL } from '@/lib/studyiq';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-[60px] bg-bg/95 backdrop-blur-md border-b border-border-custom px-4 md:px-8">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-surface border border-border-custom hover:bg-surface-2 transition-colors">
            <User className="w-5 h-5 text-text-3" />
          </button>
          <Link href="/" className="text-xl font-bold text-text-1">VIP Study</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <a href={WHATSAPP_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="p-2 text-green-500 hover:bg-green-500/10 rounded-full transition-colors">
            <MessageCircle className="w-5 h-5" />
          </a>
          <button className="p-2 rounded-full bg-surface border border-border-custom hover:bg-surface-2 transition-colors">
            <Menu className="w-5 h-5 text-text-3" />
          </button>
        </div>
      </div>
    </nav>
  );
}
