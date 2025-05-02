// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Custom hook to consume cart context
export function useCart() {
  return useContext(CartContext);
}

const initialState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      if (state.items.find(i => i.figure.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, { figure: action.payload, quantity: 1 }],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.figure.id !== action.payload),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = figure => dispatch({ type: 'ADD_ITEM', payload: figure });
  const removeFromCart = id => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, addToCart, removeFromCart, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}
