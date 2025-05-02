// src/components/CartModal.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartModal({ onClose }) {
  const { items, removeFromCart, clearCart, totalItems } = useCart();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold mb-4">Your Cart ({totalItems})</h2>

        {/* Empty state */}
        {items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            {/* Item list */}
            <ul className="space-y-4 mb-6">
              {items.map(({ figure, quantity }) => (
                <li key={figure.id} className="flex items-center space-x-4">
                  <img
                    src={figure.image}
                    alt={figure.name}
                    className="h-12 w-12 object-contain bg-gray-100 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{figure.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {quantity} × ${figure.price}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(figure.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex justify-between">
              <button
                onClick={clearCart}
                className="text-gray-700 hover:underline"
              >
                Clear Cart
              </button>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
