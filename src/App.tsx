import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/cart/CartDrawer';
import { MockCheckoutModal } from './components/cart/MockCheckoutModal';
import { AuthModal } from './components/auth/AuthModal';
import { PrivacyNoticeModal } from './components/privacy/PrivacyNoticeModal';
import { HomePage } from './pages/HomePage';
import { PrivacyDashboardPage } from './pages/PrivacyDashboardPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { dataService } from './lib/dataService';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Product, MockOrder } from './types';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'store' | 'dashboard' | 'notice' | 'admin'>('store');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  const { user } = useAuth();

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await dataService.getProducts();
      setProducts(data);
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();

    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: '#1e1b4b' }).catch(() => {});
      SplashScreen.hide().catch(() => {});
    }
  }, []);

  const handleOrderCompleted = (_order: MockOrder) => {
    // Optionally trigger any additional order actions
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">

      {/* 2. Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenNoticeModal={() => setIsNoticeModalOpen(true)}
      />

      {/* 3. Main View with safe mobile bottom padding */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 md:pb-8">
        {currentView === 'store' && (
          <HomePage
            products={products}
            loading={loadingProducts}
            onOpenNoticeModal={() => setIsNoticeModalOpen(true)}
            onNavigateToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'dashboard' && <PrivacyDashboardPage />}

        {currentView === 'notice' && <PrivacyPolicyPage />}

        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* 4. Academic Footer */}
      <Footer
        onOpenNoticeModal={() => setIsNoticeModalOpen(true)}
        onNavigate={setCurrentView}
      />

      {/* 5. Drawers and Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
      />

      <MockCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <PrivacyNoticeModal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
      />

      {/* 6. Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
