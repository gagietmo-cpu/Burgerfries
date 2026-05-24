import React, { useEffect, useState } from 'react';
import { Flame, ArrowDown, Award, Sparkles, Clock } from 'lucide-react';

interface HeroProps {
  onOrderNow: () => void;
  onOpenAICravings: () => void;
}

export default function Hero({ onOrderNow, onOpenAICravings }: HeroProps) {
  const [minutesLeft, setMinutesLeft] = useState(48);
  const [secondsLeft, setSecondsLeft] = useState(12);

  // Simple urgencies countdown timer reset to trigger craving conversions
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 0) {
          setMinutesLeft((m) => (m === 0 ? 59 : m - 1));
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero-section" className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#121212] hero-gradient py-16 px-4 sm:px-6 lg:px-8 flex items-center border-b border-[#FFF4E8]/10">
      {/* Background glow effects */}
      <div id="bg-glow-red" className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#c62828]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left side: conversion copywriting */}
        <div id="hero-copywriting" className="lg:col-span-7 flex flex-col justify-center text-left">
          {/* Conversions booster badges */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            <div className="flex items-center gap-2 bg-[#FFF4E8]/5 px-3 py-1 rounded-full border border-[#FFF4E8]/10">
              <span className="text-[#F4B400] text-xs font-bold font-mono">★★★★★</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFF4E8]/90">4.9 Ratings from 3,000+ Foodies</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#c62828]/15 border border-[#c62828]/30 rounded-full py-1 px-3 text-[10px] font-bold tracking-widest uppercase text-[#c62828]">
              <Clock className="w-3.5 h-3.5" />
              <span>Delivered hot under 25 mins</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f4b400]/10 border border-[#f4b400]/20 rounded-full py-1 px-3 text-[10px] font-black tracking-widest uppercase text-[#F4B400]">
              <span>🍟 Free Fries Today</span>
            </div>
          </div>

          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tighter uppercase italic text-white mb-4">
            SMASH BURGERS <br />
            <span className="text-[#c62828]">WORTH CRAVING.</span>
          </h1>

          <p className="text-lg text-[#FFF4E8]/60 leading-relaxed max-w-md mb-8">
            Freshly ground grass-fed beef, lacy thin caramelized edges, bubbling cheddar, and seasoned loaded fries delivered sizzling to your doorstep. Satisfy your craving instantly.
          </p>

          {/* Sizzling CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
            <button
              onClick={onOrderNow}
              className="bg-[#c62828] text-white hover:bg-[#b02222] font-display font-black tracking-wider text-base uppercase py-4 px-8 rounded-lg flex items-center justify-center gap-2 btn-shadow scale-100 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              🍔 ORDER NOW & SAVE
            </button>
            <button
              onClick={onOpenAICravings}
              className="border-2 border-[#FFF4E8]/20 hover:border-[#FFF4E8]/40 text-white font-display font-black px-8 py-4 rounded-lg uppercase tracking-wider text-base hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-[#F4B400] animate-pulse" />
              <span>NOT SURE? LET CHEF AI CHOOSE</span>
            </button>
          </div>

          {/* Social Proof + FOMO countdown */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-[#FFF4E8]/10 max-w-xl">
            <div>
              <span className="block text-3xl font-black font-display text-white uppercase italic">100%</span>
              <span className="text-[10px] text-[#FFF4E8]/50 font-mono tracking-wider uppercase font-bold">Fresh Grass-Fed Beef</span>
            </div>
            <div>
              <span className="block text-3xl font-black font-display text-[#F4B400] uppercase italic">18 Min</span>
              <span className="text-[10px] text-[#FFF4E8]/50 font-mono tracking-wider uppercase font-bold">Average Sizzle Delivery</span>
            </div>
            <div className="col-span-2 md:col-span-1 border-t md:border-t-0 pt-4 md:pt-0 border-[#FFF4E8]/10">
              <span className="block text-2xl font-black font-display text-[#c62828] animate-pulse font-mono uppercase italic">
                {minutesLeft}:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
              </span>
              <span className="text-[10px] text-[#FFF4E8]/50 font-mono tracking-wider uppercase font-bold">Flash Offer Ends</span>
            </div>
          </div>
        </div>

        {/* Right side: appetite-triggering food photography */}
        <div id="hero-media" className="lg:col-span-5 relative flex justify-center items-center py-6 sm:py-10">
          <div className="absolute w-[400px] h-[400px] bg-[#c62828]/10 rounded-full blur-3xl pointer-events-none"></div>
          {/* Decorative design plates */}
          <div className="absolute -top-4 -left-4 bg-[#F4B400] text-black text-xs font-mono font-black border-2 border-black rounded-lg transform -rotate-6 px-3.5 py-1.5 shadow-md flex items-center gap-1.5 z-20">
            <Flame className="w-3.5 h-3.5 fill-black" />
            <span>LACY CRISP EDGES</span>
          </div>

          {/* Floating Food Graphic Frame with drop-shadow and border layout */}
          <div className="relative burger-shadow transform scale-102 sm:scale-105 select-none animate-float z-10">
            <div className="w-80 h-80 sm:w-[380px] sm:h-[380px] bg-cover bg-center rounded-2xl border-4 border-[#f4b400]/20 flex items-end justify-center overflow-hidden">
              <img
                src="/src/assets/images/hero_burger_1779602286825.png"
                alt="Mouthwatering lacy crisp smashed burger"
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="relative text-center bg-black/60 backdrop-blur-sm p-4 w-full border-t border-[#FFF4E8]/10">
                <span className="block text-xs uppercase font-extrabold italic text-[#f4b400]">Most Wanted</span>
                <span className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">Classic White Cheddar Double</span>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 top-20 bg-[#F4B400] text-black font-black p-4 rounded-full rotate-12 shadow-xl z-20">
            <div className="text-center leading-none">
              <span className="text-[10px] uppercase font-extrabold">Only</span><br/>
              <span className="text-xl sm:text-2xl font-mono">${(12.99).toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce text-neutral-500 hover:text-[#c62828]" onClick={onOrderNow}>
        <ArrowDown className="w-6 h-6" />
      </div>
    </section>
  );
}
