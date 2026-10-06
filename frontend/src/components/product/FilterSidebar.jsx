import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";

const inputClass =
  "mb-5 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

const FilterSidebar = ({
  categoryId,
  setCategoryId,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  condition,
  setCondition,
  listingType,
  setListingType,
  onApply,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setLoading(true);

      try {
        const response = await getCategories();
        const result = response?.data;

        const categoryData = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        if (isMounted) {
          setCategories(categoryData);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);

        if (isMounted) {
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-xl font-bold text-slate-800">
        Refine Your Search
      </h3>

      {/* CATEGORY */}
      <label
        htmlFor="filter-category"
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        Category
      </label>

      <select
        id="filter-category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        disabled={loading}
        className={inputClass}
      >
        <option value="">
          {loading ? "Loading categories..." : "All Categories"}
        </option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* CONDITION */}
      <label
        htmlFor="filter-condition"
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        Item Condition
      </label>

      <select
        id="filter-condition"
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        className={inputClass}
      >
        <option value="">All Conditions</option>
        <option value="LIKE_NEW">Like New</option>
        <option value="GOOD">Good</option>
        <option value="FAIR">Fair</option>
        <option value="FOR_PARTS">For Parts</option>
      </select>

      {/* LISTING TYPE */}
      <label
        htmlFor="filter-listing-type"
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        Listing Type
      </label>

      <select
        id="filter-listing-type"
        value={listingType}
        onChange={(e) => setListingType(e.target.value)}
        className={inputClass}
      >
        <option value="">All Listings</option>
        <option value="ITEM">Physical Items</option>
        <option value="STUDY_MATERIAL">Study Materials</option>
      </select>

      {/* MIN PRICE */}
      <label
        htmlFor="filter-min-price"
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        Minimum Price (₹)
      </label>

      <input
        id="filter-min-price"
        type="number"
        min="0"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="₹ Minimum"
        className={inputClass}
      />

      {/* MAX PRICE */}
      <label
        htmlFor="filter-max-price"
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        Maximum Price (₹)
      </label>

      <input
        id="filter-max-price"
        type="number"
        min="0"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="₹ Maximum"
        className="mb-6 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />

      {/* APPLY */}
      <button
        type="button"
        onClick={onApply}
        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
      >
        Apply Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
