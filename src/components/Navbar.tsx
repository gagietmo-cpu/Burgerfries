import React from 'react';
import { ShoppingBag, Flame, Award, MapPin, Truck, HelpCircle } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cart: CartItem[];
  cartTotal: number;
  onOpenCart: () => void;
  onNavigate: (section: string) => void;
  activeOrderId: string | null;
  onTrackOrder: () => void;
  loyaltyPoints: number | null;
  loyaltyEmail: string | null;
}

export default function Navbar({
  cart,
  cartTotal,
  onOpenCart,
  onNavigate,
  activeOrderId,
  onTrackOrder,
  loyaltyPoints,
  loyaltyEmail
}: NavbarProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav id="app-navbar" className="sticky top-0 z-40 bg-[#121212]/95 border-b border-[#FFF4E8]/10 backdrop-blur-md">
      {/* Promo ribbon */}
      <div id="promo-ribbon" className="bg-[#c62828] text-[#FFF4E8] text-xs py-1.5 px-4 font-semibold text-center flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap">
        <Flame className="w-3.5 h-3.5 text-[#F4B400] animate-pulse" />
        <span className="tracking-wide uppercase font-mono text-[10px] sm:text-xs">🔥 LATE NIGHT CHEF SPECIAL: GET FREE TRUFFLE FRIES ON ORDERS OVER $35! USE CODE: <span className="underline decoration-[#F4B400] decoration-2 font-mono text-white">GOLDENFRIES</span></span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo and brand */}
          <div 
            id="brand-logo" 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => onNavigate('hero')}
          >
            <div className="w-10 h-10 bg-[#c62828] rounded-lg flex items-center justify-center font-bold text-2xl btn-shadow group-hover:scale-105 transition-all text-white border border-[#FFF4E8]/10">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-tighter text-[#FFF4E8] select-none uppercase italic">
                SMASH<span className="text-[#c62828]">CRAVE</span>
              </span>
              <span className="text-[8px] uppercase tracking-widest font-mono text-[#F4B400] font-black select-none leading-none">
                BUILT DIFFERENT
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <div id="desktop-links" className="hidden md:flex items-center gap-8 font-bold uppercase text-xs tracking-widest">
            <button 
              onClick={() => onNavigate('menu')}
              className="text-[#FFF4E8]/70 hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-[#c62828]"
            >
              Menu
            </button>
            <button 
              onClick={() => onNavigate('cravings')}
              className="relative text-[#FFF4E8]/70 hover:text-[#F4B400] transition-colors py-2 border-b-2 border-transparent hover:border-[#F4B400]/50 flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-[#F4B400]" />
              AI Helper
              <span className="absolute -top-1 -right-4 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f4b400] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#f4b400]"></span>
              </span>
            </button>
            <button 
              onClick={() => onNavigate('why-choose')}
              className="text-[#FFF4E8]/70 hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-[#c62828]"
            >
              Why Choose Us
            </button>
            <button 
              onClick={() => onNavigate('rewards')}
              className="text-[#FFF4E8]/70 hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-[#c62828] flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5" />
              Club Perks
            </button>
            <button 
              onClick={() => onNavigate('reviews')}
              className="text-[#FFF4E8]/70 hover:text-white transition-colors py-2 border-b-2 border-transparent hover:border-[#c62828]"
            >
              Reviews
            </button>
          </div>

          {/* Action widgets */}
          <div id="nav-actions" className="flex items-center gap-4">
            {/* Loyalty points mini tracking */}
            {loyaltyPoints !== null && loyaltyPoints > 0 && (
              <div id="loyalty-indicator" className="hidden sm:flex items-center gap-1 bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 rounded-lg px-2.5 py-1 text-xs font-semibold text-[#F4B400]">
                <Award className="w-3.5 h-3.5" />
                <span>{loyaltyPoints} PTS</span>
              </div>
            )}

            {/* Active tracking button if there is a pending simulated order */}
            {activeOrderId && (
              <button
                id="active-tracker-btn"
                onClick={onTrackOrder}
                className="bg-[#c62828]/15 border border-[#c62828]/30 hover:bg-[#c62828]/25 text-white font-semibold text-xs px-3.5 py-1.8 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer animate-pulse"
              >
                <Truck className="w-4 h-4 text-[#c62828]" />
                <span>📍 TRACK ORDER</span>
              </button>
            )}

            {/* Cart Trigger Button */}
            <button
              id="navbar-cart-btn"
              onClick={onOpenCart}
              className="relative bg-[#F4B400] text-black font-black px-5 py-2.5 rounded-full uppercase text-xs btn-shadow flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              <span className="hidden sm:inline">Order Now</span>
              {totalItems > 0 ? (
                <div className="flex items-center gap-1 bg-black/10 rounded-full px-2 py-0.5 text-[10px] select-none font-bold">
                  <span>{totalItems}</span>
                  <span className="opacity-25">|</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              ) : (
                <span className="bg-black/10 rounded-full px-2 py-0.5 text-[10px] select-none font-bold">0</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
