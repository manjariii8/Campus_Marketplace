import { useState } from "react";
import { Link } from "react-router-dom";
import { createSellerProfile } from "../services/sellerProfileService";

const SellerApplication = () => {

  const [formData, setFormData] = useState({
    shopName: "",
    phone: "",
    address: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createSellerProfile({
        shopName: formData.shopName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
      });

      setSuccess(
        "Your application has been submitted successfully and is awaiting admin approval.",
      );
    } catch (err) {
      const status = err.response?.status;
      const responseData = err.response?.data;

      if (status === 401) {
        setError("Please log in before submitting a seller application.");
      } else if (status === 403) {
        setError("You do not have permission to submit a seller application.");
      } else if (status === 409) {
        setError(
          "A seller profile already exists for your account. Please check your seller profile.",
        );
      } else {
        setError(
          responseData?.message ||
            responseData?.error ||
            "Unable to submit your application. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <Link
          to="/"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          &larr; Back to marketplace
        </Link>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          Become a CampusLoop Seller
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Apply to sell books, study materials, electronics, hostel essentials,
          and other useful items to students on your campus. Your application
          must be approved before you can list products.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="shopName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Shop or seller name *
            </label>
            <input
              id="shopName"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              minLength={3}
              maxLength={100}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter your seller name"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Phone number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="10-digit phone number"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              maxLength={255}
              required
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter your address"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              About you or the items you plan to sell
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={1000}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Tell students what you plan to offer"
            />
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
            Your application requires admin approval before you can list
            products.
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-lg bg-green-50 p-4 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit seller application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerApplication;
