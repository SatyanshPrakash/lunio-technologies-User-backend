import { useState } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { store } from './store';
import { AppRoutes } from './routes';
import { NavbarSection } from './components/navbar';
import { Topbar } from './components/topbar';
import { CTASection } from './components/deliverTo/CTASection';
import { Footer } from './components/footer';
import { CartDrawer } from './components/cart/CartDrawer';
import type { Order } from './types';

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    estimatedDelivery: '2024-01-20',
    total: 299.99,
    paymentMethod: 'Visa ****1234',
    status: 'Delivered',
    products: [
      {
        id: 'p1',
        name: 'Wireless Bluetooth Headphones',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200',
        price: 199.99,
        quantity: 1
      },
      {
        id: 'p2',
        name: 'Smartphone Case',
        image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=200',
        price: 99.99,
        quantity: 1
      }
    ],
    billingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    }
  },
  {
    id: 'ORD-002',
    date: '2024-01-15',
    estimatedDelivery: '2024-01-20',
    total: 299.99,
    paymentMethod: 'Visa ****1234',
    status: 'Shipped',
    products: [
      {
        id: 'p1',
        name: 'Wireless Bluetooth Headphones',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200',
        price: 199.99,
        quantity: 1
      },
      {
        id: 'p2',
        name: 'Smartphone Case',
        image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=200',
        price: 99.99,
        quantity: 1
      }
    ],
    billingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    }
  },
  {
    id: 'ORD-003',
    date: '2024-01-15',
    estimatedDelivery: '2024-01-20',
    total: 299.99,
    paymentMethod: 'Visa ****1234',
    status: 'Pending',
    products: [
      {
        id: 'p1',
        name: 'Wireless Bluetooth Headphones',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200',
        price: 199.99,
        quantity: 1
      },
      {
        id: 'p2',
        name: 'Smartphone Case',
        image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=200',
        price: 99.99,
        quantity: 1
      }
    ],
    billingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    }
  }
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && (
        <>
          <Topbar />
          <NavbarSection />
          <CTASection />
        </>
      )}
      {children}
      {!isLoginPage && <Footer />}
    </>
  );
};

const AppContent = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleBackToHistory = () => {
    setSelectedOrder(null);
  };

  return (
    <>
      <Layout>
        <AppRoutes
          selectedOrder={selectedOrder}
          onOrderSelect={handleOrderSelect}
          onBackToHistory={handleBackToHistory}
          mockOrders={mockOrders}
        />
      </Layout>
      <CartDrawer />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;