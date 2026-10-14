import React from 'react';
import { ShoppingCart, Star, ShieldCheck, Eye } from 'lucide-react';
import { Product } from '../../types';
import { Badge } from '../common/Badge';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const { success } = useNotification();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    success('Added to Cart', `${product.name} has been added.`);
  };

  const getPrivacyBadgeVariant = (badge: Product['privacyBadge']) => {
    switch (badge) {
      case 'Zero Telemetry':
        return 'success';
      case 'Encrypted':
        return 'primary';
      case 'Minimal Data':
        return 'info';
      case 'Open Source':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <Badge variant={getPrivacyBadgeVariant(product.privacyBadge)} size="sm">
            <ShieldCheck className="w-3 h-3" />
            {product.privacyBadge}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-1 shadow-xs">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{product.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            {product.category}
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Itemised Privacy Assurance Pill */}
          <div className="mt-3 p-2 rounded-lg bg-emerald-50/80 border border-emerald-100 text-[11px] text-emerald-800 flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium">{product.dataRequiredDescription}</span>
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400">Price (incl. GST)</span>
            <div className="text-lg font-black text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="View full details and DPDP disclosure"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddToCart}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
