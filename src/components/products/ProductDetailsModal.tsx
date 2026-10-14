import React, { useState } from 'react';
import {
  ShoppingCart,
  Star,
  ShieldCheck,
  Check,
  Lock,
  Info,
  PackageCheck
} from 'lucide-react';
import { Product } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { success } = useNotification();

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    success('Added to Cart', `${quantity}x ${product.name} added to your cart.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      subtitle={`Category: ${product.category} • DPDP Verified`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        
        {/* Top Product Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge variant="success" size="sm">
                <ShieldCheck className="w-3 h-3" />
                {product.privacyBadge}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  {product.rating} / 5.0
                </span>
                <span className="text-xs text-slate-400">• In Stock</span>
              </div>

              <div className="text-2xl font-black text-slate-900 mt-2">
                ₹{product.price.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-400 ml-2">GST Included</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Feature Highlights */}
            <div className="space-y-1.5 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Specifications:
              </h4>
              <ul className="space-y-1">
                {product.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* DPDP ACT 2023 SPECIFIC ITEMISED DISCLOSURE (KEY ACADEMIC REQUIREMENT) */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 space-y-3">
          <div className="flex items-center gap-2 text-indigo-900">
            <Lock className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              DPDP Act 2023 — Itemised Personal Data Notice For This Item
            </h4>
          </div>

          <p className="text-xs text-indigo-950 leading-relaxed">
            {product.dataRequiredDescription}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-600 border-t border-indigo-100">
            <div className="flex items-start gap-1.5">
              <PackageCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800">Processing Purpose:</strong>
                Physical transit only
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800">Data Minimisation:</strong>
                Zero telemetry tracked
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800">Statutory Basis:</strong>
                Section 4(1)(a) Contract
              </div>
            </div>
          </div>
        </div>

        {/* Quantity and Add to Cart Action */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors font-bold cursor-pointer"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-4 py-2 text-xs font-bold text-slate-800">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-slate-600 hover:bg-slate-200 transition-colors font-bold cursor-pointer"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart (₹{(product.price * quantity).toLocaleString('en-IN')})</span>
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
