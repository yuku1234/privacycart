import React, { useState } from 'react';
import {
  Lock,
  CheckCircle2,
  ShieldAlert,
  CreditCard,
  QrCode,
  Truck,
  ArrowRight,
  Info
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { dataService } from '../../lib/dataService';
import { MockOrder } from '../../types';

interface MockCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: MockOrder) => void;
}

export const MockCheckoutModal: React.FC<MockCheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted,
}) => {
  const { items, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { success, error } = useNotification();

  const [fullName, setFullName] = useState(user?.fullName || 'Alice Kulkarni');
  const [street, setStreet] = useState('Hostel No. 4, SPPU Campus, Ganeshkhind');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('411007');
  const [retainAddress, setRetainAddress] = useState(false); // DPDP Privacy by Default
  const [paymentMethod, setPaymentMethod] = useState<'MOCK_UPI' | 'MOCK_COD' | 'MOCK_NETBANKING'>('MOCK_UPI');
  const [mockUpiId, setMockUpiId] = useState('student@oksppu');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<MockOrder | null>(null);

  if (!isOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      error('Authentication Required', 'Please sign in or select a demo persona to place an order.');
      return;
    }

    if (!fullName || !street || !city || !pincode) {
      error('Missing Details', 'Please complete all required shipping fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        userId: user.id,
        userEmail: user.email,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
        totalAmount: grandTotal,
        shippingAddress: {
          fullName,
          street,
          city,
          state,
          pincode,
        },
        retainAddressForFutureOrders: retainAddress,
        paymentMethod,
      };

      const newOrder = await dataService.createOrder(orderPayload);
      clearCart();
      setCompletedOrder(newOrder);
      success('Mock Order Placed', `Order #${newOrder.orderNumber} successfully generated.`);
      onOrderCompleted(newOrder);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error('Checkout Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={completedOrder ? 'Order Confirmation' : 'Privacy-Preserving Checkout'}
      subtitle={
        completedOrder
          ? 'DPDP Compliant Transaction Record'
          : 'Data Minimisation & Purpose Limitation Enforced'
      }
      maxWidth="2xl"
    >
      {completedOrder ? (
        /* Order Success State */
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Mock Order Successfully Confirmed!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Order Reference ID:{' '}
              <span className="font-mono font-bold text-indigo-600">
                {completedOrder.orderNumber}
              </span>
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Total:</span>
              <span className="font-bold text-slate-900">
                ₹{completedOrder.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Simulation:</span>
              <span className="font-semibold text-emerald-600">
                {completedOrder.paymentMethod} (Mock Verified)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Address Retention:</span>
              <span className="text-slate-700">
                {completedOrder.retainAddressForFutureOrders
                  ? 'Retained per user consent'
                  : 'Ephemeral (Purged 30 days post delivery)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Recipient:</span>
              <span className="text-slate-700 font-medium">
                {completedOrder.shippingAddress.fullName}, {completedOrder.shippingAddress.city}
              </span>
            </div>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 flex items-center justify-center gap-2 max-w-md mx-auto">
            <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              This transaction is safely logged in your isolated Privacy Dashboard under DPDP Section 11.
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={handleCloseModal}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Return to Catalog
            </button>
          </div>
        </div>
      ) : (
        /* Checkout Form */
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          
          {/* Statutory Data Collection Purpose Notice (DPDP Section 5) */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 text-xs text-indigo-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">
                Statutory Notice on Delivery Data Collection (DPDP Act 2023 Sec 4(1)(a)):
              </span>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                Your name, postal delivery address, and pincode are collected strictly to execute physical package delivery. We do not sell or monetize address data.
              </p>
            </div>
          </div>

          {/* Shipping Address Fields */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-indigo-600" />
              <span>1. Shipping & Delivery Address</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Street Address / Hostel / Flat *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Privacy-by-Default Address Retention Toggle */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
              <input
                id="retainAddressCheckbox"
                type="checkbox"
                checked={retainAddress}
                onChange={(e) => setRetainAddress(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="retainAddressCheckbox" className="text-xs text-slate-700 cursor-pointer">
                <span className="font-bold block text-slate-900">
                  Save this address for faster future checkouts
                </span>
                <span className="text-[11px] text-slate-500">
                  Unchecked by default (DPDP Privacy-by-Default). If unchecked, this address is retained only for the active order and purged 30 days post delivery.
                </span>
              </label>
            </div>
          </div>

          {/* Mock Payment Simulation (Strict requirement: NO real card details collected!) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Mock Payment Simulation (Zero Real Financial Data)</span>
            </h4>

            {/* Warning callout */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Academic Prototype Safety Rule:</strong>
                Never enter real credit cards, CVVs, or OTPs. All financial interactions in this project are simulated.
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('MOCK_UPI')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'MOCK_UPI'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <QrCode className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                <span className="text-xs block">Mock UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('MOCK_COD')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'MOCK_COD'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Truck className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs block">Cash on Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('MOCK_NETBANKING')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'MOCK_NETBANKING'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Lock className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                <span className="text-xs block">Mock NetBanking</span>
              </button>
            </div>

            {paymentMethod === 'MOCK_UPI' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Simulated UPI ID / VPA
                </label>
                <input
                  type="text"
                  value={mockUpiId}
                  onChange={(e) => setMockUpiId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500">Payable Amount:</span>
              <div className="text-base font-black text-slate-900">
                ₹{grandTotal.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Processing Order...' : 'Complete Mock Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </form>
      )}
    </Modal>
  );
};
