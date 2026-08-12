
import React from 'react';

const PageSkeleton: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-stone-900 font-sans">
      <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in text-center">
        {/* Animated Brand Logo Icon */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-[#23412F]/20 border-t-[#23412F] animate-spin" />
          <div className="w-14 h-14 rounded-full bg-[#23412F]/10 flex items-center justify-center shadow-inner">
            <span className="font-serif text-xl font-bold text-[#23412F] tracking-tight">
              তাঁ
            </span>
          </div>
        </div>

        {/* Full Brand Name Logo */}
        <div className="space-y-1">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 animate-pulse">
            তাঁতরূপ <span className="text-xs font-sans text-amber-800 font-semibold tracking-widest block uppercase mt-0.5">Taatroop</span>
          </h2>
          <p className="text-xs text-stone-500 font-medium">পেজটি লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;

