import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product, CartItem } from '../types';
import toast from 'react-hot-toast';

interface CartContextType {
  items: CartItem[];
  customerId: number | null;
  setCustomerId: (id: number | null) => void;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<number | null>(1); // Default to first customer

  const addItem = (product: Product, quantity: number = 1) => {
    if (product.stock_quantity <= 0) {
      toast.error(`${product.product_name} is out of stock!`);
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.product.product_id === product.product_id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock_quantity) {
          toast.error(`Cannot add more. Only ${product.stock_quantity} available.`);
          return prev;
        }
        toast.success(`Updated ${product.product_name} quantity`);
        return prev.map((item) =>
          item.product.product_id === product.product_id
            ? { ...item, quantity: newQty }
            : item
        );
      } else {
        if (quantity > product.stock_quantity) {
          toast.error(`Only ${product.stock_quantity} available in stock.`);
          return prev;
        }
        toast.success(`Added ${product.product_name} to cart`);
        return [
          ...prev,
          {
            product,
            quantity,
            unit_price: Number(product.unit_price),
          },
        ];
      }
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.product_id === productId) {
          if (quantity > item.product.stock_quantity) {
            toast.error(`Only ${item.product.stock_quantity} items in stock.`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.product_id !== productId));
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        customerId,
        setCustomerId,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
