export interface Event {
  id: string;
  name: string;
  description: string;
  image: string;
  date: string;
  location: string;
  price: number;
  type: 'event' | 'establishment';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface PurchasedItem extends MenuItem {
  purchaseId: string;
  purchasedAt: string;
  used: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
}
