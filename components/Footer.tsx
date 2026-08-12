
import React, { memo, useState } from 'react';
import { Facebook, Instagram, Youtube, Phone, Send, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store';

const Footer: React.FC = () => {
    const { navigate, settings } = useAppStore(state => ({
        navigate: state.navigate,
        settings: state.settings
    }));
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const addContactMessage = useAppStore(state => state.addContactMessage);
    const notify = useAppStore(state => state.notify);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newsletterEmail) return;
        setIsSubscribing(true);
        try {
            await addContactMessage({
                name: 'Newsletter Subscriber',
                email: newsletterEmail,
                message: 'New subscription request from TAATROOP footer.'
            });
            notify('Thank you for subscribing!', 'success');
            setNewsletterEmail('');
        } catch (error) {
            notify('Subscription failed. Please try again.', 'error');
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
      <footer className="bg-[#F8F5F0] border-t border-[#E8E1D7] text-stone-900 text-xs font-sans">
        {/* Main Footer Content */}
        <div className="max-w-[1550px] mx-auto px-6 md:px-12 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 xl:gap-12">
            
            {/* Column 1: Brand Info */}
            <div className="flex flex-col space-y-5">
              <div onClick={() => navigate('/')} className="cursor-pointer flex items-center">
                {settings?.headerLogoImage ? (
                  <img 
                    src={settings.headerLogoImage} 
                    alt="Taatroop Logo" 
                    className="object-contain w-auto h-auto max-h-[60px] max-w-[240px]"
                  />
                ) : (
                  <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight leading-tight text-[#23412F]">তাঁতরূপ</h3>
                )}
              </div>

              <p className="text-stone-600 leading-relaxed text-[11px] max-w-xs font-medium">
                Premium handloom lungi crafted with care, tradition and trust.
              </p>

              {/* Social Icons */}
              <div className="flex items-center space-x-3 pt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-[#E8E1D7] flex items-center justify-center text-[#6B4A2F] hover:bg-[#23412F] hover:text-white transition-colors">
                  <Facebook size={14} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-[#E8E1D7] flex items-center justify-center text-[#6B4A2F] hover:bg-[#23412F] hover:text-white transition-colors">
                  <Instagram size={14} />
                </a>
                <a href="https://wa.me/8801640292650" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-[#E8E1D7] flex items-center justify-center text-[#6B4A2F] hover:bg-[#23412F] hover:text-white transition-colors">
                  <Phone size={14} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-[#E8E1D7] flex items-center justify-center text-[#6B4A2F] hover:bg-[#23412F] hover:text-white transition-colors">
                  <Youtube size={14} />
                </a>
              </div>
            </div>

            {/* Column 2: COLLECTIONS */}
            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] text-[#23412F] mb-4">COLLECTIONS</h4>
              <ul className="space-y-2.5 text-[11px] text-stone-600 font-medium">
                <li>
                  <button 
                    onClick={() => navigate('/shop')} 
                    className="hover:text-[#23412F] transition-colors text-left"
                  >
                    All Products
                  </button>
                </li>
                {(() => {
                  const rawCats = settings?.categories && settings.categories.length > 0
                    ? settings.categories
                    : ['Premium Collection', 'Classic Collection', 'Luxury Collection', 'New Arrivals', 'Limited Edition'];
                  const paused = settings?.pausedCategories || [];
                  const activeCats = rawCats.filter((c: string) => !paused.includes(c));
                  return activeCats.map((cat: string) => (
                    <li key={cat}>
                      <button 
                        onClick={() => navigate(`/shop?category=${encodeURIComponent(cat)}`)} 
                        className="hover:text-[#23412F] transition-colors text-left"
                      >
                        {cat}
                      </button>
                    </li>
                  ));
                })()}
              </ul>
            </div>

            {/* Column 3: CUSTOMER CARE */}
            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] text-[#23412F] mb-4">CUSTOMER CARE</h4>
              <ul className="space-y-2.5 text-[11px] text-stone-600 font-medium">
                <li><button onClick={() => navigate('/contact')} className="hover:text-[#23412F] transition-colors">Contact Support</button></li>
                <li><button onClick={() => navigate('/policy')} className="hover:text-[#23412F] transition-colors">Shipping Policy</button></li>
                <li><button onClick={() => navigate('/policy')} className="hover:text-[#23412F] transition-colors">Returns & Exchanges</button></li>
                <li><button onClick={() => navigate('/policy')} className="hover:text-[#23412F] transition-colors">Refund Policy</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-[#23412F] transition-colors">Track Order</button></li>
              </ul>
            </div>

            {/* Column 4: COMPANY */}
            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] text-[#23412F] mb-4">COMPANY</h4>
              <ul className="space-y-2.5 text-[11px] text-stone-600 font-medium">
                <li><button onClick={() => navigate('/our-story')} className="hover:text-[#23412F] transition-colors">About Us</button></li>
                <li><button onClick={() => navigate('/our-story')} className="hover:text-[#23412F] transition-colors">Our Story</button></li>
                <li><button onClick={() => navigate('/our-story')} className="hover:text-[#23412F] transition-colors">Why Taatroop?</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-[#23412F] transition-colors">Contact Us</button></li>
                <li><button onClick={() => navigate('/policy')} className="hover:text-[#23412F] transition-colors">Privacy Policy</button></li>
              </ul>
            </div>

            {/* Column 5: NEWSLETTER */}
            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] text-[#23412F] mb-4">NEWSLETTER</h4>
              <p className="text-stone-600 leading-relaxed text-[11px] mb-4 font-medium">
                Subscribe to get special offers, new arrivals and more.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex items-center">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2.5 bg-white border border-[#E8E1D7] text-[11px] outline-none text-stone-800 placeholder:text-stone-400 focus:border-[#23412F]"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-[#23412F] text-white p-2.5 px-3 hover:bg-[#1B3225] transition-colors disabled:opacity-50"
                >
                  <Send size={14} className="text-white" />
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-[#23412F] text-stone-100 py-4 px-6 md:px-12 text-[11px] border-t border-[#1B3225]">
          <div className="max-w-[1550px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              © 2026 Taatroop. All Rights Reserved.
            </div>

            <div className="flex items-center space-x-4">
              {/* Payment Methods */}
              <div className="flex items-center space-x-2 text-[10px] font-bold">
                <span className="px-2 py-0.5 bg-pink-600 text-white rounded font-black tracking-tight">bKash</span>
                <span className="px-2 py-0.5 bg-orange-600 text-white rounded font-black tracking-tight">Nagad</span>
              </div>
              <span className="text-emerald-200/40">|</span>
              <div className="flex items-center space-x-1 text-[#E8E1D7] font-bold uppercase tracking-wider text-[10px]">
                <span>🚚 CASH ON DELIVERY</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
};

export default memo(Footer);
