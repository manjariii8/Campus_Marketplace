import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  BookOpen,
  Calculator,
  Laptop,
  BedDouble,
  Dumbbell,
  Bike,
  Shirt,
  Armchair,
  Package,
  RefreshCw,
} from "lucide-react";

import { getCategories } from "../../services/categoryService";

const getCategoryIcon = (name = "") => {
  const value = name.toLowerCase();

  if (
    value.includes("book") ||
    value.includes("study") ||
    value.includes("material")
  ) {
    return BookOpen;
  }

  if (
    value.includes("stationery") ||
    value.includes("supply")
  ) {
    return Calculator;
  }

  if (
    value.includes("electronic") ||
    value.includes("accessor") ||
    value.includes("computer")
  ) {
    return Laptop;
  }

  if (
    value.includes("hostel") ||
    value.includes("room")
  ) {
    return BedDouble;
  }

  if (
    value.includes("sport") ||
    value.includes("gym")
  ) {
    return Dumbbell;
  }

  if (
    value.includes("cycle") ||
    value.includes("mobility")
  ) {
    return Bike;
  }

  if (
    value.includes("cloth") ||
    value.includes("fashion") ||
    value.includes("wear")
  ) {
    return Shirt;
  }

  if (value.includes("furniture")) {
    return Armchair;
  }

  return Package;
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      const result = response?.data;

      const categoryList = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];

      setCategories(categoryList);
    } catch (err) {
      console.error(
        "Failed to load homepage categories:",
        err
      );

      setError(
        "Unable to load categories right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-50 py-16 sm:py-20">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-10 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find What You Need
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500">
            Explore academic, hostel, lifestyle, and everyday
            essentials available through your campus marketplace.
          </p>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-44 animate-pulse rounded-2xl border border-slate-100 bg-white"
                />
              )
            )}

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={loadCategories}
              className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700 transition hover:text-blue-800"
            >
              <RefreshCw size={16} />
              Try again
            </button>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          categories.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <p className="text-slate-500">
                No categories are available yet.
              </p>

            </div>
          )}

        {/* CATEGORIES */}

        {!loading &&
          !error &&
          categories.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">

              {categories.map((category) => {
                const Icon = getCategoryIcon(
                  category.name
                );

                return (
                  <Link
                    key={category.id}
                    to={`/products?categoryId=${encodeURIComponent(
                      category.id
                    )}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-7"
                  >

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/20 sm:h-16 sm:w-16">

                      <Icon
                        size={29}
                        strokeWidth={1.8}
                      />

                    </div>

                    <h3 className="mt-4 font-semibold text-slate-800 transition-colors group-hover:text-blue-700">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-xs font-medium text-slate-400">
                      Browse listings
                    </p>

                  </Link>
                );
              })}

            </div>
          )}

      </div>
    </section>
  );
};

export default Categories;
