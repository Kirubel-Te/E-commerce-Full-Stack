import type { ProductType } from "./products"

export type CartItemType = ProductType & {
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