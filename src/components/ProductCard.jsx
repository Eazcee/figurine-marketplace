// src/components/ProductCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ figure, onClick, onEdit, onAdd }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(figure);
    onAdd && onAdd(); // trigger toast
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col w-full max-w-xs min-h-[350px]">
      {/* Edit button */}
      <button
        onClick={() => onEdit && onEdit(figure)}
        className="absolute top-2 right-2 z-10 bg-white bg-opacity-75 p-1 rounded-full hover:bg-opacity-100 transition"
      >
        ✏️
      </button>

      {/* Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <img
          src={figure.image}
          alt={figure.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Details & Actions */}
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold">{figure.name}</h2>
        <p className="text-gray-500 text-sm">{figure.series}</p>
        <p className="mt-auto text-blue-600 font-bold">${figure.price}</p>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => onClick && onClick(figure)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View Details
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
