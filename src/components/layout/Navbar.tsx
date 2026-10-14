import React, { useState } from 'react';
import {
  ShieldCheck,
  ShoppingCart,
  User,
  LogOut,
  ShieldAlert,
  ChevronDown,
  Layers,
  FileText,
  UserCheck,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Badge } from '../common/Badge';

interface NavbarProps {
  currentView: 'store' | 'dashboard' | 'notice' | 'admin';
  onNavigate: (view: 'store' | 'dashboard' | 'notice' | 'admin') => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenNoticeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCart,
  onOpenAuth,
  onOpenNoticeModal,
}) => {
  const { user, isAdmin, logout, switchDemoAccount } = useAuth();
  const { itemCount } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            
            {/* Logo & Academic Project Title */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('store')}
                className="flex items-center gap-2 text-left group cursor-pointer focus:outline-hidden"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Privacy<span className="text-indigo-600">Cart</span>
                  </span>
                  <span className="hidden sm:block text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                    DPDP Act 2023 • SPPU Prototype
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 font-medium text-sm">
              <button
                onClick={() => onNavigate('store')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'store'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Catalog
              </button>

              {user && (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    currentView === 'dashboard'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>Privacy Dashboard</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>
              )}

              <button
                onClick={onOpenNoticeModal}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Privacy Notice (Sec 5)</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    currentView === 'admin'
                      ? 'bg-purple-100 text-purple-800 font-semibold border border-purple-200'
                      : 'text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Admin & DPO Desk</span>
                  <Badge variant="warning" size="sm">Admin</Badge>
                </button>
              )}
            </nav>

            {/* Right Actions: Persona Switcher, Cart & Profile */}
            <div className="flex items-center gap-1.5 sm:gap-3">

              {/* Persona Switcher (Works on Mobile and Desktop) */}
              <div className="relative">
                <button
                  onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
                  title="Switch test personas for viva demonstration"
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="max-w-[70px] sm:max-w-none truncate">
                    {user?.fullName?.split(' ')[0] || 'Guest'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                </button>

                {demoMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-fadeIn text-xs"
                    onClick={() => setDemoMenuOpen(false)}
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                      Instant Demo Persona Switcher
                    </div>
                    <button
                      onClick={() => switchDemoAccount('alice')}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50 flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">Alice Kulkarni</div>
                        <div className="text-[11px] text-slate-500">Student User A (alice@student)</div>
                      </div>
                      {user?.email?.includes('alice') && <Badge variant="primary" size="sm">Active</Badge>}
                    </button>
                    <button
                      onClick={() => switchDemoAccount('bob')}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50 flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">Bob Deshmukh</div>
                        <div className="text-[11px] text-slate-500">Student User B (bob@student)</div>
                      </div>
                      {user?.email?.includes('bob') && <Badge variant="primary" size="sm">Active</Badge>}
                    </button>
                    <button
                      onClick={() => {
                        switchDemoAccount('admin');
                        onNavigate('admin');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-purple-50 flex items-center justify-between cursor-pointer border-t border-slate-100"
                    >
                      <div>
                        <div className="font-semibold text-purple-900">Prof. Sharma (DPO)</div>
                        <div className="text-[11px] text-purple-600">Administrator & Grievance Officer</div>
                      </div>
                      {user?.role === 'admin' && <Badge variant="warning" size="sm">Active</Badge>}
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative p-1.5 sm:p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="View shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Profile / Auth Button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-1 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                      {user.fullName.charAt(0)}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-sm animate-fadeIn"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-semibold text-slate-900 truncate">{user.fullName}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <div className="mt-1">
                          <Badge variant={user.role === 'admin' ? 'warning' : 'primary'} size="sm">
                            {user.role === 'admin' ? 'Data Protection Officer' : 'Data Principal'}
                          </Badge>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigate('dashboard')}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-xs"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Privacy Dashboard</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => onNavigate('admin')}
                          className="w-full text-left px-4 py-2 text-purple-700 hover:bg-purple-50 flex items-center gap-2 cursor-pointer font-medium text-xs"
                        >
                          <ShieldAlert className="w-4 h-4 text-purple-600" />
                          <span>Admin & DPO Desk</span>
                        </button>
                      )}

                      <button
                        onClick={onOpenNoticeModal}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-xs"
                      >
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span>Statutory Notice</span>
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer text-xs"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] sm:text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (Visible on Android & Phone screens < 768px) */}
      <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around text-[10px] font-medium safe-bottom">
        <button
          onClick={() => onNavigate('store')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors cursor-pointer ${
            currentView === 'store' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Catalog</span>
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors cursor-pointer ${
            currentView === 'dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <div className="relative">
            <ShieldCheck className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5" />
          </div>
          <span>Privacy</span>
        </button>

        <button
          onClick={onOpenNoticeModal}
          className="flex flex-col items-center gap-0.5 p-1 rounded-lg text-slate-500 transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Notice</span>
        </button>

        {isAdmin ? (
          <button
            onClick={() => onNavigate('admin')}
            className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors cursor-pointer ${
              currentView === 'admin' ? 'text-purple-600 font-bold' : 'text-purple-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>DPO Desk</span>
          </button>
        ) : (
          <button
            onClick={() => setDemoMenuOpen(true)}
            className="flex flex-col items-center gap-0.5 p-1 rounded-lg text-slate-500 transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Personas</span>
          </button>
        )}
      </nav>
    </>
  );
};
