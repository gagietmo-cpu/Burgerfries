import React, { useState } from 'react';
import { Search, Flame, Shuffle, Sparkles, Filter, Leaf, Star } from 'lucide-react';
import { MenuItem, MenuOption, CustomSelections, CartItem } from '../types';
import { MENU_ITEMS } from '../data';

interface MenuProps {
  onAddCartItem: (cartItem: CartItem) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
}

export default function Menu({
  onAddCartItem,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory
}: MenuProps) {
  // Option filters
  const [filterSpicyOnly, setFilterSpicyOnly] = useState(false);
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [filterBestSellers, setFilterBestSellers] = useState(false);

  // Customizer state
  const [activeCustomizerItem, setActiveCustomizerItem] = useState<MenuItem | null>(null);
  const [extraPatty, setExtraPatty] = useState(false);
  const [extraCheese, setExtraCheese] = useState(false);
  const [addBacon, setAddBacon] = useState(false);
  const [sauceSelection, setSauceSelection] = useState('Secret Sizzling Aioli');
  const [portionSize, setPortionSize] = useState<'Regular' | 'Large'>('Regular');

  const categories = [
    { id: 'all', label: '📖 All Cravings' },
    { id: 'burgers', label: '🍔 Burgers' },
    { id: 'fries', label: '🍟 Crispy Fries' },
    { id: 'combos', label: '🍱 Combo Deals' },
    { id: 'drinks', label: '🥤 Cold Beverages' }
  ];

  // Filtering Logic
  const filteredItems = MENU_ITEMS.filter((item) => {
    // 1. Category search
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    
    // 2. Search query matching name or description
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;

    // 3. Toggles
    if (filterSpicyOnly && item.spiceLevel === 0) return false;
    if (filterVegOnly && !item.isVegetarian) return false;
    if (filterBestSellers && !item.isBestSeller) return false;

    return true;
  });

  const handleOpenCustomizer = (item: MenuItem) => {
    setActiveCustomizerItem(item);
    // Reset selection defaults
    setExtraPatty(false);
    setExtraCheese(false);
    setAddBacon(false);
    setSauceSelection(item.category === 'burgers' ? 'Secret Sizzling Aioli' : 'Buttermilk Herbs');
    setPortionSize('Regular');
  };

  const handleCloseCustomizer = () => {
    setActiveCustomizerItem(null);
  };

  // Calculate dynamic custom price
  const getCalculateCustomPrice = () => {
    if (!activeCustomizerItem) return 0;
    let price = activeCustomizerItem.price;
    
    if (portionSize === 'Large') {
      price += 1.50; // default larger size increase
    }

    if (extraPatty) price += 2.50;
    if (extraCheese) price += 1.00;
    if (addBacon) price += 1.50;

    return price;
  };

  const handleConfirmAdd = () => {
    if (!activeCustomizerItem) return;

    const selections: CustomSelections = {};
    if (activeCustomizerItem.category === 'burgers' || activeCustomizerItem.category === 'combos') {
      selections.extraPatty = extraPatty;
      selections.extraCheese = extraCheese;
      selections.addBacon = addBacon;
      selections.sauceChoice = sauceSelection;
    }

    const price = getCalculateCustomPrice();
    const uniqueId = `${activeCustomizerItem.id}-${portionSize}-${extraPatty ? 'p' : ''}-${extraCheese ? 'c' : ''}-${addBacon ? 'b' : ''}-${sauceSelection.replace(/\s+/g, '')}`;

    const cartItem: CartItem = {
      id: uniqueId,
      item: activeCustomizerItem,
      quantity: 1,
      customSelections: selections,
      size: portionSize,
      customPrice: price
    };

    onAddCartItem(cartItem);
    handleCloseCustomizer();
  };

  return (
    <section id="menu-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121212]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFF4E8] font-bold bg-[#c62828] py-1.5 px-3.5 rounded-full btn-shadow">
            📖 Taste the Fire
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mt-6 mb-3 tracking-tight uppercase italic">
            CRAVABLE CRAFT MENU
          </h2>
          <p className="text-[#FFF4E8]/60 max-w-xl mx-auto text-sm sm:text-base font-light">
            Smashed live, cooked instantly, tailored perfectly. Filter your cravings or search your core favorite below.
          </p>
        </div>

        {/* Search, Categories, and Toggle Filter Ribbon */}
        <div id="filter-ribbon" className="bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 rounded-2xl p-4 sm:p-6 mb-12 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-6">
            
            {/* Search Input Box */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#FFF4E8]/40 w-4 h-4" />
              <input
                type="text"
                placeholder="Craving a loaded patty or truffle fry? Type here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-xl py-3.5 pl-10 pr-4 text-sm text-neutral-200 placeholder-[#FFF4E8]/40 focus:outline-none focus:border-[#c62828] transition-colors font-sans"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2.5 justify-center w-full lg:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#c62828] text-white btn-shadow'
                      : 'bg-[#FFF4E8]/5 text-[#FFF4E8]/70 hover:text-white border border-[#FFF4E8]/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          {/* Core Toggle Filter Toggles */}
          <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start pt-4 border-t border-[#FFF4E8]/10">
            <span className="text-xs text-[#FFF4E8]/50 uppercase tracking-widest font-mono font-bold flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>

            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-[#FFF4E8]/80 hover:text-white select-none">
              <input
                type="checkbox"
                checked={filterSpicyOnly}
                onChange={() => setFilterSpicyOnly(!filterSpicyOnly)}
                className="w-4.5 h-4.5 rounded bg-black border-[#FFF4E8]/10 text-[#c62828] focus:ring-[#c62828] cursor-pointer accent-[#c62828]"
              />
              <span className="flex items-center gap-1">
                🌶️ <span className="text-[#FFF4E8]">Spicy Only</span>
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-[#FFF4E8]/80 hover:text-white select-none">
              <input
                type="checkbox"
                checked={filterVegOnly}
                onChange={() => setFilterVegOnly(!filterVegOnly)}
                className="w-4.5 h-4.5 rounded bg-black border-[#FFF4E8]/10 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
              />
              <span className="flex items-center gap-1">
                🌱 <span className="text-[#FFF4E8]">Vegetarian Only</span>
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-bold text-[#FFF4E8]/80 hover:text-white select-none">
              <input
                type="checkbox"
                checked={filterBestSellers}
                onChange={() => setFilterBestSellers(!filterBestSellers)}
                className="w-4.5 h-4.5 rounded bg-black border-[#FFF4E8]/10 text-[#f4b400] focus:ring-[#f4b400] cursor-pointer accent-[#f4b400]"
              />
              <span className="flex items-center gap-1">
                ⭐ <span className="text-[#FFF4E8]">Best Sellers First</span>
              </span>
            </label>
            
            {(filterSpicyOnly || filterVegOnly || filterBestSellers || searchTerm) && (
              <button
                onClick={() => {
                  setFilterSpicyOnly(false);
                  setFilterVegOnly(false);
                  setFilterBestSellers(false);
                  setSearchTerm('');
                }}
                className="text-xs font-mono font-bold text-[#c62828] hover:text-white underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div id="menu-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              id={`item-card-${item.id}`}
              className="bg-[#FFF4E8]/5 border border-[#FFF4E8]/10 rounded-xl overflow-hidden shadow-lg hover:border-[#c62828]/50 hover:shadow-2xl hover:shadow-[#c62828]/15 transition-all duration-300 flex flex-col group justify-between"
            >
              <div>
                {/* Product Image and Badges */}
                <div className="relative overflow-hidden cursor-pointer" onClick={() => handleOpenCustomizer(item)}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Overlay tags */}
                  <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                    {item.isBestSeller && (
                      <span className="bg-[#F4B400] text-black text-[10px] font-mono font-black py-1 px-2.5 rounded shadow-md select-none uppercase tracking-wider btn-shadow">
                        ⭐ BEST SELLER
                      </span>
                    )}
                    {item.isVegetarian && (
                      <span className="bg-emerald-600 text-white text-[10px] font-mono font-black py-1 px-2.5 rounded shadow-md select-none uppercase tracking-wider">
                        🌱 VEGGIE CHOICE
                      </span>
                    )}
                  </div>

                  {item.spiceLevel > 0 && (
                    <div className="absolute top-3.5 right-3.5 bg-black/80 px-2 py-1 rounded flex gap-0.5 shadow-md">
                      {Array.from({ length: item.spiceLevel }).map((_, i) => (
                        <span key={i} className="text-xs text-red-500">🌶️</span>
                      ))}
                    </div>
                  )}

                  {/* Rating / Counts Overlay */}
                  <div className="absolute bottom-3.5 right-3.5 bg-black/95 px-2.5 py-1 rounded flex items-center gap-1 shadow-md text-xs font-bold text-[#F4B400] border border-[#FFF4E8]/10">
                    <Star className="w-3 h-3 fill-[#F4B400]" />
                    <span>{item.rating}</span>
                    <span className="text-[#FFF4E8]/40 text-[10px]">({item.reviewsCount})</span>
                  </div>
                </div>

                {/* Card Info Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display font-black text-xl text-white group-hover:text-[#c62828] transition-colors uppercase italic">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-sm text-[#FFF4E8]/60 leading-relaxed font-light mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-[#FFF4E8]/40 mb-2">
                    <span>🔥 {item.calories} CALS</span>
                    <span>•</span>
                    <span className="text-emerald-500 font-bold">100% Organic Prep</span>
                  </div>
                </div>
              </div>

              {/* Bottom Interactive Order Bar */}
              <div className="p-6 pt-0 border-t border-[#FFF4E8]/10 mt-auto flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#FFF4E8]/40 uppercase block tracking-wider leading-none mb-1">Price</span>
                  <span className="text-2xl font-display font-black text-[#F4B400] font-mono">${item.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleOpenCustomizer(item)}
                  className="bg-[#c62828] text-white hover:bg-[#b02222] px-5 py-2.5 rounded-lg text-xs font-black tracking-wider uppercase btn-shadow transition-all active:scale-95 cursor-pointer"
                >
                  ➕ ADD TO ORDER
                </button>
              </div>

            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full py-16 text-center bg-[#FFF4E8]/5 rounded-2xl border border-[#FFF4E8]/10">
              <span className="text-4xl block mb-3">🍔👀</span>
              <p className="font-display font-bold text-lg text-white mb-2 uppercase italic">My Grill Is Quiet!</p>
              <p className="text-[#FFF4E8]/50 max-w-sm mx-auto text-sm">No items matched your current filter combinations. Try deselecting some filters or search for another term.</p>
            </div>
          )}
        </div>

      </div>

      {/* Gourmet Customization Modal Popup */}
      {activeCustomizerItem && (
        <div id="modal-backdrop" className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            id="modal-container"
            className="relative bg-[#121212] border border-[#FFF4E8]/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
          >
            {/* Modal Image Header */}
            <div className="relative h-48 sm:h-56">
              <img
                src={activeCustomizerItem.image}
                alt={activeCustomizerItem.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={handleCloseCustomizer}
                className="absolute top-4 right-4 bg-black/80 hover:bg-[#c62828] font-bold p-2 text-white rounded-full transition-colors border border-neutral-800 cursor-pointer text-xs"
              >
                ✕
              </button>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#121212] pt-16 p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#F4B400] uppercase font-black">Gourmet Customizer</span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white mt-1 leading-none uppercase italic">{activeCustomizerItem.name}</h3>
              </div>
            </div>

            {/* Modal Body options */}
            <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
              {/* Sizing options */}
              <div>
                <span className="block text-xs font-mono font-bold text-[#FFF4E8]/40 uppercase tracking-widest mb-2.5">Choose Size Or Upgrade</span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPortionSize('Regular')}
                    className={`p-3.5 rounded-lg text-left border text-sm font-semibold transition-all cursor-pointer ${
                      portionSize === 'Regular'
                        ? 'bg-[#c62828]/10 border-[#c62828] text-white'
                        : 'bg-[#121212] border-[#FFF4E8]/10 text-[#FFF4E8]/60 hover:text-white'
                    }`}
                  >
                    <span className="block font-bold text-sm">Standard Regular</span>
                    <span className="text-[10px] opacity-80 block mt-0.5">As indicated: base price</span>
                  </button>
                  <button
                    onClick={() => setPortionSize('Large')}
                    className={`p-3.5 rounded-lg text-left border text-sm font-semibold transition-all cursor-pointer ${
                      portionSize === 'Large'
                        ? 'bg-[#f4b400]/10 border-[#f4b400] text-[#f4b400]'
                        : 'bg-[#121212] border-[#FFF4E8]/10 text-[#FFF4E8]/60 hover:text-white'
                    }`}
                  >
                    <span className="block font-bold text-sm">Unleash Large (+ $1.50)</span>
                    <span className="text-[10px] opacity-85 block mt-0.5 font-mono">Larger size & calorie sizing</span>
                  </button>
                </div>
              </div>

              {/* Addons / Upgrades (strictly for burgers / combos) */}
              {(activeCustomizerItem.category === 'burgers' || activeCustomizerItem.category === 'combos') && (
                <div>
                  <span className="block text-xs font-mono font-bold text-[#FFF4E8]/40 uppercase tracking-widest mb-3">Customize Toppings</span>
                  <div className="space-y-2">
                    
                    <label className="flex items-center justify-between p-3 rounded-lg bg-[#FFF4E8]/5 hover:bg-[#FFF4E8]/10 border border-[#FFF4E8]/10 cursor-pointer select-none">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={extraPatty}
                          onChange={() => setExtraPatty(!extraPatty)}
                          className="w-5 h-5 rounded bg-black border-[#FFF4E8]/10 text-[#c62828] focus:ring-[#c62828]"
                        />
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">Extra Sizzled Meat Patty</span>
                      </div>
                      <span className="text-xs font-mono text-[#F4B400] font-black">+$2.50</span>
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-lg bg-[#FFF4E8]/5 hover:bg-[#FFF4E8]/10 border border-[#FFF4E8]/10 cursor-pointer select-none">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addBacon}
                          onChange={() => setAddBacon(!addBacon)}
                          className="w-5 h-5 rounded bg-black border-[#FFF4E8]/10 text-[#c62828] focus:ring-[#c62828]"
                        />
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">Applewood Smoked Hard Bacon</span>
                      </div>
                      <span className="text-xs font-mono text-[#F4B400] font-black">+$1.50</span>
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-lg bg-[#FFF4E8]/5 hover:bg-[#FFF4E8]/10 border border-[#FFF4E8]/10 cursor-pointer select-none">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={extraCheese}
                          onChange={() => setExtraCheese(!extraCheese)}
                          className="w-5 h-5 rounded bg-black border-[#FFF4E8]/10 text-[#c62828] focus:ring-[#c62828]"
                        />
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">Melted White Cheddar Slice</span>
                      </div>
                      <span className="text-xs font-mono text-[#F4B400] font-black font-mono">+$1.00</span>
                    </label>

                  </div>
                </div>
              )}

              {/* Secret sauces selections */}
              <div>
                <span className="block text-xs font-mono font-bold text-[#FFF4E8]/40 uppercase tracking-widest mb-2">House Sauces Selection</span>
                <select
                  value={sauceSelection}
                  onChange={(e) => setSauceSelection(e.target.value)}
                  className="w-full bg-[#121212] border border-[#FFF4E8]/10 rounded-lg py-3 px-3 text-sm text-neutral-200 focus:outline-none focus:border-[#c62828]"
                >
                  <option value="Secret Sizzling Aioli">Secret Sizzling Aioli (Recommended)</option>
                  <option value="Habanero Inferno Heat">Habanero Spicy Inferno Heat</option>
                  <option value="Truffle Garlic Herb Paste">Truffle Roast Garlic Yogurt Mayo</option>
                  <option value="Sweet Hickory BBQ">Sweet Hickory Maple BBQ</option>
                  <option value="Zesty Citrus Vinegar Sauce">No Sauce / Naked Dry</option>
                </select>
              </div>
            </div>

            {/* Modal Confirm bar */}
            <div className="p-6 border-t border-[#FFF4E8]/10 flex items-center justify-between bg-[#121212]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#FFF4E8]/40 block uppercase leading-none mb-1">Total Price</span>
                <span className="text-2xl font-display font-black text-[#F4B400] font-mono">${getCalculateCustomPrice().toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCloseCustomizer}
                  className="px-4 py-3 bg-[#FFF4E8]/5 hover:bg-[#FFF4E8]/10 text-[#FFF4E8]/60 hover:text-white border border-[#FFF4E8]/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAdd}
                  className="px-6 py-3 bg-[#c62828] text-white hover:bg-[#b02222] font-display font-black text-xs uppercase rounded-lg tracking-wider btn-shadow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  🛒 Add to Order
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
