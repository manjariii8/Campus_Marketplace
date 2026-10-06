import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductGrid from "../product/ProductGrid";
import { getProducts } from "../../services/productService";
import useAuth from "../../hooks/useAuth";

const FeaturedProducts = () => {
  const { user, loading: authLoading } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    loadProducts();
  }, [user, authLoading]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts();

      const data = response?.data;

      if (Array.isArray(data)) {
        setProducts(data.slice(0, 8));
      } else if (Array.isArray(data?.content)) {
        setProducts(data.content.slice(0, 8));
      } else if (Array.isArray(data?.data)) {
        setProducts(data.data.slice(0, 8));
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(
        "Failed to load featured products:",
        error
      );

      if (error?.response?.status === 401) {
        setError(
          "Please log in to view products from your campus."
        );
      } else {
        setError(
          error?.response?.data?.message ||
            "Unable to load featured products."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white py-16 sm:py-20">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              From Your Campus
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Featured Products
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500">
              Discover recently listed essentials available
              from sellers in your campus community.
            </p>

          </div>

          {user && (
            <Link
              to="/products"
              className="inline-flex w-fit items-center rounded-xl border border-blue-200 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              View Marketplace
            </Link>
          )}

        </div>

        {/* AUTHENTICATION PROMPT */}

        {!authLoading && !user && (
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-12 text-center sm:px-10">

            <div className="mx-auto max-w-xl">

              <h3 className="text-2xl font-bold text-slate-900">
                Discover your campus marketplace
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Log in to see products listed by students
                from your campus.
              </p>

              <Link
                to="/login"
                className="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
              >
                Log in to Explore
              </Link>

            </div>

          </div>
        )}

        {/* LOADING */}

        {user && loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
                />
              )
            )}

          </div>
        )}

        {/* ERROR */}

        {user && !loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

            <p className="font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={loadProducts}
              className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* EMPTY */}

        {user &&
          !loading &&
          !error &&
          products.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">

              <h3 className="text-xl font-semibold text-slate-800">
                No products available yet
              </h3>

              <p className="mt-2 text-slate-500">
                Be the first seller to list something
                for your campus community.
              </p>

              <Link
                to="/seller/apply"
                className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Become a Seller
              </Link>

            </div>
          )}

        {/* PRODUCTS */}

        {user &&
          !loading &&
          !error &&
          products.length > 0 && (
            <ProductGrid
              products={products}
            />
          )}

      </div>
    </section>
  );
};

export default FeaturedProducts;
