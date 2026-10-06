import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import CartList from "../components/cart/CartList";
import OrderSummary from "../components/cart/OrderSummary";

import {
    getCart,
    updateCartQuantity,
    removeCartItem,
    clearCart,
} from "../services/cartService";

const Cart = () => {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {

        try {

            setLoading(true);

            const response = await getCart();

            /*
             * Backend ApiResponse:
             *
             * {
             *   success: true,
             *   message: "...",
             *   data: [...]
             * }
             */

            const cartData =
                Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.data)
                        ? response.data.data
                        : [];
            
            console.log(
    "First cart item:",
    JSON.stringify(cartData[0], null, 2)
);

            setItems(cartData);

        } catch (error) {

            console.error("Failed to load cart:", error);

            toast.error("Unable to load cart.");

            setItems([]);

        } finally {

            setLoading(false);

        }
    };


    const handleIncrease = async (item) => {

        try {

            await updateCartQuantity(
                item.id,
                item.quantity + 1
            );

            await loadCart();

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to update quantity."
            );

        }
    };


    const handleDecrease = async (item) => {

        if (item.quantity <= 1) {
            return;
        }

        try {

            await updateCartQuantity(
                item.id,
                item.quantity - 1
            );

            await loadCart();

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to update quantity."
            );

        }
    };


    const handleDelete = async (id) => {

        try {

            await removeCartItem(id);

            toast.success(
                "Item removed from cart."
            );

            await loadCart();

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to remove item."
            );

        }
    };


    const handleClearCart = async () => {

        try {

            await clearCart();

            setItems([]);

            toast.success(
                "Cart cleared successfully."
            );

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to clear cart."
            );

        }
    };


    if (loading) {

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="mt-4 text-slate-500">
                        Loading your cart...
                    </p>

                </div>

            </div>
        );

    }


    return (

        <div className="min-h-screen bg-slate-50 py-12">

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}

                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <h1 className="text-4xl font-bold text-slate-900">
                            Shopping Cart
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Review your items before checkout.
                        </p>

                    </div>

                    {items.length > 0 && (

                        <button
                            onClick={handleClearCart}
                            className="rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                        >
                            Clear Cart
                        </button>

                    )}

                </div>


                {/* Empty Cart */}

                {items.length === 0 ? (

                    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">

                            <span className="text-3xl">
                                🛒
                            </span>

                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-slate-800">
                            Your cart is empty
                        </h2>

                        <p className="mt-3 text-slate-500">
                            Add some products to your cart and they will appear here.
                        </p>

                        <Link
                            to="/products"
                            className="mt-7 inline-block rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Browse Products
                        </Link>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                        {/* Cart Items */}

                        <div className="lg:col-span-2">

                            <CartList
                                items={items}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                                onDelete={handleDelete}
                            />

                        </div>


                        {/* Summary */}

                        <div>

                            <OrderSummary
                                items={items}
                            />

                        </div>

                    </div>

                )}

            </div>

        </div>

    );
};

export default Cart;