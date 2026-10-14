import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  Sparkles,
  ArrowRight,
  Shield,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { ProductDetailsModal } from '../components/products/ProductDetailsModal';
import { ProductFilters } from '../components/products/ProductFilters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface HomePageProps {
  products: Product[];
  loading: boolean;
  onOpenNoticeModal: () => void;
  onNavigateToDashboard: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  loading,
  onOpenNoticeModal,
  onNavigateToDashboard,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesQuery =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.privacyBadge.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 sm:p-12 shadow-2xl border border-indigo-900/50">
        <div className="relative z-10 max-w-3xl space-y-5">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Digital Personal Data Protection (DPDP) Act, 2023 Compliant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Privacy-Preserving <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
              E-Commerce Experience
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Shop certified hardware tokens, cryptographic storage, and privacy tools without surrendering your personal data. Built with unbundled marketing consent, itemised purpose notices, and statutory Data Principal rights.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenNoticeModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Read Statutory Privacy Notice</span>
            </button>

            <button
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Open Privacy Dashboard</span>
            </button>
          </div>

          {/* Key DPDP Guarantee Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-indigo-800/60 text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Zero Cross-site Trackers</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>PostgreSQL RLS Isolated</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Unbundled Consent Toggles</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Section 11 Data Portability</span>
            </div>
          </div>

        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Catalog Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Privacy-First Product Catalog
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Every item includes an itemised data collection disclosure prior to purchase.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {filteredProducts.length} verified products available
          </span>
        </div>

        {/* Filters */}
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Product Grid or Loading */}
        {loading ? (
          <LoadingSpinner label="Loading certified hardware catalog..." size="lg" />
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <p className="text-sm font-semibold text-slate-700">No matching products found</p>
            <p className="text-xs text-slate-500">
              Try adjusting your search criteria or category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        product={selectedProduct}
      />

    </div>
  );
};
