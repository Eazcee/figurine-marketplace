// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { subscribeToProducts, createProduct, updateProduct, deleteProduct } from '../services/firestore';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = subscribeToProducts(
        (productsData) => {
          setProducts(productsData);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Firestore subscription error:', error);
          setError(error.message);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('Error setting up products subscription:', err);
      setError(err.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const addProduct = async (productData) => {
    try {
      await createProduct(productData);
      return { error: null };
    } catch (err) {
      console.error('Error adding product:', err);
      return { error: err.message || 'Failed to add product. Check Firestore security rules.' };
    }
  };

  const updateProductById = async (productId, productData) => {
    try {
      await updateProduct(productId, productData);
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  };

  const deleteProductById = async (productId) => {
    try {
      await deleteProduct(productId);
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct: updateProductById,
    deleteProduct: deleteProductById,
  };
}
