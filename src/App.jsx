// src/App.jsx
import React, { useState } from 'react';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import CartModal from './components/CartModal';
import AddFigureForm from './components/AddFigureForm';
import ProductList from './components/ProductList';
import Login from './components/Login';

export default function App() {
  const { currentUser, signOut } = useAuth();

  // If no user, show login page
  if (!currentUser) {
    return <Login />;
  }
  // State for showing Add/Edit form modal
  const [showForm, setShowForm] = useState(false);
  const [editingFigure, setEditingFigure] = useState(null);

  // State for showing Cart modal
  const [showCart, setShowCart] = useState(false);

  // Toast message state
  const [toast, setToast] = useState(null);

  // Alert banner state (add/edit success/failure)
  const [alert, setAlert] = useState(null);

  // Cart badge count
  const { totalItems } = useCart();

  // Show a temporary toast
  const showToast = message => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  // onSuccess for add/edit
  const handleSuccess = () => {
    setAlert('success');
    setShowForm(false);
    setEditingFigure(null);
    setTimeout(() => setAlert(null), 3000);
  };

  // onError for add/edit
  const handleError = () => {
    setAlert('error');
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Header with cart icon & badge */}
      <header className="relative bg-white shadow p-4 text-center text-2xl font-bold">
        Anime Figure Marketplace
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <button
            onClick={signOut}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Sign Out
          </button>
          <button
            onClick={() => setShowCart(true)}
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Alert banner */}
      {alert === 'success' && (
        <div className="bg-green-500 text-white text-center py-2">
          ✅ Operation successful!
        </div>
      )}
      {alert === 'error' && (
        <div className="bg-red-500 text-white text-center py-2">
          ❌ Operation failed. Please try again.
        </div>
      )}

      {/* Add Figure button */}
      <div className="p-4 flex justify-center">
        <button
          onClick={() => {
            setEditingFigure(null);
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Add Figure
        </button>
      </div>

      {/* Add/Edit Figure Modal */}
      {(showForm || editingFigure) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingFigure(null);
              }}
              className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <AddFigureForm
              initialData={editingFigure}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && <CartModal onClose={() => setShowCart(false)} />}

      {/* Product Grid */}
      <ProductList
        onEdit={fig => setEditingFigure(fig)}
        onAdd={() => showToast('Added to cart!')}
      />
    </div>
  );
}
