import type { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route
            path="/order-complete/:orderId"
            element={<OrderCompletePage />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signUp" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
