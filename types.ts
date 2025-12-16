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
  balance?: number;
}

export interface Order {
  id?: string;
  customerId: string;
  customerName: string;
  sellerId?: string;
  sellerName?: string;
  items: CartItem[];
  totalAmount: number;
  commissionAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: number;
  paymentMethod: 'pix' | 'card';
  trackingCode?: string;
}