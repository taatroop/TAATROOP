
import React, { useState, useRef } from 'react';
import { useAppStore } from '../store';
import { Product } from '../types';
import { 
  HERO_WEAVER_IMAGE, 
  HERITAGE_BANNER_IMAGE, 
  LUNGI_IMAGES
} from '../assets';
import SafeImage from '../components/SafeImage';
import { 
  Award, 
  ShieldCheck, 
  Truck, 
  Star, 
  Play, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  X,
  ShoppingCart,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ReviewsModal from '../components/ReviewsModal';

const HomePage: React.FC = () => {
  const { products, navigate, addToCart, notify, settings } = useAppStore(state => ({
    products: state.products,
    navigate: state.navigate,
    addToCart: state.addToCart,
    notify: state.notify,
    settings: state.settings
  }));

  const heroEyebrow = settings?.heroEyebrow || 'TAATROOP';
  const heroTitle = settings?.heroTitle || 'ঐতিহ্যের বুননে\nআস্থার স্পর্শ';
  const heroSubtitle = settings?.heroSubtitle || 'PREMIUM HANDLOOM LUNGI FROM SIRAJGANJ, BANGLADESH';
  const heroPcImg = settings?.heroImage || HERO_WEAVER_IMAGE;
  const heroMobileImg = settings?.heroMobileImage || heroPcImg;
  const heroBtnText = settings?.heroButtonText || 'SHOP COLLECTION';
  const heroBtnLink = settings?.heroButtonLink || '/shop';
  const heroVideoBtnText = settings?.heroVideoButtonText || 'WATCH VIDEO';
  const heroVideoTitle = settings?.heroVideoTitle || 'The Art of Handloom Weaver';
  const heroVideoUrlPc = settings?.heroVideoUrlPc || settings?.heroVideoUrl || '';
  const heroVideoUrlMobile = settings?.heroVideoUrlMobile || settings?.heroVideoUrl || '';

  const [isMobileScreen, setIsMobileScreen] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeVideoUrl = isMobileScreen ? (heroVideoUrlMobile || heroVideoUrlPc) : (heroVideoUrlPc || heroVideoUrlMobile);

  const youtubeEmbedUrl = React.useMemo(() => {
    if (!activeVideoUrl) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = activeVideoUrl.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }
    if (activeVideoUrl.includes('youtube.com/embed/')) {
      return activeVideoUrl.includes('?') ? `${activeVideoUrl}&autoplay=1` : `${activeVideoUrl}?autoplay=1`;
    }
    return null;
  }, [activeVideoUrl]);

  const formattedHeroTitle = React.useMemo(() => {
    return heroTitle.split('\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  }, [heroTitle]);

  const collectionsList = React.useMemo(() => {
    const rawCategories = (settings?.categories && settings.categories.length > 0)
      ? settings.categories
      : ["Premium Collection", "Classic Collection", "Luxury Collection", "New Arrivals", "Limited Edition"];

    const paused = settings?.pausedCategories || [];
    const menuCats = settings?.menuCategories;

    let active = rawCategories.filter((cat: string) => !paused.includes(cat));

    // If menuCategories is configured, only show those checked for OUR COLLECTIONS
    if (Array.isArray(menuCats) && menuCats.length > 0) {
      active = active.filter((cat: string) => menuCats.some(mc => mc.toLowerCase().trim() === cat.toLowerCase().trim()));
    }

    const categoryImages = settings?.categoryImages || [];

    return active.map((cat: string) => {
      const matched = categoryImages.find(
        (ci: any) => ci.categoryName && ci.categoryName.toLowerCase().trim() === cat.toLowerCase().trim()
      );
      return {
        name: cat,
        image: matched?.image || ''
      };
    });
  }, [settings?.categories, settings?.pausedCategories, settings?.menuCategories, settings?.categoryImages]);

  const handleCollectionClick = (categoryName: string) => {
    const hasProducts = Array.isArray(products) && products.some(
      (p: any) => p.category && p.category.toLowerCase().trim() === categoryName.toLowerCase().trim()
    );
    if (hasProducts) {
      navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
    } else {
      navigate('/shop');
    }
  };

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  // Review Slider States & Handlers
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [isReviewDragging, setIsReviewDragging] = useState(false);
  const [reviewStartX, setReviewStartX] = useState(0);
  const [reviewScrollLeft, setReviewScrollLeft] = useState(0);

  const scrollReviewsLeft = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollReviewsRight = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  const handleReviewMouseDown = (e: React.MouseEvent) => {
    if (!reviewsRef.current) return;
    setIsReviewDragging(true);
    setReviewStartX(e.pageX - reviewsRef.current.offsetLeft);
    setReviewScrollLeft(reviewsRef.current.scrollLeft);
  };

  const handleReviewMouseLeave = () => {
    setIsReviewDragging(false);
  };

  const handleReviewMouseUp = () => {
    setIsReviewDragging(false);
  };

  const handleReviewMouseMove = (e: React.MouseEvent) => {
    if (!isReviewDragging || !reviewsRef.current) return;
    e.preventDefault();
    const x = e.pageX - reviewsRef.current.offsetLeft;
    const walk = (x - reviewStartX) * 1.5;
    reviewsRef.current.scrollLeft = reviewScrollLeft - walk;
  };

  const homeReviewsList = [
    {
      id: 1,
      name: 'Rahim Uddin',
      location: 'Dhaka',
      rating: 5,
      comment: 'প্রিমিয়াম কোয়ালিটি এবং অনেক আরামদায়ক। কাপড়ের সুতা বেশ ঘন। অবশ্যই আবার কিনবো।',
      product: 'প্রিন চেক ডাবল সুতা লুঙ্গি'
    },
    {
      id: 2,
      name: 'Masud Rana',
      location: 'Chattogram',
      rating: 5,
      comment: 'রং এবং কাপড় অনেক ভালো। ডেলিভারিও খুব দ্রুত পেয়েছি। ধন্যবাদ আসল সিরাজগঞ্জের লুঙ্গি দেওয়ার জন্য।',
      product: 'নীল ডোরা কটন লুঙ্গি'
    },
    {
      id: 3,
      name: 'Ahsan Habib',
      location: 'Khulna',
      rating: 5,
      comment: 'তাঁতরূপের লুঙ্গি সত্যিই অসাধারণ। কাপড়ের সফটনেস চমৎকার। সবাইকে রিকমেন্ড করবো।',
      product: 'হলুদ চেক ক্লাসিক লুঙ্গি'
    },
    {
      id: 4,
      name: 'Tanvir Hossain',
      location: 'Sylhet',
      rating: 5,
      comment: 'একদম ১০০% পিওর সুতি কাপড়। গরমের জন্য এর চেয়ে আরামদায়ক লুঙ্গি আর হতে পারে না।',
      product: 'সাদা ক্লাসিক সুতি লুঙ্গি'
    },
    {
      id: 5,
      name: 'Mahbubur Rahman',
      location: 'Sirajganj',
      rating: 5,
      comment: 'আমি সিরাজগঞ্জের লোক হয়েও বলছি এদের কোয়ালিটি কন্ট্রোল চমৎকার। অরজিনাল হস্তচালিত বুনন।',
      product: 'রঙ্গিন ডাবল সুতা প্রিমিয়াম লুঙ্গি'
    },
    {
      id: 6,
      name: 'Kamrul Hasan',
      location: 'Rajshahi',
      rating: 4,
      comment: 'লুঙ্গির ফিনিশিং খুব সুন্দর। সাইজ বেশ চওড়া এবং আরামদায়ক। ডেলিভারি ২ দিনের মধ্যে পেয়েছি।',
      product: 'প্রিন চেক ডাবল সুতা লুঙ্গি'
    },
    {
      id: 7,
      name: 'Sajjad Islam',
      location: 'Barishal',
      rating: 5,
      comment: 'আব্বুর জন্য ৩টি লুঙ্গি অর্ডার করেছিলাম। উনি পড়ে ভীষণ সন্তুষ্ট। কাপড়ের স্থায়িত্ব অনেক ভালো।',
      product: 'নীল ডোরা কটন লুঙ্গি'
    }
  ];

  // Fallback / Default 5 Lungi products matching the screenshot
  const defaultBestSellers = [
    {
      id: '101',
      productId: '101',
      name: 'প্রিন চেক লুঙ্গি',
      price: 650,
      rating: 5,
      reviewsCount: 120,
      image: '',
      category: 'Premium Collection'
    },
    {
      id: '102',
      productId: '102',
      name: 'নীল ডোরা লুঙ্গি',
      price: 620,
      rating: 5,
      reviewsCount: 98,
      image: '',
      category: 'Classic Collection'
    },
    {
      id: '103',
      productId: '103',
      name: 'ক্লাসিক চেক লুঙ্গি',
      price: 700,
      rating: 5,
      reviewsCount: 154,
      image: '',
      category: 'Luxury Collection'
    },
    {
      id: '104',
      productId: '104',
      name: 'সাদা ডোরা লুঙ্গি',
      price: 600,
      rating: 5,
      reviewsCount: 87,
      image: '',
      category: 'New Arrivals'
    },
    {
      id: '105',
      productId: '105',
      name: 'সবুজ ডোরা লুঙ্গি',
      price: 620,
      rating: 5,
      reviewsCount: 112,
      image: '',
      category: 'Limited Edition'
    }
  ];

  // Merge store products if available
  const bestSellerList = products.length >= 4 
    ? products.slice(0, 4).map((p, idx) => ({
        ...p,
        image: (p.images && p.images[0]) || p.image || '',
        reviewsCount: [120, 98, 154, 87][idx % 4]
      }))
    : defaultBestSellers.slice(0, 4);

  const handleProductClick = (product: any) => {
    navigate(`/product/${product.id || product.productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    const prodImg = product.image || (product.images && product.images[0]) || '';
    addToCart({
      id: product.id || product.productId,
      name: product.name,
      price: product.price,
      image: prodImg,
      images: product.images && product.images.length > 0 ? product.images : (prodImg ? [prodImg] : [])
    }, 1, 'Standard');
    navigate('/cart');
  };

  return (
    <div className="bg-[#FAF8F5] text-stone-900 min-h-screen font-sans">
      
      {/* 1. HERO BANNER SECTION (STRICTLY FULL PAGE HEIGHT - 100DVH) */}
      <section className="hidden md:flex relative w-full h-[100dvh] max-h-[100dvh] flex-col justify-center overflow-hidden bg-[#18201C] pt-[95px] sm:pt-[110px] md:pt-[125px] pb-8 sm:pb-12">
        <div className="absolute inset-0 z-0">
          <picture className="w-full h-full block">
            {settings?.heroMobileImage && (
              <source media="(max-width: 767px)" srcSet={settings.heroMobileImage} />
            )}
            <img 
              src={heroPcImg} 
              alt="Artisan weaver at loom" 
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
          </picture>
          {/* Subtle vignette shadow gradient on left text block */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#121815]/95 via-[#121815]/75 to-black/30" />
        </div>

        <div className="max-w-[1550px] mx-auto px-6 md:px-12 lg:px-16 w-full relative z-10 my-auto">
          <div className="max-w-xl text-white space-y-3 sm:space-y-5 lg:space-y-6">
            <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.35em] text-amber-200 uppercase block">
              {heroEyebrow}
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl font-medium leading-[1.12] text-amber-50">
              {formattedHeroTitle}
            </h1>

            <p className="text-[10px] sm:text-[12px] font-sans font-semibold tracking-[0.18em] sm:tracking-[0.2em] uppercase text-stone-300 pt-0.5 sm:pt-1">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-2 sm:pt-4">
              <button 
                onClick={() => navigate(heroBtnLink || '/shop')}
                className="bg-[#121816] hover:bg-stone-900 text-white border border-stone-700/80 px-5 sm:px-8 py-2.5 sm:py-3.5 text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                {heroBtnText}
              </button>

              <button 
                onClick={() => setIsVideoOpen(true)}
                className="flex items-center space-x-2 sm:space-x-3 text-white hover:text-amber-200 transition-colors group text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/50 flex items-center justify-center group-hover:scale-105 transition-transform bg-black/30 backdrop-blur-sm">
                  <Play size={12} className="fill-white text-white ml-0.5 sm:hidden" />
                  <Play size={14} className="fill-white text-white ml-0.5 hidden sm:block" />
                </div>
                <span>{heroVideoBtnText}</span>
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* 2. VALUE PROPOSITION / HIGHLIGHTS BAR (5 Columns) */}
      <section className="bg-[#FAF8F5] border-b border-stone-200/90 py-8 sm:py-10 px-4 sm:px-6 md:px-12">
        <div className="max-w-[1550px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 text-stone-800 text-center">
          
          <div className="flex flex-col items-center space-y-1.5 sm:space-y-2 p-2.5 sm:p-3 bg-stone-100/50 sm:bg-transparent rounded-xs sm:rounded-none">
            <div className="p-1.5 text-stone-900">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.4} />
            </div>
            <h4 className="font-bold text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] uppercase text-stone-900">PREMIUM QUALITY</h4>
            <p className="text-[10px] sm:text-[11px] text-stone-600">Finest handloom cotton</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5 sm:space-y-2 p-2.5 sm:p-3 bg-stone-100/50 sm:bg-transparent rounded-xs sm:rounded-none">
            <div className="p-1.5 text-stone-900">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.4} />
            </div>
            <h4 className="font-bold text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] uppercase text-stone-900">AUTHENTIC HANDLOOM</h4>
            <p className="text-[10px] sm:text-[11px] text-stone-600">100% original handloom</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5 sm:space-y-2 p-2.5 sm:p-3 bg-stone-100/50 sm:bg-transparent rounded-xs sm:rounded-none">
            <div className="p-1.5 text-stone-900">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.4} />
            </div>
            <h4 className="font-bold text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] uppercase text-stone-900">SIRAJGANJ HERITAGE</h4>
            <p className="text-[10px] sm:text-[11px] text-stone-600">Crafted by skilled weavers</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5 sm:space-y-2 p-2.5 sm:p-3 bg-stone-100/50 sm:bg-transparent rounded-xs sm:rounded-none">
            <div className="p-1.5 text-stone-900">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.4} />
            </div>
            <h4 className="font-bold text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] uppercase text-stone-900">NATIONWIDE DELIVERY</h4>
            <p className="text-[10px] sm:text-[11px] text-stone-600">Across 64 districts</p>
          </div>

          <div className="flex flex-col items-center space-y-1.5 sm:space-y-2 p-2.5 sm:p-3 col-span-2 md:col-span-1 bg-stone-100/50 sm:bg-transparent rounded-xs sm:rounded-none">
            <div className="p-1.5 text-stone-900">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.4} />
            </div>
            <h4 className="font-bold text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.15em] uppercase text-stone-900">TRUSTED BY THOUSANDS</h4>
            <p className="text-[10px] sm:text-[11px] text-stone-600">Quality you can trust</p>
          </div>

        </div>
      </section>


      {/* 3. OUR COLLECTIONS SECTION */}
      <section className="max-w-[1550px] mx-auto px-4 sm:px-6 md:px-12 py-14 sm:py-18 lg:py-24">
        <div className="flex justify-between items-end mb-6 sm:mb-10 border-b border-stone-200/80 pb-3 sm:pb-4">
          <div>
            <span className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-amber-800 block mb-1">
              OUR COLLECTIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900 font-normal">
              Explore Our Collections
            </h2>
          </div>

          <button 
            onClick={() => navigate('/shop')}
            className="border border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-white px-3.5 sm:px-5 py-1.5 sm:py-2 text-[9.5px] sm:text-[10px] font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase transition-colors rounded-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            VIEW ALL
          </button>
        </div>

        {/* Dynamic Collections Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {collectionsList.map((col) => (
            <div 
              key={col.name}
              onClick={() => handleCollectionClick(col.name)} 
              className="group cursor-pointer bg-[#FAF8F5] border border-stone-200/90 p-2 sm:p-2.5 hover:shadow-md transition-shadow rounded-xs"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#F5F2EC] mb-2 border border-stone-200/60 rounded-xs">
                <SafeImage src={col.image} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wider sm:tracking-[0.15em] text-stone-900 truncate">
                {col.name}
              </h3>
              <span className="text-[10px] sm:text-[11px] text-stone-500 group-hover:text-amber-900 flex items-center space-x-1 pt-1 font-medium">
                <span>Explore Now</span>
                <ArrowRight size={11} />
              </span>
            </div>
          ))}
        </div>
      </section>


      {/* 4. OUR BEST SELLERS SECTION */}
      <section className="bg-[#F5F2EC] py-14 sm:py-18 lg:py-24 border-t border-b border-stone-200">
        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 items-start">
            
            {/* Left Header Column */}
            <div className="lg:col-span-1 space-y-2 sm:space-y-3 pt-1">
              <span className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-amber-800 block">
                BEST SELLERS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900 font-normal leading-tight">
                Our Best<br className="hidden sm:block" /> Sellers
              </h2>
              <button 
                onClick={() => navigate('/shop')}
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-stone-800 hover:text-amber-900 flex items-center space-x-1.5 pt-2 sm:pt-4 group cursor-pointer"
              >
                <span>SHOP ALL PRODUCTS</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Product Cards Grid (4 Products) */}
            <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
              {bestSellerList.map((product: any, idx: number) => (
                <div 
                  key={`bestseller-${product.id || product.productId || idx}-${idx}`}
                  onClick={() => handleProductClick(product)}
                  className="bg-[#FAF8F5] border border-stone-200/90 p-2 sm:p-3.5 group cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-amber-900/30 relative flex flex-col justify-between rounded-xs"
                >
                  <div>
                    {/* Image Container with Quick View & Add to Cart hover buttons */}
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#F5F2EC] border border-stone-200/60 rounded-xs relative mb-2">
                      <SafeImage 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Product Name */}
                    <h4 className="font-serif text-xs sm:text-sm font-semibold text-stone-900 mb-1 line-clamp-1 leading-snug">
                      {product.name}
                    </h4>

                    {/* Price in BDT */}
                    <div className="font-bold text-xs sm:text-sm text-stone-900 mb-1">
                      ৳ {product.price}
                    </div>
                  </div>

                  <div>
                    {/* Rating Stars & Count */}
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] pt-1.5 border-t border-stone-200/60">
                      <div className="flex text-amber-400 space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-stone-500 font-medium text-[8.5px] sm:text-[10px] whitespace-nowrap">({product.reviewsCount || 120})</span>
                    </div>

                    {/* Direct Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.productId || product.id}`);
                      }}
                      className="mt-2.5 w-full py-2 bg-[#23412F] hover:bg-[#1B3225] text-white text-[11px] font-bold uppercase tracking-wider rounded-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>View Item</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>


      {/* 5. HERITAGE / VIDEO BANNER SECTION */}
      <section className="relative w-full py-16 sm:py-22 lg:py-28 overflow-hidden bg-[#0F1714]">
        {/* Background Image of Traditional Woven Lungi Fabric */}
        <div className="absolute inset-0 z-0">
          <img 
            src={HERITAGE_BANNER_IMAGE} 
            alt="Handloom woven fabric texture" 
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1412] via-[#0D1412]/80 to-transparent" />
        </div>

        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-white space-y-3.5 sm:space-y-5 max-w-lg">
              <span className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.35em] uppercase text-amber-300">
                OUR HERITAGE
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-amber-50 font-normal leading-tight">
                From Sirajganj<br />To Your Home
              </h2>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
                We work directly with skilled weavers of Sirajganj to bring you the finest handloom lungi, preserving tradition and supporting local artisans.
              </p>

              <button 
                onClick={() => navigate('/contact')}
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-white hover:text-amber-300 flex items-center space-x-2 pt-1 sm:pt-2 group cursor-pointer"
              >
                <span>LEARN MORE</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right Video Play Badge */}
            <div className="flex lg:justify-center items-center">
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="flex items-center space-x-2 sm:space-x-4 bg-black/40 backdrop-blur-md border border-white/20 p-2 sm:p-4 px-3.5 sm:px-6 hover:bg-black/60 transition-all rounded-full text-white group shadow-2xl cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white text-stone-900 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <Play size={13} className="fill-stone-900 ml-0.5 sm:hidden" />
                  <Play size={18} className="fill-stone-900 ml-0.5 hidden sm:block" />
                </div>
                <div className="text-left">
                  <span className="block text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-stone-300">WATCH VIDEO</span>
                  <span className="block text-[10px] sm:text-xs font-serif italic text-amber-200">The Art of Handloom</span>
                </div>
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* 6. TRUSTED BY OUR CUSTOMERS / TESTIMONIALS SECTION */}
      <section className="max-w-[1550px] mx-auto px-4 sm:px-6 md:px-12 py-14 sm:py-18 lg:py-24">
        
        <div className="flex justify-between items-end mb-6 sm:mb-8 border-b border-stone-200 pb-3 sm:pb-4">
          <div>
            <span className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-amber-800 block mb-1">
              TRUSTED BY OUR CUSTOMERS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-stone-900 font-normal">
              Their Words, Our Inspiration
            </h2>
          </div>

          {/* Slider Prev / Next Navigation Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={scrollReviewsLeft}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-stone-300 hover:border-[#23412F] hover:bg-[#23412F] hover:text-white transition-all flex items-center justify-center text-stone-700 shadow-xs cursor-pointer"
              aria-label="Previous Review"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={scrollReviewsRight}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-stone-300 hover:border-[#23412F] hover:bg-[#23412F] hover:text-white transition-all flex items-center justify-center text-stone-700 shadow-xs cursor-pointer"
              aria-label="Next Review"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Swipable & Draggable Feedback Slider */}
        <div 
          ref={reviewsRef}
          onMouseDown={handleReviewMouseDown}
          onMouseLeave={handleReviewMouseLeave}
          onMouseUp={handleReviewMouseUp}
          onMouseMove={handleReviewMouseMove}
          className="flex space-x-3.5 sm:space-x-5 overflow-x-auto scrollbar-thin snap-x snap-mandatory py-2 px-1 pb-3 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        >
          {homeReviewsList.map((rev) => (
            <div 
              key={rev.id}
              className="w-[260px] sm:w-[320px] lg:w-[350px] flex-shrink-0 snap-start bg-[#F5F2EC] p-4 sm:p-6 border border-stone-200/80 flex flex-col justify-between space-y-3 sm:space-y-4 hover:border-amber-900/40 transition-colors shadow-2xs rounded-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-900/20 text-amber-900 font-bold flex items-center justify-center text-xs sm:text-sm font-serif">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">{rev.name}</h4>
                  <p className="text-[10px] text-stone-500">{rev.location}</p>
                </div>
              </div>

              <div className="flex text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-stone-700 text-xs leading-relaxed font-sans">
                "{rev.comment}"
              </p>

              {rev.product && (
                <p className="text-[10px] text-stone-500 font-mono border-t border-stone-200/60 pt-2 truncate">
                  {rev.product}
                </p>
              )}
            </div>
          ))}

          {/* Brand Commitment Card */}
          <div className="w-[260px] sm:w-[320px] lg:w-[350px] flex-shrink-0 snap-start bg-[#101714] text-white p-4 sm:p-6 border border-stone-800 flex flex-col justify-between space-y-3 sm:space-y-4 shadow-md rounded-xs">
            <div>
              <div className="w-8 h-8 border border-white/20 rounded p-1 flex items-center justify-center mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-5 h-5 text-amber-300">
                  <path d="M4 5h16M4 19h16M7 5v14M12 5v14M17 5v14" strokeLinecap="round" strokeDasharray="1 2" />
                  <path d="M2 9h20M2 15h20" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>

              <h4 className="font-serif text-base sm:text-lg font-normal text-amber-100 mb-2">
                আমাদের প্রতিশ্রুতি
              </h4>

              <p className="text-stone-300 text-xs leading-relaxed font-sans">
                সেরা মান, ন্যায্য দাম এবং আপনার পূর্ণ আস্থা।
              </p>
            </div>

            <div className="text-[10px] font-bold tracking-[0.25em] text-amber-300 uppercase border-t border-stone-800 pt-3">
              TAATROOP
            </div>
          </div>
        </div>

      </section>


      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setIsVideoOpen(false)}>
          <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/60 hover:bg-black p-2 rounded-full z-20 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="aspect-video w-full bg-black flex flex-col items-center justify-center text-center">
              {youtubeEmbedUrl ? (
                <iframe 
                  src={youtubeEmbedUrl} 
                  title={heroVideoTitle} 
                  className="w-full h-full border-0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                />
              ) : (
                <div className="p-8 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-amber-800/80 text-white flex items-center justify-center mb-4 shadow-lg">
                    <Play size={28} className="fill-white ml-1" />
                  </div>
                  <h3 className="font-serif text-2xl text-amber-100 mb-2">{heroVideoTitle}</h3>
                  <p className="text-xs text-stone-400 max-w-md uppercase tracking-widest mb-4">
                    Sirajganj Traditional Lungi Weaving Craftsmanship
                  </p>
                  <p className="text-[11px] text-amber-300/70 border border-amber-900/50 bg-amber-950/30 px-4 py-2">
                    Tip: Add YouTube Video Link in Admin Settings &gt; Home Page Hero Banner to play video here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      <ReviewsModal 
        isOpen={isReviewsOpen} 
        onClose={() => setIsReviewsOpen(false)} 
      />

    </div>
  );
};

export default HomePage;

