import React from 'react';
import { useAppStore } from '../store';
import { HERO_WEAVER_IMAGE, HERITAGE_BANNER_IMAGE, LUNGI_IMAGES } from '../assets';
import SafeImage from '../components/SafeImage';
import { Heart, Sparkles, ShieldCheck, Award, ArrowRight, CheckCircle2, Users } from 'lucide-react';

const OurStoryPage: React.FC = () => {
  const { navigate, settings } = useAppStore(state => ({ 
    navigate: state.navigate, 
    settings: state.settings 
  }));

  const heroImg = settings?.ourStoryHeroImage || HERO_WEAVER_IMAGE;
  const storyImg = settings?.ourStoryStoryImage || HERO_WEAVER_IMAGE;
  const heritageImg = settings?.ourStoryHeritageImage || HERITAGE_BANNER_IMAGE;
  const galleryImgs = (settings?.ourStoryGalleryImages || []).filter((img: string) => img && img.trim() !== '');

  return (
    <main className="bg-[#FAF8F5] text-stone-900 min-h-screen pb-24 font-sans">
      
      {/* Hero Banner Section */}
      <section className="relative bg-stone-900 text-white pt-[165px] sm:pt-[175px] md:pt-[185px] lg:pt-[195px] pb-12 sm:pb-16 md:pb-20 px-4 sm:px-8 border-b border-stone-800 overflow-hidden">
        {heroImg && (
          <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none">
            <SafeImage src={heroImg} alt="Handloom Weaver" className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <span className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-amber-400 block">
            OUR HERITAGE & LEGACY
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-amber-50 leading-tight">
            সিরাজগঞ্জের বুননে আস্থার স্পর্শ
            <span className="block text-amber-300 font-serif text-xl sm:text-3xl lg:text-4xl mt-2 sm:mt-3 font-medium">
              — তাঁতরূপের গল্প —
            </span>
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed pt-2">
            বাঙালির শত বছরের ঐতিহ্যবাহী তাঁত শিল্প এবং সিরাজগঞ্জের নিপুণ কারিগরদের হাতের বুননকে আধুনিক জীবনযাত্রায় পৌঁছে দেওয়াই আমাদের অঙ্গীকার।
          </p>
        </div>
      </section>

      <div className="max-w-[1550px] mx-auto px-6 sm:px-12 lg:px-16 mt-12 space-y-16 sm:space-y-24">

        {/* Story Section 1: The Origin */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="md:col-span-6 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-900 block">
              THE WEAVING CITY OF SIRAJGANJ
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-snug">
              যেখানে সুতার সুক্ষ্ম টানে জন্ম নেয় বাঙালির পছন্দ
            </h2>
            <div className="w-12 h-0.5 bg-amber-800 mb-4" />
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              যমুনা নদীর কোল ঘেঁষে গড়ে ওঠা তাঁতের শহর সিরাজগঞ্জ — হাজারও তাঁতি পরিবারের বছরের পর বছর ধরে লালন করা মেধা ও সাধনার সূতিকাগার। তাঁতরূপ (TAATROOP) শুরু হয়েছিল একটি সহজ স্বপ্ন নিয়ে: আমাদের দেশে তৈরি খাঁটি সিরাজগঞ্জের সুতি তাঁত লুঙ্গির সুনাম সারা বিশ্বে ছড়িয়ে দেওয়া।
            </p>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              আজ বাজারে কৃত্রিম পলিয়েস্টার ও মেশিনে তৈরি হাজারো কাপড়ের ভীরে তাঁতরূপ বিশ্বাস রাখে ঐতিহ্যবাহী হস্তচালিত খটখটি তাঁতের খাঁটি গুনে। আমাদের প্রতিটি সুতা ১০০% পিওর সুতি।
            </p>
          </div>

          <div className="md:col-span-6">
            <div className="relative border-4 border-white shadow-xl rounded-lg overflow-hidden group">
              <SafeImage 
                src={storyImg} 
                alt="Sirajganj Weaver Craftsmanship" 
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent flex items-end p-6">
                <p className="text-white text-xs font-serif italic">
                  "তাঁতের খটখটি শব্দই আমাদের প্রাণ, আর নিখুঁত বুনন আমাদের অহংকার।"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Optional Dynamic Story Gallery Grid */}
        {galleryImgs.length > 0 && (
          <section className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-900 block">
                CRAFTSMANSHIP GALLERY
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                আমাদের তাঁত বুননের চিত্রশালা
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {galleryImgs.map((imgUrl: string, idx: number) => (
                <div key={idx} className="border-4 border-white shadow-md rounded-lg overflow-hidden aspect-[4/3] group">
                  <SafeImage 
                    src={imgUrl} 
                    alt={`Craftsmanship Gallery ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Core Values Grid */}
        <section className="bg-white p-8 sm:p-12 border border-stone-200 shadow-sm rounded-xl space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-900 block">
              OUR PROMISE
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              কেন তাঁতরূপের লুঙ্গি স্বতন্ত্র?
            </h3>
            <p className="text-xs text-stone-500">
              আমরা কোনো সাধারণ কাপড় তৈরি করি না; প্রতিটি পণ্যেই থাকে ভালোবাসা ও আস্থার বুনন
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-[#FAF8F5] border border-stone-200/80 rounded-lg space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                <Sparkles size={20} />
              </div>
              <h4 className="font-serif font-bold text-stone-900 text-sm">১০০% খাঁটি সুতি সুতা</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                উচ্চমানের কম্বড কটন সুতা ব্যবহারের ফলে কাপড় অত্যন্ত সফট, শ্বাসপ্রশ্বাসযোগ্য ও ত্বকের জন্য সম্পূর্ণ আরামদায়ক।
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F5] border border-stone-200/80 rounded-lg space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-serif font-bold text-stone-900 text-sm">ডাবল সুতার নিখুঁত বুনন</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                হ্যান্ডলুমের ডাবল সুতার ঘন বুনন কাপড়ের দীর্ঘ স্থায়িত্ব নিশ্চিত করে এবং বার বার ধোয়ার পরও নষ্ট হয় না।
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F5] border border-stone-200/80 rounded-lg space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                <Award size={20} />
              </div>
              <h4 className="font-serif font-bold text-stone-900 text-sm">পাকা ও স্থায়ী রং</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                উচ্চমানের ওয়াশ প্রসেসিং এবং স্থায়ী ডাই ব্যবহারের ফলে প্রথমবার ধোয়ার পরেও রঙের উজ্জ্বলতা অটুট থাকে।
              </p>
            </div>

            <div className="p-5 bg-[#FAF8F5] border border-stone-200/80 rounded-lg space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                <Users size={20} />
              </div>
              <h4 className="font-serif font-bold text-stone-900 text-sm">তাঁতি কারিগরদের পাশে</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                তাঁতরূপ থেকে ক্রয় করা প্রতিটি লুঙ্গির অংশ সরাসরি সিরাজগঞ্জের তাঁতি পরিবারগুলির জীবনমান উন্নয়নে ভূমিকা রাখে।
              </p>
            </div>
          </div>
        </section>

        {/* Story Section 2: Heritage Showcase */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-stone-900 text-white rounded-xl overflow-hidden shadow-xl">
          <div className="md:col-span-6 p-8 sm:p-12 space-y-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400 block">
              OUR MISSION & COMMUNITY
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold leading-tight text-amber-50">
              ঐতিহ্য বাঁচিয়ে রাখা ও নতুন দিগন্তের সূচনা
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              তাঁতরূপ শুধু একটি পোশাকের ব্র্যান্ড নয়; এটি গ্রামবাংলার আবহমান সংস্কৃতির একটি সেতু। আমরা চেষ্টা করছি ঐতিহ্যবাহী হস্তচালিত তাঁতের মান বজায় রেখে নতুন প্রজন্ম এবং প্রবাসীদের কাছেও খাঁটি দেশীয় পোশাকের আবেগ পৌঁছে দিতে।
            </p>
            <div className="pt-2">
              <button 
                onClick={() => navigate('/shop')}
                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-stone-950 px-6 py-3 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
              >
                <span>আমাদের কালেকশন গ্যালারি দেখুন</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="md:col-span-6 h-full min-h-[280px]">
            <SafeImage 
              src={heritageImg} 
              alt="Heritage Handloom Collection" 
              className="w-full h-full object-cover min-h-[280px]"
              loading="lazy"
            />
          </div>
        </section>

        {/* Call to action footer banner */}
        <section className="text-center bg-amber-50/80 border border-amber-200/90 p-8 sm:p-12 rounded-xl space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            আজই পরখ করুন খাঁটি সিরাজগঞ্জের ঐতিহ্য
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            সারা বাংলাদেশে ক্যাশ অন ডেলিভারিতে হোম ডেলিভারির সুবিধা। ডেলিভারির সময় পার্সেল খুলে চেক করে নেওয়ার গ্যারান্টি।
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/shop')}
              className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-3.5 rounded text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95"
            >
              এখনই লুঙ্গি অর্ডার করুন
            </button>
          </div>
        </section>

      </div>
    </main>
  );
};

export default OurStoryPage;
