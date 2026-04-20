'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-text-3 group-focus-within:text-primary-custom transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by course name or ID..."
          className="w-full h-[52px] bg-surface border border-border-custom rounded-xl pl-12 pr-12 text-text-1 placeholder:text-text-3 outline-none focus:border-primary-custom transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-4 flex items-center text-text-3 hover:text-text-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
