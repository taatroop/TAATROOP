
import React, { memo } from 'react';
import { Product } from '../types';
import { useAppStore } from '../store';
import { Star, Eye } from 'lucide-react';
import { getProductImage } from '../assets';
import SafeImage from './SafeImage';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const regularPrice = product.regularPrice || (product.price ? product.price + 150 : 750);
    const navigate = useAppStore(state => state.navigate);
    const isOutOfStock = product.isOutOfStock ?? false;
    const linkId = product.productId || product.id;
    const imageUrl = getProductImage(product);

    const handleViewItem = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/product/${linkId}`);
    };

    return (
        <div 
            className={`bg-white border border-[#E8E1D7] p-1.5 sm:p-2.5 group cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:border-[#23412F]/40 rounded-xs ${isOutOfStock ? 'opacity-60' : ''}`}
            onClick={() => navigate(`/product/${linkId}`)}
        >
            <div>
                {/* Image Wrapper */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F8F5F0] mb-1.5 border border-[#E8E1D7]/60 rounded-xs">
                    <SafeImage
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-[#23412F]/40 flex items-center justify-center backdrop-blur-[1px]">
                            <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-widest bg-[#23412F]/80 px-2.5 py-0.5">স্টক শেষ</span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="space-y-0.5 sm:space-y-1">
                    <span className="text-[8.5px] sm:text-[10px] font-bold tracking-wider sm:tracking-widest uppercase text-[#6B4A2F] block truncate">
                      {product.category || 'HANDLOOM LUNGI'}
                    </span>
                    <h3 className="font-serif text-xs sm:text-sm md:text-base font-semibold text-stone-900 group-hover:text-[#23412F] transition-colors line-clamp-1 leading-snug">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline space-x-1.5 pt-0.5">
                      <span className="font-bold text-xs sm:text-sm text-[#23412F]">৳ {product.price}</span>
                      {regularPrice > product.price && (
                        <span className="text-[10px] sm:text-xs text-stone-400 line-through">৳ {regularPrice}</span>
                      )}
                    </div>
                </div>
            </div>

            {/* Stars */}
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] pt-1.5 mt-2 border-t border-[#E8E1D7]">
              <div className="flex text-amber-500 space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className="fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-[#6B4A2F] font-medium text-[8.5px] sm:text-[10px] whitespace-nowrap">({product.reviewsCount || 48} রিভিউ)</span>
            </div>

            {/* Action Button */}
            {!isOutOfStock && (
              <button
                onClick={handleViewItem}
                className="mt-2.5 w-full py-2 bg-[#23412F] hover:bg-[#1B3225] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Eye size={13} className="text-white" />
                <span>View Item</span>
              </button>
            )}
        </div>
    );
};

export default memo(ProductCard);
