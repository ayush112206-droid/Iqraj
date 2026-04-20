'use client';

import React from 'react';

export default function BatchCardSkeleton() {
  return (
    <div className="h-[160px] md:h-[148px] bg-surface border border-border-custom rounded-custom overflow-hidden animate-pulse">
      <div className="h-[56px] bg-surface-2"></div>
      <div className="h-[92px] p-[14px] flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-surface-2 rounded w-full"></div>
          <div className="h-4 bg-surface-2 rounded w-2/3"></div>
        </div>
        <div className="h-3 bg-surface-2 rounded w-1/3"></div>
      </div>
    </div>
  );
}
