export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

// export interface Product {
//   quantity: number;
//   name: string | undefined;
//   id: number;
//   title: string;
//   price: string;
//   image: string;
//   rating: number;
//   reviews: number;
// }

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}


export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  estimatedDelivery: string;
  total: number;
  paymentMethod: string;
  status: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  products: Product[];
  billingAddress: Address;
  shippingAddress: Address;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
