import React, { useState } from 'react';
import { Award, Zap, Gift, Check, Share2, Sparkles, HelpCircle } from 'lucide-react';
import { UserLoyalty } from '../types';

interface RewardsProps {
  loyalty: UserLoyalty | null;
  onJoinLoyalty: (email: string, phone: string) => void;
  onClaimPromoCode: (promoCode: string, pointsClaimed: number, alertMsg: string) => void;
  onAddPoints: (points: number) => void;
}

export default function Rewards({
  loyalty,
  onJoinLoyalty,
  onClaimPromoCode,
  onAddPoints
}: RewardsProps) {
  // Setup inputs
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [copied, setCopied] = useState(false);

  // Spin to win states
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [wheelDegree, setWheelDegree] = useState(0);

  const rewardsCatalog = [
    { points: 500, title: '🎁 Free Truffle Fries', code: 'REWARD-FREE-FRYS265', desc: 'Salty golden truffles and Pecorino Romano fries.' },
    { points: 1000, title: '🍦 Decadent Chocolate Malt Shake', code: 'REWARD-FREE-SHK590', desc: 'Prestige cocoa double malts shake with fresh whipped cream.' },
    { points: 1500, title: '🍔 Any Gourmet Smash Burger', code: 'REWARD-FREE-BRGR1500', desc: 'Double Beef patties, Volcano Ghost, Veggie Garden, or Crispy Chicken.' }
  ];

  const spinPrizes = [
    { text: '10% OFF Order Code: WHEEL-10', code: 'WHEEL-10', pts: 0 },
    { text: '⚡ FREE Crispy Fries Code: SPIN-FRIES', code: 'SPIN-FRIES', pts: 0 },
    { text: '🎁 +200 FREE POINTS ADDED!', code: '', pts: 200 },
    { text: '25% OFF Large Combo Code: MEAL-25', code: 'MEAL-25', pts: 0 },
    { text: '🍦 FREE Decadent Shake Code: SHAKE-SPIN', code: 'SHAKE-SPIN', pts: 0 },
    { text: '💥 TRIPLE POINT EXPLOIT ACTIVE!', code: '', pts: 450 }
  ];

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !phoneInput) return;
    onJoinLoyalty(emailInput, phoneInput);
  };

  const handleCopyCode = () => {
    if (!loyalty) return;
    navigator.clipboard.writeText(`Hey friend! Get free fries at SmashCrave with my code: ${loyalty.referralCode} - Try it here!`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Give points for mock referring
    onAddPoints(100);
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    // Randomize angle spin deg
    const randomDegree = 1800 + Math.floor(Math.random() * 360);
    setWheelDegree(randomDegree);

    setTimeout(() => {
      setIsSpinning(false);
      const prizeIndex = Math.floor(Math.random() * spinPrizes.length);
      const wonPrize = spinPrizes[prizeIndex];
      
      setSpinResult(wonPrize.text);

      if (wonPrize.pts > 0) {
        onAddPoints(wonPrize.pts);
      } else if (wonPrize.code) {
        // give the promo code directly so they can apply
        onClaimPromoCode(wonPrize.code, 0, `🎯 SPIN WIN: You unlocked code ${wonPrize.code}!`);
      }
    }, 1800);
  };

  return (
    <section id="rewards" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212] border-t border-b border-[#FFF4E8]/10">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFF4E8] font-bold bg-[#c62828] py-1.5 px-3.5 rounded-full flex items-center justify-center gap-1.5 w-max mx-auto btn-shadow">
            <Gift className="w-3.5 h-3.5 text-[#F4B400]" />
            <span>Sizzling Loyalty Perks</span>
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mt-6 mb-3 tracking-tight uppercase italic">
            SMASH CLUB LOYALTY CLUB
          </h2>
          <p className="text-[#FFF4E8]/60 max-w-xl mx-auto text-sm sm:text-base font-light">
            Why pay full price when you can earn free smash burgers and premium shakes? Earn 10 points for every dollar spent. Sign up in 10 seconds to unlock <span className="font-bold text-[#F4B400]">150 sign-up points immediately!</span>
          </p>
        </div>

        {/* Not Registered Area */}
        {!loyalty ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#FFF4E8]/5 rounded-2xl overflow-hidden border border-[#FFF4E8]/10 shadow-2xl">
            
            {/* Promo Pitch Copy */}
            <div className="lg:col-span-6 p-8 sm:p-12 space-y-6">
              <span className="bg-[#c62828] text-white text-[10px] uppercase font-mono tracking-widest font-black py-1 px-2.5 rounded shadow-md leading-none select-none btn-shadow inline-block">
                Smash Club Special
              </span>
              <h3 className="font-display font-black text-2xl sm:text-4xl text-white leading-tight uppercase italic">
                SIGN UP TONIGHT & GET FREE UPGRADE CODES
              </h3>
              <p className="text-[#FFF4E8]/60 text-sm leading-relaxed font-light">
                No passwords, no plastic cards. Just fast, clean point logs. Enter your contacts below, and our griddle engine immediately reserves your sign-up points and copies a coupon to your tray!
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-neutral-300 text-sm">
                  <div className="w-5 h-5 bg-[#c62828]/10 border border-[#c62828]/40 text-[#c62828] font-bold rounded flex items-center justify-center text-xs">✓</div>
                  <span>10 Points earned per $1 spent on all patties</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-300 text-sm">
                  <div className="w-5 h-5 bg-[#c62828]/10 border border-[#c62828]/40 text-[#c62828] font-bold rounded flex items-center justify-center text-xs">✓</div>
                  <span>Free Birthday custom dessert of choice</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-300 text-sm">
                  <div className="w-5 h-5 bg-[#c62828]/10 border border-[#c62828]/40 text-[#c62828] font-bold rounded flex items-center justify-center text-xs">✓</div>
                  <span>Exclusive hidden AI menu unlock privileges</span>
                </div>
              </div>
            </div>

            {/* Quick Sign up Form */}
            <div className="lg:col-span-6 p-8 sm:p-12 bg-black/60 border-l border-[#FFF4E8]/10 max-w-full">
              <form onSubmit={handleJoin} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sizzler@domain.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-[#FFF4E8]/35 focus:outline-none focus:border-[#c62828] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-2">Cell Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 890-SMASH"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-[#FFF4E8]/35 focus:outline-none focus:border-[#c62828] transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#F4B400] hover:bg-white text-black font-display font-black tracking-wider text-sm uppercase py-4 rounded-lg shadow-lg active:scale-95 transition-all cursor-pointer btn-shadow"
                  >
                    🎁 JOIN CLUB & CLAIM 150 POINTS
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500 font-mono text-center leading-normal">By clicking, you consent to receive delicious weekly discounts via SMS/email. Safe server opt-out any time.</p>
              </form>
            </div>

          </div>
        ) : (
          /* Registered Dashboard State */
          <div className="space-y-12 animate-fade-in">
            
            {/* Quick Stats blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Point tracker */}
              <div className="bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 p-6 rounded-xl flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#FFF4E8]/40 font-black block">My Points Inventory</span>
                  <span className="text-4xl font-display font-black tracking-tight text-white font-mono">{loyalty.points}</span>
                  <span className="text-xs text-[#F4B400] block mt-1.5 font-bold uppercase tracking-wider">💎 {loyalty.tier} Member</span>
                </div>
                <div className="w-14 h-14 bg-[#c62828]/10 border border-[#c62828]/40 rounded-xl flex items-center justify-center text-[#c62828] shadow-md">
                  <Award className="w-7 h-7" />
                </div>
              </div>

              {/* Refer and earn points dynamically! */}
              <div className="bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 p-6 rounded-xl flex flex-col justify-between shadow-lg">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#FFF4E8]/40 font-black block mb-1">Invite Friend = Get 100 PTS</span>
                  <p className="text-xs text-[#FFF4E8]/60 font-light mb-3">Copy code below. Free fries added each time!</p>
                </div>
                <div className="flex gap-2.5">
                  <span className="bg-[#121212] py-2 px-3 border border-[#FFF4E8]/10 rounded-lg text-xs font-mono select-all text-[#FFF4E8]/70 w-full flex items-center">
                    {loyalty.referralCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="bg-[#c62828] hover:bg-[#b02222] text-white p-2.5 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center cursor-pointer shrink-0 transition-all btn-shadow"
                  >
                    {copied ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Instant spin game preview */}
              <div className="bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 p-6 rounded-xl flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#FFF4E8]/40 font-black block">Spin-to-Win wheel</span>
                  <span className="text-sm font-bold text-neutral-200 block mt-1 leading-tight uppercase">Daily Free Gamble</span>
                  <p className="text-[10px] text-neutral-500 font-mono mt-1">Spin to unlock 25% OFF or points!</p>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('loyalty-spinner');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#F4B400] hover:bg-white text-black text-xs font-black font-display uppercase py-3.5 px-5 rounded-full cursor-pointer shadow-md shrink-0 btn-shadow"
                >
                  ⚡ PLAY SPIN
                </button>
              </div>

            </div>

            {/* Loyalty rewards redeemable catalog */}
            <div className="bg-[#FFF4E8]/3 border border-[#FFF4E8]/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="font-display font-black text-xl sm:text-2xl text-white mb-6 uppercase flex items-center gap-2.5 italic">
                <Gift className="text-[#c62828] w-5 h-5" /> AVAILABLE CLUB REDEMPTIONS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rewardsCatalog.map((reward, id) => {
                  const isEligible = loyalty.points >= reward.points;

                  return (
                    <div
                      key={id}
                      className={`border p-6 rounded-xl transition-all relative overflow-hidden flex flex-col justify-between shadow-lg ${
                        isEligible
                          ? 'bg-[#FFF4E8]/5 border-[#F4B400]/40'
                          : 'bg-[#121212]/40 border-[#FFF4E8]/5 opacity-50'
                      }`}
                    >
                      <div>
                        {/* Point Badge price */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[10px] font-mono font-black px-2.5 py-1 rounded shadow-sm uppercase tracking-wider ${
                            isEligible ? 'bg-[#F4B400]/10 text-[#F4B400] border border-[#F4B400]/25' : 'bg-neutral-900 text-neutral-500 border border-transparent'
                          }`}>
                            ⚡ {reward.points} PTS REQUIRED
                          </span>
                        </div>

                        <h4 className="font-display font-black text-lg text-white mb-1 uppercase italic">{reward.title}</h4>
                        <p className="text-xs text-[#FFF4E8]/50 font-light mb-6 leading-relaxed">{reward.desc}</p>
                      </div>

                      <button
                        onClick={() => {
                          if (!isEligible) return;
                          onClaimPromoCode(reward.code, reward.points, `🎉 CLAIM SUCCESS: Use code ${reward.code} at checkout for free perks!`);
                        }}
                        disabled={!isEligible}
                        className={`w-full py-3 rounded-lg text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isEligible
                            ? 'bg-[#F4B400] hover:bg-white text-black shadow-md btn-shadow'
                            : 'bg-[#121212] text-neutral-600 border border-[#FFF4E8]/5 cursor-not-allowed'
                        }`}
                      >
                        {isEligible ? 'Claim Sizzling Reward' : 'Requires points'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Spin to Win Wheel Section */}
            <div id="loyalty-spinner" className="bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
              
              <div className="lg:col-span-5 text-center lg:text-left space-y-4">
                <span className="bg-[#F4B400] text-black text-[9px] font-mono font-black py-0.5 px-2 rounded uppercase tracking-wider btn-shadow">
                  Sizzler Spin-To-Win Game
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white leading-none uppercase italic">
                  SPIN THE MAGIC GRATE
                </h3>
                <p className="text-xs sm:text-sm text-[#FFF4E8]/60 leading-relaxed font-light">
                  Spin our digital hot-combust griddle once a day for free! Win instantly and copy discount codes to your Checkout cart automatically. No tricks, 100% gourmet prizes.
                </p>

                {spinResult && (
                  <div className="p-4 bg-[#c62828]/15 border border-[#c62828]/30 rounded-xl space-y-1.5 animate-pulse text-left">
                    <span className="text-[10px] font-mono uppercase font-black text-white bg-[#c62828] py-0.5 px-1.5 rounded inline-block">🏆 YOU WON MATCH PRIZE:</span>
                    <p className="font-display font-black text-sm text-white uppercase italic">{spinResult}</p>
                    <p className="text-[10px] text-[#FFF4E8]/50 font-mono">Any earned coupon code is already copied or applied to your active Cart tray automatically!</p>
                  </div>
                )}
              </div>

              {/* Interactive Circle Wheel Visualizer */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-6 relative h-64 sm:h-72">
                
                {/* Visual wheel representation */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                  {/* Arrow pointer indicator */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 text-[#c62828] font-bold text-xl animate-bounce">
                    ▼
                  </div>

                  <div
                    style={{
                      transform: `rotate(${wheelDegree}deg)`,
                      transition: isSpinning ? 'transform 1.8s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
                    }}
                    className="w-full h-full rounded-full border-4 border-[#F4B400] bgs-circle flex items-center justify-center overflow-hidden relative shadow-2xl bg-[#121212]"
                  >
                    {/* Retro American Diner style background quadrants */}
                    <div className="absolute inset-0 bg-[#121212]"></div>
                    <div className="absolute inset-0 bg-[#c62828]/10 transform rotate-45 pointer-events-none"></div>
                    <div className="absolute inset-x-0 h-1 bg-[#F4B400]/20 pointer-events-none"></div>
                    <div className="absolute inset-y-0 w-1 bg-[#F4B400]/20 pointer-events-none"></div>

                    {/* Fun overlay text or sections */}
                    <div className="absolute text-center font-display font-black text-[#FFF4E8]/30 text-[9px] w-full select-none z-10 block uppercase tracking-widest leading-none pointer-events-none">
                      SHAKES • FREE POINTS • MEALS • 10% OFF
                    </div>

                    {/* Sizzling hub */}
                    <div className="w-12 h-12 bg-[#F4B400] rounded-full border border-black z-10 flex items-center justify-center text-black text-xs font-bold shadow-md">
                      🔥
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSpinWheel}
                  disabled={isSpinning}
                  className="bg-[#F4B400] hover:bg-white disabled:bg-neutral-800 disabled:text-neutral-500 disabled:border-transparent text-black font-display font-black tracking-wider text-xs uppercase py-3.5 px-8 rounded-full shadow-lg active:scale-95 transition-all cursor-pointer btn-shadow"
                >
                  {isSpinning ? 'GRIDDING THE WHEEL...' : '⚡ SPIN THE WHEEL'}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
