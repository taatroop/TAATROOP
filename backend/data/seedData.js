
// Data copied from frontend constants.ts
export const MOCK_PRODUCTS_DATA = [
  { id: 101, name: "প্রিন চেক লুঙ্গি", category: "Premium Collection", price: 650, description: "সিরাজগঞ্জের কারিগরদের হাতে বোনা ১০০% সুতি প্রিমিয়াম প্রিন্ট চেক লুঙ্গি। অত্যন্ত আরামদায়ক ও টেকসই।", fabric: "100% Handloom Cotton", colors: ["Green Check"], sizes: ["Standard (5 Haat)"], isNewArrival: true, isTrending: true, onSale: false, images: [] },
  { id: 102, name: "নীল ডোরা লুঙ্গি", category: "Classic Collection", price: 620, description: "আসল হ্যান্ডলুম সুতি নীল ডোরা লুঙ্গি। সিরাজগঞ্জের সেরা কারিগরি ও রঙ সুতার নিখুঁত বুনন।", fabric: "100% Cotton Handloom", colors: ["Royal Blue Stripe"], sizes: ["Standard (5 Haat)"], isNewArrival: true, isTrending: true, onSale: false, images: [] },
  { id: 103, name: "ক্লাসিক চেক লুঙ্গি", category: "Luxury Collection", price: 700, description: "ঐতিহ্যবাহী সিরাজগঞ্জ ক্লাসিক চেক ডিজাইন লুঙ্গি। প্রিমিয়াম ফিনিশিং ও আরামদায়ক সুতা।", fabric: "Premium Fine Cotton", colors: ["Classic Multi Check"], sizes: ["Standard (5 Haat)"], isNewArrival: false, isTrending: true, onSale: false, images: [] },
  { id: 104, name: "সাদা ডোরা লুঙ্গি", category: "New Arrivals", price: 600, description: "অভিজাত সাদা সুতি ডোরা লুঙ্গি। গরমের দিনে ব্যবহারের জন্য অত্যন্ত আরামদায়ক।", fabric: "Soft Pure Cotton", colors: ["White Grey Stripe"], sizes: ["Standard (5 Haat)"], isNewArrival: true, isTrending: true, onSale: false, images: [] },
  { id: 105, name: "সবুজ ডোরা লুঙ্গি", category: "Limited Edition", price: 620, description: "গাঢ় সবুজ স্ট্রাইপ হ্যান্ডলুম লুঙ্গি। সিরাজগঞ্জের ঐতিহ্যবাহী তাঁত বুননের সেরা উপহার।", fabric: "100% Handloom Cotton", colors: ["Forest Green Stripe"], sizes: ["Standard (5 Haat)"], isNewArrival: true, isTrending: true, onSale: false, images: [] }
];

export const DEFAULT_SETTINGS_DATA = {
  headerLogoType: 'text',
  headerLogoImage: '',
  headerLogoText: 'তাঁতরূপ',
  headerLogoHeight: 60,
  headerLogoHeightMobile: 60,
  onlinePaymentInfo: 'অর্ডার কনফার্ম করতে ডেলিভারি চার্জ অগ্রিম প্রদান করুন —\n<b>01909285883 (Personal)</b>\nBkash / Nagad\nএবং নিচের তথ্যগুলো পূরণ করুন:',
  onlinePaymentInfoStyles: {
    fontSize: '0.875rem', 
  },
  codEnabled: true,
  onlinePaymentEnabled: true,
  onlinePaymentMethods: ['Bkash', 'Nagad', 'UPAY'],
  sliderImages: [
    { id: 1, title: "ঐতিহ্যের বুননে আস্থার স্পর্শ", subtitle: "PREMIUM HANDLOOM LUNGI FROM SIRAJGANJ, BANGLADESH", color: "text-amber-50", image: "", mobileImage: "" }
  ],
  categoryImages: [
    { categoryName: "Premium Collection", image: "" },
    { categoryName: "Classic Collection", image: "" },
    { categoryName: "Luxury Collection", image: "" },
    { categoryName: "New Arrivals", image: "" },
    { categoryName: "Limited Edition", image: "" }
  ],
  categories: ["Premium Collection", "Classic Collection", "Luxury Collection", "New Arrivals", "Limited Edition"],
  shippingOptions: [],
  sizeGuide: [
    { size: 'Standard', chest: '5 Haat', waist: 'Free', length: 'Standard' }
  ],
  contactAddress: 'Sirajganj Handloom Hub, Sirajganj, Bangladesh',
  contactPhone: '+880 1640-292650',
  contactEmail: 'support@taatroop.com',
  whatsappNumber: '+8801640292650',
  showWhatsAppButton: true,
  showCityField: true,
  socialMediaLinks: [
    { platform: 'Facebook', url: 'https://facebook.com' },
    { platform: 'Instagram', url: 'https://instagram.com' },
    { platform: 'WhatsApp', url: 'https://wa.me/8801640292650' },
    { platform: 'YouTube', url: 'https://youtube.com' }
  ],
  privacyPolicy: `
1. Introduction
Welcome to TAATROOP (তাঁতরূপ). We are committed to protecting your privacy and delivering original handloom products from Sirajganj...
  `.trim(),
  adminEmail: 'admin@taatroop.com',
  adminPassword: 'taatroop_admin_2026',
  footerDescription: 'Premium handloom lungi crafted with care, tradition and trust.',
  homepageNewArrivalsCount: 5,
  homepageTrendingCount: 5,
  showSliderText: true,
  signatureBanners: [
    {
        id: '1',
        header: 'OUR HERITAGE',
        title: 'From Sirajganj To Your Home',
        description: 'We work directly with skilled weavers of Sirajganj to bring you the finest handloom lungi, preserving tradition and supporting local artisans.',
        buttonText: 'Explore Now',
        link: '/shop',
        desktopImage: '',
        mobileImage: '',
        layout: 'landscape',
        shape: 'rectangle'
    }
  ],
  gaMeasurementId: '',
  gaApiSecret: '',
  fbPixelId: '',
  fbAccessToken: '',
  fbTestCode: '',
  gtmId: 'GTM-T7RFW3GJ',
  exitIntentPopupEnabled: false,
  exitIntentDiscount: 50,
  exitIntentCouponCode: 'TAATROOP50',
};

