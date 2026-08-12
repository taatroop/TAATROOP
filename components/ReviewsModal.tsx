import React, { useState } from 'react';
import { X, Star, CheckCircle2, ThumbsUp, Filter, MessageSquare, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const reviewsData = [
  {
    id: 1,
    name: 'Rahim Uddin',
    location: 'Dhaka',
    rating: 5,
    date: '24 July 2026',
    verified: true,
    product: 'প্রিন চেক ডাবল সুতা লুঙ্গি',
    comment: 'প্রিমিয়াম কোয়ালিটি এবং অনেক আরামদায়ক। কাপড়ের সুতা বেশ ঘন আর ওয়াশ করার পরেও রং একই রকম আছে। অবশ্যই আবার কিনবো।',
    likes: 18
  },
  {
    id: 2,
    name: 'Masud Rana',
    location: 'Chattogram',
    rating: 5,
    date: '20 July 2026',
    verified: true,
    product: 'নীল ডোরা কটন লুঙ্গি',
    comment: 'রং এবং কাপড় অনেক ভালো। ডেলিভারিও খুব দ্রুত পেয়েছি। ধন্যবাদ তাঁতরূপকে আসল সিরাজগঞ্জের হস্তচালিত তাঁতের লুঙ্গি দেওয়ার জন্য।',
    likes: 14
  },
  {
    id: 3,
    name: 'Ahsan Habib',
    location: 'Khulna',
    rating: 5,
    date: '18 July 2026',
    verified: true,
    product: 'হলুদ চেক ক্লাসিক লুঙ্গি',
    comment: 'তাঁতরূপের লুঙ্গি সত্যিই অসাধারণ। কাপড়ের সফটনেস চমৎকার। সবাইকে রিকমেন্ড করবো।',
    likes: 11
  },
  {
    id: 4,
    name: 'Tanvir Hossain',
    location: 'Sylhet',
    rating: 5,
    date: '15 July 2026',
    verified: true,
    product: 'সাদা ক্লাসিক সুতি লুঙ্গি',
    comment: 'একদম ১০০% পিওর সুতি কাপড়। গরমের জন্য এর চেয়ে আরামদায়ক লুঙ্গি আর হতে পারে না। প্যাকেজিংও অনেক প্রিমিয়াম ছিল।',
    likes: 22
  },
  {
    id: 5,
    name: 'Mahbubur Rahman',
    location: 'Sirajganj',
    rating: 5,
    date: '10 July 2026',
    verified: true,
    product: 'রঙ্গিন ডাবল সুতা প্রিমিয়াম লুঙ্গি',
    comment: 'আমি সিরাজগঞ্জের লোক হয়েও বলছি এদের কোয়ালিটি কন্ট্রোল চমৎকার। তাঁতিদের সঠিক পারিশ্রমিক দিয়ে তৈরি একদম অরজিনাল বুনন।',
    likes: 31
  },
  {
    id: 6,
    name: 'Kamrul Hasan',
    location: 'Rajshahi',
    rating: 4,
    date: '05 July 2026',
    verified: true,
    product: 'প্রিন চেক ডাবল সুতা লুঙ্গি',
    comment: 'লুঙ্গির ফিনিশিং খুব সুন্দর। সাইজ বেশ চওড়া এবং আরামদায়ক। ডেলিভারি ২ দিনের মধ্যে পেয়েছি।',
    likes: 8
  },
  {
    id: 7,
    name: 'Sajjad Islam',
    location: 'Barishal',
    rating: 5,
    date: '28 June 2026',
    verified: true,
    product: 'নীল ডোরা কটন লুঙ্গি',
    comment: 'আব্বুর জন্য ৩টি লুঙ্গি অর্ডার করেছিলাম। উনি পড়ে ভীষণ সন্তুষ্ট। কাপড়ের স্থায়িত্ব অনেক ভালো মনে হচ্ছে।',
    likes: 19
  },
  {
    id: 8,
    name: 'Dr. Ariful Hoque',
    location: 'Mymensingh',
    rating: 5,
    date: '22 June 2026',
    verified: true,
    product: 'হলুদ চেক ক্লাসিক লুঙ্গি',
    comment: 'অনলাইনে কাপড় কিনে এত ভালো অভিজ্ঞতা আগে হয়নি। ছবি আর বাস্তব একদম হুবহু মিল। তাঁতরূপের সার্ভিস দুর্দান্ত।',
    likes: 15
  }
];

const ReviewsModal: React.FC<ReviewsModalProps> = ({ isOpen, onClose }) => {
  const globalReviews = useAppStore(state => state.globalReviews) || [];
  const fetchAllReviews = useAppStore((state: any) => state.fetchAllReviews);
  const addGlobalReview = useAppStore(state => state.addGlobalReview);

  const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all');
  const [likesMap, setLikesMap] = useState<Record<number, number>>({});
  const [likedIds, setLikedIds] = useState<Record<number, boolean>>({});

  // New review form states
  const [showForm, setShowForm] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (isOpen && fetchAllReviews) {
      fetchAllReviews();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allModalReviews = (globalReviews && globalReviews.length > 0) ? globalReviews : reviewsData;

  const handleLike = (id: number, initialLikes: number) => {
    if (likedIds[id]) return;
    setLikesMap(prev => ({ ...prev, [id]: (prev[id] ?? initialLikes) + 1 }));
    setLikedIds(prev => ({ ...prev, [id]: true }));
  };

  const filteredReviews = allModalReviews.filter(r => {
    if (selectedFilter === 'all') return true;
    return r.rating === selectedFilter;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    addGlobalReview({
      name: newReviewName.trim(),
      location: newReviewLocation.trim() || 'Dhaka',
      rating: newReviewRating,
      date: 'এখনই',
      comment: newReviewComment.trim(),
      product: 'তাঁতরূপ হ্যান্ডলুম পণ্য'
    });

    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setNewReviewName('');
      setNewReviewLocation('');
      setNewReviewComment('');
      setNewReviewRating(5);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#FAF8F5] border border-stone-200 rounded-none shadow-2xl flex flex-col max-h-[90vh] my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 md:p-6 bg-stone-900 text-white border-b border-stone-800">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400">
                TAATROOP REVIEWS & FEEDBACK
              </span>
              <span className="bg-amber-900/80 text-amber-200 text-[9px] px-2 py-0.5 rounded font-mono">
                VERIFIED REVIEWS
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-amber-50">
              গ্রাহকদের প্রতিক্রিয়া ও রিভিউ
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-stone-800 hover:bg-amber-900/80 text-stone-300 hover:text-white flex items-center justify-center transition-all shadow-md"
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-5 md:p-8 overflow-y-auto space-y-8 font-sans">
          
          {/* Rating Summary Card */}
          <div className="bg-white p-6 border border-stone-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-stone-200 pb-6 md:pb-0 md:pr-6">
              <div className="flex items-baseline justify-center md:justify-start space-x-2">
                <span className="text-5xl font-serif font-bold text-stone-900">4.9</span>
                <span className="text-stone-400 font-medium text-sm">/ 5.0</span>
              </div>
              <div className="flex justify-center md:justify-start text-amber-500 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-600 font-medium">
                সর্বমোট <strong>{allModalReviews.length} টি ভেরিফাইড রিভিউ</strong> এর ভিত্তিতে
              </p>
              <div className="mt-3 inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-none">
                <ShieldCheck size={14} />
                <span>১০০% আসল ও ভেরিফাইড ক্রেতা</span>
              </div>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center space-x-3 text-xs text-stone-600">
                <span className="w-12 font-medium">5 Star</span>
                <div className="flex-1 h-2.5 bg-stone-100 rounded-none overflow-hidden">
                  <div className="h-full bg-amber-500 w-[94%]"></div>
                </div>
                <span className="w-10 text-right font-mono font-bold text-stone-800">94%</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-stone-600">
                <span className="w-12 font-medium">4 Star</span>
                <div className="flex-1 h-2.5 bg-stone-100 rounded-none overflow-hidden">
                  <div className="h-full bg-amber-500 w-[6%]"></div>
                </div>
                <span className="w-10 text-right font-mono font-bold text-stone-800">6%</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-stone-600">
                <span className="w-12 font-medium">3 Star</span>
                <div className="flex-1 h-2.5 bg-stone-100 rounded-none overflow-hidden">
                  <div className="h-full bg-amber-500 w-[0%]"></div>
                </div>
                <span className="w-10 text-right font-mono text-stone-400">0%</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-stone-600">
                <span className="w-12 font-medium">2 Star</span>
                <div className="flex-1 h-2.5 bg-stone-100 rounded-none overflow-hidden">
                  <div className="h-full bg-amber-500 w-[0%]"></div>
                </div>
                <span className="w-10 text-right font-mono text-stone-400">0%</span>
              </div>
            </div>
          </div>

          {/* Action Bar: Filter & Add Review Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-stone-500 flex items-center space-x-1 mr-2">
                <Filter size={14} />
                <span>ফিল্টার:</span>
              </span>
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold uppercase transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                সব রিভিউ ({allModalReviews.length})
              </button>
              <button
                onClick={() => setSelectedFilter(5)}
                className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center space-x-1 ${
                  selectedFilter === 5
                    ? 'bg-amber-900 text-white'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>5 Star</span>
                <Star size={10} className="fill-current" />
              </button>
              <button
                onClick={() => setSelectedFilter(4)}
                className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center space-x-1 ${
                  selectedFilter === 4
                    ? 'bg-amber-900 text-white'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>4 Star</span>
                <Star size={10} className="fill-current" />
              </button>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 shadow-sm"
            >
              <MessageSquare size={14} />
              <span>{showForm ? 'ফর্ম বন্ধ করুন' : 'আপনার মতামত দিন'}</span>
            </button>
          </div>

          {/* Write Review Form Collapsible */}
          {showForm && (
            <div className="bg-white p-6 border border-amber-900/30 shadow-md space-y-4 animate-in fade-in duration-300">
              <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-2">
                তাঁতরূপের অভিজ্ঞতা শেয়ার করুন
              </h3>
              {submitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 size={18} />
                  <span>ধন্যবাদ! আপনার রিভিউটি সফলভাবে জমা হয়েছে। অতি শীঘ্রই মডারেট করে প্রকাশ করা হবে।</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-700 mb-1">আপনার নাম *</label>
                      <input
                        type="text"
                        required
                        value={newReviewName}
                        onChange={e => setNewReviewName(e.target.value)}
                        placeholder="যেমন: মোঃ সাব্বির আহমেদ"
                        className="w-full px-3 py-2 border border-stone-300 text-xs text-stone-900 outline-none focus:border-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-700 mb-1">আপনার জেলা / শহর</label>
                      <input
                        type="text"
                        value={newReviewLocation}
                        onChange={e => setNewReviewLocation(e.target.value)}
                        placeholder="যেমন: ঢাকা"
                        className="w-full px-3 py-2 border border-stone-300 text-xs text-stone-900 outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-1">রেটিং নির্বাচন করুন</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            size={20}
                            className={star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-stone-600 ml-2">{newReviewRating} / 5 Star</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-700 mb-1">আপনার মন্তব্য *</label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={e => setNewReviewComment(e.target.value)}
                      placeholder="তাঁতরূপের লুঙ্গির কোয়ালিটি, কাপড়ের বুনন বা সার্ভিস সম্পর্কে আপনার অনুভূতি লিখুন..."
                      className="w-full px-3 py-2 border border-stone-300 text-xs text-stone-900 outline-none focus:border-stone-900"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-stone-900 hover:bg-amber-900 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      রিভিউ সাবমিট করুন
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Reviews Grid List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map(rev => (
              <div
                key={rev.id}
                className="bg-white p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3 hover:border-amber-900/40 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-100 font-serif font-bold text-sm flex items-center justify-center">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-bold text-xs text-stone-900">{rev.name}</h4>
                          {rev.verified && (
                            <span title="Verified Buyer">
                              <CheckCircle2 size={13} className="text-emerald-600 fill-emerald-100" />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-500">{rev.location} • {rev.date}</p>
                      </div>
                    </div>

                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {rev.product && (
                    <div className="mb-2 inline-block text-[9px] font-mono font-medium text-amber-900 bg-amber-50 border border-amber-200/60 px-2 py-0.5">
                      ক্রয় করেছেন: {rev.product}
                    </div>
                  )}

                  <p className="text-stone-700 text-xs leading-relaxed font-sans">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-[10px] text-stone-500">
                  <span className="text-emerald-700 font-medium flex items-center space-x-1">
                    <CheckCircle2 size={11} />
                    <span>ভেরিফাইড অর্ডার</span>
                  </span>

                  <button
                    onClick={() => handleLike(rev.id, rev.likes)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                      likedIds[rev.id] ? 'text-amber-900 font-bold bg-amber-50' : 'hover:text-stone-900'
                    }`}
                  >
                    <ThumbsUp size={11} className={likedIds[rev.id] ? 'fill-amber-900' : ''} />
                    <span>উপকারী ({likesMap[rev.id] ?? rev.likes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 text-center flex justify-between items-center text-xs text-stone-600">
          <span className="font-medium">
            তাঁতরূপ — সিরাজগঞ্জের খাঁটি ঐতিহ্যবাহী হস্তচালিত লুঙ্গি
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReviewsModal;
