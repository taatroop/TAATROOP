
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, Product, CartItem, Order, OrderStatus, ContactMessage, AppSettings, AdminProductsResponse } from '../types';
import { trackServerEvent } from '../services/trackingService';

const API_URL = '/api';

const getTokenFromStorage = (): string | null => {
    return localStorage.getItem('unique_corner_admin_token');
};

import { LUNGI_IMAGES, HERO_WEAVER_IMAGE, HERITAGE_BANNER_IMAGE, CATEGORY_IMAGE_URLS, getProductImage, getProductImages } from '../assets';

const DEFAULT_SETTINGS: AppSettings = {
    headerLogoType: 'text',
    headerLogoImage: '',
    headerLogoText: 'তাঁতরূপ',
    headerLogoHeight: 60,
    headerLogoHeightMobile: 60,
    onlinePaymentInfo: 'অর্ডার কনফার্ম করতে ডেলিভারি চার্জ অগ্রিম প্রদান করুন —\n<b>01909285883 (Personal)</b>\nBkash / Nagad\nএবং নিচের তথ্যগুলো পূরণ করুন:',
    onlinePaymentInfoStyles: { fontSize: '0.875rem' },
    codEnabled: true, onlinePaymentEnabled: true, onlinePaymentMethods: ['Bkash', 'Nagad', 'UPAY'],
    sliderImages: [
      { id: 1, title: "ঐতিহ্যের বুননে আস্থার স্পর্শ", subtitle: "PREMIUM HANDLOOM LUNGI FROM SIRAJGANJ, BANGLADESH", color: "text-amber-50", image: "", mobileImage: "" },
      { id: 2, title: "সিরাজগঞ্জের খাঁটি সুতি তাঁত লুঙ্গি", subtitle: "ORIGINAL HANDLOOM WEAVE", color: "text-amber-50", image: "", mobileImage: "" }
    ], 
    categoryImages: [
      { categoryName: "Premium Collection", image: "" },
      { categoryName: "Classic Collection", image: "" },
      { categoryName: "Luxury Collection", image: "" },
      { categoryName: "New Arrivals", image: "" },
      { categoryName: "Limited Edition", image: "" }
    ], 
    categories: ["Premium Collection", "Classic Collection", "Luxury Collection", "New Arrivals", "Limited Edition"], 
    pausedCategories: [],
    menuCategories: [],
    shippingOptions: [], 
    sizeGuide: [
      { size: 'Standard', chest: '5 Haat', waist: 'Free', length: 'Standard' }
    ],
    contactAddress: 'Sirajganj Handloom Hub, Sirajganj, Bangladesh',
    contactPhone: '+880 1640-292650',
    contactEmail: 'support@taatroop.com',
    whatsappNumber: '+8801640292650',
    showWhatsAppButton: true,
    socialMediaLinks: [
      { platform: 'Facebook', url: 'https://facebook.com' },
      { platform: 'Instagram', url: 'https://instagram.com' },
      { platform: 'WhatsApp', url: 'https://wa.me/8801640292650' },
      { platform: 'YouTube', url: 'https://youtube.com' }
    ],
    privacyPolicy: 'Welcome to TAATROOP (তাঁতরূপ).',
    adminEmail: 'admin@taatroop.com',
    adminPassword: 'taatroop_admin_2026',
    footerDescription: 'Premium handloom lungi crafted with care, tradition and trust.',
    homepageNewArrivalsCount: 5, homepageTrendingCount: 5,
    showSliderText: true,
    signatureBanners: [],
    exitIntentPopupEnabled: false,
    exitIntentDiscount: 50,
    exitIntentCouponCode: 'TAATROOP50',
    freeShippingEnabled: false,
    ourStoryHeroImage: '',
    ourStoryStoryImage: '',
    ourStoryHeritageImage: '',
    ourStoryGalleryImages: []
};

const MOCK_PRODUCTS_DATA: any[] = [
  { id: '101', productId: '101', name: "প্রিন চেক লুঙ্গি", category: "Premium Collection", price: 650, description: "সিরাজগঞ্জের কারিগরদের হাতে বোনা ১০০% সুতি প্রিমিয়াম প্রিন্ট চেক লুঙ্গি। অত্যন্ত আরামদায়ক ও টেকসই।", fabric: "100% Handloom Cotton", colors: ["Green Check"], sizes: ["Standard (5 Haat)"], isNewArrival: true, isTrending: true, onSale: false, images: [] },
  { id: '102', productId: '102', name: "নীল ডোরা লুঙ্গি", category: "Classic Collection", price: 620, description: "আসল হ্যান্ডলুম সুতি নীল ডোরা লুঙ্গি। সিরাজগঞ্জের সেরা কারিগরি ও রঙ সুতার নিখুঁত বুনন।", fabric: "100% Cotton Handloom", colors: ["Royal Blue Stripe"], sizes: ["Standard (5 Haat)"], isNewArrival: true, isTrending: true, onSale: false, images: [] },
  { id: '103', productId: '103', name: "ক্লাসিক চেক লুঙ্গি", category: "Luxury Collection", price: 700, description: "ঐতিহ্যবাহী সিরাজগঞ্জ ক্লাসিক চেক ডিজাইন লুঙ্গি। প্রিমিয়াম ফিনিশিং ও আরামদায়ক সুতা।", fabric: "Premium Fine Cotton", colors: ["Classic Multi Check"], sizes: ["Standard (5 Haat)"], isNewArrival: true, isTrending: true, onSale: false, images: [] },
  { id: '104', productId: '104', name: "সাদা ডোরা লুঙ্গি", category: "New Arrivals", price: 600, description: "অভিজাত সাদা সুতি ডোরা লুঙ্গি। গরমের দিনে ব্যবহারের জন্য অত্যন্ত আরামদায়ক।", fabric: "Soft Pure Cotton", colors: ["White Grey Stripe"], sizes: ["Standard (5 Haat)"], isNewArrival: true, isTrending: true, onSale: false, images: [] },
  { id: '105', productId: '105', name: "সবুজ ডোরা লুঙ্গি", category: "Limited Edition", price: 620, description: "গাঢ় সবুজ স্ট্রাইপ হ্যান্ডলুম লুঙ্গি। সিরাজগঞ্জের ঐতিহ্যবাহী তাঁত বুননের সেরা উপহার।", fabric: "100% Handloom Cotton", colors: ["Forest Green Stripe"], sizes: ["Standard (5 Haat)"], isNewArrival: true, isTrending: true, onSale: false, images: [] }
];

export const useAppStore = create<any>()(
  persist(
    (set, get) => ({
        path: window.location.pathname + window.location.search,
        products: MOCK_PRODUCTS_DATA,
        orders: [],
        contactMessages: [],
        settings: DEFAULT_SETTINGS,
        cart: [],
        selectedProduct: null,
        notification: null,
        loading: true,
        isAdminAuthenticated: !!getTokenFromStorage(),
        cartTotal: 0,
        fullProductsLoaded: false,
        adminProducts: [],
        adminProductsPagination: { page: 1, pages: 1, total: 0 },
        dashboardStats: null,
        newOrdersCount: 0,
        productReviews: {},
        globalReviews: [],
        
        fetchProductReviews: async (productId: string) => {
            try {
                const res = await fetch(`${API_URL}/reviews?productId=${encodeURIComponent(productId)}`);
                if (res.ok) {
                    const data = await res.json();
                    set((state: any) => ({
                        productReviews: {
                            ...(state.productReviews || {}),
                            [productId]: data
                        }
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch product reviews:', err);
            }
        },

        fetchAllReviews: async () => {
            try {
                const res = await fetch(`${API_URL}/reviews`);
                if (res.ok) {
                    const data = await res.json();
                    set({ globalReviews: data });
                }
            } catch (err) {
                console.error('Failed to fetch all reviews:', err);
            }
        },

        addProductReview: async (productId: string, review: { name: string; rating: number; date: string; comment: string; product?: string }) => {
            const payload = { productId, ...review };
            try {
                const res = await fetch(`${API_URL}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                let savedRev;
                if (res.ok) {
                    savedRev = await res.json();
                } else {
                    savedRev = { id: `rev-${Date.now()}`, verified: true, likes: 0, ...payload };
                }
                set((state: any) => {
                    const prevProductRevs = state.productReviews?.[productId] || [];
                    const prevGlobalRevs = state.globalReviews || [];
                    return {
                        productReviews: {
                            ...(state.productReviews || {}),
                            [productId]: [savedRev, ...prevProductRevs]
                        },
                        globalReviews: [savedRev, ...prevGlobalRevs]
                    };
                });
                return savedRev;
            } catch (err) {
                console.error('Error adding product review to server:', err);
                const fallbackRev = { id: `rev-${Date.now()}`, verified: true, likes: 0, ...payload };
                set((state: any) => {
                    const prevProductRevs = state.productReviews?.[productId] || [];
                    return {
                        productReviews: {
                            ...(state.productReviews || {}),
                            [productId]: [fallbackRev, ...prevProductRevs]
                        }
                    };
                });
                return fallbackRev;
            }
        },

        addGlobalReview: async (review: { name: string; location?: string; rating: number; date: string; comment: string; product?: string }) => {
            try {
                const res = await fetch(`${API_URL}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(review)
                });
                let savedRev;
                if (res.ok) {
                    savedRev = await res.json();
                } else {
                    savedRev = { id: Date.now(), verified: true, likes: 0, ...review };
                }
                set((state: any) => ({
                    globalReviews: [savedRev, ...(state.globalReviews || [])]
                }));
                return savedRev;
            } catch (err) {
                console.error('Error adding global review to server:', err);
                const fallbackRev = { id: Date.now(), verified: true, likes: 0, ...review };
                set((state: any) => ({
                    globalReviews: [fallbackRev, ...(state.globalReviews || [])]
                }));
                return fallbackRev;
            }
        },
        
        navigate: (newPath: string, options?: { scroll?: boolean }) => {
            const shouldScroll = options?.scroll ?? true;
            if (window.location.pathname !== newPath) {
                window.history.pushState({}, '', newPath);
            }
            set({ path: newPath });
            if (shouldScroll) {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }
        },

        loadInitialData: async () => {
            try {
                // Fetch home data (settings + featured products)
                const homeDataRes = await fetch(`${API_URL}/page-data/home`);
                if (!homeDataRes.ok) throw new Error('Failed to fetch initial page data.');
                const homeData = await homeDataRes.json();
                
                const rawProducts = homeData.products || MOCK_PRODUCTS_DATA;
                const processedProducts = rawProducts.map((p: any) => ({
                    ...p,
                    images: getProductImages(p)
                }));

                const loadedSettings = homeData.settings || DEFAULT_SETTINGS;
                if (!loadedSettings.sliderImages || loadedSettings.sliderImages.length === 0) {
                    loadedSettings.sliderImages = DEFAULT_SETTINGS.sliderImages;
                }
                if (!loadedSettings.categoryImages || loadedSettings.categoryImages.length === 0) {
                    loadedSettings.categoryImages = DEFAULT_SETTINGS.categoryImages;
                }

                set({
                    products: processedProducts,
                    settings: loadedSettings,
                    loading: false
                });

                // Background load ALL products for shop page after a very short break
                // This ensures LCP is handled first
                requestAnimationFrame(() => {
                    get().ensureAllProductsLoaded();
                    get().fetchAllReviews?.();
                });
                
            } catch (error) {
                set({ 
                    products: MOCK_PRODUCTS_DATA, 
                    settings: DEFAULT_SETTINGS, 
                    loading: false,
                    fullProductsLoaded: true 
                });
            }
        },

        loadAdminData: async () => {
            const { isAdminAuthenticated } = get();
            if (!isAdminAuthenticated) return;
            const token = getTokenFromStorage();
            if (!token) return;
            const headers = { 'Authorization': `Bearer ${token}` };
            try {
                const [ordersRes, messagesRes, statsRes, settingsRes] = await Promise.all([
                    fetch(`${API_URL}/orders`, { headers }),
                    fetch(`${API_URL}/messages`, { headers }),
                    fetch(`${API_URL}/orders/stats`, { headers }),
                    fetch(`${API_URL}/settings/admin`, { headers })
                ]);
                
                if (settingsRes.ok) {
                    const settingsData = await settingsRes.json();
                    set({ settings: settingsData });
                }

                if (ordersRes.ok && messagesRes.ok && statsRes.ok) {
                    const ordersData = await ordersRes.json();
                    const messagesData = await messagesRes.json();
                    const statsData = await statsRes.json();
                    
                    const lastSeenOrders = localStorage.getItem('unique_corner_admin_last_orders_seen');
                    const lastSeenOrdersDate = lastSeenOrders ? new Date(lastSeenOrders) : new Date(0);
                    const newOrders = ordersData.filter((o: Order) => {
                        const oDate = o.createdAt ? new Date(o.createdAt) : new Date(o.date);
                        return oDate > lastSeenOrdersDate;
                    });
                    set({ orders: ordersData, contactMessages: messagesData, dashboardStats: statsData, newOrdersCount: newOrders.length });
                }
            } catch (error) {
                console.error("Failed to load admin data", error);
            }
        },

        ensureAllProductsLoaded: async () => {
            const { fullProductsLoaded, products: existingProducts } = get();
            if (fullProductsLoaded) return;
            try {
                const res = await fetch(`${API_URL}/products`);
                if (!res.ok) throw new Error('Failed to fetch all products');
                let allProducts: Product[] = await res.json();
                
                // Ensure all products have images
                const processed = allProducts.map((p: any) => ({
                    ...p,
                    images: getProductImages(p)
                }));

                // Merge products to avoid duplicates but fill missing ones
                const productMap = new Map<string, Product>();
                existingProducts.forEach(p => productMap.set(String(p.id), p));
                processed.forEach(p => productMap.set(String(p.id), p));
                
                set({ 
                    products: Array.from(productMap.values()), 
                    fullProductsLoaded: true 
                });
            } catch (error) {
                console.error("Failed to load all products", error);
            }
        },

        loadAdminProducts: async (page, searchTerm) => {
            const token = getTokenFromStorage();
            if (!token) return;
            try {
                const params = new URLSearchParams({ page: String(page), search: searchTerm });
                const res = await fetch(`${API_URL}/products/admin?${params.toString()}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to fetch admin products');
                const data: AdminProductsResponse = await res.json();
                set({ adminProducts: data.products, adminProductsPagination: { page: data.page, pages: data.pages, total: data.total } });
            } catch (error) {
                get().notify("Could not load products for admin panel.", "error");
            }
        },

        setProducts: (products) => set({ products }),
        setSelectedProduct: (product) => set({ selectedProduct: product }),
        
        refreshProduct: async (id: string) => {
            try {
                const res = await fetch(`${API_URL}/products/${id}`);
                if (!res.ok) return;
                const freshProduct = await res.json();
                set(state => {
                    const isMatch = (p: Product) => p.id === freshProduct.id || p.productId === freshProduct.productId;
                    const updatedProducts = state.products.map(p => isMatch(p) ? freshProduct : p);
                    let newSelected = state.selectedProduct;
                    if (!newSelected || isMatch(newSelected)) newSelected = freshProduct;
                    return { products: updatedProducts, selectedProduct: newSelected };
                });
            } catch (e) {
                console.error("Failed to refresh product", e);
            }
        },

        notify: (message, type = 'success') => {
            set({ notification: { message, type } });
            setTimeout(() => set({ notification: null }), 3000);
        },
        
        addToCart: (product, quantity = 1, size = 'Standard') => {
            const finalSize = size || (product as any).selectedSize || 'Standard';
            const { cart } = get();
            const productId = String(product.id || product.productId || '');
            const itemIdForAnalytics = product.productId || product.id;
            const existingItem = cart.find(item => String(item.id) === productId && item.size === finalSize);
            const productImage = (product as any).image || (product.images && product.images[0]) || '';

            let newCart;
            if (existingItem) {
                get().notify("Item quantity updated in cart.", 'success');
                newCart = cart.map(item => String(item.id) === productId && item.size === finalSize ? { ...item, quantity: item.quantity + quantity } : item);
            } else {
                const newItem: CartItem = { 
                    id: productId, 
                    productId: itemIdForAnalytics, 
                    name: product.name, 
                    price: product.price, 
                    quantity: quantity, 
                    image: productImage, 
                    size: finalSize 
                };
                get().notify("Item added to your cart.", 'success');
                newCart = [...cart, newItem];
            }
            set({ cart: newCart });
            get()._updateCartTotal();

            const eventId = `${Date.now()}.${Math.floor(Math.random() * 1000000)}`;

            // Data Layer Push for GTM (Browser Pixel)
            if (typeof window !== 'undefined') {
                (window as any).dataLayer = (window as any).dataLayer || [];
                (window as any).dataLayer.push({ ecommerce: null });
                (window as any).dataLayer.push({
                    event: 'AddToCart',
                    event_id: eventId,
                    ecommerce: {
                        currency: 'BDT',
                        value: product.price * quantity,
                        items: [{
                            item_id: itemIdForAnalytics,
                            item_name: product.name,
                            price: product.price,
                            quantity: quantity,
                            item_variant: size
                        }]
                    }
                });
            }

            // Unified Server-side Tracking
            trackServerEvent('AddToCart', {
                event_id: eventId,
                value: product.price * quantity,
                currency: 'BDT',
                content_ids: [itemIdForAnalytics],
                content_name: product.name,
                content_type: 'product',
                num_items: quantity,
                items: [{
                    id: itemIdForAnalytics,
                    name: product.name,
                    price: product.price,
                    quantity: quantity
                }]
            }, {});
        },
        
        updateCartQuantity: (id, size, newQuantity) => {
            const { cart } = get();
            let newCart;
            if (newQuantity <= 0) {
                newCart = cart.filter(item => !(item.id === id && item.size === size));
            } else {
                newCart = cart.map(item => item.id === id && item.size === size ? { ...item, quantity: newQuantity } : item);
            }
            set({ cart: newCart });
            get()._updateCartTotal();
        },
        
        clearCart: () => {
            set({ cart: [] });
            get()._updateCartTotal();
        },
        
        _updateCartTotal: () => {
            set(state => ({ cartTotal: state.cart.reduce((total, item) => total + (item.price * item.quantity), 0) }));
        },

        login: async (email, password) => {
            try {
                const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
                if (!res.ok) {
                    const contentType = res.headers.get('content-type');
                    let errorData;
                    if (contentType && contentType.includes('application/json')) {
                        errorData = await res.json().catch(() => ({ message: 'Login failed (Invalid JSON response)' }));
                    } else {
                        const errorText = await res.text().catch(() => 'No detail');
                        console.error('Non-JSON Error Response:', errorText);
                        errorData = { message: `Server Error (Status: ${res.status}). ${errorText.substring(0, 50)}` };
                    }
                    // Handle detailed error reporting from server if available
                    const errorMessage = errorData.error ? `${errorData.message}: ${errorData.error}` : (errorData.message || 'Incorrect email or password.');
                    throw new Error(errorMessage);
                }
                const { token } = await res.json();
                localStorage.setItem('unique_corner_admin_token', token);
                set({ isAdminAuthenticated: true });
                get().loadAdminData();
                get().navigate('/admin/dashboard');
                get().notify('Login successful!', 'success');
                return true;
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Incorrect email or password.';
                get().notify(message, 'error');
                return false;
            }
        },

        resetAdminPassword: async (email) => {
            try {
                const res = await fetch(`${API_URL}/auth/reset-access`, { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ email }) 
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Retrieval failed');
                }
                get().notify(data.message || 'Credentials retrieved successfully! Check your email.', 'success');
                return true;
            } catch (error) {
                get().notify(error instanceof Error ? error.message : 'Retrieval failed', 'error');
                return false;
            }
        },

        logout: () => {
            localStorage.removeItem('unique_corner_admin_token');
            set({ isAdminAuthenticated: false, orders: [], contactMessages: [], dashboardStats: null });
            get().navigate('/');
            get().notify('You have been logged out.', 'success');
        },

        addProduct: async (productData) => {
            const token = getTokenFromStorage();
            const res = await fetch(`${API_URL}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(productData) });
            const newProduct = await res.json();
            set(state => ({ products: [newProduct, ...state.products] }));
            get().notify('Product added successfully!', 'success');
        },
        
        updateProduct: async (updatedProduct) => {
            const token = getTokenFromStorage();
            const res = await fetch(`${API_URL}/products/${updatedProduct.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(updatedProduct) });
            const savedProduct = await res.json();
            set(state => ({ products: state.products.map(p => p.id === savedProduct.id ? savedProduct : p), selectedProduct: state.selectedProduct?.id === savedProduct.id ? savedProduct : state.selectedProduct }));
            get().notify('Product updated successfully!', 'success');
        },

        deleteProduct: async (id) => {
            try {
                const token = getTokenFromStorage();
                const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    get().notify(errorData.message || 'Failed to delete product.', 'error');
                    return;
                }
                set(state => ({ 
                    products: state.products.filter(p => p.id !== id && (p as any)._id !== id && (p as any).productId !== id),
                    adminProducts: state.adminProducts.filter(p => p.id !== id && (p as any)._id !== id && (p as any).productId !== id),
                    adminProductsPagination: {
                        ...state.adminProductsPagination,
                        total: Math.max(0, (state.adminProductsPagination.total || 1) - 1)
                    }
                }));
                get().notify('Product deleted successfully.', 'success');
            } catch (error) {
                console.error("Error deleting product:", error);
                get().notify('Failed to delete product.', 'error');
            }
        },

        updateOrderStatus: async (orderId, status) => {
            const token = getTokenFromStorage();
            const res = await fetch(`${API_URL}/orders/${orderId}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ status }) });
            const updatedOrder = await res.json();
            set(state => ({ orders: state.orders.map(o => o.id === updatedOrder.id ? updatedOrder : o) }));
            get().notify(`Order ${orderId} status updated to ${status}.`, 'success');
        },

        refreshOrders: async () => {
            const token = getTokenFromStorage();
            if (!token) return;
            try {
                const res = await fetch(`${API_URL}/orders`, { headers: { 'Authorization': `Bearer ${token}` } });
                if (!res.ok) throw new Error('Failed to fetch orders');
                const ordersData = await res.json();
                const lastSeenOrders = localStorage.getItem('unique_corner_admin_last_orders_seen');
                const lastSeenOrdersDate = lastSeenOrders ? new Date(lastSeenOrders) : new Date(0);
                const newOrders = ordersData.filter((o: Order) => {
                    const oDate = o.createdAt ? new Date(o.createdAt) : new Date(o.date);
                    return oDate > lastSeenOrdersDate;
                });
                set({ orders: ordersData, newOrdersCount: newOrders.length });
                get().notify('Orders list refreshed.', 'success');
            } catch (error) {
                get().notify("Could not refresh orders.", "error");
            }
        },
        
        markOrdersAsSeen: () => {
            localStorage.setItem('unique_corner_admin_last_orders_seen', new Date().toISOString());
            set({ newOrdersCount: 0 });
        },

        addOrder: async (customerDetails, cartItems, total, paymentInfo, shippingCharge, discountAmount, couponCode) => {
            // Helper to get Google Analytics Client ID from cookies
            const getGaClientId = () => {
                try {
                    const cookie = document.cookie.split('; ').find(row => row.startsWith('_ga='));
                    if (cookie) {
                        const parts = cookie.split('=')[1].split('.');
                        return `${parts[2]}.${parts[3]}`;
                    }
                } catch (e) {}
                return null;
            };

            const gaClientId = getGaClientId();

            const res = await fetch(`${API_URL}/orders`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ 
                    customerDetails, 
                    cartItems, 
                    total, 
                    paymentInfo, 
                    shippingCharge,
                    discountAmount,
                    couponCode,
                    gaClientId // Sending to backend for server-side tracking
                }) 
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || "Failed to place order. Please check your details.");
            }
            const newOrder = await res.json();
            if(get().isAdminAuthenticated) set(state => ({ orders: [newOrder, ...state.orders] }));
            return newOrder;
        },

        deleteOrder: async (orderId) => {
            try {
                const token = getTokenFromStorage();
                const res = await fetch(`${API_URL}/orders/${orderId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    get().notify(errorData.message || 'Failed to delete order.', 'error');
                    return;
                }
                set(state => ({ orders: state.orders.filter(order => order.id !== orderId && (order as any)._id !== orderId && (order as any).orderId !== orderId) }));
                get().notify(`Order ${orderId} has been deleted.`, 'success');
            } catch (error) {
                console.error("Error deleting order:", error);
                get().notify('Failed to delete order.', 'error');
            }
        },
        
        addContactMessage: async (messageData) => {
            await fetch(`${API_URL}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(messageData) });
        },

        markMessageAsRead: async (messageId, isRead) => {
            const token = getTokenFromStorage();
            const res = await fetch(`${API_URL}/messages/${messageId}/read`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ isRead }) });
            const updatedMessage = await res.json();
            set(state => ({ contactMessages: state.contactMessages.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg) }));
            get().notify(`Message marked as ${isRead ? 'read' : 'unread'}.`, 'success');
        },

        deleteContactMessage: async (messageId) => {
            try {
                const token = getTokenFromStorage();
                const res = await fetch(`${API_URL}/messages/${messageId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    get().notify(errorData.message || 'Failed to delete message.', 'error');
                    return;
                }
                set(state => ({ contactMessages: state.contactMessages.filter(msg => msg.id !== messageId && (msg as any)._id !== messageId) }));
                get().notify('Message has been deleted.', 'success');
            } catch (error) {
                console.error("Error deleting message:", error);
                get().notify('Failed to delete message.', 'error');
            }
        },
        
        updateSettings: async (newSettings) => {
            try {
                const token = getTokenFromStorage();
                const res = await fetch(`${API_URL}/settings`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(newSettings) });
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({ message: 'Failed to update settings.' }));
                    throw new Error(errorData.message || 'Failed to update settings.');
                }
                const updatedSettings = await res.json();
                set({ settings: updatedSettings });
                get().notify('Settings updated successfully!', 'success');
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                get().notify(`Error: ${errorMessage}`, 'error');
                throw error;
            }
        },
    }),
    {
      name: 'unique-corner-storage',
      storage: createJSONStorage(() => ({
        getItem: (name: string) => {
          try {
            return localStorage.getItem(name);
          } catch (e) {
            return null;
          }
        },
        setItem: (name: string, value: string) => {
          try {
            localStorage.setItem(name, value);
          } catch (e) {
            console.warn('LocalStorage quota exceeded. Performing safe fallback...', e);
            try {
              localStorage.removeItem(name);
              const parsed = JSON.parse(value);
              if (parsed && parsed.state) {
                const minimal = { state: { cart: parsed.state.cart || [] }, version: parsed.version };
                localStorage.setItem(name, JSON.stringify(minimal));
              }
            } catch (_) {}
          }
        },
        removeItem: (name: string) => {
          try {
            localStorage.removeItem(name);
          } catch (e) {}
        }
      })),
      partialize: (state) => ({
        cart: state.cart
      }),
      merge: (persistedState: any, currentState: AppState) => {
        if (!persistedState || typeof persistedState !== 'object') return currentState;
        let safeCart: CartItem[] = [];
        if (Array.isArray(persistedState.cart)) {
            safeCart = persistedState.cart.filter((item: any) => item && typeof item === 'object');
        }
        const merged = { ...currentState, cart: safeCart };
        merged.cartTotal = safeCart.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
        if (!merged.productReviews || typeof merged.productReviews !== 'object') merged.productReviews = {};
        if (!Array.isArray(merged.globalReviews)) merged.globalReviews = [];
        return merged;
      },
    }
  )
);

window.addEventListener('popstate', () => { useAppStore.setState({ path: window.location.pathname + window.location.search }); });
useAppStore.getState().loadInitialData();
