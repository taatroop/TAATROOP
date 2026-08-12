
import React, { useState, useEffect, memo } from 'react';
import { ShoppingCart, Menu, X, Search, User, Phone, Truck, ChevronDown, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';

const TaatroopLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center cursor-pointer select-none ${className}`}>
    <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-stone-900">
      তাঁতরূপ
    </span>
  </div>
);

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { navigate, cart, settings } = useAppStore(state => ({
    navigate: state.navigate,
    cart: state.cart,
    settings: state.settings
  }));

  const cartItemCount = cart.reduce((total, item: any) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile full screen menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleNavClick = (navPath: string) => {
    navigate(navPath);
    setIsMenuOpen(false);
  };

  const categoriesList = React.useMemo(() => {
    const raw = settings?.categories && settings.categories.length > 0
      ? settings.categories
      : ['Premium Collection', 'Classic Collection', 'Luxury Collection', 'New Arrivals', 'Limited Edition'];
    const paused = settings?.pausedCategories || [];
    return raw.filter((cat: string) => !paused.includes(cat));
  }, [settings?.categories, settings?.pausedCategories]);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'COLLECTIONS', path: '/shop', hasDropdown: true },
    { label: 'OUR STORY', path: '/our-story' },
    { label: 'CONTACT', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100]">
      {/* Top Announcement Bar */}
      <div className="bg-[#23412F] text-white py-1.5 px-4 md:px-8 text-[10px] md:text-[11px] font-sans tracking-wide">
        <div className="max-w-[1550px] mx-auto flex items-center justify-between text-stone-100">
          {settings?.freeShippingEnabled ? (
            <div className="w-full flex items-center justify-center space-x-2">
              <Truck size={13} className="text-[#E8E1D7]" />
              <span className="font-semibold uppercase tracking-wider">FREE DELIVERY ALL OVER BANGLADESH</span>
            </div>
          ) : (
            <>
              {/* Desktop Left Corner */}
              <div className="hidden md:block font-medium uppercase tracking-widest text-[#E8E1D7]/90 text-[10px]">
                PREMIUM HANDLOOM LUNGI FROM SIRAJGANJ
              </div>
              {/* Desktop Right Corner / Mobile Center */}
              <div className="w-full md:w-auto flex items-center justify-center md:justify-end space-x-1">
                <Phone size={12} className="text-[#E8E1D7]" />
                <span className="font-semibold tracking-wider">CUSTOMER SUPPORT: +880 1640-292650</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`w-full transition-all duration-300 bg-[#F8F5F0] border-b border-[#E8E1D7] ${
        isScrolled ? 'shadow-md py-2.5' : 'py-3 md:py-4'
      }`}>
        <div className="max-w-[1550px] mx-auto px-4 md:px-8 flex justify-between items-center">
          
          {/* Logo */}
          <div onClick={() => handleNavClick('/')} className="cursor-pointer">
            {settings?.headerLogoImage ? (
              <div className="flex items-center">
                {/* Phone / Mobile image logo */}
                <img 
                  src={settings.headerLogoImage} 
                  alt="Taatroop Logo" 
                  style={{ maxHeight: `${settings.headerLogoHeightMobile || 50}px` }}
                  className="md:hidden object-contain w-auto h-auto max-w-[180px]"
                />
                {/* PC / Desktop image logo */}
                <img 
                  src={settings.headerLogoImage} 
                  alt="Taatroop Logo" 
                  style={{ maxHeight: `${settings.headerLogoHeight || 60}px` }}
                  className="hidden md:block object-contain w-auto h-auto max-w-[260px]"
                />
              </div>
            ) : (
              <TaatroopLogo />
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
            {navLinks.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.label} className="relative group py-2">
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className="text-[11px] xl:text-[12px] font-sans font-bold tracking-[0.15em] text-[#23412F] hover:text-[#1B3225] transition-colors uppercase flex items-center space-x-1"
                    >
                      <span>{item.label}</span>
                      <ChevronDown size={12} className="text-[#6B4A2F] group-hover:text-[#23412F] transition-transform group-hover:rotate-180" />
                    </button>

                    {/* Hover Dropdown Menu */}
                    <div className="absolute top-full left-0 w-56 bg-white border border-[#E8E1D7] shadow-xl rounded-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[110] py-2">
                      <button
                        onClick={() => handleNavClick('/shop')}
                        className="w-full text-left px-4 py-2 text-[11px] font-bold text-stone-900 hover:bg-[#F8F5F0] hover:text-[#23412F] transition-colors uppercase tracking-wider"
                      >
                        All Products
                      </button>
                      <div className="border-t border-stone-100 my-1" />
                      {categoriesList.map((cat: string) => (
                        <button
                          key={cat}
                          onClick={() => handleNavClick(`/shop?category=${encodeURIComponent(cat)}`)}
                          className="w-full text-left px-4 py-2 text-[11px] font-medium text-stone-700 hover:bg-[#F8F5F0] hover:text-[#23412F] transition-colors uppercase tracking-wider"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.path)}
                  className="text-[11px] xl:text-[12px] font-sans font-bold tracking-[0.15em] text-[#23412F] hover:text-[#1B3225] transition-colors uppercase flex items-center space-x-1"
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Icons: Search, Cart */}
          <div className="flex items-center space-x-5 md:space-x-6 text-[#6B4A2F]">
            <button 
              onClick={() => handleNavClick('/shop')}
              className="hover:text-[#23412F] transition-colors p-1"
              title="Search"
            >
              <Search size={21} strokeWidth={1.8} className="text-[#6B4A2F] hover:text-[#23412F]" />
            </button>

            <button 
              onClick={() => handleNavClick('/cart')}
              className="relative hover:text-[#23412F] transition-colors p-1 group"
              title="Shopping Cart"
            >
              <ShoppingCart size={22} strokeWidth={1.8} className="text-[#6B4A2F] hover:text-[#23412F]" />
              <span className="absolute -top-1.5 -right-2 bg-[#23412F] text-white text-[10px] font-bold w-[20px] h-[20px] rounded-full flex items-center justify-center border border-white shadow-sm">
                {cartItemCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 lg:hidden text-[#23412F]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Menu - Full Screen Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-[300] bg-[#F8F5F0] text-stone-900 w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-start p-6 sm:p-8 overflow-y-auto"
          >
            {/* Top Bar inside Full Screen Overlay */}
            <div className="flex justify-between items-center border-b border-[#E8E1D7] pb-4 mb-3">
              <div onClick={() => handleNavClick('/')} className="cursor-pointer">
                {settings?.headerLogoImage ? (
                  <img 
                    src={settings.headerLogoImage} 
                    alt="Taatroop Logo" 
                    className="max-h-[45px] object-contain w-auto h-auto"
                  />
                ) : (
                  <TaatroopLogo />
                )}
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-[#23412F]/10 flex items-center justify-center text-[#23412F] hover:bg-[#23412F] hover:text-white transition-all cursor-pointer"
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Navigation Links - Pushed towards the top with comfortable padding */}
            <nav className="flex flex-col space-y-1 mt-4 sm:mt-6 mb-6">
              {navLinks.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => handleNavClick(item.path)}
                  className="flex justify-between items-center text-left py-2.5 border-b border-[#E8E1D7] group cursor-pointer"
                >
                  <span className="font-sans text-xs sm:text-sm font-normal tracking-wider text-[#23412F] group-hover:text-[#6B4A2F] transition-colors uppercase">
                    {item.label}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[#E8E1D7]/50 flex items-center justify-center text-[#23412F] group-hover:bg-[#23412F] group-hover:text-white transition-all">
                    <ArrowRight size={13} />
                  </div>
                </motion.button>
              ))}
            </nav>

            {/* Bottom Actions & Support Info - Pushed to bottom */}
            <div className="space-y-3 pt-3 mt-auto border-t border-[#E8E1D7]">
              <button
                onClick={() => handleNavClick('/shop')}
                className="w-full bg-[#23412F] text-white py-3.5 px-6 rounded-none text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center space-x-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingCart size={16} />
                <span>EXPLORE ALL LUNGI</span>
              </button>

              <div className="bg-[#E8E1D7]/40 p-3 rounded-lg flex items-center justify-center space-x-2 text-stone-600 text-xs font-medium">
                <Phone size={14} className="text-[#23412F]" />
                <span>Customer Support: +880 1640-292650</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default memo(Header);
