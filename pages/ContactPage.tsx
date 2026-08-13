
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Music2 as Tiktok } from 'lucide-react';
import { useAppStore } from '../store';
import { motion } from 'motion/react';
import { Skeleton, Shimmer } from '../components/Skeleton';

const ContactSkeleton: React.FC = () => (
    <main className="max-w-[1550px] mx-auto px-6 sm:px-12 lg:px-24 pt-32 sm:pt-48 pb-24 overflow-hidden">
        <div className="flex flex-col items-center mb-32 text-center">
            <Skeleton className="h-3 w-32 mb-6" />
            <Skeleton className="h-16 w-3/4 max-w-xl mb-10" />
            <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
            <div className="lg:col-span-5 h-[600px]">
                <Shimmer className="h-full w-full rounded-[4rem]" />
            </div>
            <div className="lg:col-span-7 h-[600px]">
                <Shimmer className="h-full w-full" />
            </div>
        </div>
    </main>
);

const ContactPage: React.FC = () => {
  const { addContactMessage, notify, settings, loading } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
        notify('Please provide all details.', 'error');
        return;
    }

    setIsSubmitting(true);
    try {
      await addContactMessage(formData);
      notify('Thank you for reaching out. We will contact you shortly.', 'success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      notify('Failed to transmit message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <ContactSkeleton />;

  return (
    <main className="max-w-[1550px] mx-auto px-4 sm:px-12 lg:px-24 pb-16 sm:pb-24 overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col items-center mt-4 sm:mt-8 mb-12 sm:mb-16 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-amber-800 uppercase tracking-[0.25em] mb-3"
          >
            TAATROOP CUSTOMER SUPPORT
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight"
          >
            CONTACT & SUPPORT
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-stone-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto px-4"
          >
            আপনার যেকোনো প্রশ্ন, পরামর্শ, অর্ডার বা সহায়তার প্রয়োজন হলে নির্দ্বিধায় আমাদের সঙ্গে যোগাযোগ করুন। আমাদের টিম যত দ্রুত সম্ভব আপনার বার্তার উত্তর দেওয়ার সর্বোচ্চ চেষ্টা করবে।
          </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Contact Info - Left */}
        <div className="lg:col-span-5 space-y-8 sm:space-y-12">
          <div className="bg-[#FAF8F5] p-6 sm:p-10 rounded-xl border border-stone-200 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-transform duration-1000 group-hover:scale-110" />
            
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mb-6 relative z-10">জরুরি যোগাযোগ ইনফো</h3>
            
            <div className="space-y-6 relative z-10">
                {settings?.contactAddress && (
                    <div className="flex gap-4 group/item">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-white border border-stone-200 flex items-center justify-center transition-all duration-300 group-hover/item:bg-stone-900 group-hover/item:border-stone-900">
                            <MapPin className="w-4 h-4 text-amber-900 transition-colors group-hover/item:text-amber-400" />
                        </div>
                        <div className="flex-1 pt-1">
                            <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-0.5">ঠিকানা / Address</p>
                            <p className="text-xs sm:text-sm font-medium text-stone-800 leading-relaxed whitespace-pre-wrap">{settings.contactAddress}</p>
                        </div>
                    </div>
                )}
                
                {settings?.contactPhone && (
                    <div className="flex gap-4 group/item">
                         <div className="w-10 h-10 shrink-0 rounded-full bg-white border border-stone-200 flex items-center justify-center transition-all duration-300 group-hover/item:bg-stone-900 group-hover/item:border-stone-900">
                            <Phone className="w-4 h-4 text-amber-900 transition-colors group-hover/item:text-amber-400" />
                        </div>
                        <div className="flex-1 pt-1">
                            <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-0.5">হটলাইন / Phone</p>
                            <a href={`tel:${settings.contactPhone}`} className="text-xs sm:text-sm font-medium text-stone-900 hover:text-amber-900 transition-colors">{settings.contactPhone}</a>
                        </div>
                    </div>
                )}

                {settings?.contactEmail && (
                    <div className="flex gap-4 group/item">
                         <div className="w-10 h-10 shrink-0 rounded-full bg-white border border-stone-200 flex items-center justify-center transition-all duration-300 group-hover/item:bg-stone-900 group-hover/item:border-stone-900">
                            <Mail className="w-4 h-4 text-amber-900 transition-colors group-hover/item:text-amber-400" />
                        </div>
                        <div className="flex-1 pt-1">
                            <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-0.5">ইমেইল / Email</p>
                            <a href={`mailto:${settings.contactEmail}`} className="text-xs sm:text-sm font-medium text-stone-900 hover:text-amber-900 transition-colors break-all block">{settings.contactEmail}</a>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-stone-200/80">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">কাস্টমার সার্ভিস সময়সূচী</p>
                    <div className="space-y-1 text-xs font-medium text-stone-700 leading-relaxed">
                        <p>রবি - বৃহস্পতি: ১০:০০ AM - ৮:০০ PM</p>
                        <p>শুক্রবার: ২:০০ PM - ৮:০০ PM</p>
                    </div>
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">সোশ্যাল মিডিয়া</p>
                     <div className="flex gap-3">
                        <a 
                          href={settings?.socialMediaLinks?.find(l => l.platform?.toLowerCase().includes('instagram'))?.url || "https://instagram.com"} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          aria-label="Instagram"
                          className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:text-white hover:bg-amber-900 hover:border-amber-900 transition-all duration-300 shadow-xs"
                        >
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a 
                          href={settings?.socialMediaLinks?.find(l => l.platform?.toLowerCase().includes('facebook'))?.url || "https://facebook.com"} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          aria-label="Facebook"
                          className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:text-white hover:bg-amber-900 hover:border-amber-900 transition-all duration-300 shadow-xs"
                        >
                            <Facebook className="w-4 h-4" />
                        </a>
                        <a 
                          href={settings?.socialMediaLinks?.find(l => l.platform?.toLowerCase().includes('tiktok'))?.url || "https://tiktok.com"} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          aria-label="TikTok"
                          className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:text-white hover:bg-amber-900 hover:border-amber-900 transition-all duration-300 shadow-xs"
                        >
                            <Tiktok className="w-4 h-4" />
                        </a>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Contact Form - Right */}
        <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-10 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mb-6">আমাদের মেসেজ দিন</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">আপনার নাম *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                        className="w-full px-4 py-3 rounded border border-stone-300 bg-white text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-all"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">ইমেইল ঠিকানা / ফোন নম্বর *</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ইমেইল বা ফোন নম্বর দিন"
                        className="w-full px-4 py-3 rounded border border-stone-300 bg-white text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-all"
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="message" className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">আপনার বার্তা *</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="আপনার প্রশ্ন বা মতামত এখানে বিস্তারিত লিখুন..."
                    className="w-full px-4 py-3 rounded border border-stone-300 bg-white text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-all resize-none min-h-[140px]"
                    required
                ></textarea>
            </div>
            
            <div className="pt-2">
                <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded bg-stone-900 text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-stone-800 active:scale-95 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md"
                >
                <span>{isSubmitting ? 'পাঠানো হচ্ছে...' : 'মেসেজ পাঠান'}</span>
                {!isSubmitting && <Send className="w-4 h-4 opacity-70" />}
                </button>
            </div>
          </form>
        </div>
      </div>

      {/* Map Section */}
      {settings?.contactMapEmbed && (
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="mt-20 sm:mt-32 w-full"
        >
          <div className="relative group rounded-none overflow-hidden border border-stone-100 shadow-[0_30px_100px_rgba(0,0,0,0.03)] bg-white p-4 sm:p-6">
            <div className="absolute top-0 left-0 w-32 h-32 bg-stone-50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="mb-8 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-bold text-[#23412F] uppercase tracking-widest mb-3 block">Visit Us</span>
                <h3 className="text-2xl sm:text-3xl font-fashion italic text-stone-900">Find Our Atelier</h3>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-50 px-6 py-2 rounded-full border border-stone-100">
                <MapPin className="w-3.5 h-3.5" />
                <span>Navigating Your Style</span>
              </div>
            </div>
            
            <div className="w-full aspect-[16/9] sm:aspect-[21/9] bg-stone-50 relative">
              {settings.contactMapEmbed.includes('<iframe') ? (
                <div 
                  className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:absolute [&>iframe]:inset-0 border-0"
                  dangerouslySetInnerHTML={{ __html: settings.contactMapEmbed }}
                />
              ) : (
                <iframe
                  title="Google Maps Location"
                  src={settings.contactMapEmbed}
                  className="w-full h-full absolute inset-0 border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
};

export default ContactPage;
