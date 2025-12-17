
export interface Product {
  id?: string;
  name: string;
  description: string;
  basePrice: number;
  sizes: string[];
  colors: string[];
  stock: number;
  images: string[];
}

export interface CartItem extends Product {
  cartId: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'customer';
  
  // Sistema de Afiliados
  affiliateCode?: string; // Código único (ex: JOAO123)
  referredBy?: string;    // UID de quem indicou este usuário
  walletBalance?: number; // Saldo disponível para saque
  pixKey?: string;        // Chave pix para recebimento
}

export interface Order {
  id?: string;
  customerId: string;
  customerName: string;
  sellerId?: string; // ID do vendedor (Loja parceira)
  sellerName?: string;
  affiliateId?: string; // ID do afiliado (Quem indicou o cliente)
  items: CartItem[];
  totalAmount: number;
  commissionAmount: number; // Comissão do vendedor/loja
  affiliateCommission?: number; // Comissão do afiliado
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: number;
  paymentMethod: 'pix' | 'card';
  trackingCode?: string;
}

export interface AffiliateClick {
  id?: string;
  affiliateCode: string;
  affiliateId: string;
  timestamp: number;
  userAgent: string;
  origin: string;
}

export interface Commission {
  id?: string;
  affiliateId: string; // Quem recebe
  fromUserId: string;  // Quem comprou
  fromUserName: string;
  orderId: string;
  orderTotal: number;
  amount: number;      // Valor da comissão
  percentage: number;  // % aplicada
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  createdAt: number;
}
