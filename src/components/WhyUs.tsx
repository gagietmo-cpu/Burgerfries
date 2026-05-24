import React from 'react';
import { ShieldCheck, Sparkles, Award, Zap, Flame, Heart } from 'lucide-react';

export default function WhyUs() {
  const benefits = [
    {
      icon: <Flame className="w-8 h-8 text-red-500" />,
      title: "100% Grass-Fed Angus Beef",
      desc: "Our custom chuck & brisket custom ratio blend is hand-rolled daily and smashed live at 450°F to form exquisite caramelized lacy edges."
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      title: "Hand-Cut Crispy Fries",
      desc: "Fresh Idaho russet potatoes, soaked in salted ice baths, then double fried in sunflower oil and dustings of house cajun sea salts."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      title: "Sizzling Thermal Delivery",
      desc: "Our drivers utilize state-of-the-art aluminum thermal-foil inserts inside high-heat backpacks to guarantee your burgers arrive steaming hot under 25 mins!"
    },
    {
      icon: <Award className="w-8 h-8 text-purple-500" />,
      title: "Dynamic Loyalty Club Rewards",
      desc: "Earn 10 points for every dollar spent. Redeem them directly on the web app in two clicks for free Loaded Fries, milkshakes, or full gourmet combos!"
    }
  ];

  return (
    <section id="why-choose" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212] border-t border-b border-[#FFF4E8]/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFF4E8] font-bold bg-[#c62828] py-1.5 px-3.5 rounded-full btn-shadow">
            ⭐ The Smash Standard
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mt-6 mb-3 tracking-tight uppercase italic">
            WHY CUSTOMERS CRAVE US EVERYDAY
          </h2>
          <p className="text-[#FFF4E8]/60 max-w-xl mx-auto text-sm sm:text-base font-light">
            We do not cut corners. We do not use freezer-burned patties. Discover the premium details that keep conversions and repeat rates high.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 p-6 rounded-xl relative overflow-hidden group hover:border-[#c62828]/50 transition-all shadow-md hover:shadow-lg"
            >
              {/* Backglow accent on hover */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#c62828]/5 rounded-full blur-2xl group-hover:bg-[#c62828]/10 transition-all pointer-events-none"></div>
              
              <div className="mb-4 bg-[#121212]/80 w-14 h-14 rounded-xl flex items-center justify-center border border-[#FFF4E8]/10 group-hover:scale-105 transition-transform">
                {benefit.icon}
              </div>

              <h3 className="font-display font-black text-lg text-white mb-2 leading-snug uppercase italic">
                {benefit.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#FFF4E8]/60 leading-relaxed font-light">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Featured Ultimate Combo Booster Baner */}
        <div id="combo-booster-banner" className="mt-16 bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 rounded-2xl overflow-hidden p-8 sm:p-12 shadow-xl relative">
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-[#c62828]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="bg-[#c62828] text-white text-[10px] uppercase font-mono tracking-widest font-black py-1 px-2.5 rounded shadow-md select-none btn-shadow">
                🏷️ FLASH BEST-SELLER DEAL
              </span>
              <h3 className="font-display font-black text-2xl sm:text-4xl text-white leading-tight uppercase italic">
                THE ULTIMATE BARGAIN COMBO MEAL
              </h3>
              <p className="text-[#FFF4E8]/60 text-sm sm:text-base font-light max-w-xl leading-relaxed">
                Enjoy our signature Double Smash Burger, loaded skin-on bacon crispy fries, and a sweating ice-cold soft drink/shake of choice. Bundled to save you over <span className="font-bold text-[#F4B400]">20% immediately</span>.
              </p>
              
              <div className="flex items-center gap-6 pt-2 font-mono text-xs text-[#FFF4E8]/40">
                <span className="flex items-center gap-1.5"><Heart className="text-[#c62828] w-4 h-4" /> Perfect for sharing</span>
                <span>•</span>
                <span className="text-[#F4B400] font-bold">🎁 Comes with a free cookie inside</span>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch lg:items-end justify-center lg:justify-end gap-5">
              <div className="text-center lg:text-right">
                <span className="text-neutral-500 line-through text-sm font-semibold hover:text-red-500/80">$23.97 Regular</span>
                <div className="flex items-center justify-center lg:justify-end gap-1">
                  <span className="text-xs font-mono text-neutral-400 uppercase font-black">Deal:</span>
                  <span className="text-3xl sm:text-4xl font-display font-black text-[#F4B400] font-mono">$18.99</span>
                </div>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('menu-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#F4B400] text-black font-display font-black tracking-wider text-xs uppercase py-4 px-6 rounded-full transition-all btn-shadow active:scale-95 cursor-pointer hover:scale-[1.02]"
              >
                ⚡ GET ULTIMATE COMBO DEAL
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
