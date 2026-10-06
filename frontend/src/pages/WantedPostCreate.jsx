import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createWantedPost } from "../services/wantedPostService";
import { getCategories } from "../services/categoryService";

const WantedPostCreate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    maxBudget: "",
    categoryId: "",
    imageData: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setError("");

      const response = await getCategories();

      const data = response?.data?.data ?? response?.data ?? [];

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setError("Failed to load categories. Please refresh the page.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    // Maximum 2 MB because the image is stored as Base64.
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result;

      setForm((prev) => ({
        ...prev,
        imageData: base64Image,
      }));

      setImagePreview(base64Image);
    };

    reader.onerror = () => {
      setError("Failed to read the image.");
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((prev) => ({
      ...prev,
      imageData: "",
    }));

    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const title = form.title.trim();
    const description = form.description.trim();
    const budget = Number(form.maxBudget);

    if (title.length < 3 || title.length > 120) {
      setError("Title must be between 3 and 120 characters.");
      return;
    }

    if (description.length > 1500) {
      setError("Description cannot exceed 1500 characters.");
      return;
    }

    if (!form.maxBudget || Number.isNaN(budget) || budget <= 0) {
      setError("Please enter a valid maximum budget.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title,
        description,
        maxBudget: budget,
        ...(form.categoryId
          ? { categoryId: Number(form.categoryId) }
          : {}),
        ...(form.imageData
          ? { imageData: form.imageData }
          : {}),
      };

      await createWantedPost(payload);

      setMessage("Your request has been posted successfully.");

      navigate("/wanted");
    } catch (error) {
      console.error("Failed to create wanted post:", error);

      const serverMessage = error?.response?.data?.message;

      setError(
        serverMessage ||
          "Failed to create your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-6">
          <Link
            to="/wanted"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Wanted Board
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Request an Item
          </h1>

          <p className="mt-2 text-slate-600">
            Tell campus students what you are looking for. Someone may
            already have it available.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          {/* Success */}
          {message && (
            <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-5">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              What are you looking for? *
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Engineering Mathematics textbook"
              maxLength={120}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1 text-xs text-slate-500">
              {form.title.length}/120 characters
            </p>
          </div>

          {/* Image */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Add an image
              <span className="ml-2 font-normal text-slate-500">
                (optional)
              </span>
            </label>

            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50"
              >
                <span className="text-3xl">📷</span>

                <span className="mt-2 font-medium text-slate-700">
                  Upload an image
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  JPG, PNG, WEBP • Maximum 2 MB
                </span>
              </button>
            ) : (
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img
                  src={imagePreview}
                  alt="Wanted item preview"
                  className="max-h-72 w-full object-contain"
                />

                <div className="flex items-center justify-between border-t border-slate-200 bg-white p-3">
                  <span className="text-sm text-slate-600">
                    Image selected
                  </span>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Description
              <span className="ml-2 font-normal text-slate-500">
                (optional)
              </span>
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add details such as edition, size, color, preferred condition, or anything else..."
              maxLength={1500}
              rows={5}
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1 text-xs text-slate-500">
              {form.description.length}/1500 characters
            </p>
          </div>

          {/* Category */}
          <div className="mb-5">
            <label
              htmlFor="categoryId"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Category
            </label>

            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              disabled={loadingCategories}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Any category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div className="mb-6">
            <label
              htmlFor="maxBudget"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Maximum budget *
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                ₹
              </span>

              <input
                id="maxBudget"
                name="maxBudget"
                type="number"
                min="0.01"
                step="0.01"
                value={form.maxBudget}
                onChange={handleChange}
                placeholder="500"
                required
                className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Enter the highest amount you are willing to pay.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Posting Request..." : "Post Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WantedPostCreate;
