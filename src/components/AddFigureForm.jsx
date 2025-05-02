// src/components/AddFigureForm.jsx
import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { GET_FIGURES } from './ProductList';

const ADD_FIGURE = gql`
  mutation AddFigure($name: String!, $series: String, $price: Float!, $image: String!) {
    addFigure(name: $name, series: $series, price: $price, image: $image) {
      id name series price image
    }
  }
`;

const UPDATE_FIGURE = gql`
  mutation UpdateFigure($id: ID!, $name: String!, $series: String, $price: Float!, $image: String!) {
    updateFigure(id: $id, name: $name, series: $series, price: $price, image: $image) {
      id name series price image
    }
  }
`;

const DELETE_FIGURE = gql`
  mutation DeleteFigure($id: ID!) {
    deleteFigure(id: $id)
  }
`;

export default function AddFigureForm({
  initialData = null,    // if non-null, we’re in “edit” mode
  onSuccess,
  onError,
}) {
  const [form, setForm] = useState({
    name: '',
    series: '',
    price: '',
    image: '',
  });

  // Prefill when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        series: initialData.series,
        price: initialData.price,
        image: initialData.image,
      });
    }
  }, [initialData]);

  // Add mutation
  const [addFigure, addResult] = useMutation(ADD_FIGURE, {
    refetchQueries: [{ query: GET_FIGURES }],
    onCompleted: onSuccess,
    onError,
  });

  // Update mutation
  const [updateFigure, updateResult] = useMutation(UPDATE_FIGURE, {
    refetchQueries: [{ query: GET_FIGURES }],
    onCompleted: onSuccess,
    onError,
  });

  // Delete mutation
  const [deleteFigure, deleteResult] = useMutation(DELETE_FIGURE, {
    refetchQueries: [{ query: GET_FIGURES }],
    onCompleted: onSuccess,
    onError,
  });

  const onChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    const vars = {
      name: form.name,
      series: form.series,
      price: parseFloat(form.price),
      image: form.image,
    };

    if (initialData) {
      updateFigure({ variables: { id: initialData.id, ...vars } });
    } else {
      addFigure({ variables: vars });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this figure?')) {
      deleteFigure({ variables: { id: initialData.id } });
    }
  };

  const busy = addResult.loading || updateResult.loading || deleteResult.loading;
  const error = addResult.error || updateResult.error || deleteResult.error;

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

      <input
        name="image"
        value={form.image}
        onChange={onChange}
        placeholder="Image URL"
        required
        className="w-full mb-4 p-2 border rounded"
      />

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

      {error && <p className="mt-2 text-red-500">Error: {error.message}</p>}
    </form>
  );
}
