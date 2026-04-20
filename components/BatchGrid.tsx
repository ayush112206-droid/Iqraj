'use client';

import React, { useMemo } from 'react';
import { Batch } from '@/types';
import BatchCard from './BatchCard';
import { Search } from 'lucide-react';

interface BatchGridProps {
  batches: Batch[];
  searchQuery: string;
}

export default function BatchGrid({ batches, searchQuery }: BatchGridProps) {
  const filteredBatches = useMemo(() => {
    if (!searchQuery.trim()) return batches;
    const query = searchQuery.toLowerCase();
    return batches.filter(
      (b) => 
        b.title.toLowerCase().includes(query) || 
        String(b.id).includes(query)
    );
  }, [batches, searchQuery]);

  if (filteredBatches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-3">
        <Search className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-lg">No results found for &quot;{searchQuery}&quot;</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 pb-12">
      {filteredBatches.map((batch) => (
        <BatchCard key={batch.id} batch={batch} />
      ))}
    </div>
  );
}
