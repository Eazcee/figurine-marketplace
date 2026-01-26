// src/services/storage.js
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Upload image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} path - Storage path (e.g., 'listings/{listingId}/image.jpg')
 * @returns {Promise<string>} Download URL
 */
export async function uploadImage(file, path) {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return { url: downloadURL, error: null };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { url: null, error: error.message };
  }
}

/**
 * Upload product image
 * @param {File} file - The image file
 * @param {string} productId - Product ID (or 'temp' for new products)
 * @returns {Promise<string>} Download URL
 */
export async function uploadProductImage(file, productId = 'temp') {
  const filename = file.name || `image_${Date.now()}.${file.type.split('/')[1]}`;
  const path = `products/${productId}/${filename}`;
  return uploadImage(file, path);
}

/**
 * Upload listing image
 * @param {File} file - The image file
 * @param {string} listingId - Listing ID (or 'temp' for new listings)
 * @returns {Promise<string>} Download URL
 */
export async function uploadListingImage(file, listingId = 'temp') {
  const filename = file.name || `image_${Date.now()}.${file.type.split('/')[1]}`;
  const path = `listings/${listingId}/${filename}`;
  return uploadImage(file, path);
}

/**
 * Delete image from Firebase Storage
 * @param {string} path - Storage path
 */
export async function deleteImage(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { error: null };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { error: error.message };
  }
}

/**
 * Extract storage path from download URL
 * Useful for deleting images when you only have the URL
 */
export function getStoragePathFromUrl(url) {
  // Firebase Storage URLs contain the path, but we need to extract it
  // This is a helper - you might need to store the path separately
  const match = url.match(/\/o\/(.+)\?/);
  return match ? decodeURIComponent(match[1]) : null;
}
