import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Plus, Minus, Trash2, Tag, Gift, Percent } from 'lucide-react';
import { CartItem, MenuItem, Order, OrderStatus } from '../types';
import { MENU_ITEMS } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onUpdateSize: (id: string, size: 'Regular' | 'Large') => void;
  onRemoveItem: (id: string) => void;
  onAddCartItem: (cartItem: CartItem) => void;
  onPlaceOrder: (order: Order) => void;
  appliedPromo: string;
  appliedPromoValue: number; // e.g. 15 for 15%
  onApplyPromoCode: (code: string, pct: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  cartTotal,
  onUpdateQuantity,
  onUpdateSize,
  onRemoveItem,
  onAddCartItem,
  onPlaceOrder,
  appliedPromo,
  appliedPromoValue,
  onApplyPromoCode
}: CartDrawerProps) {
  // Checkout pipeline stage: 'cart' | 'info' | 'payment'
  const [stage, setStage] = useState<'cart' | 'info' | 'payment'>('cart');

  // Info details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  // Payment option
  const [paymentOption, setPaymentOption] = useState<'applepay' | 'googlepay' | 'cod'>('googlepay');
  const [isProcessing, setIsProcessing] = useState(false);

  // Promo code entry
  const [promoCodeInput, setPromoCodeInput] = useState(appliedPromo || '');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Sizzling Delivery Fees
  const FREE_SHIPPING_LIMIT = 35.00;
  const isFreeDelivery = cartTotal >= FREE_SHIPPING_LIMIT;
  const deliveryFee = deliveryMethod === 'delivery' ? (isFreeDelivery ? 0.00 : 3.99) : 0.00;
  
  // Upsell calculation logic
  const discountDecimal = appliedPromoValue / 100;
  const discountAmount = cartTotal * discountDecimal;
  const salesTax = (cartTotal - discountAmount) * 0.0825;
  const grandTotal = cartTotal - discountAmount + deliveryFee + salesTax;

  // Check if specific popular upsell items are already in cart
  const hasLoadedFries = cart.some(item => item.item.id === 'loaded-cheese-fries');
  const hasLemonade = cart.some(item => item.item.id === 'craft-house-lemonade');

  const handleApplyPromo = () => {
    setPromoError(null);
    setPromoSuccess(null);
    const code = promoCodeInput.trim().toUpperCase();

    // Map common available codes
    if (code === 'GOLDENFRIES') {
      onApplyPromoCode(code, 20);
      setPromoSuccess('Promo GOLDENFRIES (20% OFF) successfully applied!');
    } else if (code === 'FREEFRIES-CRSPY') {
      onApplyPromoCode(code, 15);
      setPromoSuccess('Coupon FREEFRIES-CRSPY (15% OFF) applied! Fries voucher registered.');
    } else if (code.endsWith('15') || code.includes('SIM')) {
      onApplyPromoCode(code, 15);
      setPromoSuccess(`Special Campaign Coupon ${code} (15% OFF) applied!`);
    } else if (code.endsWith('10') || code.includes('-10')) {
      onApplyPromoCode(code, 10);
      setPromoSuccess(`Sizzler Reward Coupon ${code} (10% OFF) applied!`);
    } else if (code.endsWith('25') || code.includes('-25')) {
      onApplyPromoCode(code, 25);
      setPromoSuccess(`Ultimate VIP Coupon ${code} (25% OFF) applied! Awesome!`);
    } else {
      setPromoError('That voucher code has expired or is invalid. Spin the Magic Wheel to win active codes!');
    }
  };

  const handleAddUpsellFries = () => {
    const loadedFriesItem = MENU_ITEMS.find(item => item.id === 'loaded-cheese-fries');
    if (!loadedFriesItem) return;

    onAddCartItem({
      id: `upsell-fries-${Date.now()}`,
      item: loadedFriesItem,
      quantity: 1,
      customSelections: {},
      size: 'Regular',
      customPrice: loadedFriesItem.price
    });
  };

  const handleAddUpsellLemonade = () => {
    const lemonadeItem = MENU_ITEMS.find(item => item.id === 'craft-house-lemonade');
    if (!lemonadeItem) return;

    onAddCartItem({
      id: `upsell-lemonade-${Date.now()}`,
      item: lemonadeItem,
      quantity: 1,
      customSelections: {},
      size: 'Regular',
      customPrice: lemonadeItem.price
    });
  };

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) return;
    if (deliveryMethod === 'delivery' && !deliveryAddress) return;
    setStage('payment');
  };

  const handleProcessingPayment = () => {
    setIsProcessing(true);

    // Simulated quick high conversions processing time
    setTimeout(() => {
      setIsProcessing(false);
      
      const newOrder: Order = {
        id: `CRAVE-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        email: customerEmail,
        phone: customerPhone,
        method: deliveryMethod,
        address: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
        paymentMethod: paymentOption,
        status: 'pending',
        items: cart,
        subtotal: cartTotal,
        tax: salesTax,
        deliveryFee,
        discount: discountAmount,
        total: grandTotal,
        createdAt: new Date().toISOString()
      };

      onPlaceOrder(newOrder);
      setStage('cart'); // reset back
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#121212] border-l border-[#FFF4E8]/10 shadow-2xl flex flex-col justify-between">
      
      {/* Header Pipeline state Bar */}
      <div className="p-6 border-b border-[#FFF4E8]/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#c62828]" />
          <h3 className="font-display font-black text-xl text-white uppercase tracking-tight italic">MY COMBO TRAYS</h3>
        </div>
        
        {/* Stages progress points indicator */}
        <div className="flex gap-2 text-[10px] uppercase font-mono tracking-widest text-[#FFF4E8]/40 select-none font-bold">
          <span className={stage === 'cart' ? 'text-[#F4B400] font-black' : ''}>Cart</span>
          <span>•</span>
          <span className={stage === 'info' ? 'text-[#F4B400] font-black' : ''}>Info</span>
          <span>•</span>
          <span className={stage === 'payment' ? 'text-[#F4B400] font-black' : ''}>Payment</span>
        </div>

        <button 
          onClick={onClose}
          className="bg-transparent hover:bg-[#c62828] text-white p-2 rounded-full text-xs font-semibold cursor-pointer shrink-0 transition-all border border-[#FFF4E8]/10 leading-none"
        >
          ✕
        </button>
      </div>

      {cart.length === 0 ? (
        /* Empty Plate Display */
        <div className="flex-1 p-8 text-center flex flex-col items-center justify-center space-y-4">
          <span className="text-5xl block animate-pulse">🍱🍔👀</span>
          <h4 className="font-display font-black text-lg text-white uppercase italic">Your combo tray is currently empty!</h4>
          <p className="text-[#FFF4E8]/40 text-sm max-w-xs leading-relaxed font-light">
            Fill up your stomach today. Click surrounding "Order Now" to navigate our crispy bacon burgers and garlic truffles fries catalog.
          </p>
          <button
            onClick={onClose}
            className="bg-[#c62828] hover:bg-white hover:text-black font-display font-black text-xs py-3.5 px-6 rounded-full uppercase tracking-wider transition-all cursor-pointer btn-shadow"
          >
            Start Ordering
          </button>
        </div>
      ) : (
        /* Cart Contents active details */
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Stage 1: Standard Cart Inventory selection */}
          {stage === 'cart' && (
            <>
              {/* Delivery Limit Free Delivery warning */}
              {!isFreeDelivery && deliveryMethod === 'delivery' ? (
                <div className="p-4 bg-[#F4B400]/10 border border-[#F4B400]/30 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[#F4B400] font-black uppercase tracking-wider">
                      🎁 ONLY ${(FREE_SHIPPING_LIMIT - cartTotal).toFixed(2)} AWAY FROM FREE SHIPPING!
                    </span>
                  </div>
                  <div className="relative h-1.5 bg-[#121212] rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${(cartTotal / FREE_SHIPPING_LIMIT) * 100}%` }}
                      className="absolute left-0 top-0 h-full bg-[#F4B400] rounded-full"
                    ></div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-[10px] text-[#FFF4E8]/60 leading-tight">Add an organic sweet Strawberry Lemonade to secure free logistics shipping!</p>
                    <button
                      onClick={handleAddUpsellLemonade}
                      className="bg-[#F4B400] text-black hover:bg-white px-3 py-1 text-[9px] font-black uppercase rounded-full shrink-0 transition-all btn-shadow cursor-pointer"
                    >
                      + Add $3.99
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-950/25 border border-emerald-900/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-400 font-mono font-black select-none animate-pulse">
                  <span>🚀 EXCELLENT CHOICE: You unlocked FREE local griddle logistics shipping!</span>
                </div>
              )}

              {/* Items Inventory Lists */}
              <div className="space-y-4">
                {cart.map((cartItem) => (
                  <div key={cartItem.id} className="bg-[#FFF4E8]/5 p-4 border border-[#FFF4E8]/10 rounded-xl flex gap-3.5 relative overflow-hidden transition-all hover:bg-[#FFF4E8]/3 hover:border-[#c62828]/45 justify-between items-center">
                    
                    <div className="flex gap-3">
                      {/* Img */}
                      <img 
                        src={cartItem.item.image} 
                        alt={cartItem.item.name} 
                        className="w-16 h-16 object-cover rounded-xl border border-[#FFF4E8]/10 mt-1"
                        referrerPolicy="no-referrer"
                      />

                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-[#FFF4E8]/40 tracking-wider uppercase font-bold">Gourmet Choice</span>
                        <h4 className="font-display font-black text-sm text-white leading-tight uppercase italic">{cartItem.item.name}</h4>
                        
                        {/* Size upgrades toggle indicator */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => onUpdateSize(cartItem.id, 'Regular')}
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border cursor-pointer transition-all ${
                              cartItem.size === 'Regular' ? 'bg-[#c62828]/10 border-[#c62828]/45 text-[#c62828] font-bold' : 'bg-[#121212] border-[#FFF4E8]/10 text-[#FFF4E8]/40 hover:text-white'
                            }`}
                          >
                            REG
                          </button>
                          <button
                            onClick={() => onUpdateSize(cartItem.id, 'Large')}
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md border cursor-pointer transition-all ${
                              cartItem.size === 'Large' ? 'bg-[#F4B400]/15 border-[#F4B400]/45 text-[#F4B400] font-bold' : 'bg-[#121212] border-[#FFF4E8]/10 text-[#FFF4E8]/40 hover:text-white'
                            }`}
                          >
                            LGE (+ $1.50)
                          </button>
                        </div>

                        {/* custom selections description tags */}
                        {Object.keys(cartItem.customSelections).length > 0 && (
                          <div className="text-[9px] font-mono text-[#FFF4E8]/40 flex flex-wrap gap-1 leading-none mt-2">
                            {Object.entries(cartItem.customSelections).map(([key, val]) => {
                              if (val === true) return <span key={key} className="bg-black/35 py-0.5 px-1.5 rounded border border-[#FFF4E8]/5">+{key.replace('extra', '').replace('add', '')}</span>;
                              if (typeof val === 'string') return <span key={key} className="bg-black/35 py-0.5 px-1.5 rounded border border-[#FFF4E8]/5">{val}</span>;
                              return null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sizzling quantities counter & removal trash */}
                    <div className="flex flex-col items-end justify-between h-full gap-2.5 shrink-0">
                      <button
                        onClick={() => onRemoveItem(cartItem.id)}
                        className="text-neutral-500 hover:text-red-500 transition-colors cursor-pointer text-xs p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2 bg-[#121212] border border-[#FFF4E8]/10 rounded-lg p-1 scale-95">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.id, Math.max(1, cartItem.quantity - 1))}
                          className="p-1 hover:bg-[#FFF4E8]/5 hover:text-white rounded transition-colors"
                        >
                          <Minus className="w-3 h-3 text-neutral-400" />
                        </button>
                        <span className="font-mono text-xs font-bold text-white px-1 mt-0.5">{cartItem.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                          className="p-1 hover:bg-[#FFF4E8]/5 hover:text-white rounded transition-colors"
                        >
                          <Plus className="w-3 h-3 text-neutral-400" />
                        </button>
                      </div>

                      <span className="font-mono text-sm font-semibold text-[#F4B400]">${(cartItem.customPrice * cartItem.quantity).toFixed(2)}</span>
                    </div>

                  </div>
                ))}
              </div>

              {/* Upsells recommendation Block */}
              {!hasLoadedFries && (
                <div className="p-4 bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#FFF4E8]/10 border border-[#FFF4E8]/20 rounded-xl flex items-center justify-center text-[#F4B400] text-xl btn-shadow">
                      🍟
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-mono tracking-widest text-[#FFF4E8]/40 font-black">UPSELL DEAL</span>
                      <h5 className="font-display font-bold text-xs text-white uppercase italic">Add Loaded Bacon Fries?</h5>
                      <span className="font-mono text-[11px] text-[#F4B400] font-semibold">$7.99 — Cheddar Cheese</span>
                    </div>
                  </div>
                  <button
                    onClick={handleAddUpsellFries}
                    className="bg-[#c62828] hover:bg-[#b02222] text-white font-mono font-black text-xs py-2 px-3.5 rounded-lg shrink-0 transition-colors uppercase cursor-pointer btn-shadow"
                  >
                    + ADD DEAL
                  </button>
                </div>
              )}

              {/* Redeem Promo Code Input box Container */}
              <div className="p-4 bg-[#FFF4E8]/3 border border-[#FFF4E8]/10 rounded-xl space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFF4E8]/40 font-black flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#c62828]" /> Promo Voucher Code:
                </span>
                <div className="flex gap-2.5">
                  <input
                    type="text"
                    placeholder="e.g. GOLDENFRIES or SPIN WHEEL CODES"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-2 px-3 text-xs text-white placeholder-[#FFF4E8]/20 focus:outline-none focus:border-[#c62828]"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-[#121212] hover:bg-[#FFF4E8]/5 text-[#FFF4E8]/60 hover:text-white border border-[#FFF4E8]/10 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-all"
                  >
                    Apply
                  </button>
                </div>

                {promoError && <p className="text-[10px] font-mono text-red-500">{promoError}</p>}
                {promoSuccess && <p className="text-[10px] font-mono text-green-400">{promoSuccess}</p>}
                {appliedPromo && <p className="text-[10px] font-mono text-emerald-400 font-black tracking-wide select-none flex items-center gap-1">✓ Active Reward deduction: {appliedPromo} (-{appliedPromoValue}%)</p>}
              </div>
            </>
          )}

          {/* Stage 2: Guest Coordinates Detail Entry */}
          {stage === 'info' && (
            <form onSubmit={handleConfirmCheckout} className="space-y-6">
              <span className="block text-xs font-mono font-bold text-[#FFF4E8]/40 uppercase tracking-widest">2. Checkout Contact details</span>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-1.5">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#c62828] font-sans placeholder-[#FFF4E8]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-1.5">Secure Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@doe.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3 px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c62828] font-sans placeholder-[#FFF4E8]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-1.5">Cell Phone Tracker</label>
                    <input
                      type="tel"
                      required
                      placeholder="(555) 890-SMASH"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3 px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c62828] font-sans placeholder-[#FFF4E8]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-1.5">Fulfillment Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`p-3 rounded-lg border text-xs font-black uppercase font-display tracking-widest text-center cursor-pointer transition-colors ${
                        deliveryMethod === 'delivery'
                          ? 'bg-[#c62828] border-transparent text-white btn-shadow'
                          : 'bg-[#121212] border-[#FFF4E8]/10 text-[#FFF4E8]/40 hover:text-white'
                      }`}
                    >
                      🛵 Delivery (Under 25 mins)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`p-3 rounded-lg border text-xs font-black uppercase font-display tracking-widest text-center cursor-pointer transition-colors ${
                        deliveryMethod === 'pickup'
                          ? 'bg-[#F4B400] border-transparent text-black btn-shadow'
                          : 'bg-[#121212] border-[#FFF4E8]/10 text-[#FFF4E8]/40 hover:text-white'
                      }`}
                    >
                      🏪 Contactless Pickup
                    </button>
                  </div>
                </div>

                {deliveryMethod === 'delivery' && (
                  <div>
                    <label className="block text-[10px] font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-1.5">Courier Delivery Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Street number, Apartment suite, ZIP code..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3.5 px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c62828] placeholder-[#FFF4E8]/20"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStage('cart')}
                  className="px-4 py-3 bg-[#121212] border border-[#FFF4E8]/10 text-[#FFF4E8]/60 text-xs rounded-lg font-bold uppercase transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-full bg-[#c62828] hover:bg-[#b02222] py-3.5 rounded-xl font-display font-black text-xs uppercase tracking-wider text-white shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 btn-shadow"
                >
                  <span>PROCEED TO PAYMENT CHOICE</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </form>
          )}

          {/* Stage 3: Payment Selection */}
          {stage === 'payment' && (
            <div className="space-y-6">
              <span className="block text-xs font-mono font-bold text-[#FFF4E8]/40 uppercase tracking-widest">3. Pick Secure Payment Option</span>
              
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentOption('googlepay')}
                  className={`p-4 w-full rounded-2xl border text-left font-display font-black flex items-center justify-between transition-colors cursor-pointer ${
                    paymentOption === 'googlepay' ? 'bg-[#F4B400]/15 border-[#F4B400] text-[#F4B400]' : 'bg-[#121212] border-[#FFF4E8]/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">🤖 Pay with Google Pay</span>
                  <span className="text-[10px] font-mono bg-black px-2 py-0.5 rounded text-white font-normal uppercase">One-Tap Approved</span>
                </button>

                <button
                  onClick={() => setPaymentOption('applepay')}
                  className={`p-4 w-full rounded-2xl border text-left font-display font-black flex items-center justify-between transition-colors cursor-pointer ${
                    paymentOption === 'applepay' ? 'bg-[#c62828]/10 border-[#c62828] text-[#c62828]' : 'bg-[#121212] border-[#FFF4E8]/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">🍎 Pay with Apple Pay</span>
                  <span className="text-[10px] font-mono bg-black px-2 py-0.5 rounded text-white font-normal uppercase">Instant dispatch</span>
                </button>

                <button
                  onClick={() => setPaymentOption('cod')}
                  className={`p-4 w-full rounded-2xl border text-left font-display font-black flex items-center justify-between transition-colors cursor-pointer ${
                    paymentOption === 'cod' ? 'bg-[#F4B400]/15 border-[#F4B400] text-[#F4B400]' : 'bg-[#121212] border-[#FFF4E8]/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm">💵 Cash on Delivery (COD)</span>
                  <span className="text-[10px] font-mono bg-black px-2 py-0.5 rounded text-white font-normal uppercase">Pay Cash or Card</span>
                </button>
              </div>

              {isProcessing ? (
                <div className="text-center py-6 space-y-3 bg-[#121212] border border-[#FFF4E8]/10 rounded-2xl">
                  <span className="w-7 h-7 border-2 border-[#F4B400] border-t-transparent rounded-full animate-spin inline-block"></span>
                  <p className="font-mono text-xs text-[#FFF4E8]/40 animate-pulse">Contacting griddle nodes & locking courier assignment...</p>
                </div>
              ) : (
                <div className="p-4 bg-[#121212] border border-[#FFF4E8]/10 rounded-xl text-xs text-neutral-400 font-light flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p>Secure checkout guaranteed! We utilize sandbox token protection. No real banking operations or credentials are recorded.</p>
                </div>
              )}

              <div className="pt-4 flex gap-2.5">
                <button
                  onClick={() => setStage('info')}
                  disabled={isProcessing}
                  className="px-4 py-3 bg-[#121212] border border-[#FFF4E8]/10 text-[#FFF4E8]/60 text-xs rounded-xl font-bold uppercase cursor-pointer"
                >
                  Back to info
                </button>
                <button
                  onClick={handleProcessingPayment}
                  disabled={isProcessing}
                  className="w-full bg-[#F4B400] hover:bg-white text-black py-3.5 rounded-lg font-display font-black text-xs uppercase transition-all cursor-pointer btn-shadow hover:scale-[1.01]"
                >
                  🔒 CONFIRM PAYMENT (${grandTotal.toFixed(2)})
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Persistent Price Summary footer block */}
      {cart.length > 0 && (
        <div className="p-6 border-t border-[#FFF4E8]/10 bg-black/40 space-y-4">
          
          <div className="space-y-1.5 text-xs font-mono text-neutral-500">
            <div className="flex justify-between">
              <span>Tray Subtotal:</span>
              <span className="text-[#FFF4E8]/70 font-bold">${cartTotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-400 font-semibold">
                <span>Loyalty Multi-Discount (-{appliedPromoValue}%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Thermal Delivery logics:</span>
              <span className="text-[#FFF4E8]/70 font-mono">${deliveryFee === 0 ? 'FREE.00' : deliveryFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-end pt-3 border-t border-[#FFF4E8]/10">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#FFF4E8]/40 block uppercase leading-none mb-1">Total checkout</span>
              <span className="text-2xl font-display font-black text-[#F4B400] font-mono">${grandTotal.toFixed(2)}</span>
            </div>

            {stage === 'cart' && (
              <button
                onClick={() => setStage('info')}
                className="bg-[#c62828] hover:bg-[#b02222] text-white font-display font-black tracking-widest text-xs uppercase py-3.5 px-6 rounded-lg flex items-center gap-1 shadow-lg cursor-pointer border border-[#FFF4E8]/10 btn-shadow"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
