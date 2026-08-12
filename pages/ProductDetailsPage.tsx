import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp,
  ChevronDown,
  Share2, 
  Plus, 
  Minus, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Star, 
  CheckCircle, 
  Ruler, 
  X, 
  Info,
  Heart,
  Check,
  MapPin,
  Maximize2,
  PackageCheck,
  Award,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  Send
} from 'lucide-react';
import { useAppStore } from '../store';
import { getProductImages } from '../assets';

const DEFAULT_COLORS = [
  { name: 'Brown (বাদামী)', code: '#6B4226' },
  { name: 'Navy (নেভি ব্লু)', code: '#1E293B' },
  { name: 'Green (সবুজ)', code: '#14532D' },
];

const DEFAULT_SIZES = [
  { label: 'ফ্রি সাইজ (52" x 88")', desc: 'সেলাই করা রেগুলার সাইজ' },
  { label: 'লার্জ সাইজ (54" x 90")', desc: 'সেলাই করা স্পেশাল লার্জ' },
  { label: 'সেলাই বিহীন (Unstitched)', desc: 'বুননকৃত ওপেন কাপড়ে ৫ গজ' },
];

const SizeGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-lg p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-[0.25em] block mb-1">TAATROOP LUNGI SIZE CHART</span>
            <h3 className="text-xl font-serif font-bold text-stone-900">লুঙ্গি মাপ ও সাইজ গাইড</h3>
            <p className="text-xs text-stone-500 mt-1">সিরাজগঞ্জের তাঁত বুননের স্ট্যান্ডার্ড মাপের বিবরণ</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="py-3 px-3 font-bold text-stone-700">সাইজ নাম</th>
                  <th className="py-3 px-3 font-bold text-stone-700">বহর (দৈর্ঘ্য)</th>
                  <th className="py-3 px-3 font-bold text-stone-700">ঘের (প্রস্থ)</th>
                  <th className="py-3 px-3 font-bold text-stone-700">সেলাই অবস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-600">
                <tr>
                  <td className="py-3 px-3 font-medium text-stone-900">ফ্রি সাইজ</td>
                  <td className="py-3 px-3">৫২ ইঞ্চি</td>
                  <td className="py-3 px-3">৮৮ ইঞ্চি</td>
                  <td className="py-3 px-3">রেডিমেড সেলাই করা</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-medium text-stone-900">লার্জ সাইজ</td>
                  <td className="py-3 px-3">৫৪ ইঞ্চি</td>
                  <td className="py-3 px-3">৯০ ইঞ্চি</td>
                  <td className="py-3 px-3">রেডিমেড সেলাই করা</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-medium text-stone-900">সেলাই বিহীন</td>
                  <td className="py-3 px-3">৫৪ ইঞ্চি</td>
                  <td className="py-3 px-3">৫ গজ পর্যন্ত</td>
                  <td className="py-3 px-3">আনস্টিচড (বুনন)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded text-xs space-y-1 text-amber-950">
            <p className="font-bold flex items-center gap-1">
              <Info size={14} className="text-amber-800" />
              <span>জরুরি তথ্য:</span>
            </p>
            <p className="text-[11px] leading-relaxed text-stone-700">
              আমাদের সকল লুঙ্গি ১০০% খাঁটি সুতি সুতা দিয়ে তৈরি। প্রথমবার ধোয়ার পর প্রায় ১% পর্যন্ত সংকোচন হতে পারে যা খাঁটি সুতি ফেব্রিকের স্বাভাবিক বৈশিষ্ট্য।
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors rounded"
          >
            বুঝেছি, পণ্য দেখতে ফিরুন
          </button>
        </div>
      </div>
    </div>
  );
};

const ImageZoomModal: React.FC<{ isOpen: boolean; imageSrc: string; title: string; onClose: () => void }> = ({ isOpen, imageSrc, title, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] bg-stone-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <button 
        onClick={onClose}
        className="absolute top-5 right-5 p-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors z-10"
        aria-label="Close"
      >
        <X size={24} />
      </button>
      <div className="max-w-4xl max-h-[88vh] flex flex-col items-center justify-center">
        <img src={imageSrc} alt={title} className="max-w-full max-h-[82vh] object-contain rounded-lg shadow-2xl" referrerPolicy="no-referrer" />
        <p className="text-white/80 text-xs mt-3 font-medium text-center">{title}</p>
      </div>
    </div>
  );
};

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-stone-200/80 last:border-b-0 py-3.5">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center text-left focus:outline-none group py-1"
      >
        <span className="text-sm font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">{title}</span>
        <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="text-xs text-stone-600 leading-relaxed pt-3 space-y-2.5 pb-1">
          {children}
        </div>
      )}
    </div>
  );
};

const DEFAULT_BASE_REVIEWS = [
  { id: '1', name: 'মোঃ রফিকুল ইসলাম', rating: 5, date: '১ দিন আগে', comment: 'তাঁতরূপের লুঙ্গির সুতার বুনন ও কোয়ালিটি সত্যিই অসাধারণ। একদম হালকা ও পরতে আরামদায়ক।' },
  { id: '2', name: 'তানভীর আহমেদ', rating: 5, date: '৩ দিন আগে', comment: 'সিরাজগঞ্জের আসল হ্যান্ডলুম কাজের ফিনিশিং পেয়েছি। ১০০% কটন ফেব্রিক।' },
  { id: '3', name: 'সাইফুল আলম', rating: 4, date: '১ সপ্তাহ আগে', comment: 'ডেলিভারি দ্রুত ছিল এবং প্রোডাক্ট হুবহু ছবির মতো।' }
];

const ProductDetailsPage: React.FC = () => {
  const { product, navigate, addToCart, notify, loading, refreshProduct, productReviews, fetchProductReviews, addProductReview } = useAppStore((state: any) => ({
    product: state.selectedProduct,
    navigate: state.navigate,
    addToCart: state.addToCart,
    notify: state.notify,
    loading: state.loading,
    refreshProduct: state.refreshProduct,
    productReviews: state.productReviews,
    fetchProductReviews: state.fetchProductReviews,
    addProductReview: state.addProductReview
  }));

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isFetching, setIsFetching] = useState(true);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Review state
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const productIdKey = product?.id || product?.productId || 'default';
  const savedProductReviews = productReviews?.[productIdKey];
  const reviewsList = (savedProductReviews && savedProductReviews.length > 0) ? savedProductReviews : DEFAULT_BASE_REVIEWS;

  useEffect(() => {
    if (productIdKey && fetchProductReviews) {
      fetchProductReviews(productIdKey);
    }
  }, [productIdKey]);

  const totalReviews = reviewsList.length;
  const avgRating = (reviewsList.reduce((acc: number, r: any) => acc + r.rating, 0) / (totalReviews || 1)).toFixed(1);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      notify('অনুগ্রহ করে আপনার মতামত বা রিভিউ লিখুন।', 'error');
      return;
    }
    addProductReview(productIdKey, {
      name: reviewName.trim() || 'সম্মানিত ক্রেতা',
      rating: reviewRating,
      date: 'এখনই',
      comment: reviewComment.trim()
    });
    setIsReviewSubmitted(true);
    setReviewComment('');
    setReviewName('');
    notify('আপনার রিভিউটি সফলভাবে স্থায়ীভাবে জমা নেওয়া হয়েছে! ধন্যবাদ।', 'success');
  };

  useEffect(() => {
    let isMounted = true;
    const fetchProductData = async () => {
        const pathParts = window.location.pathname.split('/');
        const pathId = pathParts[pathParts.length - 1];
        
        if (pathId && pathId !== 'product') {
             await refreshProduct(pathId);
        }
        if (isMounted) setIsFetching(false);
    };

    fetchProductData();
    return () => { isMounted = false; };
  }, [refreshProduct]);

  const images = useMemo(() => {
    return getProductImages(product);
  }, [product]);

  // Color options logic
  const availableColors = useMemo(() => {
    if (product?.colors && product.colors.length > 0) {
      return product.colors.map(c => {
        if (typeof c === 'object' && c !== null && 'name' in c) {
          return { name: c.name, code: (c as any).code || '#23412F' };
        }
        if (typeof c === 'string') {
          if (c.includes('|')) {
            const [name, code] = c.split('|');
            return { name: name.trim(), code: code.trim() || '#23412F' };
          }
          const lower = c.toLowerCase().trim();
          if (lower.includes('brown') || lower.includes('বাদামী')) return { name: c, code: '#6B4226' };
          if (lower.includes('navy') || lower.includes('নেভি')) return { name: c, code: '#1E293B' };
          if (lower.includes('green') || lower.includes('সবুজ')) return { name: c, code: '#14532D' };
          if (lower.includes('red') || lower.includes('লাল')) return { name: c, code: '#DC2626' };
          if (lower.includes('black') || lower.includes('কালো')) return { name: c, code: '#000000' };
          if (lower.includes('white') || lower.includes('সাদা')) return { name: c, code: '#FFFFFF' };
          if (lower.includes('yellow') || lower.includes('হলুদ')) return { name: c, code: '#EAB308' };
          if (lower.includes('pink') || lower.includes('গোলাপী')) return { name: c, code: '#EC4899' };
          if (lower.includes('blue') || lower.includes('নীল')) return { name: c, code: '#2563EB' };
          if (lower.includes('maroon') || lower.includes('মেরুন')) return { name: c, code: '#800000' };
          if (lower.includes('gold') || lower.includes('গোল্ড')) return { name: c, code: '#D4AF37' };
          return { name: c, code: '#6B4226' };
        }
        return { name: String(c), code: '#23412F' };
      });
    }
    return DEFAULT_COLORS;
  }, [product]);

  // Size options logic
  const availableSizes = useMemo(() => {
    if (product?.sizes && product.sizes.length > 0) {
      return product.sizes.map(s => typeof s === 'string' ? { label: s, desc: '' } : s);
    }
    return DEFAULT_SIZES;
  }, [product]);

  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0].name);
    }
  }, [availableColors, selectedColor]);

  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0].label);
    }
  }, [availableSizes, selectedSize]);

  useEffect(() => {
    if (product) {
        setCurrentImageIndex(0);
        window.scrollTo(0, 0); 
    }
  }, [product]);

  // Auto slide images every 3.5 seconds unless hovered
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  if ((loading || isFetching) && !product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center pt-[125px] sm:pt-[140px] md:pt-[150px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-amber-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-600 font-bold uppercase tracking-widest">লোডিং হচ্ছে...</p>
        </div>
      </div>
    );
  }
  
  if (!product) return null;

  const colorAndSizeVariant = `${selectedColor ? `কালার: ${selectedColor}` : ''}${selectedSize ? ` | সাইজ: ${selectedSize}` : ''}`;

  const handleAddToCart = () => {
    addToCart(product, quantity, colorAndSizeVariant || 'Standard');
    notify("Item added to your cart.", 'success');
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, colorAndSizeVariant || 'Standard');
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      notify('লিংক কপি করা হয়েছে', 'info');
    }
  };

  const regularPrice = product.regularPrice || product.price + 150;

  return (
    <div className="bg-[#F8F5F0] min-h-screen pb-24 text-stone-900 font-sans"> 
      <main className="max-w-[1550px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Breadcrumb Navigation - Hidden on Mobile */}
        <div className="hidden sm:flex items-center space-x-2 text-xs text-stone-500 mb-6 flex-wrap gap-y-1">
          <button onClick={() => navigate('/')} className="hover:text-[#23412F] transition-colors">Home</button>
          <span>›</span>
          <button onClick={() => navigate('/shop')} className="hover:text-[#23412F] transition-colors">Shop</button>
          <span>›</span>
          {product.category && (
            <>
              <button 
                onClick={() => navigate(`/shop?category=${encodeURIComponent(product.category)}`)} 
                className="hover:text-[#23412F] transition-colors"
              >
                {product.category}
              </button>
              <span>›</span>
            </>
          )}
          <span className="text-[#23412F] font-semibold truncate max-w-[240px]">{product.name}</span>
        </div>

        {/* TOP SECTION: Gallery & Info Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12">
            
            {/* Left: Product Images Gallery with Vertical Thumbnails */}
            <div 
              className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 items-start"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
                
                {/* Vertical Thumbnails Column */}
                {images.length > 0 && (
                  <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[580px] w-full sm:w-[90px] flex-shrink-0 scrollbar-none py-1 pb-2 sm:pb-0">
                    {images.map((img, i) => (
                      <button 
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === i 
                            ? 'border-amber-900 ring-2 ring-amber-900/20 opacity-100 scale-95 shadow-sm' 
                            : 'border-stone-200/80 opacity-70 hover:opacity-100 bg-white'
                        }`}
                      >
                        <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Product Display Card */}
                <div 
                  className="relative w-full bg-stone-100/60 rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm group"
                  style={{ aspectRatio: '3 / 3.4' }}
                >
                    {images.length > 0 ? (
                      <img 
                          src={images[currentImageIndex]} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          referrerPolicy="no-referrer"
                          alt={product.name}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                        কোনো ছবি নেই
                      </div>
                    )}

                    {/* Expand/Zoom Button */}
                    <button 
                      onClick={() => setIsZoomOpen(true)}
                      className="absolute bottom-4 right-4 p-2.5 bg-white/90 hover:bg-white text-stone-800 rounded-full shadow-md transition-all active:scale-95 hover:scale-110"
                      title="ছবি বড় করে দেখুন"
                      aria-label="Zoom Image"
                    >
                      <Maximize2 size={16} />
                    </button>

                    {/* Nav Arrows overlay for mobile or slider */}
                    {images.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between p-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                          className="p-2 bg-white/90 hover:bg-white text-stone-900 rounded-full shadow-md pointer-events-auto transition-transform active:scale-95"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button 
                          onClick={() => setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                          className="p-2 bg-white/90 hover:bg-white text-stone-900 rounded-full shadow-md pointer-events-auto transition-transform active:scale-95"
                          aria-label="Next image"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                </div>

            </div>

            {/* Right: Product Details & Purchase Panel */}
            <div className="lg:col-span-5 space-y-6">
                <div>
                    {/* Brand & Name */}
                    <div className="flex justify-between items-start mb-1">
                      <h1 className="text-2xl sm:text-3xl font-serif font-normal text-stone-900 tracking-tight">
                        {product.name}
                      </h1>
                      <button 
                        onClick={handleShare}
                        className="p-1.5 text-stone-400 hover:text-[#23412F] transition-colors"
                        title="শেয়ার করুন"
                      >
                        <Share2 size={18} className="text-[#6B4A2F]" />
                      </button>
                    </div>

                    {/* Rating Banner */}
                    <div className="flex items-center space-x-2 text-xs text-stone-600 mb-5 flex-wrap gap-y-1">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < Math.round(Number(avgRating)) ? "fill-amber-500 text-amber-500" : "text-stone-300"} />
                        ))}
                      </div>
                      <span className="font-bold text-stone-800">{avgRating}</span>
                      <span className="text-[#6B4A2F]">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
                    </div>

                    {/* Price and Stock Row matching uploaded UI */}
                    <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D7]">
                      <div className="flex items-baseline space-x-3">
                        <span className="text-3xl font-bold font-sans text-[#23412F]">৳{product.price}</span>
                        {product.price < regularPrice && (
                          <span className="text-sm text-stone-400 line-through">৳{regularPrice}</span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5 bg-[#23412F]/10 text-[#23412F] border border-[#23412F]/20 text-xs font-bold px-3 py-1 rounded-full">
                        <Check size={14} className="text-[#23412F] stroke-[3]" />
                        <span>In Stock</span>
                      </div>
                    </div>

                    {/* Short Description */}
                    {product.shortDescription && product.shortDescription.trim() !== '' && (
                      <p className="text-xs font-medium text-[#23412F] bg-amber-50/80 px-3.5 py-2 border-l-2 border-amber-800 rounded-r my-2">
                        {product.shortDescription}
                      </p>
                    )}

                    {product.description && product.description.trim() !== '' && product.description.trim() !== '- - -' && product.description.trim() !== '---' && (
                      <div className="text-xs text-stone-600 leading-relaxed py-4 border-b border-[#E8E1D7] whitespace-pre-line">
                        {product.description}
                      </div>
                    )}
                </div>

                {/* COLOR SELECTOR SECTION */}
                <div className="space-y-3 pt-2 border-t border-[#E8E1D7]">
                  <div className="text-xs font-bold text-stone-900 font-sans">
                    <span>Color: </span>
                    <span className="font-semibold text-stone-700">{selectedColor || 'Classic Multi Check'}</span>
                  </div>

                  {/* Circular Color Swatches Only */}
                  <div className="flex flex-wrap items-center gap-3 py-1">
                    {availableColors.map((col, idx) => {
                      const colorName = typeof col === 'string' ? col : col.name;
                      const colorCode = typeof col === 'object' && col.code ? col.code : '#6B4226';
                      const isSelected = selectedColor === colorName;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColor(colorName)}
                          title={colorName}
                          aria-label={colorName}
                          className={`w-7 h-7 rounded-full transition-all duration-200 ${
                            isSelected 
                              ? 'ring-2 ring-offset-2 ring-[#23412F] scale-110' 
                              : 'hover:scale-110 opacity-90 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: colorCode }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* QUANTITY & ACTION BUTTONS matching reference image */}
                <div className="space-y-4 pt-2">
                  <div className="text-xs font-bold text-stone-900 font-sans mb-1">
                    <span>Quantity</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Quantity Pill Counter */}
                    <div className="flex items-center border border-[#E8E1D7] bg-[#F8F5F0] rounded-xl overflow-hidden px-1 h-12 w-32 flex-shrink-0">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="w-9 h-full flex items-center justify-center text-stone-700 hover:text-stone-950 text-sm font-bold transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} className="text-[#6B4A2F]" />
                      </button>
                      <span className="flex-1 text-center text-xs font-bold text-[#23412F] font-sans">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)} 
                        className="w-9 h-full flex items-center justify-center text-stone-700 hover:text-stone-950 text-sm font-bold transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} className="text-[#6B4A2F]" />
                      </button>
                    </div>

                    {/* Add to Cart Button (Primary Full-Width Dark Green Button) */}
                    <button 
                        onClick={handleAddToCart}
                        className="flex-1 h-12 bg-[#23412F] hover:bg-[#1B3225] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 active:scale-[0.99]"
                    >
                        <ShoppingCart size={16} className="text-white" />
                        <span>Add to Cart</span>
                    </button>
                  </div>

                  {/* Buy Now Button (Secondary Light Button) */}
                  <button 
                      onClick={handleBuyNow}
                      className="w-full h-12 bg-white hover:bg-[#F8F5F0] text-[#23412F] text-xs font-bold uppercase tracking-wider rounded-xl border border-[#23412F] transition-all flex items-center justify-center space-x-2 shadow-xs active:scale-[0.99]"
                  >
                      <span>Buy Now</span>
                  </button>
                </div>

                {/* WRITE A REVIEW DROPDOWN BOX */}
                <div className="bg-[#FAF8F5] rounded-2xl border border-[#E5DFD5] shadow-2xs mt-4 overflow-hidden transition-all">
                  {/* Mobile Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                    className="w-full md:hidden p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-[#F3EFEA] transition-colors focus:outline-none"
                  >
                    <div className="flex items-center space-x-2">
                      <Star className="text-amber-500 fill-amber-400" size={16} />
                      <span className="font-bold text-xs text-[#23412F] uppercase tracking-wider">
                        Write a Review / মতামত দিন
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isReviewFormOpen ? (
                        <ChevronUp size={16} className="text-[#23412F]" />
                      ) : (
                        <ChevronDown size={16} className="text-[#23412F]" />
                      )}
                    </div>
                  </button>

                  {/* Desktop Static Header */}
                  <div className="hidden md:flex p-4 sm:p-5 items-center justify-between text-left border-b border-[#E8E1D7]">
                    <div className="flex items-center space-x-2">
                      <Star className="text-amber-500 fill-amber-400" size={16} />
                      <span className="font-bold text-xs text-[#23412F] uppercase tracking-wider">
                        Write a Review / মতামত দিন
                      </span>
                    </div>
                  </div>

                  {/* Form Content: Always open on PC (md:block), collapsible on mobile */}
                  <div className={isReviewFormOpen ? "block" : "hidden md:block"}>
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t md:border-t-0 border-[#E8E1D7] animate-fadeIn">
                      {isReviewSubmitted ? (
                        <div className="p-4 bg-white rounded-xl border border-emerald-200 text-center space-y-2 animate-fadeIn shadow-2xs">
                          <div className="flex items-center justify-center text-emerald-800 gap-1.5 font-bold text-xs">
                            <CheckCircle2 size={18} />
                            <span>আপনার রিভিউ প্রকাশিত হয়েছে!</span>
                          </div>
                          <p className="text-[11px] text-stone-600">
                            আপনার মূল্যবান মতামতের জন্য ধন্যবাদ।
                          </p>
                          <button 
                            type="button"
                            onClick={() => { setIsReviewSubmitted(false); }}
                            className="text-[10px] font-bold text-[#23412F] hover:underline mt-1 block mx-auto cursor-pointer"
                          >
                            আরেকটি রিভিউ লিখুন
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleReviewSubmit} className="space-y-3 mt-2">
                          {/* Rating Stars Selection */}
                          <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-[#E8E1D7]">
                            <span className="text-xs font-bold text-stone-800">আপনার রেটিং:</span>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="p-1 focus:outline-none transition-transform hover:scale-120 active:scale-90 cursor-pointer"
                                  aria-label={`Rate ${star} stars`}
                                >
                                  <Star
                                    size={18}
                                    className={`${
                                      star <= (hoverRating || reviewRating)
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-stone-300'
                                    } transition-colors`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Inputs */}
                          <div className="space-y-2.5">
                            <input
                              type="text"
                              value={reviewName}
                              onChange={(e) => setReviewName(e.target.value)}
                              placeholder="আপনার নাম (ঐচ্ছিক)"
                              className="w-full bg-white px-3.5 py-2.5 text-xs rounded-xl border border-[#E8E1D7] focus:outline-none focus:border-[#23412F] focus:ring-1 focus:ring-[#23412F] text-stone-800 placeholder:text-stone-400 transition-all font-sans"
                            />
                            <textarea
                              rows={2}
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="পণ্যটির মান ও অনুভূতি নিয়ে আপনার মতামত লিখুন..."
                              className="w-full bg-white px-3.5 py-2.5 text-xs rounded-xl border border-[#E8E1D7] focus:outline-none focus:border-[#23412F] focus:ring-1 focus:ring-[#23412F] text-stone-800 placeholder:text-stone-400 resize-none transition-all font-sans"
                            />
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            className="w-full py-3 bg-[#23412F] hover:bg-[#1B3225] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 active:scale-[0.99] cursor-pointer"
                          >
                            <Send size={14} />
                            <span>রিভিউ জমা দিন / Submit Review</span>
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

            </div>
        </div>

        {/* BOTTOM SECTION: 2-Row Feature Grid (Left) & Accordions (Right) matching uploaded UI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-stone-200/80">
            
            {/* Left Box: 8 Feature Badges Grid */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
              
              {/* Row 1: 4 Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-stone-100">
                
                {/* 1. Cash on Delivery */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F2EC] flex items-center justify-center text-amber-900 mx-auto">
                    <PackageCheck size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Cash on Delivery</h5>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">Pay Upon Delivery</p>
                  </div>
                </div>

                {/* 2. Secure Payment */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F2EC] flex items-center justify-center text-amber-900 mx-auto">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Secure Payment</h5>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">100% Safe Transactions</p>
                  </div>
                </div>

                {/* 3. Fast Delivery */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F2EC] flex items-center justify-center text-amber-900 mx-auto">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Fast Delivery</h5>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">Nationwide Shipping</p>
                  </div>
                </div>

                {/* 4. Premium Packaging */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F2EC] flex items-center justify-center text-amber-900 mx-auto">
                    <Award size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Premium Packaging</h5>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">Guaranteed Box Packing</p>
                  </div>
                </div>

              </div>

              {/* Row 2: 4 Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                {/* 5. Premium Quality */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F2EC] flex items-center justify-center text-amber-900 mx-auto">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Premium Quality</h5>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">High Count Cotton Yarn</p>
                  </div>
                </div>

                {/* 6. Handloom Woven */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F2EC] flex items-center justify-center text-amber-900 mx-auto">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Handloom Woven</h5>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">Artisanal Hand Weave</p>
                  </div>
                </div>

                {/* 7. Soft & Comfortable */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F2EC] flex items-center justify-center text-amber-900 mx-auto">
                    <ThumbsUp size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Soft & Comfortable</h5>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">Soft & Breathable Fabric</p>
                  </div>
                </div>

                {/* 8. Quality Checked */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F2EC] flex items-center justify-center text-amber-900 mx-auto">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">Quality Checked</h5>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">Passed Quality Audit</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Box: Accordion Group matching uploaded UI */}
            <div className="lg:col-span-5 bg-[#F9F8F6] p-6 rounded-2xl border border-stone-200/80 shadow-xs divide-y divide-stone-200/80">
              
              <AccordionItem title="Description" defaultOpen>
                {product.description && product.description.trim() ? (
                  <div className="whitespace-pre-line leading-relaxed text-stone-600">
                    {product.description}
                  </div>
                ) : (
                  <>
                    <p>• উপাদান: ১০০% অরিজিনাল সিরাজগঞ্জের সুতি তাঁত ফেব্রিক।</p>
                    <p>• সাইজ: ফ্রি সাইজ (উচ্চতা ৫০"-৫২", ঘের ৮৬"-৮৮") অথবা পছন্দ অনুযায়ী সেলাই ছাড়া।</p>
                    <p>• বুনন: ডাবল সুতার নিখুঁত হ্যান্ডলুম ক্রাফটম্যানশিপ।</p>
                    <p>• বিবরণ: সিরাজগঞ্জের ঐতিহ্যবাহী তাঁতিদের নিপুণ হাতে বোনা উচ্চমানের আরামদায়ক কটন লুঙ্গি।</p>
                  </>
                )}
              </AccordionItem>

              <AccordionItem title="Fabric & Care">
                <p>১. প্রথমবার ধোয়ার সময় আলাদা সাবান পানিতে ওয়াশ করুন।</p>
                <p>২. মৃদু ডিটারজেন্ট ব্যবহার করা শ্রেয়। অতিরিক্ত কড়া রোদে বেশিক্ষণ না শুকিয়ে ছায়ায় শুকান।</p>
                <p>৩. সুতি কাপড়ের স্থায়িত্ব দীর্ঘ করতে অতিরিক্ত ব্লিচিং এড়িয়ে চলুন।</p>
              </AccordionItem>

              <AccordionItem title="Shipping & Delivery">
                <p>• ঢাকা সিটিতে ২৪-৪৮ ঘণ্টার মধ্যে দ্রুত হোম ডেলিভারি (চার্জ ৮০ টাকা)।</p>
                <p>• ঢাকার বাইরে ২-৪ দিনের মধ্যে হোম ডেলিভারি (চার্জ ১৫০ টাকা)।</p>
                <p>• পণ্য হাতে পেয়ে দেখে নেওয়ার এবং ক্যাশ অন ডেলিভারির সম্পূর্ণ সুবিধা রয়েছে।</p>
              </AccordionItem>

              <AccordionItem title={`Customer Reviews (${totalReviews})`} defaultOpen={isReviewSubmitted}>
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between border-b border-stone-200/80 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} className={i < Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-stone-300"} />
                        ))}
                      </div>
                      <span className="text-stone-900 font-bold text-xs">{avgRating} out of 5</span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
                      {totalReviews} Verified Ratings
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-stone-900">{rev.name}</span>
                            <span className="text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-bold border border-emerald-200/60">Verified Buyer</span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-medium">{rev.date}</span>
                        </div>
                        <div className="flex items-center text-amber-400 space-x-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={11} className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"} />
                          ))}
                        </div>
                        <p className="text-stone-700 text-xs leading-relaxed font-sans">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionItem>

            </div>

        </div>

      </main>

      {/* Sticky Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white border-t border-stone-200 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] flex items-center justify-between gap-3">
        <div className="pl-1">
          <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider block">মূল্য</span>
          <span className="font-sans font-bold text-lg text-stone-900 leading-none">৳{product.price * quantity}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAddToCart}
            className="w-11 h-11 bg-stone-100 text-stone-900 rounded-xl hover:bg-stone-200 transition-colors flex items-center justify-center border border-stone-200"
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
          <button 
            onClick={handleBuyNow}
            className="px-5 py-3 bg-[#2C221E] hover:bg-amber-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Truck size={15} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      <ImageZoomModal isOpen={isZoomOpen} imageSrc={images[currentImageIndex] || ''} title={product.name} onClose={() => setIsZoomOpen(false)} />
    </div>
  );
};

export default ProductDetailsPage;
