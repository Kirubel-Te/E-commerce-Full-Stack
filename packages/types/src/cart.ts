import type { Product } from "@repo/db";

export type CartItemType = Product & {
    quantity:number;
    selectedSize: string;
    selectedColor: string;
}

export type CartItemsType = CartItemType[]
export type CartStoreStateType = {
  cart: CartItemsType;
  hasHydrated: boolean;
};

export type CartStoreActionsType = {
  addToCart: (product: CartItemType) => void;
  removeFromCart: (product: CartItemType) => void;
  clearCart: () => void;
};