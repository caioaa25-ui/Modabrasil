import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, getDoc, query, where, addDoc } from 'firebase/firestore';
import { Product, UserProfile, Order } from '../types';

// Produtos Dummy caso o banco esteja vazio
export const DUMMY_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Camiseta Brasil Oficial Amarela',
    description: 'Camiseta torcedor algodão premium.',
    basePrice: 89.90,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Amarelo'],
    stock: 100,
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=60']
  },
  {
    id: '2',
    name: 'Boné Aba Reta Verde',
    description: 'Boné estiloso com ajuste traseiro.',
    basePrice: 49.90,
    sizes: ['Único'],
    colors: ['Verde'],
    stock: 50,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60']
  },
  {
    id: '3',
    name: 'Agasalho Esportivo Azul',
    description: 'Conjunto completo para treino.',
    basePrice: 229.90,
    sizes: ['M', 'G'],
    colors: ['Azul'],
    stock: 20,
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60']
  }
];

export const getProducts = async (): Promise<Product[]> => {
  try {
    const q = query(collection(db, "products"));
    const snap = await getDocs(q);
    if (snap.empty) return DUMMY_PRODUCTS;
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  } catch (e) {
    console.error(e);
    return DUMMY_PRODUCTS;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const d = await getDoc(doc(db, "users", uid));
  return d.exists() ? d.data() as UserProfile : null;
};

export const createUserProfile = async (user: UserProfile) => {
  await setDoc(doc(db, "users", user.uid), user);
};

export const createOrder = async (order: Order) => {
  const docRef = await addDoc(collection(db, 'orders'), order);
  return docRef.id;
};

export const getOrdersBySeller = async (sellerId: string): Promise<Order[]> => {
  try {
    const q = query(collection(db, 'orders'), where('sellerId', '==', sellerId));
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
    // Sort client-side to avoid index requirement for demo
    return list.sort((a, b) => b.createdAt - a.createdAt);
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getOrdersByCustomer = async (customerId: string): Promise<Order[]> => {
  try {
    const q = query(collection(db, 'orders'), where('customerId', '==', customerId));
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
    // Sort client-side to avoid index requirement for demo
    return list.sort((a, b) => b.createdAt - a.createdAt);
  } catch (e) {
    console.error(e);
    return [];
  }
};