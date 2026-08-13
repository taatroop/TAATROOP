
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import { LoaderCircle, ChevronDown, Check, ShieldCheck, Lock, ShoppingBag, Search, MapPin, X } from 'lucide-react';
import { trackServerEvent } from '../services/trackingService';
import { motion, AnimatePresence } from 'motion/react';
import { Skeleton, Shimmer, TextSkeleton } from '../components/Skeleton';

const BANGLADESH_DISTRICTS = [
  { en: "Bagerhat", bn: "বাগেরহাট" },
  { en: "Bandarban", bn: "বান্দরবান" },
  { en: "Barguna", bn: "বরগুনা" },
  { en: "Barishal", bn: "বরিশাল" },
  { en: "Bhola", bn: "ভোলা" },
  { en: "Bogura", bn: "বগুড়া" },
  { en: "Brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া" },
  { en: "Chandpur", bn: "চাঁদপুর" },
  { en: "Chapainawabganj", bn: "চাঁপাইনবাবগঞ্জ" },
  { en: "Chattogram", bn: "চট্টগ্রাম" },
  { en: "Chuadanga", bn: "চুয়াডাঙ্গা" },
  { en: "Cumilla", bn: "কুমিল্লা" },
  { en: "Cox's Bazar", bn: "কক্সবাজার" },
  { en: "Dhaka", bn: "ঢাকা" },
  { en: "Dinajpur", bn: "দিনাজপুর" },
  { en: "Faridpur", bn: "ফরিদপুর" },
  { en: "Feni", bn: "ফেনী" },
  { en: "Gaibandha", bn: "গাইবান্ধা" },
  { en: "Gazipur", bn: "গাজীপুর" },
  { en: "Gopalganj", bn: "গোপালগঞ্জ" },
  { en: "Habiganj", bn: "হবিগঞ্জ" },
  { en: "Jamalpur", bn: "জামালপুর" },
  { en: "Jashore", bn: "যশোর" },
  { en: "Jhalokati", bn: "ঝালকাঠি" },
  { en: "Jhenaidah", bn: "ঝিনাইদহ" },
  { en: "Joypurhat", bn: "জয়পুরহাট" },
  { en: "Khagrachhari", bn: "খাগড়াছড়ি" },
  { en: "Khulna", bn: "খুলনা" },
  { en: "Kishoreganj", bn: "কিশোরগঞ্জ" },
  { en: "Kurigram", bn: "কুড়িগ্রাম" },
  { en: "Kushtia", bn: "কুষ্টিয়া" },
  { en: "Lakshmipur", bn: "লক্ষ্মীপুর" },
  { en: "Lalmonirhat", bn: "লালমনিরহাট" },
  { en: "Madaripur", bn: "মাদারীপুর" },
  { en: "Magura", bn: "মাগুরা" },
  { en: "Manikganj", bn: "মানিকগঞ্জ" },
  { en: "Meherpur", bn: "মেহেরপুর" },
  { en: "Moulvibazar", bn: "মৌলভীবাজার" },
  { en: "Munshiganj", bn: "মুন্সীগঞ্জ" },
  { en: "Mymensingh", bn: "ময়মনসিংহ" },
  { en: "Naogaon", bn: "নওগাঁ" },
  { en: "Narail", bn: "নড়াইল" },
  { en: "Narayanganj", bn: "নারায়ণগঞ্জ" },
  { en: "Narsingdi", bn: "নরসিংদী" },
  { en: "Natore", bn: "নাটোর" },
  { en: "Netrokona", bn: "নেত্রকোনা" },
  { en: "Nilphamari", bn: "নীলফামারী" },
  { en: "Noakhali", bn: "নোয়াখালী" },
  { en: "Pabna", bn: "পাবনা" },
  { en: "Panchagarh", bn: "পঞ্চগড়" },
  { en: "Patuakhali", bn: "পটুয়াখালী" },
  { en: "Pirojpur", bn: "পিরোজপুর" },
  { en: "Rajbari", bn: "রাজবাড়ী" },
  { en: "Rajshahi", bn: "রাজশাহী" },
  { en: "Rangamati", bn: "রাঙ্গামাটি" },
  { en: "Rangpur", bn: "রংপুর" },
  { en: "Satkhira", bn: "সাতক্ষীরা" },
  { en: "Shariatpur", bn: "শরীয়তপুর" },
  { en: "Sherpur", bn: "শেরপুর" },
  { en: "Sirajganj", bn: "সিরাজগঞ্জ" },
  { en: "Sunamganj", bn: "সুনামগঞ্জ" },
  { en: "Sylhet", bn: "সিলেট" },
  { en: "Tangail", bn: "টাঙ্গাইল" },
  { en: "Thakurgaon", bn: "ঠাকুরগাঁও" }
].sort((a, b) => a.en.localeCompare(b.en));

const InputField: React.FC<{ 
    label: string; 
    name: string; 
    type?: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; 
    required?: boolean; 
    error?: boolean;
    placeholder?: string;
}> = ({ label, name, type = 'text', value, onChange, required = true, error, placeholder }) => {
    return (
        <div className="flex flex-col space-y-1.5">
          <label htmlFor={name} className="text-[11px] sm:text-xs font-bold text-[#23412F] uppercase tracking-wider ml-1">
            {label} {required && <span className="text-[#23412F] ml-0.5">*</span>}
          </label>
          <input 
            type={type} 
            id={name} 
            name={name} 
            value={value || ''} 
            onChange={onChange} 
            required={required}
            placeholder={placeholder}
            className={`w-full px-3.5 py-3 border rounded-none outline-none transition-all duration-300 bg-white text-[#23412F] text-xs sm:text-sm font-sans placeholder:text-stone-400
              ${error ? 'border-red-500' : 'border-[#E8E1D7] focus:border-[#23412F]'} 
            `} 
          />
        </div>
    );
};

const SafeHTML: React.FC<{ content: string; style?: React.CSSProperties }> = ({ content, style }) => {
    try {
        if (!content) return null;
        return (
            <div
                className="font-medium text-brand-charcoal text-xs whitespace-pre-wrap"
                style={style}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    } catch (e) {
        return <div className="font-medium text-brand-charcoal text-xs whitespace-pre-wrap" style={style}>{content}</div>;
    }
};

const CheckoutSkeleton: React.FC = () => (
    <div className="bg-brand-offwhite min-h-screen">
      <main className="container-luxury pt-[10rem] pb-60">
        <div className="flex flex-col mb-12 md:mb-32">
            <Skeleton className="h-3 w-40 mb-6 opacity-40" />
            <Skeleton className="h-20 w-full max-w-2xl" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32">
            <div className="lg:col-span-7 space-y-20 order-2 lg:order-1">
                <section className="space-y-12 bg-white p-10 border border-brand-border">
                    <Skeleton className="h-10 w-full border-b border-brand-border pb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="md:col-span-2 space-y-4">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-14 w-full rounded-none" />
                        </div>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-14 w-full rounded-none" />
                            </div>
                        ))}
                    </div>
                </section>
                <section className="space-y-12 bg-white p-10 border border-brand-border">
                    <Skeleton className="h-10 w-full border-b border-brand-border pb-4" />
                    <div className="space-y-6">
                        <Skeleton className="h-24 w-full rounded-none" />
                        <Skeleton className="h-24 w-full rounded-none opacity-40" />
                    </div>
                </section>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2 space-y-10">
                <div className="bg-stone-900/5 p-10 border border-brand-border space-y-10">
                    <Skeleton className="h-10 w-48" />
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-6">
                                <Shimmer className="w-20 h-24 flex-shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-10 border-t border-brand-border space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex justify-between pt-4">
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
);

const DEFAULT_SHIPPING_OPTIONS = [
  { id: 'inside-dhaka', label: 'ঢাকার ভেতরে (Inside Dhaka)', charge: 80 },
  { id: 'outside-dhaka', label: 'ঢাকার বাইরে (Outside Dhaka)', charge: 150 }
];

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, navigate, clearCart, notify, addOrder, settings: storeSettings, loading, products, ensureAllProductsLoaded, fullProductsLoaded } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [isAttempted, setIsAttempted] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [districtSearchQuery, setDistrictSearchQuery] = useState('');
  
  useEffect(() => {
      if (!fullProductsLoaded) {
          ensureAllProductsLoaded();
      }
  }, [fullProductsLoaded, ensureAllProductsLoaded]);

   const safeSettings = useMemo(() => {
      const configuredShipping = Array.isArray(storeSettings?.shippingOptions) && storeSettings.shippingOptions.length > 0
        ? storeSettings.shippingOptions
        : DEFAULT_SHIPPING_OPTIONS;

      if (!storeSettings) {
          return {
            codEnabled: true,
            onlinePaymentEnabled: true,
            shippingOptions: DEFAULT_SHIPPING_OPTIONS,
            onlinePaymentMethods: [],
            onlinePaymentInfo: '',
            contactPhone: '',
            freeShippingEnabled: false,
            exitIntentCouponCode: '',
            exitIntentDiscount: 0,
            exitIntentPopupEnabled: false,
          };
      }
      return {
        codEnabled: storeSettings.codEnabled ?? true,
        onlinePaymentEnabled: storeSettings.onlinePaymentEnabled ?? true,
        shippingOptions: configuredShipping,
        onlinePaymentMethods: Array.isArray(storeSettings.onlinePaymentMethods) ? storeSettings.onlinePaymentMethods : [],
        onlinePaymentInfo: typeof storeSettings.onlinePaymentInfo === 'string' ? storeSettings.onlinePaymentInfo : '',
        contactPhone: typeof storeSettings.contactPhone === 'string' ? storeSettings.contactPhone : '',
        freeShippingEnabled: storeSettings.freeShippingEnabled ?? false,
        exitIntentCouponCode: storeSettings.exitIntentCouponCode ?? '',
        exitIntentDiscount: storeSettings.exitIntentDiscount ?? 0,
        exitIntentPopupEnabled: storeSettings.exitIntentPopupEnabled ?? false,
      };
  }, [storeSettings]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    note: '',
    paymentMethod: 'COD',
    shippingOptionId: '',
    paymentNumber: '',
    onlinePaymentMethod: 'Choose',
    transactionId: '',
  });

  const safeCartTotal = Number.isFinite(cartTotal) ? cartTotal : 0;

  useEffect(() => {
    if (!loading && (!cart || cart.length === 0) && !isSubmittingRef.current) {
      navigate('/shop');
    }
  }, [loading, cart, navigate]);
  
  const isOnlinePaymentVisible = safeSettings.onlinePaymentEnabled;

  const merchantNumber = useMemo(() => {
    if (safeSettings.onlinePaymentInfo) {
      const textOnly = safeSettings.onlinePaymentInfo.replace(/<[^>]*>/g, '');
      const match = textOnly.match(/(01\d{3}[-\s]?\d{6})/);
      if (match) return match[1].replace(/\s+/g, '');
    }
    if (safeSettings.contactPhone) {
      const clean = safeSettings.contactPhone.replace(/[^\d]/g, '');
      if (clean.length >= 11) return '0' + clean.slice(-10);
    }
    return '01700000000';
  }, [safeSettings.onlinePaymentInfo, safeSettings.contactPhone]);

  useEffect(() => {
    if (loading) return; 
    setFormData(prev => {
        const newData = { ...prev };
        let changed = false;
        const isCodAvailable = safeSettings.codEnabled;
        if (!((prev.paymentMethod === 'COD' && isCodAvailable) || (prev.paymentMethod === 'Online' && isOnlinePaymentVisible))) {
            newData.paymentMethod = isCodAvailable ? 'COD' : (isOnlinePaymentVisible ? 'Online' : 'COD');
            changed = true;
        }
        if (!prev.shippingOptionId && safeSettings.shippingOptions.length > 0) {
            newData.shippingOptionId = safeSettings.shippingOptions[0].id;
            changed = true;
        }
        return changed ? newData : prev;
    });
  }, [safeSettings, loading, isOnlinePaymentVisible]);

  const selectedShippingOption = useMemo(() => {
    if (!safeSettings.shippingOptions || safeSettings.shippingOptions.length === 0) return null;
    return safeSettings.shippingOptions.find(opt => opt.id === formData.shippingOptionId) || safeSettings.shippingOptions[0];
  }, [formData.shippingOptionId, safeSettings.shippingOptions]);

  const shippingCharge = selectedShippingOption?.charge || 0;
  const isOnlinePayment = formData.paymentMethod === 'Online';
  const effectiveShippingCharge = safeSettings.freeShippingEnabled ? 0 : shippingCharge;
  const totalPayable = Math.max(0, safeCartTotal + effectiveShippingCharge - discountAmount);

  const formattedPaymentInfo = useMemo(() => {
      const info = safeSettings.onlinePaymentInfo || '';
      return info.replace(/(<\/?br\s*\/?>)\s*[\r\n]+/gi, '$1');
  }, [safeSettings.onlinePaymentInfo]);
  
  if (loading) return <CheckoutSkeleton />;

  if (!cart || cart.length === 0) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newData = { ...prev, [name]: value };
        
        // Auto-select shipping option based on city
        if (name === 'city' && safeSettings.shippingOptions.length > 0) {
            const isDhaka = value.toLowerCase().includes('dhaka');
            const matchingOption = safeSettings.shippingOptions.find(opt => 
                isDhaka ? opt.label.toLowerCase().includes('inside dhaka') : opt.label.toLowerCase().includes('outside dhaka') || opt.label.toLowerCase().includes('out side dhaka')
            );
            if (matchingOption) {
                newData.shippingOptionId = matchingOption.id;
            }
        }
        
        return newData;
    });
  };

  const handleCitySelect = (cityName: string) => {
    setFormData(prev => {
        const newData = { ...prev, city: cityName };
        
        // Auto-select shipping option based on city
        if (safeSettings.shippingOptions.length > 0) {
            const isDhaka = cityName.toLowerCase().includes('dhaka');
            const matchingOption = safeSettings.shippingOptions.find(opt => 
                isDhaka ? opt.label.toLowerCase().includes('inside dhaka') : opt.label.toLowerCase().includes('outside dhaka') || opt.label.toLowerCase().includes('out side dhaka')
            );
            if (matchingOption) {
                newData.shippingOptionId = matchingOption.id;
            }
        }
        
        return newData;
    });
  };

  const filteredDistricts = useMemo(() => {
    return BANGLADESH_DISTRICTS.filter(dist => 
        dist.en.toLowerCase().includes(districtSearchQuery.toLowerCase()) ||
        dist.bn.includes(districtSearchQuery)
    );
  }, [districtSearchQuery]);

  const isFormValid = formData.fullName?.trim() && formData.email?.trim() && formData.phone?.trim() && formData.city && formData.address?.trim();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingRef.current || isSubmitting) return;

    if (!isFormValid) {
        setIsAttempted(true);
        notify("Please fill in all required delivery details.", "error");
        return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const paymentInfo = {
        paymentMethod: formData.paymentMethod as 'COD' | 'Online',
        paymentDetails: formData.paymentMethod === 'Online' ? {
            paymentNumber: formData.paymentNumber,
            method: formData.onlinePaymentMethod,
            amount: totalPayable,
            transactionId: formData.transactionId
        } : undefined
    };
    
    try {
        const cartForOrder = cart.map(item => {
            const productInStore = products.find(p => p.id === item.id);
            const finalId = item.productId || productInStore?.productId || item.id;
            return { ...item, productId: finalId };
        });
        
        const newOrder = await addOrder(
          { firstName: formData.fullName, lastName: '', email: formData.email, phone: formData.phone, address: formData.address, city: formData.city, note: formData.note },
          cartForOrder,
          totalPayable,
          paymentInfo,
          effectiveShippingCharge,
          discountAmount,
          appliedCoupon
        );
    
        const orderId = newOrder.orderId || newOrder.id;
        if (orderId) {
            clearCart();
            navigate(`/thank-you/${orderId}`);
        }
    } catch (error: any) {
        notify(error.message || "Purchase could not be finalized.", "error");
        isSubmittingRef.current = false;
        setIsSubmitting(false);
    }
  };

  const applyCoupon = () => {
    if (!couponInput.trim()) {
        notify("Please enter a coupon code.", "error");
        return;
    }
    
    // Check against settings coupon if it exists
    if (safeSettings.exitIntentCouponCode && couponInput.toUpperCase() === safeSettings.exitIntentCouponCode.toUpperCase()) {
        setDiscountAmount(safeSettings.exitIntentDiscount || 0);
        setAppliedCoupon(safeSettings.exitIntentCouponCode);
        notify(`Coupon applied: ৳${safeSettings.exitIntentDiscount} discount`, "success");
        setIsCouponModalOpen(false);
    } else {
        notify("Invalid coupon code.", "error");
    }
  };

  const removeCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon('');
    notify("Coupon removed.", "info");
  };

  return (
    <div className="bg-brand-offwhite min-h-screen">
      <main className="container-luxury pb-24 sm:pb-36">
        <AnimatePresence>
            {isCouponModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCouponModalOpen(false)}
                        className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white p-10 shadow-3xl rounded-none"
                    >
                        <h3 className="text-xl font-serif font-bold text-brand-charcoal mb-4 text-center">তাঁতরূপ স্পেশাল প্রোমো কোড</h3>
                        <p className="text-[11px] sm:text-xs font-sans text-brand-muted mb-6 text-center leading-relaxed">
                            ডিসকাউন্ট পেতে আপনার প্রোমো বা কুপন কোডটি নিচে লিখুন।
                        </p>
                        
                        <div className="space-y-6">
                            <InputField 
                                label="প্রোমো কোড" 
                                name="coupon" 
                                value={couponInput} 
                                onChange={(e) => setCouponInput(e.target.value)} 
                                required 
                                placeholder="TAATROOP10..." 
                            />
                            <button 
                                onClick={applyCoupon}
                                className="w-full h-14 bg-stone-900 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-amber-900 transition-all duration-300"
                            >
                                কোড প্রয়োগ করুন
                            </button>
                            <button 
                                onClick={() => setIsCouponModalOpen(false)}
                                className="w-full text-xs font-bold text-stone-500 uppercase tracking-widest hover:text-stone-900 transition-colors"
                            >
                                বন্ধ করুন
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {isDistrictModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            setIsDistrictModalOpen(false);
                            setDistrictSearchQuery('');
                        }}
                        className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-md"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 15 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-[94vw] sm:max-w-xl md:max-w-2xl bg-[#FDFDFB] border border-brand-charcoal/15 shadow-[0_25px_80px_rgba(0,0,0,0.3)] flex flex-col max-h-[85vh] sm:max-h-[88vh] z-10 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-5 sm:p-7 pb-4 border-b border-[#E8E1D7] bg-white space-y-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#23412F] leading-tight">
                                        ডেলিভারি জেলা / শহর নির্বাচন করুন
                                    </h3>
                                    <p className="text-xs text-[#6B4A2F] font-bold uppercase tracking-wider mt-1">
                                        SELECT YOUR DISTRICT OR CITY
                                    </p>
                                    <div className="mt-2">
                                        <span className="inline-block text-xs font-bold px-2.5 py-1 bg-[#F8F5F0] text-[#23412F] tracking-wider uppercase border border-[#E8E1D7]">
                                            {filteredDistricts.length} টি জেলা উপলব্ধ
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsDistrictModalOpen(false);
                                        setDistrictSearchQuery('');
                                    }}
                                    className="text-stone-500 hover:text-stone-900 transition-colors p-2 hover:bg-stone-100 rounded-full flex-shrink-0"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Search Input Bar */}
                            <div className="relative flex items-center">
                                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
                                <input
                                    type="text"
                                    value={districtSearchQuery}
                                    onChange={(e) => setDistrictSearchQuery(e.target.value)}
                                    placeholder="Search city or district..."
                                    className="w-full pl-10 pr-9 py-2.5 sm:py-3 bg-[#F8F5F0] border border-[#E8E1D7] text-sm text-stone-900 font-sans placeholder:text-stone-400 focus:outline-none focus:border-[#23412F] transition-all"
                                    autoFocus
                                />
                                {districtSearchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setDistrictSearchQuery('')}
                                        className="absolute right-3 text-stone-400 hover:text-stone-900 p-1"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Scrollable List */}
                        <div className="flex-grow overflow-y-auto divide-y divide-[#E8E1D7]/50 custom-scrollbar-light max-h-[50vh] sm:max-h-[55vh] bg-white">
                            {filteredDistricts.length > 0 ? (
                                filteredDistricts.map(dist => {
                                    const isSelected = formData.city === dist.en;
                                    return (
                                        <button
                                            key={dist.en}
                                            type="button"
                                            onClick={() => {
                                                handleCitySelect(dist.en);
                                                setIsDistrictModalOpen(false);
                                                setDistrictSearchQuery('');
                                            }}
                                            className={`w-full py-3.5 sm:py-4 px-5 sm:px-7 text-left flex items-center justify-between transition-all duration-200 group ${
                                                isSelected 
                                                    ? 'bg-[#23412F]/10 border-l-4 border-l-[#23412F]' 
                                                    : 'hover:bg-[#F8F5F0]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className={`p-2 rounded-full transition-colors ${
                                                    isSelected ? 'bg-[#23412F] text-white' : 'bg-[#F8F5F0] text-stone-500 group-hover:text-[#23412F]'
                                                }`}>
                                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className={`text-sm sm:text-base font-bold uppercase tracking-wider transition-colors duration-200 ${
                                                        isSelected ? 'text-[#23412F]' : 'text-stone-900 group-hover:text-[#23412F]'
                                                    }`}>
                                                        {dist.en}
                                                    </span>
                                                    <span className="text-xs sm:text-sm text-stone-600 leading-tight mt-0.5 font-sans font-medium">
                                                        {dist.bn}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={`transition-all duration-200 ${
                                                isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-40 group-hover:scale-100'
                                            }`}>
                                                <Check className="w-5 h-5 text-[#23412F]" strokeWidth={2.5} />
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="py-14 px-6 text-center space-y-3">
                                    <MapPin className="w-8 h-8 text-stone-300 mx-auto" />
                                    <p className="text-sm font-bold uppercase tracking-widest text-stone-800">
                                        No City Found
                                    </p>
                                    <p className="text-xs text-stone-500 font-sans">
                                        No district matches "{districtSearchQuery}". Please check your spelling.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setDistrictSearchQuery('')}
                                        className="text-xs font-bold text-[#23412F] uppercase tracking-wider underline underline-offset-4 pt-2"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer Info */}
                        <div className="px-5 py-3 bg-[#F8F5F0] border-t border-[#E8E1D7] flex items-center justify-center text-center text-xs text-stone-600 font-sans font-medium">
                            <span>জেলা বা শহরের উপর ভিত্তি করে ডেলিভারি চার্জ স্বয়ংক্রিয়ভাবে হিসাব করা হয়।</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <div className="flex flex-col mb-8 md:mb-10 pt-2 sm:pt-4">
            <span className="text-[10px] sm:text-xs font-bold text-[#6B4A2F] uppercase tracking-[0.2em] mb-1">TAATROOP SECURE CHECKOUT</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#23412F]">Order & Delivery Information</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
            {/* Form Side */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8 md:space-y-12">
                
                {/* Step 1: Shipping */}
                <section>
                    <div className="flex items-center gap-6 mb-5 md:mb-6 py-2.5 border-b border-[#E8E1D7]">
                        <span className="text-xs sm:text-sm font-bold text-[#23412F] uppercase tracking-wider">০১. ডেলিভারি তথ্য (Shipping Details)</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <InputField label="আপনার নাম (Full Name)" name="fullName" value={formData.fullName} onChange={handleChange} required error={isAttempted && !formData.fullName.trim()} placeholder="আপনার নাম লিখুন..." />
                        </div>
                        <InputField label="মোবাইল নম্বর (Phone Number)" name="phone" type="tel" value={formData.phone} onChange={handleChange} required error={isAttempted && !formData.phone.trim()} placeholder="01XXXXXXXXX" />
                        <InputField label="ইমেইল অ্যাড্রেস (Email Address)" name="email" type="email" value={formData.email} onChange={handleChange} required error={isAttempted && !formData.email.trim()} placeholder="example@gmail.com" />
                        
                        <div className="md:col-span-2 flex flex-col space-y-1.5">
                            <label htmlFor="city" className="text-[11px] sm:text-xs font-bold text-[#23412F] uppercase tracking-wider ml-1">
                                জেলা / শহর (City / District) <span className="text-[#23412F] ml-0.5">*</span>
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsDistrictModalOpen(true)}
                                    className={`w-full px-3.5 py-3 border rounded-none outline-none bg-white text-xs sm:text-sm text-left flex items-center justify-between transition-all duration-300
                                    ${isAttempted && !formData.city 
                                        ? 'border-red-500' 
                                        : 'border-[#E8E1D7] focus-within:border-[#23412F] hover:border-[#23412F]/40'}`}
                                >
                                    <span className={`font-sans ${formData.city ? 'text-stone-900 font-medium' : 'text-stone-400'}`}>
                                        {formData.city ? (
                                            (() => {
                                                const found = BANGLADESH_DISTRICTS.find(d => d.en === formData.city);
                                                return found ? `${found.bn} (${found.en})` : formData.city;
                                            })()
                                        ) : (
                                            "আপনার জেলা / শহর নির্বাচন করুন"
                                        )}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-[#23412F]/70" />
                                </button>
                                
                                <select 
                                    id="city" 
                                    name="city" 
                                    value={formData.city} 
                                    onChange={handleChange} 
                                    required 
                                    className="sr-only"
                                >
                                    <option value="" disabled>জেলা নির্বাচন করুন</option>
                                    {BANGLADESH_DISTRICTS.map(dist => (
                                        <option key={dist.en} value={dist.en}>
                                            {dist.bn} ({dist.en})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex flex-col space-y-1.5">
                            <label htmlFor="address" className="text-[11px] sm:text-xs font-bold text-[#23412F] uppercase tracking-wider ml-1">
                                সম্পূর্ণ ডেলিভারি ঠিকানা (Full Address) <span className="text-[#23412F] ml-0.5">*</span>
                            </label>
                            <textarea id="address" name="address" value={formData.address} onChange={handleChange} required rows={3} placeholder="বাসা নম্বর, রোড নম্বর, এলাকা/থানা..." 
                                className={`w-full px-3.5 py-3 border rounded-none outline-none transition-all duration-300 bg-white text-xs sm:text-sm font-medium placeholder:text-stone-400
                                ${isAttempted && !formData.address.trim() ? 'border-red-500' : 'border-[#E8E1D7] focus:border-[#23412F]'}`}
                            />
                        </div>
                    </div>

                    {!safeSettings.freeShippingEnabled && safeSettings.shippingOptions.length > 0 && (
                        <div className="mt-8 space-y-3">
                            <span className="text-xs sm:text-sm font-bold text-[#23412F] uppercase tracking-wider block">
                                ডেলিভারি চার্জ নির্বাচন করুন (Select Delivery Charge)
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
                                {safeSettings.shippingOptions.map((option) => {
                                    const isSelected = formData.shippingOptionId === option.id;
                                    return (
                                        <div 
                                            key={option.id}
                                            onClick={() => setFormData(p => ({ ...p, shippingOptionId: option.id }))}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                                                isSelected 
                                                    ? 'border-stone-800 ring-1 ring-stone-800 bg-white shadow-xs' 
                                                    : 'border-stone-200/90 bg-white hover:border-stone-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                                    isSelected ? 'border-[#23412F] bg-white' : 'border-stone-300 bg-white'
                                                }`}>
                                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#23412F]" />}
                                                </div>
                                                <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                                                    {option.label}
                                                </span>
                                            </div>
                                            <span className="text-xs sm:text-sm font-extrabold font-sans text-[#23412F]">
                                                ৳{option.charge}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>

                {/* Step 2: Payment */}
                <section>
                    <div className="flex items-center gap-6 mb-5 md:mb-6 py-2.5 border-b border-[#E8E1D7]">
                        <span className="text-xs sm:text-sm font-bold text-[#23412F] uppercase tracking-wider">০২. পেমেন্ট মেথড (Payment Method)</span>
                    </div>

                    <div className="space-y-3 sm:space-y-3.5">
                        {safeSettings.codEnabled && (
                            <div
                                onClick={() => setFormData(p => ({ ...p, paymentMethod: 'COD', onlinePaymentMethod: '' }))}
                                className={`w-full p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                                    formData.paymentMethod === 'COD'
                                        ? 'border-stone-800 ring-1 ring-stone-800 bg-white shadow-xs'
                                        : 'border-stone-200/90 bg-white hover:border-stone-300'
                                }`}
                            >
                                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                        formData.paymentMethod === 'COD' ? 'border-[#23412F] bg-white' : 'border-stone-300 bg-white'
                                    }`}>
                                        {formData.paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-[#23412F]" />}
                                    </div>

                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                        <ShoppingBag className="w-5 h-5 text-[#23412F]" />
                                    </div>

                                    <div className="flex flex-col min-w-0">
                                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                                            Cash on Delivery (COD)
                                        </h4>
                                    </div>
                                </div>

                                {formData.paymentMethod === 'COD' && (
                                    <Check className="w-5 h-5 text-stone-800 shrink-0 ml-2" />
                                )}
                            </div>
                        )}

                        {isOnlinePaymentVisible && (
                            <>
                                <div
                                    onClick={() => setFormData(p => ({ ...p, paymentMethod: 'Online', onlinePaymentMethod: 'bKash' }))}
                                    className={`w-full p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                                        formData.paymentMethod === 'Online' && formData.onlinePaymentMethod === 'bKash'
                                            ? 'border-stone-800 ring-1 ring-stone-800 bg-white shadow-xs'
                                            : 'border-stone-200/90 bg-white hover:border-stone-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                            formData.paymentMethod === 'Online' && formData.onlinePaymentMethod === 'bKash' ? 'border-[#23412F] bg-white' : 'border-stone-300 bg-white'
                                        }`}>
                                            {formData.paymentMethod === 'Online' && formData.onlinePaymentMethod === 'bKash' && <div className="w-2.5 h-2.5 rounded-full bg-[#23412F]" />}
                                        </div>

                                        <div className="w-10 h-10 rounded-xl bg-pink-100/90 border border-pink-200/50 flex items-center justify-center shrink-0">
                                            <span className="font-black text-[11px] text-[#D81B60]">bKash</span>
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                                                bKash Mobile Banking
                                            </h4>
                                        </div>
                                    </div>

                                    {formData.paymentMethod === 'Online' && formData.onlinePaymentMethod === 'bKash' && (
                                        <Check className="w-5 h-5 text-stone-800 shrink-0 ml-2" />
                                    )}
                                </div>

                                <div
                                    onClick={() => setFormData(p => ({ ...p, paymentMethod: 'Online', onlinePaymentMethod: 'Nagad' }))}
                                    className={`w-full p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                                        formData.paymentMethod === 'Online' && formData.onlinePaymentMethod === 'Nagad'
                                            ? 'border-stone-800 ring-1 ring-stone-800 bg-white shadow-xs'
                                            : 'border-stone-200/90 bg-white hover:border-stone-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                            formData.paymentMethod === 'Online' && formData.onlinePaymentMethod === 'Nagad' ? 'border-[#23412F] bg-white' : 'border-stone-300 bg-white'
                                        }`}>
                                            {formData.paymentMethod === 'Online' && formData.onlinePaymentMethod === 'Nagad' && <div className="w-2.5 h-2.5 rounded-full bg-[#23412F]" />}
                                        </div>

                                        <div className="w-10 h-10 rounded-xl bg-amber-100/80 border border-amber-200/50 flex items-center justify-center shrink-0">
                                            <span className="font-black text-[11px] text-[#E65100]">Nagad</span>
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                                                Nagad Mobile Banking
                                            </h4>
                                        </div>
                                    </div>

                                    {formData.paymentMethod === 'Online' && formData.onlinePaymentMethod === 'Nagad' && (
                                        <Check className="w-5 h-5 text-stone-800 shrink-0 ml-2" />
                                    )}
                                </div>
                            </>
                        )}

                        <AnimatePresence>
                            {formData.paymentMethod === 'Online' && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0, y: -6 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -6 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-[#FAF8F5] border border-stone-200/90 rounded-2xl p-4 sm:p-5 mt-3 space-y-4 shadow-2xs">
                                        <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-4 text-xs sm:text-sm text-stone-800 space-y-2 leading-relaxed font-sans">
                                            <div 
                                                className="prose prose-xs text-stone-800 font-medium whitespace-pre-line border-b border-amber-200/70 pb-3 mb-2 [&_b]:text-[#23412F] [&_b]:font-black [&_b]:text-sm sm:[&_b]:text-base font-sans"
                                                dangerouslySetInnerHTML={{ 
                                                    __html: safeSettings.onlinePaymentInfo || `অর্ডার কনফার্ম করতে ডেলিভারি চার্জ অগ্রিম প্রদান করুন —\n<b>01909285883 (Personal)</b>\nBkash / Nagad\nএবং নিচের তথ্যগুলো পূরণ করুন:`
                                                }}
                                            />
                                            <div className="text-[11px] sm:text-xs text-stone-600 font-bold uppercase tracking-wider flex items-center gap-2 pt-0.5">
                                                <span>Send Money / Payment To:</span>
                                                <span className="font-mono text-xs sm:text-sm font-extrabold text-[#23412F] bg-white px-2.5 py-1 border border-amber-200 rounded shadow-2xs">
                                                    {merchantNumber}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-0.5">
                                            <div className="flex flex-col space-y-1.5">
                                                <label className="text-[10px] sm:text-[11px] font-extrabold text-stone-600 uppercase tracking-wider">
                                                    SENDER MOBILE NUMBER
                                                </label>
                                                <input 
                                                    type="tel" 
                                                    name="paymentNumber" 
                                                    value={formData.paymentNumber} 
                                                    onChange={handleChange} 
                                                    placeholder="01XXXXXXXXX" 
                                                    className="w-full px-4 py-2.5 sm:py-3 bg-white border border-stone-200 rounded-xl outline-none text-xs sm:text-sm text-stone-900 focus:border-[#23412F] focus:ring-1 focus:ring-[#23412F] transition-all font-sans placeholder:text-stone-300" 
                                                />
                                            </div>

                                            <div className="flex flex-col space-y-1.5">
                                                <label className="text-[10px] sm:text-[11px] font-extrabold text-stone-600 uppercase tracking-wider">
                                                    TRANSACTION ID (TRXID)
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="transactionId" 
                                                    value={formData.transactionId} 
                                                    onChange={handleChange} 
                                                    placeholder="TrxID e.g. 9J283HKS" 
                                                    className="w-full px-4 py-2.5 sm:py-3 bg-white border border-stone-200 rounded-xl outline-none text-xs sm:text-sm text-stone-900 focus:border-[#23412F] focus:ring-1 focus:ring-[#23412F] transition-all font-sans placeholder:text-stone-300" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
                {/* Mobile / Tablet Order Summary */}
                <div className="block lg:hidden my-8 sm:my-10">
                    <div className="bg-[#23412F] p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                            <ShieldCheck size={100} strokeWidth={0.5} />
                        </div>
                        
                        <h3 className="font-serif text-xl sm:text-2xl font-bold mb-6 text-amber-100">Order Summary</h3>
                        
                        <div className={`space-y-5 mb-6 pr-2 custom-scrollbar-light ${cart.length > 2 ? 'max-h-[280px] overflow-y-auto' : 'max-h-none overflow-visible'}`}>
                            {cart.map((item) => (
                                <div key={`mob-${item.id}-${item.size}`} className="flex gap-3.5 items-center group">
                                    <div className="w-14 h-18 flex-shrink-0 bg-white/10 overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs sm:text-sm font-bold mb-1 truncate text-white">{item.name}</h4>
                                        <p className="text-[11px] text-emerald-100/80">{item.size} &bull; পরিমাণ: {item.quantity}</p>
                                        <p className="text-xs sm:text-sm font-sans mt-1.5 font-bold text-amber-200">৳{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-5 border-t border-white/20 text-xs sm:text-sm">
                            {appliedCoupon ? (
                                <div className="flex justify-between items-center group">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">কোড প্রয়োগ করা হয়েছে</span>
                                        <span className="text-xs sm:text-sm text-white font-bold">{appliedCoupon}</span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={removeCoupon}
                                        className="text-[11px] font-bold text-amber-200 hover:text-white uppercase tracking-wider transition-colors underline underline-offset-4"
                                    >
                                        সরিয়ে দিন
                                    </button>
                                </div>
                            ) : safeSettings.exitIntentPopupEnabled ? (
                                <button 
                                    type="button"
                                    onClick={() => setIsCouponModalOpen(true)}
                                    className="w-full py-2.5 border border-white/20 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-amber-100 hover:text-white hover:border-amber-200 transition-all group"
                                >
                                    <span>প্রোমো বা ডিসকাউন্ট কোড আছে?</span>
                                </button>
                            ) : null}
                            
                            <div className="flex justify-between items-center text-emerald-50">
                                <span>পণ্যের মোট মূল্য</span>
                                <span className="text-white font-bold">৳{safeCartTotal.toLocaleString()}</span>
                            </div>
                            
                            {discountAmount > 0 && (
                                <div className="flex justify-between items-center text-amber-300">
                                    <span>প্রোমো ডিসকাউন্ট</span>
                                    <span>-৳{discountAmount.toLocaleString()}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-emerald-50">
                                <span className="whitespace-nowrap">ডেলিভারি চার্জ</span>
                                <span className={effectiveShippingCharge === 0 ? 'text-amber-300 font-bold whitespace-nowrap' : 'text-white font-bold whitespace-nowrap'}>
                                    {effectiveShippingCharge === 0 ? 'ফ্রি ডেলিভারি' : `৳${effectiveShippingCharge.toLocaleString()}`}
                                </span>
                            </div>
                            
                            <div className="mt-5 pt-5 border-t border-white/20 flex justify-between items-center">
                                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-200">সর্বমোট প্রদেয় টাকা</span>
                                <span className="text-xl sm:text-2xl font-sans font-bold text-white">৳{totalPayable.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 md:pt-8 pb-12 sm:pb-16 md:pb-20">
                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full py-3.5 sm:py-4 px-4 min-h-[52px] bg-[#23412F] hover:bg-[#1B3225] active:bg-[#182E21] text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    >
                        {isSubmitting ? (
                            <LoaderCircle className="w-5 h-5 animate-spin text-white" />
                        ) : (
                            <>
                                <span className="font-bold text-sm sm:text-base md:text-lg tracking-wide text-white">
                                    PURCHASE {totalPayable.toLocaleString()}
                                </span>
                                <ShoppingBag className="w-5 h-5 text-amber-300 flex-shrink-0" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Receipt Side (Desktop) */}
            <div className="hidden lg:block lg:col-span-5 pt-8 lg:pt-0">
                <div className="lg:sticky lg:top-40 space-y-12">
                    <div className="bg-[#23412F] p-7 md:p-8 text-white shadow-xl relative overflow-hidden border border-[#1B3225]">
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <ShieldCheck size={120} strokeWidth={0.5} />
                        </div>
                        
                        <h3 className="font-serif text-xl sm:text-2xl font-bold mb-6 text-amber-100">Order Summary</h3>
                        
                        <div className={`space-y-5 mb-8 pr-2 custom-scrollbar-light ${cart.length > 2 ? 'max-h-[280px] overflow-y-auto md:max-h-[350px]' : 'max-h-none overflow-visible md:max-h-[350px] md:overflow-y-auto'}`}>
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex gap-3.5 items-center group">
                                    <div className="w-14 h-18 flex-shrink-0 bg-white/10 overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-90" referrerPolicy="no-referrer" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs sm:text-sm font-bold mb-1 truncate text-white">{item.name}</h4>
                                        <p className="text-[11px] text-emerald-100/80">{item.size} &bull; পরিমাণ: {item.quantity}</p>
                                        <p className="text-xs sm:text-sm font-sans mt-1.5 font-bold text-amber-200">৳{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-white/20 text-xs sm:text-sm">
                            {appliedCoupon ? (
                                <div className="flex justify-between items-center group">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">কোড প্রয়োগ করা হয়েছে</span>
                                        <span className="text-xs sm:text-sm text-white font-bold">{appliedCoupon}</span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={removeCoupon}
                                        className="text-[11px] font-bold text-amber-200 hover:text-white uppercase tracking-wider transition-colors underline underline-offset-4"
                                    >
                                        সরিয়ে দিন
                                    </button>
                                </div>
                            ) : safeSettings.exitIntentPopupEnabled ? (
                                <button 
                                    type="button"
                                    onClick={() => setIsCouponModalOpen(true)}
                                    className="w-full py-3 border border-white/20 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-amber-100 hover:text-white hover:border-amber-200 transition-all group"
                                >
                                    <span>প্রোমো বা ডিসকাউন্ট কোড আছে?</span>
                                </button>
                            ) : null}
                            
                            <div className="flex justify-between items-center text-emerald-50">
                                <span>পণ্যের মোট মূল্য</span>
                                <span className="text-white font-bold">৳{safeCartTotal.toLocaleString()}</span>
                            </div>
                            
                            {discountAmount > 0 && (
                                <div className="flex justify-between items-center text-amber-300">
                                    <span>প্রোমো ডিসকাউন্ট</span>
                                    <span>-৳{discountAmount.toLocaleString()}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-emerald-50">
                                <span className="whitespace-nowrap">ডেলিভারি চার্জ</span>
                                <span className={effectiveShippingCharge === 0 ? 'text-amber-300 font-bold whitespace-nowrap' : 'text-white font-bold whitespace-nowrap'}>
                                    {effectiveShippingCharge === 0 ? 'ফ্রি ডেলিভারি' : `৳${effectiveShippingCharge.toLocaleString()}`}
                                </span>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-white/20 flex justify-between items-center">
                                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-200">সর্বমোট প্রদেয় টাকা</span>
                                <span className="text-xl sm:text-2xl font-sans font-bold text-white">৳{totalPayable.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
