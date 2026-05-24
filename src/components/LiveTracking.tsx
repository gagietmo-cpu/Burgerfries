import React, { useEffect, useState } from 'react';
import { Truck, CheckCircle, Smartphone, MapPin, Receipt, Flame, MessageSquare } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface LiveTrackingProps {
  order: Order | null;
  onClose: () => void;
}

export default function LiveTracking({ order, onClose }: LiveTrackingProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('pending');
  const [progressPercent, setProgressPercent] = useState(10);
  const [driverMessage, setDriverMessage] = useState<string>("Chef is reading your gourmet order ticket...");

  useEffect(() => {
    if (!order) return;

    setCurrentStatus('pending');
    setProgressPercent(10);

    // Speed up simulation to let user fully experience the conversion flow!
    const timeline = [
      { status: 'preparing' as OrderStatus, percent: 35, delay: 4000, msg: "🍳 Patty Rollers: Hand-shaping grass-fed beef spheres..." },
      { status: 'cooking' as OrderStatus, percent: 60, delay: 9000, msg: "🔥 Flat-Top Master: Smashed live at 450°F! White Cheddar is bubble-melting..." },
      { status: 'delivering' as OrderStatus, percent: 85, delay: 14000, msg: "🛵 Courier Sizzler: Slipped inside aluminum-insulated thermal bag. Left downtown kitchen!" },
      { status: 'arrived' as OrderStatus, percent: 100, delay: 19000, msg: "🔔 Ring Bell! Steaming hot burgers arrived on your porch. Bon Appétit!" }
    ];

    const timers = timeline.map((stage) => {
      return setTimeout(() => {
        setCurrentStatus(stage.status);
        setProgressPercent(stage.percent);
        setDriverMessage(stage.msg);
      }, stage.delay);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [order]);

  if (!order) {
    return (
      <div className="py-20 text-center bg-[#121212] min-h-[50vh] flex flex-col justify-center border-t border-b border-[#FFF4E8]/10">
        <span className="text-4xl animate-bounce">👀🍔</span>
        <h3 className="font-display font-black text-xl text-white mt-4 uppercase italic">NO ACTIVE ORDERS FOUND</h3>
        <p className="text-[#FFF4E8]/50 text-sm max-w-sm mx-auto mt-2 font-light">Add delicious items to your tray and complete checkout to begin tracking real-time grills.</p>
        <button onClick={onClose} className="mt-6 mx-auto bg-[#c62828] text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider btn-shadow cursor-pointer transition-all hover:scale-102">Close Panel</button>
      </div>
    );
  }

  const steps = [
    { id: 'pending', label: 'Ticket Approved', desc: 'Securely logged' },
    { id: 'preparing', label: 'Rolling Beef', desc: 'Fresh 100% Angus' },
    { id: 'cooking', label: 'Live Smashing', desc: '450°F Sear' },
    { id: 'delivering', label: 'Riding Hot', desc: 'Insulated bike' },
    { id: 'arrived', label: 'Arrived Steaming', desc: 'Doorbell trigger' }
  ];

  return (
    <section id="tracking-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#121212] min-h-screen text-white">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Sizzling header order tracker */}
        <div className="text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFF4E8] font-bold bg-[#c62828] py-1.5 px-4 rounded-full select-none btn-shadow inline-flex items-center gap-1.5">
            ● SIMULATED LIVE SIZZLE DELIVERY TRACER
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mt-6 leading-none uppercase italic">
            TRACK YOUR BURGER FEAST
          </h2>
          <p className="text-[#FFF4E8]/40 font-mono text-xs sm:text-sm mt-3">
            Order Reference ID: <span className="text-[#F4B400] font-bold select-all font-mono">#{order.id}</span> • Delivery Method: <span className="text-white font-semibold uppercase">{order.method}</span>
          </p>
        </div>

        {/* Dynamic Road Map Progress slider bar */}
        <div className="bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
          
          {/* Slider line bar */}
          <div className="relative pt-6">
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#121212] rounded-full"></div>
            <div 
              style={{ width: `${progressPercent}%` }}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#c62828] transition-all duration-1000 rounded-full"
            ></div>

            {/* Sizzling delivery courier animation block */}
            <div 
              style={{ left: `calc(${progressPercent}% - 22px)` }}
              className="absolute top-1/2 transform -translate-y-[22px] w-11 h-11 bg-white rounded-full shadow-lg border border-[#FFF4E8]/20 flex items-center justify-center text-xl transition-all duration-1000 select-none z-10 btn-shadow"
            >
              🛵
            </div>
          </div>

          {/* Steps tags */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4">
            {steps.map((step) => {
              // Decide styling
              const isPast = steps.findIndex(s => s.id === step.id) <= steps.findIndex(s => s.id === currentStatus);
              const isActive = step.id === currentStatus;

              return (
                <div key={step.id} className="text-center space-y-1">
                  <div className={`w-3 h-3 rounded-full mx-auto relative ${
                    isActive ? 'bg-[#F4B400]' : isPast ? 'bg-[#c62828]' : 'bg-[#FFF4E8]/10'
                  }`}>
                    {isActive && (
                      <span className="absolute -top-1 -left-1 flex h-5 w-5 rounded-full border border-[#F4B400] animate-ping"></span>
                    )}
                  </div>
                  <span className={`block text-xs font-semibold ${
                    isActive ? 'text-[#F4B400] font-black uppercase italic' : isPast ? 'text-white' : 'text-neutral-500 font-normal'
                  }`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] text-[#FFF4E8]/40 font-mono block leading-none">{step.desc}</span>
                </div>
              );
            })}
          </div>

          {/* Sizzling driver chat simulator block */}
          <div className="p-4 bg-[#121212] border border-[#FFF4E8]/10 rounded-xl flex items-center gap-4">
            <div className="w-11 h-11 bg-[#c62828]/15 rounded-xl border border-[#c62828]/35 flex items-center justify-center text-[#c62828] shrink-0 shadow-md">
              <MessageSquare className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-mono tracking-wider font-bold text-[#FFF4E8]/40">Active status log:</span>
              <p className="font-display font-bold text-sm sm:text-base text-neutral-200">{driverMessage}</p>
            </div>
          </div>

        </div>

        {/* Live receipt audit breakdown */}
        <div className="bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h3 className="font-display font-black text-lg text-white mb-6 uppercase flex items-center gap-2.5 italic">
            <Receipt className="text-[#c62828] w-5 h-5" /> VOUCHER RECEIPT BREAKDOWN
          </h3>

          <div className="space-y-4">
            {order.items.map((cartItem) => (
              <div key={cartItem.id} className="flex justify-between items-start py-3 border-b border-[#FFF4E8]/10 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#F4B400] font-mono font-black">{cartItem.quantity}x</span>
                    <span className="font-display font-bold text-sm text-[#FFF4E8]/90">{cartItem.item.name}</span>
                    <span className="text-[9px] font-mono bg-[#121212] border border-[#FFF4E8]/10 text-[#FFF4E8]/50 py-0.5 px-2 rounded uppercase">{cartItem.size}</span>
                  </div>
                  
                  {/* custom toppings display */}
                  {Object.keys(cartItem.customSelections).length > 0 && (
                    <div className="text-[10px] font-mono text-[#FFF4E8]/40 flex flex-wrap gap-1.5 pl-7">
                      {Object.entries(cartItem.customSelections).map(([key, value]) => {
                        if (value === true) return <span key={key} className="bg-black/20 px-1.5 py-0.5 rounded text-[#FFF4E8]/50 border border-[#FFF4E8]/5">+{key.replace('extra', '').replace('add', '')}</span>;
                        if (typeof value === 'string') return <span key={key} className="bg-black/20 px-1.5 py-0.5 rounded text-[#FFF4E8]/50 border border-[#FFF4E8]/5">{value}</span>;
                        return null;
                      })}
                    </div>
                  )}
                </div>
                <span className="font-mono text-sm font-semibold text-[#FFF4E8]">${(cartItem.customPrice * cartItem.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 mt-6 space-y-2 border-t border-[#FFF4E8]/10 max-w-md ml-auto">
            <div className="flex justify-between text-xs text-[#FFF4E8]/50 font-mono">
              <span>Checkout Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-xs text-green-400 font-mono">
                <span>Promotional Discount:</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-[#FFF4E8]/50 font-mono">
              <span>Delivery Logistics Fee:</span>
              <span>${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#FFF4E8]/50 font-mono">
              <span>Local Sales Tax (8.25%):</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-[#FFF4E8]/10">
              <span className="font-display font-black text-white text-base">TOTAL PAID:</span>
              <span className="font-display font-black text-2xl text-[#F4B400] font-mono">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Courier Coordinates Info footer */}
          <div className="mt-8 pt-6 border-t border-[#FFF4E8]/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-neutral-500">
            <div>
              <span className="block uppercase font-bold text-neutral-400">DELIVERY TO DETAILED ADDRESS</span>
              <span className="block text-neutral-300 mt-1">{order.address || "Contactless pickup at downtown kitchen bay #4"}</span>
            </div>
            <div>
              <span className="block uppercase font-bold text-neutral-400">CUSTOMER RECEIVER</span>
              <span className="block text-neutral-300 mt-1">{order.customerName} ({order.phone})</span>
            </div>
          </div>

        </div>

        {/* Return Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={onClose}
            className="bg-transparent hover:bg-[#FFF4E8]/5 text-[#FFF4E8]/60 hover:text-white border border-[#FFF4E8]/10 px-8 py-3.5 rounded-full uppercase font-bold text-xs tracking-wider transition-colors cursor-pointer"
          >
            ← CONTINUE BROWSING APP MENU
          </button>
        </div>

      </div>
    </section>
  );
}
