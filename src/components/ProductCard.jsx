// src/components/ProductCard.jsx
import React from 'react';

export default function ProductCard({ figure, onClick }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      <img
        src={figure.image}
        alt={figure.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold">{figure.name}</h2>
        <p className="text-gray-500 text-sm">{figure.series}</p>
        <p className="mt-auto text-blue-600 font-bold">${figure.price}</p>
        <button
          onClick={onClick}
          className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
