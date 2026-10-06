import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProduct } from "../services/productService";

import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      setProduct(null);

      const response = await getProduct(id);

      /*
       * Backend returns the product directly for this endpoint.
       */
      setProduct(response.data);
    } catch (error) {
      console.error("Failed to load product:", error);

      const status = error?.response?.status;

      if (status === 404) {
        setError(
          "Product not found or it is not available in your campus marketplace."
        );
      } else if (status === 401) {
        setError(
          "Please log in to view this product."
        );
      } else if (status === 403) {
        setError(
          "You do not have access to this product."
        );
      } else {
        setError(
          "Unable to load product. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">
          Loading product...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-4xl">
            📦
          </div>

          <h2 className="mb-2 text-xl font-semibold text-slate-900">
            Product unavailable
          </h2>

          <p className="text-sm leading-6 text-slate-500">
            {error || "Product not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-2">

          <ProductGallery
            product={product}
          />

          <ProductInfo
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
          />

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
