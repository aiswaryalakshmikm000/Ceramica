
import React from "react";
import { Lock, RotateCcw, Shield } from "lucide-react";
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

  console.log("User ID from Redux:", userId);

  const {
    data: cart,
    isLoading,
    error,
  } = useGetCartQuery(userId, { skip: !user });
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  if (isLoading) return <div>Loading cart...</div>;
  if (error) {
    toast.error(error?.data?.message || "Failed to retrieve cart");
    return <div>Error loading cart: {error?.data?.message || error.message}</div>;
  }
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <a
              href="/shop"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }


  const handleRemoveItem = async (productId, color) => {
    try {
      const response = await removeFromCart({ userId, productId: productId._id, color }).unwrap();
      toast.success(response.message || "Item successfully removed from cart");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove item from cart");
    }
  };

  const handleUpdateQuantity = async (productId, color, newQuantity) => {
    try {
      console.log("Updating quantity:", {
        userId,
        productId,
        color,
        newQuantity,
      });
      const response = await updateCartItem({
        userId,
        productId: productId._id,
        quantity: newQuantity,
        color,
      }).unwrap();
      toast.success(response.message || "Cart item quantity updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update quantity");
    }
  };

  const subtotal = cart.items
    .reduce((acc, item) => acc + item.latestPrice * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50/50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            {cart.items.map((item) => (
              <CartItem
                key={`${item.productId}-${item.color}`}
                id={item.productId}
                name={item.name}
                originalPrice={item.originalPrice}
                latestPrice={item.latestPrice}
                discount={item.discount}
                quantity={item.quantity}
                image={item.image}
                color={item.color}
                onRemove={() => handleRemoveItem(item.productId, item.color)}
                onUpdateQuantity={(newQuantity) =>
                  handleUpdateQuantity(item.productId, item.color, newQuantity)
                }
              />
            ))}
            <button
              className="w-full text-orange-500 hover:bg-orange-50 py-3 rounded-lg transition-colors font-medium"
              onClick={() => navigate("/shop")}
            >
              Shop More
            </button>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl sticky top-8 shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Order Summary
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{cart.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Original Price</span>
                  <span>₹{cart.totalMRP.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal (After Discount)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Total Discount</span>
                  <span>-₹{cart.totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>₹{cart.deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{cart.platformFee.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between font-bold text-lg text-gray-800">
                  <span>Total Amount</span>
                  <span>₹{cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="bg-green-50 text-green-700 text-sm py-2 px-3 rounded-md">
                  You save: ₹{cart.totalDiscount.toFixed(2)}
                </div>
              </div>

              <button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition-colors font-medium">
                Place Order
              </button>

              <div className="mt-6 text-gray-600 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Lock size={16} className="text-orange-600" />
                  </div>
                  <span>Safe and Secure Payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <RotateCcw size={16} className="text-orange-600" />
                  </div>
                  <span>Easy 30-Day Returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Shield size={16} className="text-orange-600" />
                  </div>
                  <span>100% Authentic Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;