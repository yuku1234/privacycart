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
  UserCheck
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Academic Project Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('store')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Privacy<span className="text-indigo-600">Cart</span>
                </span>
                <span className="hidden sm:block text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  DPDP Act 2023 • SPPU Prototype
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
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

          {/* Right Action Icons & Persona Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Quick Demo Persona Switcher (Crucial for SPPU Project Viva & Demo) */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
                title="Switch test personas for viva demonstration"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Persona: {user?.fullName?.split(' ')[0] || 'Guest'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn text-xs"
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
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="View shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {user.fullName}
                  </span>
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
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Privacy Dashboard</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => onNavigate('admin')}
                        className="w-full text-left px-4 py-2 text-purple-700 hover:bg-purple-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <ShieldAlert className="w-4 h-4 text-purple-600" />
                        <span>Admin & DPO Desk</span>
                      </button>
                    )}

                    <button
                      onClick={onOpenNoticeModal}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>Statutory Notice</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
