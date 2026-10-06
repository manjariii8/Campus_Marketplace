import{ useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiZap, FiHeart } from "react-icons/fi";

import {
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from "../../services/wishlistService";

import QuantitySelector from "./QuantitySelector";

import { addToCart } from "../../services/cartService";

import useAuth from "../../hooks/useAuth";

const ProductInfo = ({ product, quantity, setQuantity }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [updatingWishlist, setUpdatingWishlist] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadWishlistStatus = async () => {
      if (!user || !product?.id) {
        setIsWishlisted(false);
        return;
      }

      try {
        const response = await checkWishlist(product.id);

        if (!cancelled) {
          const result = response.data;

          setIsWishlisted(
            typeof result === "boolean"
              ? result
              : result?.data === true
          );
        }
      } catch (error) {
        if (!cancelled) {
          setIsWishlisted(false);
        }
      }
    };

    loadWishlistStatus();

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
  | WISHLIST
  |--------------------------------------------------------------------------
  */

  const handleWishlist = async () => {
    clearMessage();

    if (!user) {
      showMessage("Please login to use your wishlist.");
      navigate("/login");
      return;
    }

    if (!product?.id || updatingWishlist) return;

    setUpdatingWishlist(true);

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);

        setIsWishlisted(false);

        showMessage(
          "Removed from wishlist.",
          "success"
        );
      } else {
        await addToWishlist(product.id);

        setIsWishlisted(true);

        showMessage(
          "Added to wishlist.",
          "success"
        );
      }
    } catch (error) {
      console.error(
        "Wishlist update failed:",
        error
      );

      showMessage(
        error?.response?.data?.message ||
          "Unable to update wishlist."
      );
    } finally {
      setUpdatingWishlist(false);
    }
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

      navigate("/login");
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

    if (!quantity || quantity < 1) {
      showMessage(
        "Please select a valid quantity."
      );
      return;
    }

    setAddingToCart(true);

    try {
      await addToCart({
        productId: product.id,
        quantity: quantity,
      });

      showMessage(
        "Product added to cart successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Add to cart failed:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Unable to add product to cart.";

      showMessage(
        typeof message === "string"
          ? message
          : "Unable to add product to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | BUY NOW
  |--------------------------------------------------------------------------
  */

  const handleBuyNow = async () => {
    clearMessage();

    if (!user) {
      showMessage(
        "Please login to continue."
      );

      navigate("/login");
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

    if (!quantity || quantity < 1) {
      showMessage(
        "Please select a valid quantity."
      );
      return;
    }

    setBuyingNow(true);

    try {
      /*
       * Add the selected product to the cart first.
       */
      await addToCart({
        productId: product.id,
        quantity: quantity,
      });

      /*
       * Then go to checkout.
       */
      navigate("/checkout");
    } catch (error) {
      console.error(
        "Buy now failed:",
        error
      );

      const responseMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Unable to continue to checkout.";

      showMessage(
        typeof responseMessage === "string"
          ? responseMessage
          : "Unable to continue to checkout."
      );
    } finally {
      setBuyingNow(false);
    }
  };

  return (
    <div>
      {/* INLINE MESSAGE */}

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

      {/* CATEGORY */}

      {product.categoryName && (
        <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
          {product.categoryName}
        </span>
      )}

      {/* PRODUCT NAME */}

      <h1 className="mt-4 text-4xl font-bold text-slate-800">
        {product.name}
      </h1>

      {/* PRICE */}

      <h2 className="mt-6 text-5xl font-bold text-blue-700">
        ₹ {product.price}
      </h2>

      {/* DESCRIPTION */}

      <p className="mt-8 leading-8 text-slate-600">
        {product.description}
      </p>

      {/* STOCK */}

      {product.stock !== undefined && (
        <p
          className={`mt-5 font-semibold ${
            product.stock > 0
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {product.stock > 0
            ? `${product.stock} items available`
            : "Out of stock"}
        </p>
      )}

      {/* QUANTITY */}

      <div className="mt-8">
        <p className="mb-3 font-semibold text-slate-700">
          Quantity
        </p>

        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>

      {/* ACTIONS */}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        {/* BUY NOW */}

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={
            buyingNow ||
            addingToCart ||
            product.stock <= 0
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <FiZap size={20} />

          {buyingNow
            ? "Processing..."
            : "Buy Now"}
        </button>

        {/* WISHLIST */}

        <button
          type="button"
          onClick={handleWishlist}
          disabled={updatingWishlist}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-4 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            isWishlisted
              ? "border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-100"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <FiHeart
            size={20}
            className={
              isWishlisted
                ? "fill-current"
                : ""
            }
          />

          {updatingWishlist
            ? "Updating..."
            : isWishlisted
              ? "Wishlisted"
              : "Wishlist"}
        </button>

        {/* ADD TO CART */}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={
            addingToCart ||
            buyingNow ||
            product.stock <= 0
          }
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <FiShoppingCart size={20} />

          {addingToCart
            ? "Adding..."
            : "Add to Cart"}
        </button>
      </div>

      {/* SELLER */}

      <div className="mt-10 rounded-xl bg-slate-100 p-5">
        <h3 className="text-lg font-bold text-slate-800">
          Seller
        </h3>

        <p className="mt-2 text-slate-600">
          {product.sellerName ||
            "Marketplace Seller"}
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;
