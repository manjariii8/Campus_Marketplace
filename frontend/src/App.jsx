import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

/* Route Guards */
import PublicRoute from "./routes/PublicRoute";
import CustomerRoute from "./routes/CustomerRoute";
import SellerRoute from "./routes/SellerRoute";
import AdminRoute from "./routes/AdminRoute";

/* Customer */
import Home from "./pages/Home";
import Products from "./pages/Products";
import Search from "./pages/Search";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Categories from "./components/home/Categories";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import WantedPostCreate from "./pages/WantedPostCreate";
import WantedBoard from "./pages/WantedBoard";
import WantedPostDetails from "./pages/WantedPostDetails";

/* Support */
import HelpCenter from "./pages/HelpCenter";
import ContactSupport from "./pages/ContactSupport";
import FAQs from "./pages/FAQs";

/* Authentication */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AuthLayout from "./layouts/AuthLayout";

/* Seller */
import SellerLayout from "./layouts/SellerLayout";
import SellerDashboard from "./pages/SellerDashboard";
import SellerProducts from "./pages/SellerProducts";
import SellerOrders from "./pages/SellerOrders";
import SellerProfile from "./pages/SellerProfile";
import AddProduct from "./pages/AddProducts";
import EditProduct from "./pages/EditProduct";
import SellerEditProfile from "./pages/SellerEditProfile";
import SellerApplication from "./pages/SellerApplication";
import SellerProductDetails from "./pages/SellerProductDetails";

/* Admin */
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import Users from "./admin/pages/Users";
import Sellers from "./admin/pages/Sellers";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminCategories from "./admin/pages/AdminCategories";
import AdminOrders from "./admin/pages/AdminOrders";
import Analytics from "./admin/pages/Analytics";

function App() {
  return (
    <Routes>
      {/* =====================================================
          CUSTOMER WEBSITE
      ====================================================== */}

      <Route element={<MainLayout />}>

        {/* Public customer pages */}
        <Route path="/" element={<Home />} />

        {/* =================================================
            CAMPUS MARKETPLACE
            These pages require authentication because the
            backend filters marketplace data by campus.
        ================================================== */}

        <Route element={<CustomerRoute />}>
          <Route path="/products" element={<Products />} />

          <Route path="/categories" element={<Categories />} />

          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/search" element={<Search />} />

          {/* Customer-only pages */}
          <Route path="/cart" element={<Cart />} />

          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/orders/:id" element={<OrderDetails />} />

          {/* Wanted Board */}
          <Route path="/wanted" element={<WantedBoard />} />

          <Route path="/wanted/create" element={<WantedPostCreate />} />

          <Route path="/wanted/:id" element={<WantedPostDetails />} />
        </Route>
      </Route>

      {/* =====================================================
          AUTHENTICATION
      ====================================================== */}

      <Route element={<AuthLayout />}>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/seller/register"
            element={<SellerApplication />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
        </Route>
      </Route>

      {/* =====================================================
          SELLER
      ====================================================== */}

      <Route element={<SellerRoute />}>
        <Route element={<SellerLayout />}>

          <Route
            path="/seller"
            element={<SellerDashboard />}
          />

          <Route
            path="/seller/products"
            element={<SellerProducts />}
          />

          <Route
            path="/seller/products/:id"
            element={<SellerProductDetails />}
          />

          <Route
            path="/seller/products/add"
            element={<AddProduct />}
          />

          <Route
            path="/seller/products/edit/:id"
            element={<EditProduct />}
          />

          <Route
            path="/seller/orders"
            element={<SellerOrders />}
          />

          <Route
            path="/seller/profile"
            element={<SellerProfile />}
          />

          <Route
            path="/seller/profile/edit"
            element={<SellerEditProfile />}
          />

        </Route>
      </Route>

      {/* =====================================================
          ADMIN
      ====================================================== */}

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<Users />}
          />

          <Route
            path="/admin/sellers"
            element={<Sellers />}
          />

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          <Route
            path="/admin/categories"
            element={<AdminCategories />}
          />

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          <Route
            path="/admin/analytics"
            element={<Analytics />}
          />

        </Route>
      </Route>

      {/* =====================================================
          SUPPORT / PUBLIC
      ====================================================== */}

      <Route
        path="/help-center"
        element={<HelpCenter />}
      />

      <Route
        path="/contact-support"
        element={<ContactSupport />}
      />

      <Route
        path="/faqs"
        element={<FAQs />}
      />

      {/* =====================================================
          403
      ====================================================== */}

      <Route
        path="/403"
        element={
          <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="text-center">

              <h1 className="text-7xl font-bold text-gray-900">
                403
              </h1>

              <h2 className="mt-4 text-2xl font-bold text-gray-800">
                Access Denied
              </h2>

              <p className="mt-2 text-gray-500">
                You don't have permission to access this page.
              </p>

            </div>
          </div>
        }
      />

    </Routes>
  );
}

export default App;
