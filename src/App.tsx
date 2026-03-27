import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrderDetail from "./pages/AdminOrderDetail";
import AdminProducts from "./pages/AdminProducts";
import CartPage from "./pages/CartPage";
import CheckOutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import OrderCompletePage from "./pages/OrderCompletePage";
import ProductDetailPage from "./pages/ProductDetail";
import SignupPage from "./pages/SignupPage";

const App: FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ユーザー向けルート */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route
            path="/order-complete/:orderId"
            element={<OrderCompletePage />}
          />

          {/* 認証ルート */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 管理者向けルート */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/order/:orderId"
            element={
              <ProtectedRoute>
                <AdminOrderDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
