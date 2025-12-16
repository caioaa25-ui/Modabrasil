import { db, storage } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfile, Product, Order, Withdrawal } from '../types';

// User Services
export const createUserProfile = async (user: UserProfile) => {
  await setDoc(doc(db, "users", user.uid), user);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const q = query(collection(db, "users"));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as UserProfile);
};

export const deleteUser = async (uid: string) => {
  await deleteDoc(doc(db, "users", uid));
};

// Product Services
export const addProduct = async (product: Product) => {
  const docRef = await addDoc(collection(db, "products"), product);
  return docRef.id;
};

export const getProducts = async (): Promise<Product[]> => {
  const q = query(collection(db, "products"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  await updateDoc(doc(db, "products", id), data);
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, "products", id));
};

// Order Services
export const createOrder = async (order: Order) => {
  const docRef = await addDoc(collection(db, "orders"), order);
  return docRef.id;
};

export const getOrdersByCustomer = async (uid: string): Promise<Order[]> => {
  const q = query(collection(db, "orders"), where("customerId", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
};

export const getOrdersBySeller = async (uid: string): Promise<Order[]> => {
  const q = query(collection(db, "orders"), where("sellerId", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
};

export const getAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
};

// Admin Services
export const getAllSellers = async (): Promise<UserProfile[]> => {
  const q = query(collection(db, "users"), where("role", "==", "seller"));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as UserProfile);
};

export const approveSeller = async (uid: string) => {
  await updateDoc(doc(db, "users", uid), { approved: true });
};

// Financial Services (Withdrawals)
export const getPendingWithdrawals = async (): Promise<Withdrawal[]> => {
  // In a real app, create a 'withdrawals' collection. For now, assuming we query orders or a specific collection
  // Creating a dedicated collection for withdrawals is best practice.
  // Since we don't have a 'createWithdrawal' in the previous step, I will assume it exists or use a mock logic if empty
  // But strictly following the prompt, let's assume we query the 'withdrawals' collection
  const q = query(collection(db, "withdrawals"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Withdrawal));
};

export const approveWithdrawal = async (id: string) => {
  await updateDoc(doc(db, "withdrawals", id), { status: 'approved' });
};

// Image Upload
export const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};