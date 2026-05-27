import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Product, ProductVariant } from "@/data/products";
import { toast } from "@/hooks/use-toast";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedVariant?: ProductVariant) => void;
  removeItem: (productId: string, variantLabel?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantLabel?: string) => void;
  clear: () => void;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "olvi_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const itemKey = (productId: string, variantLabel?: string) =>
    productId + (variantLabel ? `__${variantLabel}` : "");

  const addItem = (product: Product, quantity = 1, selectedVariant?: ProductVariant) => {
    const key = itemKey(product.id, selectedVariant?.label);
    setItems(prev => {
      const existing = prev.find(i => itemKey(i.product.id, i.selectedVariant?.label) === key);
      if (existing) {
        return prev.map(i => itemKey(i.product.id, i.selectedVariant?.label) === key
          ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { product, quantity, selectedVariant }];
    });
    const label = selectedVariant ? ` (${selectedVariant.label})` : "";
    toast({ title: "Додано до кошика", description: product.name + label });
  };

  const removeItem = (productId: string, variantLabel?: string) => {
    const key = itemKey(productId, variantLabel);
    setItems(prev => prev.filter(i => itemKey(i.product.id, i.selectedVariant?.label) !== key));
  };

  const updateQuantity = (productId: string, quantity: number, variantLabel?: string) => {
    if (quantity <= 0) return removeItem(productId, variantLabel);
    const key = itemKey(productId, variantLabel);
    setItems(prev => prev.map(i => itemKey(i.product.id, i.selectedVariant?.label) === key
      ? { ...i, quantity } : i));
  };

  const clear = () => setItems([]);

  const { totalCount, totalPrice } = useMemo(() => ({
    totalCount: items.reduce((s, i) => s + i.quantity, 0),
    totalPrice: items.reduce((s, i) => s + i.quantity * (i.selectedVariant?.price ?? i.product.price), 0),
  }), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
