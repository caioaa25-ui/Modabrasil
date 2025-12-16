export type UserRole = 'admin' | 'seller' | 'customer';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  approved: boolean; // For sellers
  balance: number; // For sellers
  createdAt: number;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  basePrice: number;
  sizes: string[];
  colors: string[];
  stock: number;
  images: string[];
  category?: string;
}

export interface CartItem extends Product {
  cartId: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id?: string;
  customerId: string;
  customerName: string;
  sellerId?: string; // If bought through a seller
  sellerName?: string;
  items: CartItem[];
  totalAmount: number;
  commissionAmount: number; // 0 if no seller
  status: OrderStatus;
  trackingCode?: string;
  createdAt: number;
  paymentMethod: 'pix' | 'card';
}

export interface Withdrawal {
  id?: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  pixKey: string;
  createdAt: number;
}