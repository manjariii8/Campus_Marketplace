import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiTrash } from "react-icons/fi";

import { getProduct } from "../../services/productService";
import { getImageUrl } from "../../utils/imageUrl";

const CartItem = ({ item, onIncrease, onDecrease, onDelete }) => {
    const [productImage, setProductImage] = useState(null);

    useEffect(() => {
        let active = true;

        const loadProductImage = async () => {
            try {
                if (!item.productId) return;

                const response = await getProduct(item.productId);

                // Support both a direct product response and an ApiResponse wrapper.
                const product = response.data?.data ?? response.data;

                const image =
                    product?.imageUrl ||
                    product?.imageData ||
                    product?.image ||
                    null;

                if (active && image) {
                    setProductImage(getImageUrl(image));
                }
            } catch (error) {
                console.error(
                    `Unable to load image for product ${item.productId}:`,
                    error
                );
            }
        };

        loadProductImage();

        return () => {
            active = false;
        };
    }, [item.productId]);

    return (
        <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:gap-6">
            {/* Product image */}
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {productImage ? (
                    <img
                        src={productImage}
                        alt={item.productName || "Product"}
                        className="h-full w-full object-cover"
                        onError={() => setProductImage(null)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                        Loading image...
                    </div>
                )}
            </div>

            {/* Product information */}
            <div className="min-w-0 flex-1">
                <h2 className="break-words text-xl font-bold text-slate-900">
                    {item.productName}
                </h2>

                <p className="mt-2 text-gray-500">
                    ₹ {Number(item.price || 0).toFixed(2)}
                </p>

                <div className="mt-5 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => onDecrease(item)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="rounded border p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <FiMinus />
                    </button>

                    <span className="min-w-5 text-center">
                        {item.quantity}
                    </span>

                    <button
                        type="button"
                        onClick={() => onIncrease(item)}
                        aria-label="Increase quantity"
                        className="rounded border p-2 transition hover:bg-slate-100"
                    >
                        <FiPlus />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        aria-label="Remove item"
                        className="ml-auto text-red-600 transition hover:text-red-800"
                    >
                        <FiTrash />
                    </button>
                </div>
            </div>

            {/* Item total */}
            <div className="shrink-0 text-xl font-bold text-slate-900 sm:text-2xl">
                ₹{" "}
                {Number(
                    item.totalPrice ??
                    Number(item.price || 0) * Number(item.quantity || 0)
                ).toFixed(2)}
            </div>
        </div>
    );
};

export default CartItem;