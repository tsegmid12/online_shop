import { createContext, useContext, useState, useEffect } from "react";
import { useShoppingItems } from "./ShoppingItemsContext";
import * as apiService from "../services/api";

const ShoppingCartContext = createContext({});

// Generate or get a persistent user ID for this browser
const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId);
  }
  return userId;
};

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [userId] = useState(getUserId());
  const [hasLoaded, setHasLoaded] = useState(false);
  const { products } = useShoppingItems();

  // Load cart from database on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cart = await apiService.getCart(userId);
        if (cart && cart.items && Array.isArray(cart.items)) {
          // Normalize cart items to ensure they have the right format
          const normalizedItems = cart.items.map((item) => ({
            productId: item.productId?._id || item.productId || item.id,
            id: item.productId?._id || item.productId || item.id,
            quantity: item.quantity || 0,
          }));
          setCartItems(normalizedItems);
        }
        setHasLoaded(true);
      } catch (error) {
        console.error("Error loading cart:", error);
        setHasLoaded(true);
      }
    };
    loadCart();
  }, [userId]);

  // Save cart to database whenever it changes (after initial load)
  useEffect(() => {
    if (!hasLoaded) return; // Don't save until we've loaded from database

    const saveCart = async () => {
      try {
        // Normalize items for saving - only send productId and quantity
        const itemsToSave = cartItems
          .filter((item) => item.quantity > 0)
          .map((item) => ({
            productId: item.productId || item.id,
            quantity: item.quantity,
          }));

        await apiService.saveCart(userId, itemsToSave);
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    };
    // Debounce the save to avoid too many requests
    const timeoutId = setTimeout(saveCart, 500);
    return () => clearTimeout(timeoutId);
  }, [cartItems, userId, hasLoaded]);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0,
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  function getItem(id) {
    return products.find((item) => {
      // Check against both _id (MongoDB) and id properties
      return (
        item._id === id ||
        item.id === id ||
        item._id?.toString() === id?.toString()
      );
    });
  }

  function getItemQuantity(id) {
    return (
      cartItems.find((item) => {
        return (
          item.productId === id ||
          item.id === id ||
          item.productId?.toString() === id?.toString()
        );
      })?.quantity || 0
    );
  }

  function increaseCartQuantity(id) {
    setCartItems((currItems) => {
      if (
        currItems.find((item) => item.productId === id || item.id === id) ==
        null
      ) {
        return [...currItems, { productId: id, id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.productId === id || item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQuantity(id) {
    setCartItems((currItems) => {
      if (
        currItems.find((item) => item.productId === id || item.id === id)
          ?.quantity === 1
      ) {
        return currItems.filter(
          (item) => item.productId !== id && item.id !== id,
        );
      } else {
        return currItems.map((item) => {
          if (item.productId === id || item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function removeFromCart(id) {
    setCartItems((currItems) => {
      return currItems.filter(
        (item) => item.productId !== id && item.id !== id,
      );
    });
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItem,
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        clearCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
        isOpen,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}
