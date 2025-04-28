import React from 'react';
import ProductList from './components/ProductList';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 text-center text-2xl font-bold">
        Anime Figure Marketplace
      </header>
      <ProductList />
    </div>
  );
}
