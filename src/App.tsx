import type { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CartPage from "./pages/CartPage";
import CheckOutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import OrderCompletePage from "./pages/OrderCompletePage";
import ProductDetailPage from "./pages/ProductDetail";

const App: FC = () => {
  return (
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
