import { Navigate, Route, Routes } from "react-router";
import HomePage from "./feature/shell/pages/HomePage";
import Layout from "./feature/shell/Layout";
import ProductDetailPage from "./feature/product/detail/ProductDetailPage";
import Login from "./feature/auth/pages/login";
import SignUp from "./feature/auth/pages/sign-up";
import ForgotPassword from "./feature/auth/pages/forgot-password";
import AccountLayout from "./feature/account/AccountLayout";
import useAuth from "./shared/hooks/useAuth";
import AuthConfirm from "./feature/auth/pages/auth.confirm";
import AuthError from "./feature/auth/pages/auth.error";
import { CartPage } from "./feature/cart/CartPage";
import useCustomer from "./shared/hooks/useCustomer";
import CheckoutPage from "./feature/checkout/pages/CheckoutPage";
import OrderConfirmationPage from "./feature/checkout/pages/OrderConfirmationPage";
import OrderHistory from "./feature/account/components/OrderHistory";
import CustomOrders from "./feature/account/components/CustomOrders";
import AccountSettings from "./feature/account/components/AccountSettings";
import UpdatePassword from "./feature/account/components/update-password";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  useAuth();
  useCustomer();

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/order-confirmation/:orderId"
            element={<OrderConfirmationPage />}
          />
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<Navigate to="orders" replace />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="custom-orders" element={<CustomOrders />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="update-password" element={<UpdatePassword />} />
          </Route>
        </Route>
        <Route path="/auth/confirm" element={<AuthConfirm />} />
        <Route path="/auth/error" element={<AuthError />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
