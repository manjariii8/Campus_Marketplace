import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

import ProductGrid from "../components/product/ProductGrid";
import SearchBar from "../components/product/SearchBar";
import SortDropdown from "../components/product/SortDropdown";
import FilterSidebar from "../components/product/FilterSidebar";
import Pagination from "../components/product/Pagination";

import { searchProducts } from "../services/productService";

const getInitialPage = (params) => {
  const value = Number.parseInt(params.get("page") || "0", 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
};

const getInitialFilters = (params) => ({
  keyword: params.get("keyword") || "",
  categoryId: params.get("categoryId") || "",
  condition: params.get("condition") || "",
  listingType: params.get("listingType") || "",
  minPrice: params.get("minPrice") || "",
  maxPrice: params.get("maxPrice") || "",
});

// Handles Spring Page responses and common API response wrappers.
const normalizeProductResponse = (response) => {
  const outer = response?.data;
  const payload = outer?.data ?? outer;

  const pageData =
    payload?.content
      ? payload
      : payload?.data?.content
        ? payload.data
        : outer?.content
          ? outer
          : null;

  let products = [];

  if (Array.isArray(payload)) {
    products = payload;
  } else if (Array.isArray(payload?.content)) {
    products = payload.content;
  } else if (Array.isArray(payload?.data)) {
    products = payload.data;
  } else if (Array.isArray(payload?.data?.content)) {
    products = payload.data.content;
  } else if (Array.isArray(outer?.data)) {
    products = outer.data;
  } else if (Array.isArray(outer?.data?.content)) {
    products = outer.data.content;
  }

  return {
    products,
    totalPages: pageData?.totalPages ?? 1,
    totalElements: pageData?.totalElements ?? products.length,
  };
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);

  const [keyword, setKeyword] = useState(
    () => getInitialFilters(searchParams).keyword
  );
  const [categoryId, setCategoryId] = useState(
    () => getInitialFilters(searchParams).categoryId
  );
  const [condition, setCondition] = useState(
    () => getInitialFilters(searchParams).condition
  );
  const [listingType, setListingType] = useState(
    () => getInitialFilters(searchParams).listingType
  );
  const [minPrice, setMinPrice] = useState(
    () => getInitialFilters(searchParams).minPrice
  );
  const [maxPrice, setMaxPrice] = useState(
    () => getInitialFilters(searchParams).maxPrice
  );

  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "createdAt"
  );

  const [page, setPage] = useState(() => getInitialPage(searchParams));
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState(
    () => getInitialFilters(searchParams)
  );

  // Keep the URL synchronized with applied filters and sorting.
  useEffect(() => {
    const params = new URLSearchParams();

    if (appliedFilters.keyword.trim()) {
      params.set("keyword", appliedFilters.keyword.trim());
    }

    if (appliedFilters.categoryId) {
      params.set("categoryId", appliedFilters.categoryId);
    }

    if (appliedFilters.condition) {
      params.set("condition", appliedFilters.condition);
    }

    if (appliedFilters.listingType) {
      params.set("listingType", appliedFilters.listingType);
    }

    if (appliedFilters.minPrice !== "") {
      params.set("minPrice", appliedFilters.minPrice);
    }

    if (appliedFilters.maxPrice !== "") {
      params.set("maxPrice", appliedFilters.maxPrice);
    }

    if (sortBy !== "createdAt") {
      params.set("sort", sortBy);
    }

    if (page > 0) {
      params.set("page", String(page));
    }

    setSearchParams(params, { replace: true });
  }, [appliedFilters, sortBy, page, setSearchParams]);

  // Load products whenever filters, sorting, or page changes.
  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // Convert the dropdown selection to backend sort parameters.
        const isPriceDescending = sortBy === "priceDesc";

        const params = {
          page,
          size: 12,
          sortBy: isPriceDescending ? "price" : sortBy,
          direction:
            isPriceDescending || sortBy === "createdAt"
              ? "desc"
              : "asc",
        };

        if (appliedFilters.keyword.trim()) {
          params.keyword = appliedFilters.keyword.trim();
        }

        if (appliedFilters.categoryId) {
          params.categoryId = appliedFilters.categoryId;
        }

        if (appliedFilters.condition) {
          params.condition = appliedFilters.condition;
        }

        if (appliedFilters.listingType) {
          params.listingType = appliedFilters.listingType;
        }

        if (appliedFilters.minPrice !== "") {
          params.minPrice = appliedFilters.minPrice;
        }

        if (appliedFilters.maxPrice !== "") {
          params.maxPrice = appliedFilters.maxPrice;
        }

        // Always use the backend search endpoint.
        const response = await searchProducts(params);
        const normalized = normalizeProductResponse(response);

        if (cancelled) return;

        setProducts(normalized.products);
        setTotalPages(normalized.totalPages);
        setTotalElements(normalized.totalElements);
      } catch (err) {
        console.error("Failed to load products:", err);

        if (cancelled) return;

        setError(
          err?.response?.data?.message ||
            "Unable to load products. Please try again."
        );

        setProducts([]);
        setTotalPages(1);
        setTotalElements(0);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [page, sortBy, appliedFilters]);

  // Apply the search bar and sidebar selections.
  const handleSearch = () => {
    setPage(0);

    setAppliedFilters({
      keyword,
      categoryId,
      condition,
      listingType,
      minPrice,
      maxPrice,
    });
  };

  const handleFilter = () => {
    setPage(0);

    setAppliedFilters({
      keyword,
      categoryId,
      condition,
      listingType,
      minPrice,
      maxPrice,
    });

    setShowFilters(false);
  };

  // Clear every filter and restore default sorting.
  const clearFilters = () => {
    setKeyword("");
    setCategoryId("");
    setCondition("");
    setListingType("");
    setMinPrice("");
    setMaxPrice("");

    setAppliedFilters({
      keyword: "",
      categoryId: "",
      condition: "",
      listingType: "",
      minPrice: "",
      maxPrice: "",
    });

    setSortBy("createdAt");
    setPage(0);
    setShowFilters(false);
  };

  // Remove one active filter while preserving the others.
  const removeFilter = (type) => {
    const updated = { ...appliedFilters };

    if (type === "keyword") {
      setKeyword("");
      updated.keyword = "";
    } else if (type === "category") {
      setCategoryId("");
      updated.categoryId = "";
    } else if (type === "condition") {
      setCondition("");
      updated.condition = "";
    } else if (type === "listingType") {
      setListingType("");
      updated.listingType = "";
    } else if (type === "minPrice") {
      setMinPrice("");
      updated.minPrice = "";
    } else if (type === "maxPrice") {
      setMaxPrice("");
      updated.maxPrice = "";
    }

    setPage(0);
    setAppliedFilters(updated);
  };

  const conditionLabels = {
    LIKE_NEW: "Like New",
    GOOD: "Good",
    FAIR: "Fair",
    FOR_PARTS: "For Parts",
  };

  const activeFilterCount = [
    appliedFilters.keyword,
    appliedFilters.categoryId,
    appliedFilters.condition,
    appliedFilters.listingType,
    appliedFilters.minPrice,
    appliedFilters.maxPrice,
  ].filter((value) => value !== "").length;

  const sidebarProps = {
    categoryId,
    setCategoryId,
    condition,
    setCondition,
    listingType,
    setListingType,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    onApply: handleFilter,
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* Search and page heading */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-slate-700">Products</span>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Explore Products
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Discover affordable pre-loved items and study essentials
              from your campus community.
            </p>
          </div>

          <div className="max-w-4xl">
            <SearchBar
              keyword={keyword}
              setKeyword={setKeyword}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-semibold text-slate-700">
              Applied filters:
            </span>

            {appliedFilters.keyword && (
              <FilterChip
                label={`Search: ${appliedFilters.keyword}`}
                onRemove={() => removeFilter("keyword")}
              />
            )}

            {appliedFilters.categoryId && (
              <FilterChip
                label="Category selected"
                onRemove={() => removeFilter("category")}
              />
            )}

            {appliedFilters.condition && (
              <FilterChip
                label={`Condition: ${
                  conditionLabels[appliedFilters.condition] ||
                  appliedFilters.condition
                }`}
                onRemove={() => removeFilter("condition")}
              />
            )}

            {appliedFilters.listingType && (
              <FilterChip
                label={`Type: ${
                  appliedFilters.listingType === "STUDY_MATERIAL"
                    ? "Study Materials"
                    : "Physical Items"
                }`}
                onRemove={() => removeFilter("listingType")}
              />
            )}

            {appliedFilters.minPrice !== "" && (
              <FilterChip
                label={`Min ₹${appliedFilters.minPrice}`}
                onRemove={() => removeFilter("minPrice")}
              />
            )}

            {appliedFilters.maxPrice !== "" && (
              <FilterChip
                label={`Max ₹${appliedFilters.maxPrice}`}
                onRemove={() => removeFilter("maxPrice")}
              />
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="ml-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Mobile filter controls */}
        <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-blue-500 hover:text-blue-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4h18M6 12h12M10 20h4"
              />
            </svg>

            Filters

            {activeFilterCount > 0 && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <SortDropdown
            sortBy={sortBy}
            setSortBy={handleSortChange}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                  <div>
                    <h2 className="font-bold text-slate-900">Filters</h2>

                    {activeFilterCount > 0 && (
                      <p className="mt-1 text-xs text-blue-600">
                        {activeFilterCount} applied
                      </p>
                    )}
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="p-5">
                  <FilterSidebar {...sidebarProps} />
                </div>
              </div>
            </div>
          </aside>

          {/* Product results */}
          <section className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div>
                <h2 className="font-bold text-slate-900">Products</h2>

                <p className="mt-1 text-sm text-slate-500">
                  {loading
                    ? "Finding products..."
                    : `${totalElements} ${
                        totalElements === 1 ? "item" : "items"
                      } found`}
                </p>
              </div>

              <div className="hidden lg:block">
                <SortDropdown
                  sortBy={sortBy}
                  setSortBy={handleSortChange}
                />
              </div>
            </div>

            {loading && <ProductSkeleton />}

            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  We couldn't load the products
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setAppliedFilters({ ...appliedFilters })
                  }
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                  <svg
                    className="h-10 w-10 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                      d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-900">
                  No products found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  No products match your current search or filters.
                  Try changing your search or clearing the filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <ProductGrid products={products} />
            )}

            {!loading && !error && totalPages > 1 && (
              <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  setPage={setPage}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setShowFilters(false)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          <div className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Filters
                </h2>

                {activeFilterCount > 0 && (
                  <p className="mt-1 text-xs text-blue-600">
                    {activeFilterCount} filters applied
                  </p>
                )}
              </div>

              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setShowFilters(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <FilterSidebar {...sidebarProps} />
            </div>

            <div className="border-t border-slate-200 p-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={handleFilter}
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterChip = ({ label, onRemove }) => (
  <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
    <span>{label}</span>

    <button
      type="button"
      onClick={onRemove}
      className="flex h-4 w-4 items-center justify-center rounded-full text-blue-500 transition hover:bg-blue-100 hover:text-blue-800"
      aria-label={`Remove ${label}`}
    >
      ×
    </button>
  </div>
);

const ProductSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="aspect-square animate-pulse bg-slate-200" />

        <div className="space-y-3 p-4">
          <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    ))}
  </div>
);

export default Products;