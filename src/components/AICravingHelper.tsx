import React, { useState } from 'react';
import { Sparkles, Flame, CheckCircle, RotateCcw } from 'lucide-react';
import { CartItem, MenuItem } from '../types';
import { MENU_ITEMS } from '../data';

interface AICravingsResponse {
  slogan: string;
  recommendedItems: string[];
  explanation: string;
  discountCode: string;
  discountPercent: number;
}

interface AICravingHelperProps {
  onAddMultiCartItems: (items: CartItem[], appliedPromoCode: string, promoValue: number) => void;
}

export default function AICravingHelper({ onAddMultiCartItems }: AICravingHelperProps) {
  const [mood, setMood] = useState('');
  const [diet, setDiet] = useState('Standard');
  const [spice, setSpice] = useState('Mild-Medium');
  const [hungerLevel, setHungerLevel] = useState('Hungry');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [apiResult, setApiResult] = useState<AICravingsResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const moodsPreset = [
    "🥵 Super Spicy Craving",
    "🤤 Late Night Cravings",
    "🏃 Running Late / Need Speed",
    "🧗 Hangry Feast Mode",
    "🌱 Pure Clean Green Mood"
  ];

  const handleRecommend = async (customMood?: string) => {
    const selectedMood = customMood || mood;
    if (!selectedMood) {
      setApiError('Please describe your current craving mood or click a preset!');
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setApiResult(null);

    const loadingLines = [
      "🔥 Warming up the virtual flat-top griddle at 450°F...",
      "🧀 Calibrating white cheddar melting coefficients...",
      "🍟 Sizzling hand-cut russet fries in garlic herbs...",
      "🧠 AI Chef analyzes your cravings and formulating secret sauce...",
    ];

    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingLines.length);
    }, 1200);

    try {
      const response = await fetch('/api/cravings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: selectedMood,
          diet,
          spice,
          hungerLevel
        })
      });

      if (!response.ok) {
        throw new Error('Sizzler error back of kitchen!');
      }

      const data: AICravingsResponse = await response.json();
      setApiResult(data);
    } catch (err) {
      setApiError('Gourd on the grill! The AI chef burnt your burger. Select from the standard menu directly or try again!');
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const handleAddFeastToCart = () => {
    if (!apiResult) return;

    // Map recommendation item strings into exact MENU_ITEMS structures
    const matchedCartItems: CartItem[] = [];

    apiResult.recommendedItems.forEach((name) => {
      const matchingMenuItem = MENU_ITEMS.find(
        (m) => m.name.toLowerCase() === name.toLowerCase() || 
               name.toLowerCase().includes(m.name.toLowerCase()) ||
               m.name.toLowerCase().includes(name.toLowerCase())
      );

      if (matchingMenuItem) {
        matchedCartItems.push({
          id: `ai-${matchingMenuItem.id}-regular`,
          item: matchingMenuItem,
          quantity: 1,
          customSelections: {},
          size: 'Regular',
          customPrice: matchingMenuItem.price
        });
      }
    });

    if (matchedCartItems.length === 0) {
      // Fallback: If no item matched, add default Double Smash Burger & fries
      const doubleSmash = MENU_ITEMS.find(m => m.id === 'double-smash');
      const fries = MENU_ITEMS.find(m => m.id === 'loaded-cheese-fries');
      
      if (doubleSmash) {
        matchedCartItems.push({
          id: `ai-fallback-smash`,
          item: doubleSmash,
          quantity: 1,
          customSelections: {},
          size: 'Regular',
          customPrice: doubleSmash.price
        });
      }
      if (fries) {
        matchedCartItems.push({
          id: `ai-fallback-fries`,
          item: fries,
          quantity: 1,
          customSelections: {},
          size: 'Regular',
          customPrice: fries.price
        });
      }
    }

    onAddMultiCartItems(matchedCartItems, apiResult.discountCode, apiResult.discountPercent);
  };

  return (
    <section id="cravings" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212] border-t border-b border-[#FFF4E8]/10">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFF4E8] font-bold bg-[#c62828] py-1.5 px-3.5 rounded-full flex items-center justify-center gap-1.5 w-max mx-auto btn-shadow">
            <Sparkles className="w-3.5 h-3.5 text-[#F4B400] animate-spin" />
            <span>AI recommendation wizard</span>
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mt-6 mb-3 tracking-tight uppercase italic">
            AI CRAVING MATCHMAKER
          </h2>
          <p className="text-[#FFF4E8]/60 max-w-xl mx-auto text-sm sm:text-base font-light">
            Can’t choose between lacy smash patties or spicy volcano burgers? Describe your appetite current mood and click matching, or let Chef AI create your perfect customized bundle!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Left panel: form configuration */}
          <div className="bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Mood Description Box */}
              <div>
                <label className="block text-xs font-bold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-2.5">
                  1. Describe Your Appetite Mood
                </label>
                <input
                  type="text"
                  placeholder="e.g., Exhausted from workout, absolute spicy cheat meal required with massive fries"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3.5 px-4 text-sm text-[#FFF4E8] placeholder-[#FFF4E8]/30 focus:outline-none focus:border-[#c62828] transition-colors font-sans"
                />
                
                {/* Mood presets for single-click instant conversions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {moodsPreset.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMood(preset.substring(3));
                        handleRecommend(preset.substring(3));
                      }}
                      className="text-[10px] font-black uppercase tracking-wider bg-[#FFF4E8]/5 hover:bg-[#c62828]/15 text-[#FFF4E8]/70 hover:text-white border border-[#FFF4E8]/10 rounded-lg py-1.5 px-3 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                
                <div>
                  <label className="block text-xs font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-1.5">Diet Theme</label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3 px-3 text-xs text-[#FFF4E8] focus:outline-none focus:border-[#c62828]"
                  >
                    <option value="Standard">Standard Carnivore</option>
                    <option value="Vegetarian">Strict Vegetarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-1.5">Spice Grade</label>
                  <select
                    value={spice}
                    onChange={(e) => setSpice(e.target.value)}
                    className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3 px-3 text-xs text-[#FFF4E8] focus:outline-none focus:border-[#c62828]"
                  >
                    <option value="Mild-Medium">Mild / Original</option>
                    <option value="spicy">🔥 Spicy Habanero</option>
                    <option value="Fiery ghost">🌶️🌶️🌶️ Inferno Pepper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-1.5">Hunger Scale</label>
                  <select
                    value={hungerLevel}
                    onChange={(e) => setHungerLevel(e.target.value)}
                    className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3 px-3 text-xs text-[#FFF4E8] focus:outline-none focus:border-[#c62828]"
                  >
                    <option value="snacking">Light Snacking (Side)</option>
                    <option value="Hungry">Satisfy Craving</option>
                    <option value="Feast">Glutting Feast (Large Combo)</option>
                  </select>
                </div>

              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-[#FFF4E8]/10">
              {apiError && (
                <div className="bg-[#c62828]/10 border border-[#c62828]/30 text-red-400 text-xs p-3.5 rounded-lg mb-4 text-center font-semibold">
                  {apiError}
                </div>
              )}
              
              <button
                onClick={() => handleRecommend()}
                disabled={isLoading}
                className="w-full bg-[#c62828] hover:bg-[#b02222] disabled:bg-neutral-850 disabled:text-neutral-500 disabled:border-transparent text-white font-display font-black tracking-widest text-sm uppercase py-4 rounded-lg flex items-center justify-center gap-2 btn-shadow scale-100 hover:scale-[1.01] transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>AI COOKING IN PROGRESS...</span>
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#F4B400]" />
                    <span>MUTATE MY CRAVING TO FEAST BUNDLE</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right panel: loading sequences OR result display */}
          <div className="lg:col-span-1 border border-[#FFF4E8]/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center relative min-h-[300px] overflow-hidden bg-[#FFF4E8]/5">
            {/* Background design elements */}
            <div className="absolute inset-0 bg-[#c62828]/5 pointer-events-none"></div>

            {/* Default State */}
            {!isLoading && !apiResult && !apiError && (
              <div className="text-center max-w-sm space-y-4 relative z-10">
                <span className="text-4xl block animate-bounce">🤖💬</span>
                <p className="font-display font-black text-lg text-white uppercase italic">Ask your AI grill companion</p>
                <p className="text-[#FFF4E8]/50 text-sm leading-relaxed">
                  Provide your appetite mood description and preferences on the left, then click the button. Chef AI will instantly formulate a customized gourmet spread and generate an exclusive coupon code to boost your checkout!
                </p>
              </div>
            )}

            {/* Loading Screen */}
            {isLoading && (
              <div className="text-center space-y-4 py-8 relative z-10">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 border-4 border-[#c62828]/30 border-t-[#c62828] rounded-full animate-spin"></div>
                  <Flame className="w-6 h-6 text-[#F4B400] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse fill-[#F4B400]" />
                </div>
                <p className="font-mono text-xs text-[#FFF4E8]/60 max-w-xs mx-auto animate-pulse">
                  {[
                    "🔥 Warming up the virtual flat-top griddle at 450°F...",
                    "🧀 Calibrating white cheddar melting coefficients...",
                    "🍟 Sizzling hand-cut russet fries in garlic herbs...",
                    "🧠 AI Chef analyzes your cravings and formulating secret sauce...",
                  ][loadingStep]}
                </p>
              </div>
            )}

            {/* Results Reveal Card */}
            {!isLoading && apiResult && (
              <div className="w-full text-left space-y-6 relative z-10">
                <div>
                  <span className="bg-[#F4B400] text-black text-[9px] font-mono font-black py-0.5 px-2 rounded uppercase tracking-wider btn-shadow">
                    AI CHEF SPEAKS
                  </span>
                  <h3 className="font-display font-black text-2xl text-[#c62828] tracking-tight mt-1.5 leading-none uppercase italic">
                    “ {apiResult.slogan} ”
                  </h3>
                </div>

                <div className="bg-[#121212] border border-[#FFF4E8]/10 rounded-xl p-4">
                  <span className="block text-[10px] uppercase font-mono tracking-widest text-[#FFF4E8]/40 mb-2 font-black text-xs">Recommended Spread:</span>
                  <div className="flex flex-col gap-2">
                    {apiResult.recommendedItems.map((item, id) => (
                      <div key={id} className="flex items-center gap-2 font-display text-sm font-bold text-neutral-200 uppercase">
                        <CheckCircle className="w-4 h-4 text-[#F4B400] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-[10px] uppercase font-mono tracking-widest text-[#FFF4E8]/40 font-black">AI Chef’s Perspective:</span>
                  <p className="text-[#FFF4E8]/70 text-sm leading-relaxed font-light italic">
                    {apiResult.explanation}
                  </p>
                </div>

                {/* Exclusive Promo Coupon */}
                <div className="p-4 bg-[#F4B400]/10 border border-dashed border-[#F4B400]/30 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#F4B400] uppercase font-black tracking-wider block">Special Coupon Activated</span>
                    <span className="font-mono text-lg font-bold text-white selection:bg-[#F4B400] selection:text-black">
                      {apiResult.discountCode}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-display font-black text-[#F4B400] font-mono">
                      -{apiResult.discountPercent}% OFF
                    </span>
                  </div>
                </div>

                {/* Conversion Button */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      setMood('');
                      setApiResult(null);
                    }}
                    className="p-3 bg-[#121212] border border-[#FFF4E8]/10 hover:bg-[#FFF4E8]/5 text-[#FFF4E8]/60 hover:text-white rounded-lg transition-colors shrink-0 cursor-pointer text-sm font-semibold flex items-center"
                  >
                    <RotateCcw className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={handleAddFeastToCart}
                    className="w-full bg-[#F4B400] text-black hover:bg-white hover:scale-[1.01] font-display font-black text-xs uppercase rounded-lg tracking-wider py-3.5 btn-shadow active:scale-95 transition-all cursor-pointer"
                  >
                    ⚡ ADD TASTY FEAST TO ORDER
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
