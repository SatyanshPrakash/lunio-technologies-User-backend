import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import Home from '../pages/home';
import { ProductsPage } from '../pages/products';
import ProductInfoHardware from '../pages/productInfoHardware';
import Blogs from '../pages/blogs';
import Blog from '../pages/blog';
import RewardsPage from '../pages/rewards';
import { OrderHistory } from '../pages/orderHistory';
import { OrderDetails } from '../pages/orderDetails';
import { LoginPage } from '../pages/login';
import { ProfilePage } from '../pages/profile';
import { KYCPage } from '../pages/kyc';
import type { Order } from '../types';

interface AppRoutesProps {
  selectedOrder: Order | null;
  onOrderSelect: (order: Order) => void;
  onBackToHistory: () => void;
  mockOrders: Order[];
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = ({ selectedOrder, onOrderSelect, onBackToHistory, mockOrders }: AppRoutesProps) => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductInfoHardware />} />
      <Route path="/product-details" element={<ProductInfoHardware />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blog/:id" element={<Blog />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/rewards" element={<RewardsPage />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/kyc"
        element={
          <ProtectedRoute>
            <KYCPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-history"
        element={
          <ProtectedRoute>
            <OrderHistory orders={mockOrders} onOrderSelect={onOrderSelect} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-details"
        element={
          <ProtectedRoute>
            {selectedOrder ? (
              <OrderDetails order={selectedOrder} onBack={onBackToHistory} />
            ) : (
              <Navigate to="/order-history" replace />
            )}
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};