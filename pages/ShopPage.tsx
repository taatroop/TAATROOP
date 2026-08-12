
import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { Search, SlidersHorizontal, X, ArrowUpDown, RefreshCw, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const ShopPage: React.FC = () => {
    const { products, isInitialLoading, ensureAllProductsLoaded, fullProductsLoaded, settings, path } = useAppStore(state => ({
        products: state.products,
        isInitialLoading: state.loading,
        ensureAllProductsLoaded: state.ensureAllProductsLoaded,
        fullProductsLoaded: state.fullProductsLoaded,
        settings: state.settings,
        path: state.path,
    }));
    
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceLimit, setPriceLimit] = useState(2500);
    const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'popular'>('default');

    useEffect(() => {
        if (!fullProductsLoaded) {
            ensureAllProductsLoaded();
        }
    }, [ensureAllProductsLoaded, fullProductsLoaded]);

    // Categories list from settings or defaults
    const categories = useMemo(() => {
      const list = settings?.categories && settings.categories.length > 0
        ? settings.categories
        : ['Premium Collection', 'Classic Collection', 'Luxury Collection', 'New Arrivals', 'Limited Edition'];
      return ['All', ...list];
    }, [settings]);

    // Sync selected category if navigated with a category parameter or category route
    useEffect(() => {
      let catFromUrl = '';
      if (path) {
        if (path.includes('category=')) {
          const queryString = path.includes('?') ? path.substring(path.indexOf('?')) : window.location.search;
          const params = new URLSearchParams(queryString);
          const qCat = params.get('category');
          if (qCat) catFromUrl = qCat;
        } else if (path.startsWith('/category/')) {
          const rawSlug = decodeURIComponent(path.split('/')[2] || '').trim();
          if (rawSlug) catFromUrl = rawSlug;
        }
      }
      if (!catFromUrl && window.location.search.includes('category=')) {
        const params = new URLSearchParams(window.location.search);
        const qCat = params.get('category');
        if (qCat) catFromUrl = qCat;
      }

      if (catFromUrl) {
        const matched = categories.find(c => 
          c.toLowerCase().trim() === catFromUrl.toLowerCase().trim() ||
          c.toLowerCase().replace(/\s+/g, '-') === catFromUrl.toLowerCase().replace(/\s+/g, '-')
        );
        setSelectedCategory(matched || catFromUrl);
      }
    }, [path, categories]);

    // Filter and Sort Logic
    const filteredProducts = useMemo(() => {
      let result = products.filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
        const matchesPrice = p.price <= priceLimit;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) || 
                              (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase().trim()));
        return matchesCategory && matchesPrice && matchesSearch;
      });

      // Sort
      if (sortBy === 'price-asc') {
        result = [...result].sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        result = [...result].sort((a, b) => b.price - a.price);
      } else if (sortBy === 'popular') {
        result = [...result].sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
      }

      return result;
    }, [products, selectedCategory, priceLimit, searchTerm, sortBy]);

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, priceLimit, searchTerm, sortBy]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const productsPerPage = 12;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const currentProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return filteredProducts.slice(startIndex, startIndex + productsPerPage);
    }, [currentPage, filteredProducts, productsPerPage]);

    const hasActiveFilters = selectedCategory !== 'All' || searchTerm.trim() !== '' || priceLimit < 2500 || sortBy !== 'default';

    const handleResetFilters = () => {
      setSelectedCategory('All');
      setSearchTerm('');
      setPriceLimit(2500);
      setSortBy('default');
    };

    return (
      <main className="bg-[#FAF8F5] text-stone-900 min-h-screen pb-24 font-sans">
        
        {/* Banner / Header Section (Hidden on mobile/phone screens) */}
        <section className="hidden md:block bg-stone-900 text-white pt-[145px] sm:pt-[160px] md:pt-[175px] lg:pt-[185px] pb-10 sm:pb-14 px-4 sm:px-8 border-b border-stone-800 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          
          <div className="max-w-6xl mx-auto text-center relative z-10 space-y-3">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase text-amber-400/90 block">
              TAATROOP LUNGI COLLECTION
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-amber-50">
              আমাদের সকল লুঙ্গি কালেকশন
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              সিরাজগঞ্জের ঐতিহ্যবাহী হস্তচালিত তাঁতের খাঁটি সুতি ডাবল-সুতার তৈরি প্রিমিয়াম লুঙ্গির সম্পূর্ণ ক্যাটালগ
            </p>
          </div>
        </section>

        <div className="max-w-[1550px] mx-auto px-4 sm:px-8 lg:px-12 pt-[125px] sm:pt-[140px] md:pt-0 mt-2 md:mt-8">

          {/* Toolbar: Search, Sort, Filter Drawer Trigger */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 my-6 bg-white p-3.5 sm:p-4 border border-stone-200 shadow-sm rounded-lg">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="নাম বা ক্যাটালগ দিয়ে লুঙ্গি খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-[#FAF8F5] border border-stone-300 rounded text-xs text-stone-900 outline-none focus:border-stone-900 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800 p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort & Filter Controls */}
            <div className="flex items-center gap-3 justify-between md:justify-end">
              
              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-2 border border-stone-300 bg-[#FAF8F5] px-3 py-2 rounded text-xs">
                <ArrowUpDown size={14} className="text-stone-500" />
                <span className="text-stone-500 font-medium hidden sm:inline">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-stone-900 outline-none cursor-pointer"
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="popular">Popular Collections</option>
                </select>
              </div>

              {/* Filter Drawer Toggle Button */}
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center space-x-2 bg-stone-900 text-white px-4 py-2.5 rounded text-xs font-bold tracking-wider uppercase hover:bg-stone-800 transition-colors shadow-sm"
              >
                <SlidersHorizontal size={14} />
                <span>Filter</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse ml-1" />
                )}
              </button>

            </div>
          </div>

          {/* Active Filter Chips & Product Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">
                মোট <strong className="text-stone-900 font-bold">{filteredProducts.length}</strong> টি পণ্য পাওয়া গেছে
              </span>

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100/90 text-amber-950 text-[11px] font-bold rounded-full border border-amber-200">
                  <span>{selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-red-700">
                    <X size={12} />
                  </button>
                </span>
              )}

              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200 text-stone-900 text-[11px] font-bold rounded-full border border-stone-300">
                  <span>খোঁজ: "{searchTerm}"</span>
                  <button onClick={() => setSearchTerm('')} className="hover:text-red-700">
                    <X size={12} />
                  </button>
                </span>
              )}

              {priceLimit < 2500 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200 text-stone-900 text-[11px] font-bold rounded-full border border-stone-300">
                  <span>সর্বোচ্চ: ৳{priceLimit}</span>
                  <button onClick={() => setPriceLimit(2500)} className="hover:text-red-700">
                    <X size={12} />
                  </button>
                </span>
              )}

              {hasActiveFilters && (
                <button 
                  onClick={handleResetFilters}
                  className="text-xs text-amber-900 hover:underline font-bold flex items-center gap-1 ml-2"
                >
                  <RefreshCw size={12} />
                  <span>সব ফিল্টার মুছুন</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Drawer Modal */}
          <AnimatePresence>
            {isFilterOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
                  onClick={() => setIsFilterOpen(false)}
                />
                
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[151] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
                >
                  <div>
                    <div className="flex justify-between items-center pb-4 border-b border-stone-200 mb-6">
                      <div className="flex items-center gap-2">
                        <Filter size={18} className="text-amber-800" />
                        <h3 className="font-serif text-lg font-bold text-stone-900">Filter Options</h3>
                      </div>
                      <button onClick={() => setIsFilterOpen(false)} className="p-1.5 text-stone-400 hover:text-stone-900">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Category Selection */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">ক্যাটাগরি সমূহ</h4>
                        <div className="space-y-1.5">
                          {categories.map(cat => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`w-full text-left text-xs py-2.5 px-3 rounded-none transition-colors flex items-center justify-between ${
                                selectedCategory === cat 
                                  ? 'bg-stone-900 text-white font-bold' 
                                  : 'bg-stone-50 text-stone-800 hover:bg-stone-100 border border-stone-200/80'
                              }`}
                            >
                              <span>{cat === 'All' ? 'ALL COLLECTIONS' : cat}</span>
                              {selectedCategory === cat && <span className="text-amber-400 text-xs">✓</span>}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price Range Slider */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">সর্বোচ্চ বাজেট:</h4>
                          <span className="font-bold text-xs text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            ৳ {priceLimit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="400"
                          max="2500"
                          step="50"
                          value={priceLimit}
                          onChange={(e) => setPriceLimit(Number(e.target.value))}
                          className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                        />
                        <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                          <span>৳ ৪০০</span>
                          <span>৳ ২৫০০</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-stone-200 flex space-x-3">
                    <button
                      onClick={handleResetFilters}
                      className="w-1/2 py-3 border border-stone-300 text-xs font-bold uppercase tracking-wider text-stone-800 hover:bg-stone-100 rounded"
                    >
                      রিসেট
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-1/2 py-3 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 rounded shadow-md"
                    >
                      প্রয়োগ করুন
                    </button>
                  </div>

                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          {isInitialLoading && products.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4">
              {[...Array(10)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-stone-200 rounded-lg p-8 my-4 shadow-sm">
              <div className="w-12 h-12 bg-amber-50 text-amber-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">কোনো লুঙ্গি পাওয়া যায়নি</h3>
              <p className="text-stone-500 text-xs mb-5">আপনার নির্বাচিত ক্যাটাগরি বা ফিল্টারের সাথে মিলে এমন প্রোডাক্ট পাওয়া যায়নি।</p>
              <button 
                onClick={handleResetFilters}
                className="bg-stone-900 text-white text-xs font-bold px-6 py-3 uppercase tracking-wider rounded hover:bg-stone-800 transition-colors shadow"
              >
                সব প্রোডাক্ট দেখুন
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4">
                {currentProducts.map((product, idx) => (
                  <motion.div
                    key={`shopproduct-${product.id || product.productId || idx}-${idx}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (idx % 4) * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-6 border-t border-stone-200">
                  <span className="text-xs text-stone-500 font-medium">
                    পৃষ্ঠা <strong className="text-stone-900">{currentPage}</strong> / {totalPages}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-white border border-stone-300 text-stone-800 rounded disabled:opacity-40 hover:bg-stone-100 transition-colors"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 text-xs font-bold rounded transition-colors ${
                          currentPage === page 
                            ? 'bg-stone-900 text-white shadow-sm' 
                            : 'bg-white border border-stone-300 text-stone-800 hover:bg-stone-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 bg-white border border-stone-300 text-stone-800 rounded disabled:opacity-40 hover:bg-stone-100 transition-colors"
                      aria-label="Next Page"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </main>
    );
};

export default ShopPage;

