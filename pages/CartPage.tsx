
// pages/CartPage.tsx

import React from 'react';
import { CartItem } from '../types';
import { ShoppingCart, Truck, ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { useAppStore } from '../store';

const CartItemComponent: React.FC<{ item: CartItem, updateCartQuantity: (id: string, size: string, newQuantity: number) => void }> = ({ item, updateCartQuantity }) => (
    <div className="flex gap-4 sm:gap-6 py-6 border-b border-stone-200 bg-white p-4 shadow-sm">
        <div className="w-20 sm:w-28 aspect-[4/3] flex-shrink-0 overflow-hidden bg-stone-100 border border-stone-200">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>

        <div className="flex flex-col flex-1 justify-between">
            <div className="flex justify-between items-start gap-2">
                <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900">{item.name}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      সিরাজগঞ্জ হ্যান্ডলুম লুঙ্গি
                    </p>
                </div>
                <button 
                  onClick={() => updateCartQuantity(item.id, item.size, 0)} 
                  className="text-stone-400 hover:text-red-600 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
            </div>

            <div className="flex items-center justify-between pt-3">
                <div className="flex items-center border border-stone-300 bg-white">
                    <button 
                        onClick={() => updateCartQuantity(item.id, item.size, item.quantity - 1)} 
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold"
                    >
                        <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-900">{item.quantity}</span>
                    <button 
                        onClick={() => updateCartQuantity(item.id, item.size, item.quantity + 1)} 
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold"
                    >
                        <Plus size={12} />
                    </button>
                </div>
                <div className="text-right">
                    <span className="text-sm sm:text-base font-bold text-stone-900">৳{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
    </div>
);

const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, navigate, cartTotal } = useAppStore(state => ({
    cart: state.cart,
    updateCartQuantity: state.updateCartQuantity,
    navigate: state.navigate,
    cartTotal: state.cartTotal
  }));

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4 pb-16">
        <div className="text-center max-w-md bg-white p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-500">
              <ShoppingCart className="w-8 h-8 text-amber-900" />
          </div>
          <h2 className="font-serif text-xl font-bold text-stone-900">আপনার শপিং ব্যাগ সম্পূর্ণ খালি</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
              আপনি তাঁতরূপ থেকে এখনো কোনো লুঙ্গি ব্যাগে যোগ করেননি।
          </p>
          <button 
            onClick={() => navigate('/shop')} 
            className="w-full py-3 bg-[#121816] hover:bg-stone-800 text-white font-bold uppercase tracking-wider text-xs transition-all shadow"
          >
              লুঙ্গি কালেকশন দেখুন
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-24 text-stone-900 font-sans">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-[0.25em] block mb-2">TAATROOP SHOPPING BAG</span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">আপনার নির্বাচিত ব্যাগ</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
              <div className="space-y-3">
                  {cart.map(item => (
                    <CartItemComponent key={`${item.id}-${item.size}`} item={item} updateCartQuantity={updateCartQuantity} />
                  ))}
              </div>
              
              <button 
                  onClick={() => navigate('/shop')} 
                  className="mt-4 inline-flex items-center space-x-2 text-xs font-bold text-stone-700 hover:text-amber-900 transition-colors"
              >
                  <ArrowLeft size={14} />
                  <span>আরও কেনাকাটা করুন</span>
              </button>
          </div>

          <div className="lg:col-span-5">
              <div className="bg-white border border-stone-200 p-6 shadow-sm space-y-6">
                  <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-3">Order Summary</h3>
                  
                  <div className="space-y-3 text-xs text-stone-700">
                      <div className="flex justify-between items-center">
                          <span>পণ্যর মূল্য:</span>
                          <span className="font-bold text-stone-900">৳{cartTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span>ডেলিভারি চার্জ:</span>
                          <span className="text-stone-500 font-medium">পরবর্তী স্টেপে হিসাব করা হবে</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-stone-900 pt-3 border-t border-stone-200">
                          <span>সর্বমোট আনুমানিক:</span>
                          <span className="text-xl text-amber-900">৳{cartTotal.toLocaleString('en-IN')}</span>
                      </div>
                  </div>

                  <button 
                      onClick={() => navigate('/checkout')} 
                      className="w-full bg-[#121816] hover:bg-stone-800 text-white py-4 font-bold uppercase tracking-wider text-xs transition-all shadow-md flex items-center justify-center space-x-2"
                  >
                      <Truck size={16} />
                      <span>অর্ডার নিশ্চিত করতে এগিয়ে যান</span>
                  </button>
                  
                  <div className="text-center pt-2">
                      <p className="text-[10px] text-stone-500">সম্পূর্ণ ক্যাশ অন ডেলিভারি সার্ভিস সুবিধা।</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
