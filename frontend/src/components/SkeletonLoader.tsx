import React from 'react';
import Skeleton from './ui/Skeleton';

const SkeletonLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Skeleton for Navigation */}
        <div className="flex items-center justify-between h-16 lg:h-20 mb-8">
          <Skeleton className="h-10 w-20" />
          <div className="hidden md:flex items-center space-x-8">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>

        {/* Skeleton for Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-8 w-1/2 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-8" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
          <div className="hidden md:block">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>

        {/* Skeleton for a content section */}
        <div className="mt-16">
            <Skeleton className="h-8 w-1/3 mx-auto mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>

      </div>
    </div>
  );
};

export default SkeletonLoader;
