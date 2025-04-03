
import React from "react";
import { Lock, RotateCcw, Shield, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/userAuthSlice";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "../../../features/products/userProductApislice";
import CartItem from "./CartItem";
import { toast } from "react-toastify";

const Cart = () => {
  const user = useSelector(selectUser);
  const userId = user?._id;
  const navigate = useNavigate();

  const {
    data: cart,
    isLoading,
    error,
  } = useGetCartQuery(userId, { skip: !user });
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  if (isLoading) return <div className="text-center py-20">Loading cart...</div>;
  if (error) {
    toast.error(error?.data?.message || "Failed to retrieve cart");
    return (
      <div className="text-center py-20 text-red-600">
        Error loading cart: {error?.data?.message || error.message}
      </div>
    );
  }
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate("/shop")}
              className="inline-block bg-orange-800 hover:bg-orange-900 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleRemoveItem = async (productId, color) => {
    try {
      const response = await removeFromCart({ userId, productId: productId._id, color }).unwrap();
      toast.success(response.message || "Item removed from cart");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove item");
    }
  };

  const handleUpdateQuantity = async (productId, color, newQuantity) => {
    try {
      const response = await updateCartItem({
        userId,
        productId: productId._id,
        quantity: newQuantity,
        color,
      }).unwrap();
      toast.success(response.message || "Quantity updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update quantity");
    }
  };

  const handleClearCart = async () => {
    try {
      for (const item of cart.items) {
        await removeFromCart({ userId, productId: item.productId._id, color: item.color }).unwrap();
      }
      toast.success("Cart cleared successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to clear cart");
    }
  };

  const subtotal = cart.items
    .reduce((acc, item) => acc + item.latestPrice * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-l font-semibold text-gray-800">
                  Items in Your Cart ({cart.totalItems})
                </h2>
                <button
                  onClick={handleClearCart}
                  className="flex items-center text-red-600 hover:text-red-700 font-small transition-colors"
                >
                  <Trash2 size={15} className="mr-1" />
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItem
                    key={`${item.productId._id}-${item.color}`}
                    id={item.productId._id}
                    name={item.name}
                    originalPrice={item.originalPrice}
                    latestPrice={item.latestPrice}
                    discount={item.discount}
                    quantity={item.quantity}
                    image={item.image}
                    color={item.color}
                    inStock={item.inStock}
                    onRemove={() => handleRemoveItem(item.productId, item.color)}
                    onUpdateQuantity={(newQuantity) =>
                      handleUpdateQuantity(item.productId, item.color, newQuantity)
                    }
                  />
                ))}
              </div>

              <button
                onClick={() => navigate("/shop")}
                className="mt-6 w-full text-black-800 hover:text-orange-900 py-2 rounded-lg font-medium transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl sticky top-8 shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Order Summary
              </h2>
              <div className="space-y-4 text-gray-700 border-t py-6">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{cart.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Original Price</span>
                  <span>₹{cart.totalMRP.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Total Discount</span>
                  <span>-₹{cart.totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>₹{cart.deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{cart.platformFee.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between font-bold text-lg text-gray-800">
                  <span>Total Amount</span>
                  <span>₹{cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="bg-green-50 text-green-700 text-sm py-2 px-3 rounded-md">
                  You save: ₹{cart.totalDiscount.toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-orange-800 hover:bg-orange-900 text-white py-3 rounded-lg transition-colors font-medium"
              >
                Proceed to Checkout
              </button>

              {/* <div className="mt-6 text-gray-600 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-orange-800" />
                  <span>Safe and Secure Payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw size={16} className="text-orange-800" />
                  <span>Easy 30-Day Returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-orange-800" />
                  <span>100% Authentic Products</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;