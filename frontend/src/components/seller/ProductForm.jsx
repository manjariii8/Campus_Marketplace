import { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  X,
  Package,
  IndianRupee,
  Boxes,
  FileText,
  Tag,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { getCategories } from "../../services/categoryService";

const ProductForm = ({
  formData,
  setFormData,
  onSubmit,
  loading,
  error = "",
  success = "",
}) => {
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const [imagePreview, setImagePreview] = useState(
    formData?.imageData || null,
  );

  const [imageError, setImageError] = useState("");

  const fileInputRef = useRef(null);

  /* =========================
     LOAD CATEGORIES
  ========================= */

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError("");

      const response = await getCategories();

      /*
       * Supports:
       *
       * { data: [...] }
       *
       * and:
       *
       * { success: true, data: [...] }
       */

      const categoryData =
        response?.data?.data ||
        response?.data ||
        [];

      if (Array.isArray(categoryData)) {
        setCategories(categoryData);
      } else {
        setCategories([]);
        setCategoryError(
          "Invalid category response from server.",
        );
      }
    } catch (error) {
      console.error(
        "Unable to load categories:",
        error,
      );

      setCategories([]);

      setCategoryError(
        error?.response?.data?.message ||
          "Unable to load categories. Please try again.",
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================
     IMAGE CHANGE
  ========================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    setImageError("");

    if (!file) {
      return;
    }

    /*
     * Validate image type
     */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setImageError(
        "Please upload a JPG, PNG, or WEBP image.",
      );

      e.target.value = "";
      return;
    }

    /*
     * Validate image size
     */

    if (file.size > 2 * 1024 * 1024) {
      setImageError(
        "Image size must be less than 2 MB.",
      );

      e.target.value = "";
      return;
    }

    /*
     * Read image
     */

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result;

      if (!base64Image) {
        setImageError(
          "Unable to process the selected image.",
        );
        return;
      }

      setFormData((previous) => ({
        ...previous,
        imageData: base64Image,
      }));

      setImagePreview(base64Image);
      setImageError("");
    };

    reader.onerror = () => {
      setImageError(
        "Unable to read this image. Please try another file.",
      );
    };

    reader.readAsDataURL(file);
  };

  /* =========================
     REMOVE IMAGE
  ========================= */

  const removeImage = () => {
    setFormData((previous) => ({
      ...previous,
      imageData: null,
    }));

    setImagePreview(null);
    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =========================
     OPEN FILE PICKER
  ========================= */

  const openFilePicker = () => {
    setImageError("");
    fileInputRef.current?.click();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-8"
    >
      {/* =========================
          GLOBAL ERROR
      ========================= */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>
            <p className="font-semibold text-red-800">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* =========================
          SUCCESS
      ========================= */}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-emerald-600"
          />

          <div>
            <p className="font-semibold text-emerald-800">
              Success
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              {success}
            </p>
          </div>
        </div>
      )}

      {/* =========================
          BASIC INFORMATION
      ========================= */}

      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Package size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Basic Information
            </h3>

            <p className="text-sm text-slate-500">
              Enter the main details of your product.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* PRODUCT NAME */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Product Name
            </label>

            <div className="relative">
              <Tag
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-4 top-4 text-slate-400"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows={5}
                className="w-full resize-none rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CATEGORY
      ========================= */}

      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Tag size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Category
            </h3>

            <p className="text-sm text-slate-500">
              Choose the category that best matches your product.
            </p>
          </div>
        </div>

        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Product Category
        </label>

        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          disabled={categoryLoading}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          required
        >
          <option value="">
            {categoryLoading
              ? "Loading categories..."
              : "Select a category"}
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        {categoryError && (
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">
                {categoryError}
              </p>

              <button
                type="button"
                onClick={loadCategories}
                className="mt-2 text-sm font-semibold text-red-700 underline underline-offset-2 transition hover:text-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {!categoryLoading &&
          !categoryError &&
          categories.length === 0 && (
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <p className="text-sm text-amber-700">
                No categories are available.
                Please create categories from the
                admin panel first.
              </p>
            </div>
          )}
      </section>

      {/* =========================
          PRICE & STOCK
      ========================= */}

      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Boxes size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Pricing & Inventory
            </h3>

            <p className="text-sm text-slate-500">
              Set your product price and available stock.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* PRICE */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Price
            </label>

            <div className="relative">
              <IndianRupee
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter product price"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Enter the selling price in Indian Rupees.
            </p>
          </div>

          {/* STOCK */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Stock Quantity
            </label>

            <div className="relative">
              <Boxes
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="number"
                name="stock"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Enter the number of products currently available.
            </p>
          </div>
        </div>
      </section>
      
      {/* =========================
          CAMPUS REUSE DETAILS
      ========================= */}

      <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="font-semibold text-slate-900">
            Campus Reuse Details
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Help students understand the item's condition and arrange
            a convenient campus pickup.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="listingType"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Listing Type
            </label>

            <select
              id="listingType"
              name="listingType"
              value={formData.listingType || "ITEM"}
              onChange={(e) => {
                const listingType = e.target.value;

                setFormData((previous) => ({
                  ...previous,
                  listingType,
                  ...(listingType === "ITEM"
                    ? {
                        course: "",
                        subject: "",
                        semester: "",
                      }
                    : {}),
                }));
              }}
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="ITEM">Regular Item</option>
              <option value="STUDY_MATERIAL">Study Material</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="condition"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Item Condition
            </label>

            <select
              id="condition"
              name="condition"
              value={formData.condition || "GOOD"}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="LIKE_NEW">Like New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="FOR_PARTS">For Parts / Repair</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="defects"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Defects or Damage
              <span className="ml-2 font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <textarea
              id="defects"
              name="defects"
              value={formData.defects || ""}
              onChange={handleChange}
              disabled={loading}
              rows={2}
              maxLength={1000}
              placeholder="E.g. small scratch on the back, a few highlighted pages..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="pickupLocation"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Campus Pickup Location
              <span className="ml-2 font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <input
              id="pickupLocation"
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation || ""}
              onChange={handleChange}
              disabled={loading}
              maxLength={255}
              placeholder="E.g. college library entrance"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1 text-xs text-slate-500">
              Use a public campus meeting point rather than your private
              address.
            </p>
          </div>

          {formData.listingType === "STUDY_MATERIAL" && (
            <>
              <div>
                <label
                  htmlFor="course"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Course
                </label>
                <input
                  id="course"
                  type="text"
                  name="course"
                  value={formData.course || ""}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={150}
                  placeholder="E.g. B.Tech CSE"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject || ""}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={150}
                  placeholder="E.g. Data Structures"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="semester"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Semester
                </label>
                <input
                  id="semester"
                  type="text"
                  name="semester"
                  value={formData.semester || ""}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={50}
                  placeholder="E.g. Semester 3"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </>
          )}
        </div>
      </section>


      {/* =========================
          PRODUCT IMAGE
      ========================= */}

      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <ImagePlus size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Product Image
            </h3>

            <p className="text-sm text-slate-500">
              Upload a clear image of your product.
            </p>
          </div>
        </div>

        {!imagePreview ? (
          <button
            type="button"
            onClick={openFilePicker}
            disabled={loading}
            className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 transition hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition group-hover:scale-105 group-hover:bg-blue-200">
              <ImagePlus size={26} />
            </div>

            <p className="mt-4 font-semibold text-slate-700">
              Click to upload product image
            </p>

            <p className="mt-1 text-sm text-slate-500">
              PNG, JPG or WEBP • Maximum 2 MB
            </p>
          </button>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <img
              src={imagePreview}
              alt="Product preview"
              className="h-80 w-full object-contain"
            />

            <div className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow">
              Image selected
            </div>

            <button
              type="button"
              onClick={removeImage}
              disabled={loading}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              title="Remove image"
              aria-label="Remove image"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* IMAGE ERROR */}

        {imageError && (
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <p className="text-sm font-semibold text-red-700">
                Image upload failed
              </p>

              <p className="mt-1 text-sm text-red-600">
                {imageError}
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />
      </section>

      {/* =========================
          SUBMIT
      ========================= */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={loading}
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            loading ||
            categoryLoading ||
            !!imageError
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <Loader2
              size={18}
              className="animate-spin"
            />
          )}

          {loading
            ? "Adding Product..."
            : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
