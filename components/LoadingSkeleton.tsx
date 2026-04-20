import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="border border-border-custom bg-surface rounded-xl overflow-hidden h-60 animate-pulse">
      <div className="h-28 w-full bg-surface-2"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-surface-2 rounded"></div>
        <div className="h-4 w-1/2 bg-surface-2 rounded"></div>
        <div className="mt-6 flex justify-between">
          <div className="h-3 w-1/4 bg-surface-2 rounded"></div>
          <div className="h-3 w-1/4 bg-surface-2 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="h-10 w-32 bg-surface-2 rounded-full animate-pulse"></div>
        <div className="h-10 w-32 bg-surface-2 rounded-full animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 w-full bg-surface-2 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="hidden lg:block space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 w-full bg-surface-2 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SubjectSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-14 w-full bg-surface-2 rounded-xl animate-pulse"></div>
      ))}
    </div>
  );
}
