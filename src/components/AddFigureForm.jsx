// src/components/AddFigureForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../hooks/useProducts';
import { uploadProductImage } from '../services/storage';

export default function AddFigureForm({
  initialData = null,    // if non-null, we're in "edit" mode
  onSuccess,
  onError,
}) {
  const [form, setForm] = useState({
    name: '',
    series: '',
    price: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { addProduct, updateProduct, deleteProduct } = useProducts();

  // Prefill when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        series: initialData.series || '',
        price: initialData.price || '',
        image: initialData.image || '',
      });
      setImagePreview(initialData.image || null);
    }
  }, [initialData]);

  const onChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      setError(null);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      // Clear URL input when file is selected
      setForm({ ...form, image: '' });
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      let imageUrl = form.image; // Use URL if provided

      // Upload file if selected
      if (imageFile) {
        const productId = initialData?.id || `temp_${Date.now()}`;
        const uploadResult = await uploadProductImage(imageFile, productId);
        if (uploadResult.error) {
          setError(`Image upload failed: ${uploadResult.error}`);
          onError?.();
          setBusy(false);
          return;
        }
        imageUrl = uploadResult.url;
      }

      // Validate that we have an image URL
      if (!imageUrl) {
        setError('Please provide an image (upload file or enter URL)');
        onError?.();
        setBusy(false);
        return;
      }

      const productData = {
        name: form.name,
        series: form.series || '',
        price: parseFloat(form.price),
        image: imageUrl,
        imageUrl: imageUrl, // Store as imageUrl as requested
      };

      if (initialData) {
        const result = await updateProduct(initialData.id, productData);
        if (result.error) {
          setError(result.error);
          onError?.();
        } else {
          onSuccess?.();
        }
      } else {
        const result = await addProduct(productData);
        if (result.error) {
          setError(result.error);
          onError?.();
        } else {
          onSuccess?.();
        }
      }
    } catch (err) {
      setError(err.message);
      onError?.();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this figure?')) {
      setBusy(true);
      setError(null);
      try {
        const result = await deleteProduct(initialData.id);
        if (result.error) {
          setError(result.error);
          onError?.();
        } else {
          onSuccess?.();
        }
      } catch (err) {
        setError(err.message);
        onError?.();
      } finally {
        setBusy(false);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="p-6 bg-white rounded-lg shadow-md relative">
      {/* Delete button in edit mode */}
      {initialData && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-2 left-2 text-red-500 hover:text-red-700"
        >
          🗑️
        </button>
      )}

      <h3 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit Figure' : 'Add New Figure'}
      </h3>

      <input
        name="name"
        value={form.name}
        onChange={onChange}
        placeholder="Name"
        required
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        name="series"
        value={form.series}
        onChange={onChange}
        placeholder="Series"
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        name="price"
        type="number"
        step="0.01"
        value={form.price}
        onChange={onChange}
        placeholder="Price"
        required
        className="w-full mb-2 p-2 border rounded"
      />

      {/* Image Upload Section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        
        {/* File Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mb-2 p-2 border rounded"
        />

        {/* Or URL Input */}
        <p className="text-xs text-gray-500 mb-2 text-center">OR</p>
        <input
          name="image"
          value={form.image}
          onChange={onChange}
          placeholder="Image URL"
          disabled={!!imageFile}
          className="w-full p-2 border rounded disabled:bg-gray-100"
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-2 relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-contain border rounded"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        className={`
          w-full py-2 rounded-lg text-white transition
          ${initialData ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
        `}
      >
        {busy
          ? initialData
            ? 'Saving...'
            : 'Adding...'
          : initialData
          ? 'Save Changes'
          : 'Add Figure'}
      </button>

      {error && <p className="mt-2 text-red-500">Error: {typeof error === 'string' ? error : error?.message || 'An error occurred'}</p>}
    </form>
  );
}
