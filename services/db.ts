
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, getDoc, query, where, addDoc, deleteDoc, updateDoc, increment, runTransaction } from 'firebase/firestore';
import { Product, UserProfile, Order, AffiliateClick, Commission } from '../types';

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

// --- PRODUTOS ---
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

export const addProduct = async (product: Product) => {
  await addDoc(collection(db, "products"), product);
};

export const deleteProduct = async (productId: string) => {
  await deleteDoc(doc(db, "products", productId));
};

// --- USUÁRIOS & AFILIADOS ---

// Gera um código único baseado no nome + caracteres aleatórios
const generateUniqueAffiliateCode = (name: string): string => {
  const cleanName = name.split(' ')[0].replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 5);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName}${random}`;
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const d = await getDoc(doc(db, "users", uid));
  return d.exists() ? d.data() as UserProfile : null;
};

export const createUserProfile = async (user: UserProfile) => {
  // 1. Gera código de afiliado se não existir
  if (!user.affiliateCode) {
    user.affiliateCode = generateUniqueAffiliateCode(user.name || 'USER');
  }
  
  // 2. Verifica se existe indicação no LocalStorage
  const refCode = localStorage.getItem('moda_brasil_ref');
  if (refCode && !user.referredBy) {
    // Busca o UID do dono do código
    const q = query(collection(db, "users"), where("affiliateCode", "==", refCode));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      const referrerId = snap.docs[0].id;
      // Previne auto-referência
      if (referrerId !== user.uid) {
        user.referredBy = referrerId;
      }
    }
  }

  // 3. Inicializa saldo
  user.walletBalance = 0;

  await setDoc(doc(db, "users", user.uid), user);
  
  // Limpa o ref após uso
  if (user.referredBy) {
    localStorage.removeItem('moda_brasil_ref');
  }
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => d.data() as UserProfile);
};

export const deleteUser = async (uid: string) => {
  await deleteDoc(doc(db, "users", uid));
};

// --- SISTEMA DE AFILIADOS (Cliques e Métricas) ---

export const recordAffiliateClick = async (refCode: string) => {
  // Evita flood de cliques (simples debounce via sessionStorage)
  const sessionKey = `click_recorded_${refCode}`;
  if (sessionStorage.getItem(sessionKey)) return;

  try {
    // Busca quem é o afiliado
    const q = query(collection(db, "users"), where("affiliateCode", "==", refCode));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const affiliateId = snap.docs[0].id;
      
      const clickData: AffiliateClick = {
        affiliateCode: refCode,
        affiliateId,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        origin: window.location.pathname
      };

      await addDoc(collection(db, "affiliate_clicks"), clickData);
      sessionStorage.setItem(sessionKey, 'true');
      console.log('Clique de afiliado registrado:', refCode);
    }
  } catch (e) {
    console.error("Erro ao registrar clique:", e);
  }
};

export const getAffiliateStats = async (uid: string) => {
  try {
    // 1. Total de Cliques
    const clicksQuery = query(collection(db, "affiliate_clicks"), where("affiliateId", "==", uid));
    const clicksSnap = await getDocs(clicksQuery);
    
    // 2. Total de Indicados (Cadastros)
    const referralsQuery = query(collection(db, "users"), where("referredBy", "==", uid));
    const referralsSnap = await getDocs(referralsQuery);

    // 3. Comissões
    const commsQuery = query(collection(db, "commissions"), where("affiliateId", "==", uid));
    const commsSnap = await getDocs(commsQuery);
    const commissions = commsSnap.docs.map(d => d.data() as Commission);

    const pending = commissions.filter(c => c.status === 'pending').reduce((acc, c) => acc + c.amount, 0);
    const totalEarned = commissions.filter(c => c.status === 'paid' || c.status === 'approved').reduce((acc, c) => acc + c.amount, 0);

    return {
      clicks: clicksSnap.size,
      referrals: referralsSnap.size,
      referralsList: referralsSnap.docs.map(d => d.data() as UserProfile),
      commissionsList: commissions.sort((a,b) => b.createdAt - a.createdAt),
      pendingBalance: pending,
      totalEarned: totalEarned
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};

// --- PEDIDOS & COMISSÕES ---

export const createOrder = async (order: Order) => {
  try {
    // Verifica se o comprador tem um afiliado (referredBy)
    const userProfile = await getUserProfile(order.customerId);
    
    let affiliateId = null;
    let affiliateCommission = 0;

    // Se o usuário foi indicado por alguém, calcula comissão (EX: 5%)
    if (userProfile && userProfile.referredBy) {
      affiliateId = userProfile.referredBy;
      affiliateCommission = order.totalAmount * 0.05; // 5% de comissão padrão
      
      order.affiliateId = affiliateId;
      order.affiliateCommission = affiliateCommission;
    }

    // Cria o pedido
    const orderRef = await addDoc(collection(db, 'orders'), order);

    // Se houve afiliado, REGISTRA A COMISSÃO
    if (affiliateId && affiliateCommission > 0) {
      const commission: Commission = {
        affiliateId,
        fromUserId: order.customerId,
        fromUserName: order.customerName,
        orderId: orderRef.id,
        orderTotal: order.totalAmount,
        amount: affiliateCommission,
        percentage: 5,
        status: 'pending', // Fica pendente até o pedido ser pago/entregue
        createdAt: Date.now()
      };
      await addDoc(collection(db, "commissions"), commission);
      
      // Opcional: Atualizar saldo pendente do usuário (se tiver campo no DB para isso)
      // Por enquanto calculamos o saldo on-the-fly em getAffiliateStats
    }

    return orderRef.id;
  } catch (e) {
    console.error("Erro ao processar pedido e comissão:", e);
    throw e;
  }
};

export const getOrdersBySeller = async (sellerId: string): Promise<Order[]> => {
  try {
    const q = query(collection(db, 'orders'), where('sellerId', '==', sellerId));
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
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
    return list.sort((a, b) => b.createdAt - a.createdAt);
  } catch (e) {
    console.error(e);
    return [];
  }
};
