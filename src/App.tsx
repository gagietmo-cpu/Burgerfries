import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import WhyUs from './components/WhyUs';
import AICravingHelper from './components/AICravingHelper';
import Reviews from './components/Reviews';
import Rewards from './components/Rewards';
import ExitIntentPopup from './components/ExitIntentPopup';
import LiveTracking from './components/LiveTracking';
import CartDrawer from './components/CartDrawer';
import { CartItem, Order, UserLoyalty, FAQItem } from './types';
import { FAQS } from './data';
import { HelpCircle, ChevronRight, MessageSquareCode, Clock, MapPin, Phone, Instagram, Flame } from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [trackingMode, setTrackingMode] = useState(false);
  const [loyalty, setLoyalty] = useState<UserLoyalty | null>(null);

  // Dynamic search and tag category filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Promo code discounts
  const [appliedPromo, setAppliedPromo] = useState('');
  const [appliedPromoValue, setAppliedPromoValue] = useState(0);

  // Custom Alerts
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'warn' } | null>(null);

  // FAQ collapse/expand toggler
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Load state from localStorage on startup if any
  useEffect(() => {
    try {
      const storedLoyalty = localStorage.getItem('smash_loyalty');
      if (storedLoyalty) {
        setLoyalty(JSON.parse(storedLoyalty));
      }
      const storedActiveOrder = localStorage.getItem('smash_active_order');
      if (storedActiveOrder) {
        const parsed = JSON.parse(storedActiveOrder);
        setActiveOrder(parsed);
        setActiveOrderId(parsed.id);
      }
    } catch (e) {
      console.error('Error loading local state:', e);
    }
  }, []);

  // Alert dismisser
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const triggerAlert = (message: string, type: 'success' | 'warn' = 'success') => {
    setAlert({ message, type });
  };

  // Cart operations
  const handleAddCartItem = (newItem: CartItem) => {
    setCart((prevCart) => {
      // Find matching item by unique selections key
      const existingIdx = prevCart.findIndex((item) => item.id === newItem.id);
      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += newItem.quantity;
        triggerAlert(`Added another ${newItem.item.name} to tray!`);
        return updated;
      }
      triggerAlert(`Added ${newItem.item.name} to tray!`);
      return [...prevCart, newItem];
    });

    // Automatically slide cart drawer out to boost checkout conversions!
    setTimeout(() => {
      setIsCartOpen(true);
    }, 450);
  };

  // Add multiple items at once (useful for our AI Craving Helper Feast recommendation!)
  const handleAddMultiCartItems = (itemsList: CartItem[], preselectedPromoCode: string, promoValue: number) => {
    itemsList.forEach((cartItem) => {
      setCart((prevCart) => {
        const existingIdx = prevCart.findIndex((item) => item.id === cartItem.id);
        if (existingIdx > -1) {
          const updated = [...prevCart];
          updated[existingIdx].quantity += 1;
          return updated;
        }
        return [...prevCart, cartItem];
      });
    });

    if (preselectedPromoCode) {
      setAppliedPromo(preselectedPromoCode);
      setAppliedPromoValue(promoValue);
    }

    triggerAlert('🎉 SIZZLING: Your custom AI Feast bundle has been loaded onto your Tray!', 'success');
    
    setTimeout(() => {
      setIsCartOpen(true);
    }, 500);
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleUpdateSize = (id: string, size: 'Regular' | 'Large') => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Adjust single-item custom price based on size toggle
          const oldSize = item.size;
          if (oldSize === size) return item;
          
          let updatedPrice = item.customPrice;
          if (size === 'Large') {
            updatedPrice += 1.50;
          } else {
            updatedPrice -= 1.50;
          }

          return { ...item, size, customPrice: updatedPrice };
        }
        return item;
      })
    );
    triggerAlert('Tray sizing adjusted.');
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    triggerAlert('Item removed from tray.', 'warn');
  };

  const handleApplyPromoCode = (code: string, percent: number) => {
    setAppliedPromo(code);
    setAppliedPromoValue(percent);
    triggerAlert(`Promo code: ${code} applied! (-${percent}% discount)`);
  };

  // Apply a free fries offer code (from exit intent popup)
  const handleApplyFreeFries = (couponCode: string) => {
    setAppliedPromo(couponCode);
    setAppliedPromoValue(15);
    triggerAlert('🍟 Free Fries voucher applied to your ongoing cart check! (-15% overall)', 'success');
  };

  // Checkout placement
  const handlePlaceOrder = (newOrder: Order) => {
    setActiveOrder(newOrder);
    setActiveOrderId(newOrder.id);
    setCart([]); // reset tray
    setTrackingMode(true); // slide tracking coordinates screen

    localStorage.setItem('smash_active_order', JSON.stringify(newOrder));

    // Allocate loyalty points automatically for user if registered!
    if (loyalty) {
      const ptsEarned = Math.floor(newOrder.subtotal * 10);
      const updatedPts = loyalty.points + ptsEarned;
      let newTier: 'Bronze' | 'Silver' | 'Gold' | 'VIP' = 'Bronze';
      if (updatedPts >= 1500) newTier = 'VIP';
      else if (updatedPts >= 1000) newTier = 'Gold';
      else if (updatedPts >= 500) newTier = 'Silver';

      const updatedLoyalty: UserLoyalty = {
        ...loyalty,
        points: updatedPts,
        tier: newTier
      };

      setLoyalty(updatedLoyalty);
      localStorage.setItem('smash_loyalty', JSON.stringify(updatedLoyalty));
      triggerAlert(`🎉 Sweet! You earned +${ptsEarned} Smash Club loyalty points!`);
    }

    triggerAlert('🛒 Checkout Succeeded! Flat-top operators on task.', 'success');
  };

  // Loyalty actions
  const handleJoinLoyalty = (email: string, phone: string) => {
    const signupLoyalty: UserLoyalty = {
      email,
      phone,
      points: 150, // free starter points
      tier: 'Bronze',
      referrals: 0,
      referralCode: `CRAVE-MOB-${Math.floor(1000 + Math.random() * 9000)}`,
      claimedCodes: []
    };

    setLoyalty(signupLoyalty);
    localStorage.setItem('smash_loyalty', JSON.stringify(signupLoyalty));
    triggerAlert('🎁 Welcome to Smash Club! 150 starting points added!');
  };

  const handleClaimPromoFromLoyalty = (promoCode: string, pointsClaimed: number, logMsg: string) => {
    if (!loyalty) return;

    const remainingPoints = loyalty.points - pointsClaimed;
    const updatedLoyalty: UserLoyalty = {
      ...loyalty,
      points: remainingPoints,
      claimedCodes: [...loyalty.claimedCodes, promoCode]
    };

    setLoyalty(updatedLoyalty);
    localStorage.setItem('smash_loyalty', JSON.stringify(updatedLoyalty));

    // Auto load input
    setAppliedPromo(promoCode);
    setAppliedPromoValue(pointsClaimed === 500 ? 15 : pointsClaimed === 1000 ? 20 : 25);
    triggerAlert(logMsg, 'success');

    // open cart drawer automatically to see redeem code applied!
    setTimeout(() => {
      setIsCartOpen(true);
    }, 400);
  };

  const handleAddPoints = (amount: number) => {
    if (!loyalty) return;
    const pts = loyalty.points + amount;
    const updated: UserLoyalty = { ...loyalty, points: pts };
    setLoyalty(updated);
    localStorage.setItem('smash_loyalty', JSON.stringify(updated));
    triggerAlert(`⚡ GAMIFIED: Spin success! +${amount} points added!`);
  };

  // Navigation router
  const handleNavigate = (section: string) => {
    if (section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(`${section}-section`) || document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setTrackingMode(false); // return to normal browsing view
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.customPrice * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0b0b0b] font-sans antialiased text-[#FFF4E8] relative selection:bg-[#c62828] selection:text-white">
      
      {/* Alert Sliding Bar Component */}
      {alert && (
        <div 
          id="custom-slide-alert" 
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-pulse border bg-[#121212] ${
            alert.type === 'success' 
              ? 'border-emerald-500/40 text-emerald-400' 
              : 'border-[#c62828]/40 text-[#c62828]'
          }`}
        >
          <span>🔥</span>
          <span>{alert.message}</span>
        </div>
      )}

      {/* Embedded Exit Intent Trap */}
      <ExitIntentPopup onApplyFreeFries={handleApplyFreeFries} />

      {/* Main sticky navigation bar */}
      <Navbar 
        cart={cart}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        activeOrderId={activeOrderId}
        onTrackOrder={() => setTrackingMode(true)}
        loyaltyPoints={loyalty ? loyalty.points : null}
        loyaltyEmail={loyalty ? loyalty.email : null}
      />

      {trackingMode && activeOrder ? (
        /* Sizzling Simulated Map Tracking Route View */
        <LiveTracking 
          order={activeOrder}
          onClose={() => setTrackingMode(false)}
        />
      ) : (
        /* Regular Home-Menu Pipeline browsing View */
        <>
          <Hero 
            onOrderNow={() => handleNavigate('menu')}
            onOpenAICravings={() => handleNavigate('cravings')}
          />
          
          <Menu 
            onAddCartItem={handleAddCartItem}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          
          <AICravingHelper 
            onAddMultiCartItems={handleAddMultiCartItems}
          />

          <WhyUs />
          
          <Rewards 
            loyalty={loyalty}
            onJoinLoyalty={handleJoinLoyalty}
            onClaimPromoCode={handleClaimPromoFromLoyalty}
            onAddPoints={handleAddPoints}
          />

          <Reviews />

          {/* Sizzler FAQs Segment */}
          <section id="faq-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212] border-t border-[#FFF4E8]/10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-xs font-mono uppercase tracking-widest text-white font-black bg-[#c62828] py-1.5 px-3.5 rounded-full btn-shadow">
                  ❓ Ask the grill chef
                </span>
                <h2 className="font-display font-black text-3xl sm:text-5xl text-white mt-6 mb-3 tracking-tight uppercase italic">
                  FREQUENTLY ASKED CHESTNUTS
                </h2>
                <p className="text-[#FFF4E8]/60 max-w-sm mx-auto text-sm sm:text-base font-light">
                  Have questions regarding our double double meat patties, allergen alerts, or points? We’ve got answers.
                </p>
              </div>

              <div className="space-y-4">
                {FAQS.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;

                  return (
                    <div 
                      key={faq.id}
                      className="bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#F4B400]/40 shadow-md"
                    >
                      <button
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="w-full text-left p-6 flex justify-between items-center gap-4 cursor-pointer hover:bg-[#FFF4E8]/3"
                      >
                        <span className="font-display font-black text-sm sm:text-lg text-white uppercase italic">
                          {faq.question}
                        </span>
                        <ChevronRight className={`w-5 h-5 text-[#F4B400] shrink-0 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-6 pt-0 border-t border-[#FFF4E8]/10 text-xs sm:text-sm text-[#FFF4E8]/60 leading-relaxed font-light font-sans">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Global Slide-out Drawer Cart */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        cartTotal={cartTotal}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateSize={handleUpdateSize}
        onRemoveItem={handleRemoveItem}
        onAddCartItem={handleAddCartItem}
        onPlaceOrder={handlePlaceOrder}
        appliedPromo={appliedPromo}
        appliedPromoValue={appliedPromoValue}
        onApplyPromoCode={handleApplyPromoCode}
      />

      {/* Cinematic Diner Footer block */}
      <footer id="footer-section" className="bg-[#121212] border-t border-[#FFF4E8]/10 py-16 px-4 sm:px-6 lg:px-8 text-xs sm:text-sm text-[#FFF4E8]/60 font-light">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍔</span>
              <span className="font-display font-black text-xl text-white tracking-widest leading-none">
                SMASH<span className="text-[#c62828] font-black">CRAVE</span>
              </span>
            </div>
            <p className="text-[#FFF4E8]/40 text-xs leading-relaxed font-light">
              Premium 100% grass-fed custom mix burger joint. We smash balls daily on raging griddles for the ultimate lacy lacing crust borders. Zero regrets.
            </p>
            <div className="flex gap-4">
              <a href="#footer" className="text-neutral-500 hover:text-[#F4B400] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#footer" className="text-neutral-500 hover:text-[#F4B400] transition-colors font-mono flex items-center justify-center font-black select-none text-base h-5">
                🫵 🧑‍🍳
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-black text-sm text-white uppercase tracking-wider italic">OPENING SIZZLE HOURS</h4>
            <div className="space-y-2 font-mono text-xs text-[#FFF4E8]/40 leading-none">
              <div className="flex justify-between">
                <span>MON - THU:</span>
                <span className="text-neutral-300">11:00 AM - MIDNIGHT</span>
              </div>
              <div className="flex justify-between">
                <span>FRI - SAT:</span>
                <span className="text-[#c62828] font-black">11:00 AM - 3:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span>SUNDAY:</span>
                <span className="text-neutral-300">11:00 AM - MIDNIGHT</span>
              </div>
            </div>
            <div className="text-[10px] text-[#F4B400]/80 font-semibold">• Sizzlers stay active until late to satisfy your midnight munchies.</div>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-black text-sm text-white uppercase tracking-wider italic">SIZZLER SHIFT LOCATIONS</h4>
            <div className="space-y-3">
              <div className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-[#c62828] shrink-0 mt-0.5" />
                <span className="text-xs text-neutral-300 leading-tight block">
                  849 Griddle Boulevard, Suite #4B, Downtown Sizzle Kitchens
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <Phone className="w-4 h-4 text-[#F4B400] shrink-0 mt-0.5" />
                <span className="text-xs text-neutral-300 leading-none">
                  (555) 890-SMASH (7627)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-black text-sm text-white uppercase tracking-wider italic">CONVERSIONS ASSISTANCE</h4>
            <p className="text-xs text-[#FFF4E8]/40 leading-relaxed font-light">
              Are you a local restaurant manager or franchise applicant? Explore food safety logs, calorie charts, and license certifications below.
            </p>
            <div className="flex flex-col gap-2">
              <a href="#footer" className="text-xs text-[#F4B400] hover:text-white font-mono flex items-center gap-1">
                📔 Nutritional Allergen PDF Chart 
              </a>
              <a href="#footer" className="text-xs text-neutral-550 hover:text-white font-mono">
                💼 Joint Franchise Application
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[#FFF4E8]/10 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-[#FFF4E8]/20 text-xs font-mono">
          <span>© 2026 Smash Burger & Fries Corp. Built Premium for extreme digital conversions. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#footer" className="hover:text-white">Privacy Terms</a>
            <a href="#footer" className="hover:text-white">Allergen Safety</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
