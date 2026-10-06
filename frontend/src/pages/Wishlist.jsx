import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
} from "react-icons/fi";

import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

import { addToCart } from "../services/cartService";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [cartLoadingId, setCartLoadingId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD WISHLIST
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await getWishlist();

      /*
       * Backend WishlistController may return:
       *
       * List<WishlistResponse>
       *
       * or an ApiResponse wrapper.
       */

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setWishlist(data);
    } catch (error) {
      console.error(
        "Unable to load wishlist:",
        error
      );

      setWishlist([]);

      setMessage(
        "Unable to load wishlist. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE FROM WISHLIST
  |--------------------------------------------------------------------------
  */

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    setMessage("");
    setMessageType("");

    try {
      await removeFromWishlist(productId);

      setWishlist((current) =>
        current.filter(
          (item) =>
            getProductId(item) !== productId
        )
      );

      setMessage("Removed from wishlist.");
      setMessageType("success");
    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );

      setMessage(
        "Unable to remove product from wishlist."
      );
      setMessageType("error");
    } finally {
      setRemovingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | ADD TO CART
  |--------------------------------------------------------------------------
  */

  const handleAddToCart = async (product) => {
    const productId = getProductId(product);

    if (!productId) {
      setMessage(
        "Product information is missing."
      );
      setMessageType("error");
      return;
    }

    setCartLoadingId(productId);
    setMessage("");
    setMessageType("");

    try {
      await addToCart({
        productId,
        quantity: 1,
      });

      setMessage("Product added to cart.");
      setMessageType("success");
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      const responseMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Unable to add product to cart.";

      setMessage(
        typeof responseMessage === "string"
          ? responseMessage
          : "Unable to add product to cart."
      );
      setMessageType("error");
    } finally {
      setCartLoadingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PRODUCT ID
  |--------------------------------------------------------------------------
  */

  const getProductId = (item) => {
    return (
      item?.productId ||
      item?.product?.id ||
      item?.id
    );
  };

  /*
  |--------------------------------------------------------------------------
  | PRODUCT DATA
  |--------------------------------------------------------------------------
  */

  const getProduct = (item) => {
    return item?.product || item;
  };

  /*
  |--------------------------------------------------------------------------
  | PRODUCT IMAGE
  |--------------------------------------------------------------------------
  |
  | Supports the image formats used by the marketplace.
  |
  | Priority:
  | 1. imageUrl
  | 2. imageData
  | 3. image
  | 4. placeholder
  |
  */

  const getProductImage = (product) => {
    return (
      product?.imageUrl ||
      product?.imageData ||
      product?.image ||
      "https://placehold.co/500x350/f8fafc/1e293b?text=Product"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="mb-10">
            <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-3 h-5 w-80 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-56 animate-pulse bg-slate-200" />

                <div className="space-y-3 p-5">
                  <div className="h-5 animate-pulse rounded bg-slate-200" />

                  <div className="h-4 animate-pulse rounded bg-slate-200" />

                  <div className="h-10 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | EMPTY
  |--------------------------------------------------------------------------
  */

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-6">

          <div className="w-full rounded-3xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <FiHeart
                size={36}
                className="text-red-500"
              />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-slate-800">
              Your Wishlist is Empty
            </h1>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Save products you love and come
              back to them anytime.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Continue Shopping
            </Link>

          </div>

        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | WISHLIST PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl px-6 py-12">

        {message && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        {/* HEADER */}

        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                <FiHeart
                  size={24}
                  className="text-red-500"
                />
              </div>

              <div>

                <h1 className="text-3xl font-bold text-slate-800">
                  My Wishlist
                </h1>

                <p className="mt-1 text-slate-500">
                  Your saved products.
                </p>

              </div>

            </div>

          </div>

          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {wishlist.length}{" "}
            {wishlist.length === 1
              ? "saved product"
              : "saved products"}
          </div>

        </div>

        {/* PRODUCTS */}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {wishlist.map((item) => {

            const product = getProduct(item);

            const productId = getProductId(item);

            return (
              <div
                key={productId}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                {/* IMAGE */}

                <div className="relative overflow-hidden bg-slate-100">

                  <div className="h-56">

                    <img
                      src={getProductImage(product)}
                      alt={
                        product?.name ||
                        "Product"
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(event) => {
                        console.error(
                          "WISHLIST PRODUCT IMAGE FAILED"
                        );

                        console.error(
                          "imageUrl:",
                          product?.imageUrl
                        );

                        console.error(
                          "imageData:",
                          product?.imageData
                        );

                        console.error(
                          "image:",
                          product?.image
                        );

                        event.currentTarget.src =
                          "https://placehold.co/500x350/f8fafc/1e293b?text=Product";
                      }}
                    />

                  </div>

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(productId)
                    }
                    disabled={
                      removingId === productId
                    }
                    title="Remove from wishlist"
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                  >
                    <FiTrash2 size={18} />
                  </button>

                </div>

                {/* DETAILS */}

                <div className="p-5">

                  {product?.categoryName && (
                    <p className="text-sm font-medium text-blue-600">
                      {product.categoryName}
                    </p>
                  )}

                  <h2 className="mt-2 line-clamp-2 text-lg font-bold text-slate-800">
                    {product?.name ||
                      "Product"}
                  </h2>

                  {product?.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {product.description}
                    </p>
                  )}

                  <p className="mt-4 text-2xl font-bold text-blue-700">
                    ₹{product?.price ?? "0"}
                  </p>

                  {/* ACTIONS */}

                  <div className="mt-5 flex gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(product)
                      }
                      disabled={
                        cartLoadingId ===
                        productId
                      }
                      className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                    >
                      <FiShoppingCart className="mr-2" />

                      {cartLoadingId ===
                      productId
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>

                    <Link
                      to={`/product/${productId}`}
                      className="flex items-center justify-center rounded-xl border border-blue-600 px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                    >
                      View
                    </Link>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* CONTINUE SHOPPING */}

        <div className="mt-12 text-center">

          <Link
            to="/products"
            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </div>
  );
};

export default Wishlist;
