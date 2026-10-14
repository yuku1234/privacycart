import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedCheckout,
}) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    taxAmount,
    grandTotal,
    clearCart,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Your Cart</h3>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
              {items.length} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700">Your cart is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                No items added yet. Explore our privacy-preserving hardware tokens and guides.
              </p>
              <button
                onClick={onClose}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Browse Catalog &rarr;
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span>Selected Items</span>
                <button
                  onClick={clearCart}
                  className="text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ₹{product.price.toLocaleString('en-IN')} each
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-semibold text-slate-700">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          ₹{(product.price * quantity).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Drawer Footer with Calculations & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50/90 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% Statutory Tax)</span>
                <span className="font-medium text-slate-900">
                  ₹{taxAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Express Courier Shipping</span>
                <span className="font-medium text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-semibold">FREE (Above ₹999)</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Grand Total</span>
                <span className="text-base text-indigo-700">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Data Minimisation: Address purged 30 days post delivery unless saved.</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedCheckout();
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Mock Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
