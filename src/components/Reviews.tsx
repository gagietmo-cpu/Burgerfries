import React, { useState } from 'react';
import { Star, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Review } from '../types';
import { REVIEWS } from '../data';

export default function Reviews() {
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  // Form states to add review
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [newTag, setNewTag] = useState('Double Smash Burger');
  
  const [showForm, setShowForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const prevReview = () => {
    setActiveReviewIndex((prev) => (prev === 0 ? reviewsList.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setActiveReviewIndex((prev) => (prev === reviewsList.length - 1 ? 0 : prev + 1));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newText) return;

    const addedReview: Review = {
      id: `custom-rev-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      text: newText,
      tag: newTag,
      date: 'Today',
      verified: true
    };

    setReviewsList([addedReview, ...reviewsList]);
    setIsSubmitted(true);
    
    // Clear inputs
    setNewAuthor('');
    setNewText('');
    setNewRating(5);

    setTimeout(() => {
      setIsSubmitted(false);
      setShowForm(false);
      setActiveReviewIndex(0); // slide to their added review
    }, 1800);
  };

  const activeReview = reviewsList[activeReviewIndex];

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212] border-t border-b border-[#FFF4E8]/10 relative">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFF4E8] font-bold bg-[#c62828] py-1.5 px-3.5 rounded-full flex items-center justify-center gap-1.5 w-max mx-auto btn-shadow">
            🎙️ Social Proof
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mt-6 mb-3 tracking-tight uppercase italic">
            WHAT CRITICS & CRAVERS SAY
          </h2>
          <p className="text-[#FFF4E8]/60 max-w-xl mx-auto text-sm sm:text-base font-light">
            Don’t believe our bold promises. Believe the words of over 3,000 extremely satisfied repeat burger custom consumers!
          </p>
        </div>

        {/* Carousel + Review details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Review Text Column */}
          <div className="lg:col-span-8 bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 rounded-2xl p-8 sm:p-12 shadow-2xl relative min-h-[300px] flex flex-col justify-between">
            {/* Elegant Quotation mark indicator */}
            <span className="absolute top-6 right-8 text-[#FFF4E8]/5 font-display font-black text-8xl leading-none">“</span>

            <div className="space-y-6">
              {/* Stars rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: activeReview.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#F4B400] text-[#F4B400]" />
                ))}
              </div>

              {/* Review Text block */}
              <p className="font-display text-lg sm:text-2xl font-bold text-[#FFF4E8] italic leading-snug">
                {activeReview.text}
              </p>
            </div>

            {/* Author details, date, products tagged */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-[#FFF4E8]/10 mt-8">
              <div>
                <span className="block font-display font-black text-lg text-white uppercase italic">
                  {activeReview.author}
                </span>
                <span className="text-xs text-[#FFF4E8]/40 font-mono uppercase tracking-wider">
                  Verified Craver • Purchased {activeReview.date}
                </span>
              </div>
              
              {activeReview.tag && (
                <span className="bg-[#c62828] text-white text-[10px] py-1.5 px-3 rounded shadow-md font-mono font-bold leading-none uppercase btn-shadow">
                  ⭐ {activeReview.tag}
                </span>
              )}
            </div>

            {/* Carousel controller buttons */}
            <div className="absolute -bottom-6 right-8 flex gap-2.5">
              <button
                onClick={prevReview}
                className="bg-[#121212] hover:bg-[#FFF4E8]/5 text-[#FFF4E8]/80 p-3.5 rounded-full shadow-lg border border-[#FFF4E8]/10 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextReview}
                className="bg-[#c62828] hover:bg-[#b02222] text-white p-3.5 rounded-full shadow-lg border border-[#FFF4E8]/10 transition-colors cursor-pointer btn-shadow"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Prompt: Share My Experience Column */}
          <div className="lg:col-span-4 flex flex-col justify-center text-center lg:text-left space-y-6">
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white leading-tight uppercase italic font-black">
              HAD A SIZZLING EXPERIENCING?
            </h3>
            <p className="text-[#FFF4E8]/60 text-sm leading-relaxed font-light">
              We value transparency and appreciate our community. Share your authentic smash grill experience and prompt a chance to win free Loaded Cheese Fries next week!
            </p>

            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-transparent hover:bg-[#c62828]/10 text-[#FFF4E8]/80 hover:text-white border border-[#FFF4E8]/10 hover:border-[#c62828] font-black py-4 px-6 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
              >
                📝 LEAVE YOUR REVIEW
              </button>
            ) : (
              <form onSubmit={handleSubmitReview} className="p-6 bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 rounded-2xl text-left space-y-4 shadow-xl">
                {isSubmitted ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white shadow-md">
                      <Check className="w-6 h-6" />
                    </div>
                    <p className="font-display font-black text-white uppercase italic">Review Submitted!</p>
                    <p className="text-xs text-[#FFF4E8]/50 font-sans">Refreshing grills & sliding review card to slots...</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-[10px] font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-1.5">Sizzler Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Your Name (e.g. David L.)"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3 px-3 text-xs text-white placeholder-[#FFF4E8]/30 focus:outline-none focus:border-[#c62828]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-1.5">Rating Choice</label>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3 px-2 text-xs text-[#FFF4E8] focus:outline-none focus:border-[#c62828]"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Legendary)</option>
                        <option value="4">⭐⭐⭐⭐ 4 Stars (Excellent)</option>
                        <option value="3">⭐⭐⭐ 3 Stars (Good)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-1.5">Fav Product</label>
                      <select
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3 px-2 text-xs text-[#FFF4E8] focus:outline-none focus:border-[#c62828]"
                      >
                        <option value="Double Smash Burger">Double Smash Burger</option>
                        <option value="Loaded Fries">Loaded Cheese Fries</option>
                        <option value="Truffle Fries">Truffle Garlic Fries</option>
                        <option value="Crave Combo">The Ultimate Crave Combo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold font-mono text-[#FFF4E8]/40 uppercase tracking-widest mb-1.5">Your Sizzler Feedback</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Tell the community how crispy, juicy, or spicy the burgers and fries were..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3 px-3 text-xs text-white placeholder-[#FFF4E8]/30 focus:outline-none focus:border-[#c62828] font-sans"
                      />
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-3.5 py-2.5 bg-[#121212] border border-[#FFF4E8]/10 hover:bg-[#FFF4E8]/5 text-[#FFF4E8]/60 text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full bg-[#F4B400] text-black hover:bg-white font-black text-xs py-2.5 rounded-lg transition-all cursor-pointer btn-shadow"
                      >
                        Submit Sizzle Review
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
