import Home from "./pages/home";
import { useState } from "react";
import type { Order } from "./types";
import Blog from "./pages/blog";
import Blogs from "./pages/blogs";
import RewardsPage from "./pages/rewards";
import { NavbarSection } from "./components/navbar";
import { Topbar } from "./components/topbar";
import { CTASection } from "./components/deliverTo/CTASection";
import { Footer } from "./components/footer";
import ProductInfoHardware from "./pages/productInfoHardware";
import { ProductsPage } from "./pages/products";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OrderHistory } from "./pages/orderHistory";
import { OrderDetails } from "./pages/orderDetails";
import { LoginPage } from "./pages/login";

const App = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    console.log(selectedOrder);
  };

  const handleBackToHistory = () => {
    setSelectedOrder(null);
  };

  return (
    <>
      {/* <Topbar />
      <NavbarSection />
      <CTASection /> */}
      {/* <Home /> */}
      {/* <Blog /> */}
      {/* <Blogs /> */}
      {/* <RewardsPage /> */}
      {/* <ProductInfo /> */}

      {/* <ProductInfoHardware /> */}





      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Topbar />
        <NavbarSection />
        <CTASection />
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductInfoHardware />} />
          <Route path="/product-details" element={<ProductInfoHardware />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/order-history" element={<OrderHistory orders={[{
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
          }, {
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
          }, {
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
          }]} onOrderSelect={handleOrderSelect} />} />

          <Route 
            path="/order-details" 
            element={
              selectedOrder ? (
                <OrderDetails order={selectedOrder} onBack={handleBackToHistory} />
              ) : (
                <Navigate to="/order-history" replace />
              )
            } 
          />

        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
