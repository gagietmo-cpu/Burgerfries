import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, Check, Mail } from 'lucide-react';

interface ExitIntentPopupProps {
  onApplyFreeFries: (couponCode: string) => void;
}

export default function ExitIntentPopup({ onApplyFreeFries }: ExitIntentPopupProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Listen for mouseout event that detects if user moves mouse to top (close tab action)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 18) {
        // Only show once per session using session flag
        const alreadyShowed = sessionStorage.getItem('exit_intent_displayed');
        if (!alreadyShowed) {
          setShowPopup(true);
          sessionStorage.setItem('exit_intent_displayed', 'true');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    setIsSubmitted(true);
    // Auto-apply free fries coupon
    onApplyFreeFries('FREEFRIES-CRSPY');
    
    setTimeout(() => {
      setShowPopup(false);
    }, 4500); // close automatically after showing coupon code details
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#121212] border-2 border-[#FFF4E8]/20 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        
        {/* Floating design elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#c62828]/5 rounded-full blur-2xl pointer-events-none"></div>
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 bg-black/80 hover:bg-[#c62828] text-white p-2.5 text-xs rounded-full cursor-pointer border border-[#FFF4E8]/10 leading-none"
        >
          ✕
        </button>

        <div className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-[#c62828] rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-[#FFF4E8]/10 btn-shadow">
            <span className="text-3xl animate-bounce">🍟✨</span>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-black text-[#F4B400] uppercase tracking-widest block">WAIT! DON'T LEAVE EMPTY STOMACHED</span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white mt-1 leading-none uppercase italic">
              CLAIM FREE LOADED FRIES!
            </h3>
            <p className="text-xs sm:text-sm text-[#FFF4E8]/60 leading-relaxed font-light">
              Join our mailing list right now, and we will instantly add a coupon code for <span className="font-bold text-[#F4B400]">FREE Loaded Fries</span> to your cart list automatically!
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubscribe} className="space-y-3 text-left">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Insert email here (e.g., foodie@crave.com)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3 px-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c62828] placeholder-[#FFF4E8]/20 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#F4B400] hover:bg-white text-black font-display font-black tracking-widest text-xs uppercase py-3.5 rounded-lg shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 btn-shadow"
              >
                <Mail className="w-4 h-4 text-black" />
                <span>ACTIVATE CODES NOW</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4 py-4 animate-pulse">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-md">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-500 uppercase font-black block leading-none mb-1">Coupon Activated</span>
                <span className="font-mono text-lg font-bold text-white tracking-widest bg-black/40 py-1.5 px-4 rounded border border-emerald-500/30">
                  FREEFRIES-CRSPY
                </span>
                <p className="text-[10px] text-neutral-500 font-mono mt-2 leading-relaxed">This voucher has been auto-applied directly inside your Shopping Cart panel! Sizzling free item unlocked.</p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => setShowPopup(false)}
              className="text-xs text-neutral-500 hover:text-[#FFF4E8] underline font-mono cursor-pointer transition-colors"
            >
              No thanks, I rather order normal price
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
