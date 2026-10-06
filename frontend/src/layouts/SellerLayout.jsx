import { Link, Outlet } from "react-router-dom";

import SellerSidebar from "../components/seller/SellerSidebar";

const SellerLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <SellerSidebar />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Go to Marketplace
          </Link>

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SellerLayout;
