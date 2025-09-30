import { useState } from 'react';
import ProductDetails from '../components/productDetailsHardware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  colors: { name: string; value: string; image: string }[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  category: string;
}

function ProductInfoHardware() {
  const [currentPage, setCurrentPage] = useState<'product' | 'checkout'>('product');
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 299.99,
      quantity: 1,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
      color: 'Black'
    },
    {
      id: '2',
      name: 'Organic Cotton T-Shirt',
      price: 49.99,
      quantity: 2,
      image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300',
      size: 'Medium',
      color: 'White'
    },
    {
      id: '3',
      name: 'Minimalist Watch',
      price: 179.99,
      quantity: 1,
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ]);

  
  const product: Product = {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1037999/pexels-photo-1037999.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Experience premium audio quality with our flagship wireless headphones. Featuring advanced noise cancellation, 30-hour battery life, and studio-quality sound reproduction.',
    features: [
      'Active Noise Cancellation with Transparency Mode',
      '30-hour battery life with quick charge',
      'Premium leather and aluminum construction',
      'Spatial audio with dynamic head tracking',
      'Professional-grade 40mm drivers',
      'Multi-device connectivity'
    ],
    specifications: {
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Battery Life': '30 hours',
      'Charging Time': '2 hours',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.2, USB-C'
    },
    colors: [
      { name: 'Midnight Black', value: '#1a1a1a', image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300' },
      { name: 'Silver', value: '#c0c0c0', image: 'https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=300' },
      { name: 'Rose Gold', value: '#e8b4a0', image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=300' }
    ],
    sizes: [],
    rating: 4.8,
    reviewCount: 2847,
    inStock: true,
    category: 'Audio'
  };


  const addToCart = (productId: string, selectedColor: string, quantity: number) => {
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0],
        color: selectedColor
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const goToCheckout = () => {
    setCurrentPage('checkout');
  };

  if (currentPage === 'product') {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProductDetails 
          product={product} 
          onAddToCart={addToCart}
          onGoToCheckout={goToCheckout}
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        />
      </div>
    );
  }
}

export default ProductInfoHardware;