import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { CheckCircle2, Truck, ShieldCheck, Gift, ArrowRight, Printer, ShoppingBag, PackageCheck, Copy } from 'lucide-react';
import { Order } from '../types';
import { motion } from 'motion/react';
import { Skeleton, Shimmer } from '../components/Skeleton';

interface ThankYouPageProps {
  orderId: string;
}

const ThankYouPageSkeleton: React.FC = () => (
    <main className="min-h-screen bg-[#F8F5F0] pt-28 sm:pt-36 pb-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1300px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-7 flex flex-col items-center text-center space-y-6 bg-white p-8 sm:p-12 border border-[#E8E1D7]">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72" />
                    <Skeleton className="h-4 w-60" />
                    <Skeleton className="h-16 w-full max-w-md rounded-lg mt-4" />
                    <div className="flex gap-4 mt-6">
                        <Skeleton className="h-12 w-40" />
                        <Skeleton className="h-12 w-40" />
                    </div>
                </div>
                <div className="lg:col-span-5 h-[500px]">
                    <Shimmer className="h-full w-full rounded-lg" />
                </div>
            </div>
        </div>
    </main>
);

const ThankYouPage: React.FC<ThankYouPageProps> = ({ orderId }) => {
    const { navigate, notify } = useAppStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId || orderId === 'undefined') {
                setError(true);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(false);
            try {
                const res = await fetch(`/api/orders/${orderId}`);
                if (!res.ok) throw new Error('Order not found');
                const data: Order = await res.json();
                setOrder(data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrder();
    }, [orderId]);

    const handleCopyOrderId = () => {
        const displayId = order?.orderId || order?.id || '';
        navigator.clipboard.writeText(displayId);
        notify("Order ID copied to clipboard", "success");
    };

    if (loading) return <ThankYouPageSkeleton />;
    
    if (error || !order) {
        return (
             <main className="min-h-[85vh] bg-[#F8F5F0] flex flex-col items-center justify-center p-6 text-center pt-28">
                <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mb-6">
                     <ShoppingBag className="w-8 h-8 text-[#23412F]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#23412F] mb-3">Order Statement Not Found</h2>
                <p className="text-stone-600 text-xs sm:text-sm max-w-md mb-8">
                    We were unable to retrieve your acquisition record. Please check your order ID or contact customer support.
                </p>
                <button 
                  onClick={() => navigate('/shop')} 
                  className="px-8 py-3 bg-[#23412F] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1B3225] transition-all shadow-md"
                >
                    Return to Shop
                </button>
            </main>
        );
    }

    const subtotal = (order.cartItems || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = order.discountAmount || 0;
    const shipping = order.shippingCharge !== undefined ? order.shippingCharge : (order.total + discount - subtotal);
    const displayOrderId = order.orderId || order.id || '#TRP-2505187';
    
    const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const customerEmail = order.email || 'customer@example.com';

    return (
      <main className="min-h-screen bg-[#F8F5F0] pb-16 px-4 sm:px-6 lg:px-12 font-sans">
        <div className="max-w-[1320px] mx-auto space-y-10">
            
            {/* Top Grid: Confirmation Left + Order Summary Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                
                {/* LEFT SIDE: Thank You Banner & Status */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="lg:col-span-7 bg-white border border-[#E8E1D7] p-8 sm:p-12 shadow-xs flex flex-col items-center text-center space-y-6"
                >
                    {/* Circle Check Icon */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#23412F] bg-emerald-50/50 flex items-center justify-center text-[#23412F] shadow-xs">
                        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#23412F]" strokeWidth={2} />
                    </div>

                    {/* Thank You Title */}
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">
                            Thank You!
                        </h1>
                        <p className="text-base sm:text-lg font-bold text-stone-800">
                            Your order has been placed successfully.
                        </p>
                        <p className="text-xs sm:text-sm text-stone-600 font-medium">
                            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।
                        </p>
                    </div>

                    {/* Email Notice */}
                    <p className="text-xs sm:text-sm text-stone-600">
                        We've sent a confirmation email to{' '}
                        <span className="font-bold text-[#23412F] break-all">{customerEmail}</span>
                    </p>

                    {/* Order Confirmation Shipping Box */}
                    <div className="w-full max-w-lg bg-[#F8F5F0]/80 border border-[#E8E1D7] rounded-lg p-4 sm:p-5 flex items-center gap-4 text-left shadow-2xs">
                        <div className="w-10 h-10 rounded-full bg-[#23412F]/10 border border-[#23412F]/20 flex items-center justify-center shrink-0">
                            <Truck className="w-5 h-5 text-[#23412F]" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                                Your order is confirmed and will be shipped soon.
                            </h4>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full pt-2">
                        <button
                            onClick={() => window.print()}
                            className="w-full sm:w-auto px-6 py-3.5 bg-[#23412F] hover:bg-[#1B3225] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            <Printer className="w-4 h-4" />
                            <span>View Order Details</span>
                        </button>
                        <button
                            onClick={() => navigate('/shop')}
                            className="w-full sm:w-auto px-6 py-3.5 bg-white border border-[#E8E1D7] hover:border-[#23412F] text-stone-800 hover:text-[#23412F] text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-2xs flex items-center justify-center gap-2"
                        >
                            <span>Continue Shopping</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>

                {/* RIGHT SIDE: Order Summary Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="lg:col-span-5 bg-white border border-[#E8E1D7] p-6 sm:p-8 shadow-xs space-y-6"
                >
                    <div className="flex items-center justify-between border-b border-[#E8E1D7] pb-4">
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                            Order Summary
                        </h3>
                        <button 
                            onClick={handleCopyOrderId} 
                            className="text-[10px] font-bold text-[#6B4A2F] hover:text-[#23412F] uppercase tracking-wider flex items-center gap-1 bg-[#F8F5F0] px-2.5 py-1 border border-[#E8E1D7]"
                            title="Copy Order ID"
                        >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                        </button>
                    </div>

                    {/* Order Details Metadata Table */}
                    <div className="space-y-2.5 text-xs sm:text-sm font-medium">
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500">Order ID</span>
                            <span className="font-mono font-bold text-stone-900">{displayOrderId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500">Order Date</span>
                            <span className="text-stone-800">{formattedDate}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500">Payment Method</span>
                            <span className="text-stone-800 font-bold">
                                {order.paymentMethod === 'COD' ? 'Cash on Delivery' : `${order.paymentDetails?.method || 'Digital Payment'}`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-stone-500">Payment Status</span>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 uppercase tracking-wider">
                                {order.paymentMethod === 'Online' ? 'Paid' : 'Pending'}
                            </span>
                        </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="border-t border-b border-[#E8E1D7] py-4 space-y-4 max-h-[260px] overflow-y-auto custom-scrollbar-light">
                        {(order.cartItems || []).map((item, idx) => (
                            <div key={idx} className="flex gap-3.5 items-center">
                                <div className="w-14 h-16 sm:w-16 sm:h-18 shrink-0 bg-[#F8F5F0] border border-[#E8E1D7] overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B4A2F]">তাঁতরূপ Taatroop</p>
                                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">{item.name}</h4>
                                    <p className="text-[11px] text-stone-500">
                                        Size: <span className="text-stone-700 font-medium">{item.size}</span> | Qty: <span className="text-stone-700 font-medium">{item.quantity}</span>
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-xs sm:text-sm font-sans font-bold text-[#23412F]">
                                        ৳{(item.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Financial Totals */}
                    <div className="space-y-2.5 text-xs sm:text-sm">
                        <div className="flex justify-between text-stone-600">
                            <span>Subtotal</span>
                            <span className="font-bold text-stone-900">৳{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-stone-600">
                            <span>Shipping</span>
                            <span className="font-bold text-stone-900">৳{shipping.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-emerald-700 font-medium">
                                <span>Discount</span>
                                <span className="font-bold">-৳{discount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-base sm:text-lg font-bold text-[#23412F] pt-3 border-t border-[#E8E1D7]">
                            <span>Total</span>
                            <span className="text-xl sm:text-2xl font-bold font-sans">৳{order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
      </main>
    );
};

export default ThankYouPage;
