export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Feminino' | 'Masculino' | 'Acessórios';
  images: string[];
  sizes: string[];
  stock: number;
  featured?: boolean;
}

export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin';
}
