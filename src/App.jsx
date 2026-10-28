import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider, ProductProvider, ToastProvider } from "./context/StoreContext";
import SiteLayout from "./components/SiteLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { LoadingState } from "./components/Feedback";

const HomePage = lazy(() => import("./pages/HomePage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const LoginPage = lazy(() => import("./pages/AuthPages").then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("./pages/AuthPages").then((module) => ({ default: module.RegisterPage })));
const AccountPage = lazy(() => import("./pages/AccountPages").then((module) => ({ default: module.AccountPage })));
const OrderHistoryPage = lazy(() => import("./pages/AccountPages").then((module) => ({ default: module.OrderHistoryPage })));
const OrderDetailPage = lazy(() => import("./pages/AccountPages").then((module) => ({ default: module.OrderDetailPage })));
const AdminLayout = lazy(() => import("./pages/AdminPages").then((module) => ({ default: module.AdminLayout })));
const AdminDashboardPage = lazy(() => import("./pages/AdminPages").then((module) => ({ default: module.AdminDashboardPage })));
const AdminProductsPage = lazy(() => import("./pages/AdminPages").then((module) => ({ default: module.AdminProductsPage })));
const AdminOrdersPage = lazy(() => import("./pages/AdminPages").then((module) => ({ default: module.AdminOrdersPage })));
const AdminAnalyticsPage = lazy(() => import("./pages/AdminPages").then((module) => ({ default: module.AdminAnalyticsPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <ToastProvider>
            <BrowserRouter>
              <Suspense fallback={<div className="container page-wrap"><LoadingState /></div>}>
                <Routes>
                  <Route element={<SiteLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="shop" element={<ShopPage />} />
                    <Route path="product/:slug" element={<ProductPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="checkout" element={<CheckoutPage />} />
                      <Route path="order-success/:orderId" element={<OrderSuccessPage />} />
                      <Route path="account" element={<AccountPage />} />
                      <Route path="account/orders" element={<OrderHistoryPage />} />
                      <Route path="account/orders/:orderId" element={<OrderDetailPage />} />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                  <Route element={<ProtectedRoute admin />}>
                    <Route path="admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboardPage />} />
                      <Route path="products" element={<AdminProductsPage />} />
                      <Route path="orders" element={<AdminOrdersPage />} />
                      <Route path="analytics" element={<AdminAnalyticsPage />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
