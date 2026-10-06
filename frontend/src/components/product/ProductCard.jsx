import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";


import { addToCart } from "../../services/cartService";

import {
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from "../../services/wishlistService";

import useAuth from "../../hooks/useAuth";

const ProductCard = ({ product }) => {
  const { user } = useAuth();

  const [wishlist, setWishlist] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /*
  |--------------------------------------------------------------------------
  | CHECK WISHLIST STATUS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    const checkWishlistStatus = async () => {
      if (!user || !product?.id) {
        setWishlist(false);
        return;
      }

      try {
        const response = await checkWishlist(product.id);

        if (!cancelled) {
          const result = response.data;

          setWishlist(
            typeof result === "boolean"
              ? result
              : result?.data === true
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Unable to check wishlist:",
            error
          );

          setWishlist(false);
        }
      }
    };

    checkWishlistStatus();

    return () => {
      cancelled = true;
    };
  }, [user, product?.id]);

  const showMessage = (text, type = "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const clearMessage = () => {
    setMessage("");
    setMessageType("");
  };

  /*
  |--------------------------------------------------------------------------
  | ADD TO CART
  |--------------------------------------------------------------------------
  */

  const handleAddToCart = async () => {
    clearMessage();

    if (!user) {
      showMessage(
        "Please login to add products to cart."
      );
      return;
    }

    if (!product?.id) {
      showMessage(
        "Product information is missing."
      );
      return;
    }

    if (
      product.stock !== undefined &&
      product.stock <= 0
    ) {
      showMessage(
        "This product is out of stock."
      );
      return;
    }

    setCartLoading(true);

    try {
      await addToCart({
        productId: product.id,
        quantity: 1,
      });

      showMessage(
        "Product added to cart.",
        "success"
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      const responseMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Unable to add product to cart.";

      showMessage(
        typeof responseMessage === "string"
          ? responseMessage
          : "Unable to add product to cart."
      );
    } finally {
      setCartLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | TOGGLE WISHLIST
  |--------------------------------------------------------------------------
  */

  const handleWishlist = async () => {
    clearMessage();

    if (!user) {
      showMessage(
        "Please login to use your wishlist."
      );
      return;
    }

    if (!product?.id || wishlistLoading) {
      return;
    }

    setWishlistLoading(true);

    try {
      if (wishlist) {
        await removeFromWishlist(product.id);

        setWishlist(false);

        showMessage(
          "Removed from wishlist.",
          "success"
        );
      } else {
        await addToWishlist(product.id);

        setWishlist(true);

        showMessage(
          "Added to wishlist.",
          "success"
        );
      }
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      const responseMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Unable to update wishlist.";

      showMessage(
        typeof responseMessage === "string"
          ? responseMessage
          : "Unable to update wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* =====================================================
          IMAGE
      ====================================================== */}

      <div className="relative overflow-hidden bg-slate-100">
        <div className="aspect-square">
          {product?.imageUrl ||
          product?.imageData ? (
            <img
              src={
                product.imageUrl ||
                product.imageData
              }
              alt={
                product?.name || "Product"
              }
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              onError={(e) => {
                console.error(
                  "PRODUCT IMAGE FAILED"
                );
                console.error(
                  "imageUrl:",
                  product?.imageUrl
                );
                console.error(
                  "imageData:",
                  product?.imageData
                );

                e.currentTarget.style.display =
                  "none";
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="text-5xl">
                  📦
                </div>

                <p className="mt-2 text-sm">
                  No image
                </p>
              </div>
            </div>
          )}
        </div>

        {/* DISCOUNT */}

        {product.discountPercentage > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
            {product.discountPercentage}% OFF
          </span>
        )}

        {/* ACTION BUTTONS */}

        <div className="absolute right-4 top-4 flex flex-col gap-2">

          {/* WISHLIST */}

          <button
            type="button"
            onClick={handleWishlist}
            disabled={wishlistLoading}
            title={
              wishlist
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md transition ${
              wishlist
                ? "bg-red-500 text-white"
                : "bg-white text-slate-600 hover:bg-red-500 hover:text-white"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <FiHeart
              size={18}
              className={
                wishlist
                  ? "fill-current"
                  : ""
              }
            />
          </button>

          {/* VIEW */}

          <Link
            to={`/product/${product.id}`}
            title="View product"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-md transition hover:bg-blue-600 hover:text-white"
          >
            <FiEye size={18} />
          </Link>
        </div>
      </div>

      {/* =====================================================
          DETAILS
      ====================================================== */}

      <div className="p-5">

        {/* INLINE MESSAGE */}

        {message && (
          <div
            className={`mb-4 rounded-lg border px-3 py-2 text-xs font-medium ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        {/* CATEGORY */}

        {product.categoryName && (
          <p className="text-sm font-medium text-blue-600">
            {product.categoryName}
          </p>
        )}

        {/* NAME */}

        <h3 className="mt-2 line-clamp-2 text-xl font-bold text-slate-800">
          {product.name}
        </h3>

        {/* DESCRIPTION */}

        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
          {product.description}
        </p>

        {/* PRICE */}

        <div className="mt-5 flex items-center gap-3">
          <span className="text-2xl font-bold text-blue-700">
            ₹{product.price}
          </span>

          {product.originalPrice &&
            Number(product.originalPrice) >
              Number(product.price) && (
              <span className="text-sm text-slate-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
        </div>

        {/* STOCK */}

        {product.stock !== undefined && (
          <p
            className={`mt-2 text-sm font-medium ${
              product.stock > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} available`
              : "Out of stock"}
          </p>
        )}

        {/* BUTTONS */}

        <div className="mt-6 flex gap-3">

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              cartLoading ||
              product.stock <= 0
            }
            className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <FiShoppingCart className="mr-2" />

            {cartLoading
              ? "Adding..."
              : product.stock <= 0
                ? "Out of Stock"
                : "Add to Cart"}
          </button>

          <Link
            to={`/product/${product.id}`}
            className="rounded-xl border border-blue-600 px-5 py-3 text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
