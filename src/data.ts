import { MenuItem, Review, FAQItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'double-smash',
    name: 'Double Smash Burger',
    description: 'Two ultra-crisp grass-fed beef patties, double melted cheddar white cheese, grilled onions, pickles, and our signature secret dynamic sauce on a toasted shiny brioche bun.',
    price: 11.99,
    image: '/src/assets/images/hero_burger_1779602286825.png',
    category: 'burgers',
    calories: 780,
    spiceLevel: 0,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 1540,
    customizationOptions: [
      { id: 'patty', name: 'Extra Smash Patty', price: 2.50 },
      { id: 'bacon', name: 'Crispy Applewood Bacon', price: 1.50 },
      { id: 'cheese', name: 'Extra White Cheddar', price: 1.00 },
      { id: 'jalapenos', name: 'Sliced Jalapeños', price: 0.50 }
    ]
  },
  {
    id: 'crispy-bird',
    name: 'Crispy Bird Burger',
    description: 'Crispy hand-breaded golden chicken breast dunked in honey glaze, Swiss cheese, chipotle garlic aioli, dill pickle chips, and vinegar slaw on artisan brioche.',
    price: 10.99,
    image: '/src/assets/images/chicken_burger_1779602347085.png',
    category: 'burgers',
    calories: 690,
    spiceLevel: 1,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 784,
    customizationOptions: [
      { id: 'bacon', name: 'Crispy Applewood Bacon', price: 1.50 },
      { id: 'cheese', name: 'Extra Swiss Cheese', price: 1.00 },
      { id: 'avocado', name: 'Creamy Avocado', price: 1.50 }
    ]
  },
  {
    id: 'volcano-lava',
    name: 'Volcano Lava Inferno',
    description: 'Double custom spiced beef patties, ghost pepper jack cheese, crispy fried jalapeños, habanero dynamic jam, and sriracha aioli. Guaranteed to burn with pleasure!',
    price: 12.49,
    image: '/src/assets/images/hero_burger_1779602286825.png', // Fallback to hero
    category: 'burgers',
    calories: 840,
    spiceLevel: 3,
    rating: 4.7,
    reviewsCount: 412,
    customizationOptions: [
      { id: 'patty', name: 'Extra Custom Spiced Patty', price: 2.50 },
      { id: 'cheese', name: 'Extra Ghost Pepper Jack', price: 1.00 },
      { id: 'egg', name: 'Fried Sunny Egg', price: 1.50 }
    ]
  },
  {
    id: 'green-paradise',
    name: 'Green Paradise Veggie',
    description: 'Savory house-made black bean & red quinoa patty, melted provolone cheese, thick Hass avocado slice, tomatoes, romaine leaf, and herb lemon yogurt sauce.',
    price: 11.49,
    image: '/src/assets/images/chicken_burger_1779602347085.png', // Fallback
    category: 'burgers',
    calories: 520,
    spiceLevel: 0,
    isVegetarian: true,
    rating: 4.6,
    reviewsCount: 231,
    customizationOptions: [
      { id: 'cheese', name: 'Extra Provolone Cheese', price: 1.00 },
      { id: 'egg', name: 'Fried Sunny Egg', price: 1.50 },
      { id: 'avocado', name: 'Extra Avocado', price: 1.50 }
    ]
  },
  {
    id: 'loaded-cheese-fries',
    name: 'Loaded Cheese & Bacon Fries',
    description: 'Our signature crispy hand-cut skin-on fries drowned in warm sharp cheddar sauce, piled high with hickory smoked real slab bacon crumbles and sliced serrano peppers.',
    price: 7.99,
    image: '/src/assets/images/loaded_fries_1779602305654.png',
    category: 'fries',
    calories: 640,
    spiceLevel: 1,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 981,
    customizationOptions: [
      { id: 'extra-cheese', name: 'Double Cheese Drizzle', price: 1.25 },
      { id: 'extra-bacon', name: 'Extra Smoked Bacon Crumbles', price: 1.50 },
      { id: 'pulled-beef', name: 'Add Shredded Pit Beef', price: 2.50 }
    ]
  },
  {
    id: 'truffle-romano-fries',
    name: 'Truffle garlic & Romano Fries',
    description: 'Crispy rustic golden fries tossed heavily in white truffle oil, grated imported Pecorino Romano cheese, roasted minced garlic paste, and parsley flakes.',
    price: 6.99,
    image: '/src/assets/images/loaded_fries_1779602305654.png', // Fallback
    category: 'fries',
    calories: 510,
    spiceLevel: 0,
    rating: 4.8,
    reviewsCount: 542,
    customizationOptions: [
      { id: 'truffle-oil', name: 'Extra Truffle Infusion', price: 1.50 },
      { id: 'romano', name: 'Extra Pecorino Romano', price: 1.00 }
    ]
  },
  {
    id: 'ultimate-crave-combo',
    name: 'The Ultimate Crave Combo',
    description: 'Save 20%! Legendary Double Smash Burger cooked to premium perfection, paired with skin-on loaded fries and custom artisan craft cola or milkshake.',
    price: 18.99,
    image: '/src/assets/images/ultimate_combo_1779602327113.png',
    category: 'combos',
    calories: 1420,
    spiceLevel: 1,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 3120,
    customizationOptions: [
      { id: 'shake-upgrade', name: 'Upgrade Drink to Decadent Shake', price: 2.00 },
      { id: 'bacon', name: 'Add Bacon to Burger', price: 1.50 },
      { id: 'make-large', name: 'Size Up both Fries & Drink', price: 1.75 }
    ]
  },
  {
    id: 'double-inferno-combo',
    name: 'Spicy Inferno Fire-Feast',
    description: 'Craving intense fire? Volcano Lava Inferno Burger combined with spicy jalapeño Loaded Fries and a cooling craft lemonade. Fire in, satisfaction guaranteed.',
    price: 19.49,
    image: '/src/assets/images/ultimate_combo_1779602327113.png', // Fallback
    category: 'combos',
    calories: 1480,
    spiceLevel: 3,
    rating: 4.8,
    reviewsCount: 651,
    customizationOptions: [
      { id: 'make-large', name: 'Size Up both Fries & Drink', price: 1.75 },
      { id: 'extra-jalapeno', name: 'Double Inferno Toppings', price: 1.00 }
    ]
  },
  {
    id: 'choc-malt-shake',
    name: 'Decadent Chocolate Malt Shake',
    description: 'Prestige double-churned cocoa bean gelato, fresh whipped Jersey milk, caramelized malt flakes, chocolate drizzle cups, and a black cherry crown.',
    price: 5.99,
    image: '/src/assets/images/ultimate_combo_1779602327113.png', // Fallback style
    category: 'drinks',
    calories: 450,
    spiceLevel: 0,
    rating: 4.9,
    reviewsCount: 890,
    customizationOptions: [
      { id: 'malt', name: 'Extra Double Malt', price: 0.75 },
      { id: 'cherry', name: 'Add Extra Cherries', price: 0.50 }
    ]
  },
  {
    id: 'craft-house-lemonade',
    name: 'Craft Strawberry Lemonade',
    description: 'Squeezed fresh daily lemons infused with high-grade organic strawberry purée, cane sugar syrup, iced and garnished with fresh mint leaf spears.',
    price: 3.99,
    image: '/src/assets/images/ultimate_combo_1779602327113.png', // Fallback
    category: 'drinks',
    calories: 180,
    spiceLevel: 0,
    rating: 4.7,
    reviewsCount: 341,
    customizationOptions: [
      { id: 'mint', name: 'Extra Muddled Mint', price: 0.25 },
      { id: 'strawberry', name: 'Double Strawberry Base', price: 0.75 }
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Sarah M.',
    rating: 5,
    text: 'Best burger in the city by a mile. The smash patties are perfectly crispy on the edges and so unbelievably juicy on the inside. Those skin-on loaded fries changed my life. Ordering here three times a week now!',
    date: 'May 18, 2026',
    verified: true,
    tag: 'Double Smash Burger'
  },
  {
    id: 'rev-2',
    author: 'Marcus J.',
    rating: 5,
    text: 'I ordered the Ultimate Crave Combo and was blown away. The delivery took only 18 minutes, the burger was still steaming hot, and the fries were super crispy. Outstanding quality and incredible speed.',
    date: 'May 20, 2026',
    verified: true,
    tag: 'The Ultimate Crave Combo'
  },
  {
    id: 'rev-3',
    author: 'Elena K.',
    rating: 5,
    text: 'Finally, a veggie burger that doesn\'t taste like dry cardboard! The Green Paradise has so much flavor and the Hass avocado was generous and flawless. Also got reward points to get free premium milkshakes.',
    date: 'May 22, 2026',
    verified: true,
    tag: 'Green Paradise Veggie'
  },
  {
    id: 'rev-4',
    author: 'Derrick T.',
    rating: 5,
    text: 'If you like spicy, the Volcano Lava Inferno will blow your MIND. Pure habanero gold, and the pepper jack cheese makes it so creamy. The live order tracking on their web app was super accurate!',
    date: 'May 23, 2026',
    verified: true,
    tag: 'Volcano Lava Inferno'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How fast is your delivery and where do you deliver?',
    answer: 'We guarantee hot delivery in under 25 minutes to anyone within a 5-mile radius of our downtown kitchen locations. All orders are packed in optimized thermal-shield bags to ensure your smash burgers are sizzling and fries stay ultra-crispy.',
    category: 'delivery'
  },
  {
    id: 'faq-2',
    question: 'What makes your smash burgers unique?',
    answer: 'We start with custom-cut, grass-fed 100% Angus beef chuck and brisket blend. Everyday we hand-roll fresh balls which are smashed live at 450°F on a heavy cast-iron flat top. This caramelizes the juices, creating those iconic crispy lacy edges while keeping the meat juicy.',
    category: 'ingredients'
  },
  {
    id: 'faq-3',
    question: 'How do I earn and redeem loyalty points?',
    answer: 'Simply enter your email/phone number to instantly join our Smash Club. You obtain 10 points for every dollar spent. At 500 points, you can claim free fries; at 1000 points, you get any gourmet milkshake; at 1500 points, get any premium burger for free!',
    category: 'rewards'
  },
  {
    id: 'faq-4',
    question: 'Do you offer contactless pickup or curbside dispatch?',
    answer: 'Yes! Select "Pickup" at checkout and insert your car details. Upon arrival, parking in our numbered bays triggers our notification, and a team member will dispatch the sizzling order right to your trunk or passenger window.',
    category: 'ordering'
  }
];
