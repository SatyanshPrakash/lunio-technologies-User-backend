import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  image: string;
  productType: 'hardware' | 'software' | 'service';
  stockStatus: string;
  maxQuantity: number;
  selectedAttributes?: {
    color?: string;
    size?: string;
    [key: string]: string | undefined;
  };
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.salePrice || item.price;
    return sum + (price * item.quantity);
  }, 0);
  return { totalItems, totalPrice };
};

const loadCartFromStorage = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

const savedItems = loadCartFromStorage();
const { totalItems, totalPrice } = calculateTotals(savedItems);

const initialState: CartState = {
  items: savedItems,
  totalItems,
  totalPrice,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) => {
      const { quantity = 1, ...item } = action.payload;
      const existingItem = state.items.find(
        (i) => i.id === item.id &&
        JSON.stringify(i.selectedAttributes) === JSON.stringify(item.selectedAttributes)
      );

      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, item.maxQuantity);
        existingItem.quantity = newQuantity;
      } else {
        state.items.push({ ...item, quantity: Math.min(quantity, item.maxQuantity) });
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;

      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    removeFromCart: (state, action: PayloadAction<{ id: number; selectedAttributes?: CartItem['selectedAttributes'] }>) => {
      state.items = state.items.filter(
        (item) => !(item.id === action.payload.id &&
        JSON.stringify(item.selectedAttributes) === JSON.stringify(action.payload.selectedAttributes))
      );

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;

      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number; selectedAttributes?: CartItem['selectedAttributes'] }>) => {
      const item = state.items.find(
        (i) => i.id === action.payload.id &&
        JSON.stringify(i.selectedAttributes) === JSON.stringify(action.payload.selectedAttributes)
      );

      if (item) {
        item.quantity = Math.min(Math.max(1, action.payload.quantity), item.maxQuantity);
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;

      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;