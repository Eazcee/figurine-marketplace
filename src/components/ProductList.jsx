// src/components/ProductList.jsx
import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import ProductCard from './ProductCard';

export const GET_FIGURES = gql`
  query GetFigures {
    figures {
      id
      name
      price
      image
      series
    }
  }
`;

export default function ProductList({ onEdit, onAdd }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFigure, setSelectedFigure] = useState(null);

  const { loading, error, data } = useQuery(GET_FIGURES, {
    fetchPolicy: 'network-only',
  });

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error.message}</p>;

  const filtered = data.figures.filter(fig =>
    fig.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Search Bar */}
      <div className="p-6">
        <input
          type="text"
          placeholder="Search figures..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
        />
      </div>

      {/* No Results / Grid */}
      {filtered.length === 0 ? (
        <p className="p-6 text-center text-gray-500">
          No figures found for "{searchTerm}".
        </p>
      ) : (
        <div className="
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
            gap-6 p-6 justify-items-center items-center
          ">
          {filtered.map(fig => (
            <ProductCard
              key={fig.id}
              figure={fig}
              onClick={() => setSelectedFigure(fig)}
              onEdit={onEdit}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedFigure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative">
            <button
              onClick={() => setSelectedFigure(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <div className="flex justify-center items-center mb-4 h-64 overflow-hidden bg-gray-100 rounded-lg">
              <img
                src={selectedFigure.image}
                alt={selectedFigure.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">
              {selectedFigure.name}
            </h2>
            <p className="text-gray-600">{selectedFigure.series}</p>
            <p className="mt-2 text-blue-600 font-bold">
              ${selectedFigure.price}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
