// src/services/firestore.js
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  LISTINGS: 'listings',
};

// ========== USERS ==========
export async function createUserProfile(uid, userData) {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  await setDoc(userRef, {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }, { merge: true });
  return userRef;
}

export async function getUserProfile(uid) {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }
  return null;
}

// ========== PRODUCTS ==========
export async function getProducts() {
  const productsRef = collection(db, COLLECTIONS.PRODUCTS);
  const q = query(productsRef, orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export function subscribeToProducts(callback, onError) {
  const productsRef = collection(db, COLLECTIONS.PRODUCTS);
  const q = query(productsRef, orderBy('name'));
  return onSnapshot(
    q,
    (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(products);
    },
    (error) => {
      console.error('Firestore snapshot error:', error);
      if (onError) onError(error);
    }
  );
}

export async function getProduct(productId) {
  const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
  const productSnap = await getDoc(productRef);
  if (productSnap.exists()) {
    return { id: productSnap.id, ...productSnap.data() };
  }
  return null;
}

export async function createProduct(productData) {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error('Firestore createProduct error:', error);
    throw error;
  }
}

export async function updateProduct(productId, productData) {
  const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
  await updateDoc(productRef, {
    ...productData,
    updatedAt: new Date(),
  });
  return { id: productId, ...productData };
}

export async function deleteProduct(productId) {
  const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
  await deleteDoc(productRef);
  return true;
}

// ========== LISTINGS ==========
export async function getListings(filters = {}) {
  const listingsRef = collection(db, COLLECTIONS.LISTINGS);
  let q = query(listingsRef);
  
  if (filters.sellerId) {
    q = query(listingsRef, where('sellerId', '==', filters.sellerId));
  }
  
  if (filters.productId) {
    q = query(listingsRef, where('productId', '==', filters.productId));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export function subscribeToListings(callback, filters = {}) {
  const listingsRef = collection(db, COLLECTIONS.LISTINGS);
  let q = query(listingsRef);
  
  if (filters.sellerId) {
    q = query(listingsRef, where('sellerId', '==', filters.sellerId));
  }
  
  if (filters.productId) {
    q = query(listingsRef, where('productId', '==', filters.productId));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const listings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(listings);
  });
}

export async function createListing(listingData) {
  const listingsRef = collection(db, COLLECTIONS.LISTINGS);
  const docRef = await addDoc(listingsRef, {
    ...listingData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { id: docRef.id, ...listingData };
}

export async function updateListing(listingId, listingData) {
  const listingRef = doc(db, COLLECTIONS.LISTINGS, listingId);
  await updateDoc(listingRef, {
    ...listingData,
    updatedAt: new Date(),
  });
  return { id: listingId, ...listingData };
}

export async function deleteListing(listingId) {
  const listingRef = doc(db, COLLECTIONS.LISTINGS, listingId);
  await deleteDoc(listingRef);
  return true;
}
