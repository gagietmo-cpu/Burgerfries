export type ItemCategory = 'burgers' | 'fries' | 'combos' | 'drinks' | 'specials';

export interface MenuOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ItemCategory;
  calories: number;
  spiceLevel: number; // 0 to 3
  isVegetarian?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  customizationOptions?: MenuOption[];
}

export interface CustomSelections {
  extraPatty?: boolean;
  extraCheese?: boolean;
  addBacon?: boolean;
  sauceChoice?: string;
  drinkChoice?: string;
  sideChoice?: string;
}

export interface CartItem {
  id: string; // unique combination of item.id + customizations
  item: MenuItem;
  quantity: number;
  customSelections: CustomSelections;
  size: 'Regular' | 'Large';
  customPrice: number; // Single item price including add-ons
}

export type OrderStatus = 'pending' | 'preparing' | 'cooking' | 'delivering' | 'arrived' | 'canceled';

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  method: 'delivery' | 'pickup';
  address?: string;
  paymentMethod: 'applepay' | 'googlepay' | 'cod';
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  createdAt: string;
}

export interface UserLoyalty {
  email: string;
  phone: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'VIP';
  referrals: number;
  referralCode: string;
  claimedCodes: string[];
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  tag?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'ordering' | 'delivery' | 'ingredients' | 'rewards';
}
