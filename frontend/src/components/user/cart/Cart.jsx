
import React, { useState, useEffect } from "react";
import { Lock, RotateCcw, Shield, Trash2, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userAuth/userAuthSlice";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "../../../features/userAuth/userCartApislice";
import CartItem from "./CartItem";
import CartOrderSummary from "./CartOrderSummary";
import { toast } from "react-toastify";
import Fallback from "../../common/Fallback";
import Breadcrumbs from "../../common/BreadCrumbs";

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

  const [problematicItems, setProblematicItems] = useState({
    outOfStockItems: [],
    unlistedItems: [],
  });

  if (isLoading || error || !user) {
    return (
      <Fallback
        isLoading={isLoading}
        error={error}
        noUser={!user}
        emptyMessage={null}
        emptyActionText="Continue Shopping"
        emptyActionPath="/shop"
      />
    );
  }

  const handleRemoveItem = async (productId, color) => {
    try {
      const response = await removeFromCart({ userId, productId: productId._id, color }).unwrap();
      toast.success(response.message || "Item removed from cart");
      setProblematicItems(prev => ({
        outOfStockItems: prev.outOfStockItems.filter(item => item.productId !== productId._id || item.color !== color),
        unlistedItems: prev.unlistedItems.filter(item => item.productId !== productId._id || item.color !== color),
      }));
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
      setProblematicItems({ outOfStockItems: [], unlistedItems: [] });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to clear cart");
    }
  };

  const subtotal = cart.items
    .reduce((acc, item) => acc + item.productId.discountedPrice * item.quantity, 0)
    .toFixed(2);

  const isCartEmpty = !cart || cart.items.length === 0;

  const totalAmount = isCartEmpty
    ? subtotal
    : (parseFloat(subtotal) + cart.deliveryCharge + cart.platformFee).toFixed(2);

  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Cart", href: "/cart" },
  ];

  const isProblematic = (productId, color) => {
    return (
      problematicItems.outOfStockItems.some(item => item.productId === productId._id && item.color === color) ||
      problematicItems.unlistedItems.some(item => item.productId === productId._id && item.color === color)
    );
  };

  const getProblematicReason = (productId, color) => {
    if (problematicItems.outOfStockItems.some(item => item.productId === productId._id && item.color === color)) {
      return "Out of Stock";
    }
    if (problematicItems.unlistedItems.some(item => item.productId === productId._id && item.color === color)) {
      return "No Longer Available";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  My Cart
                </h2>
                <button
                  onClick={handleClearCart}
                  className="flex items-center text-red-600 hover:text-red-700 font-small transition-colors"
                >
                  <Trash2 size={15} className="mr-1" />
                  Clear All
                </button>
              </div>
              <Breadcrumbs items={breadcrumbItems} />

              {!cart || cart.items.length === 0 ? (
                <Fallback
                  isLoading={false}
                  error={null}
                  noUser={false}
                  emptyMessage="Your cart is empty"
                  emptyActionText="Continue Shopping"
                  emptyActionPath="/shop"
                />
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={`${item.productId._id}-${item.color}`}
                      className={`relative ${isProblematic(item.productId, item.color) ? "border-2 border-red-500 rounded-lg p-2" : ""}`}
                    >
                      <CartItem
                        id={item.productId._id}
                        name={item.productId.name}
                        originalPrice={item.productId.price}
                        latestPrice={item.productId.discountedPrice}
                        discount={item.productId.discount}
                        quantity={item.quantity}
                        image={item.image}
                        color={item.color}
                        stock={item.productId.colors.find(c => c.name === item.color)?.stock || 0}
                        inStock={item.inStock}
                        onRemove={() => handleRemoveItem(item.productId, item.color)}
                        onUpdateQuantity={(newQuantity) =>
                          handleUpdateQuantity(item.productId, item.color, newQuantity)
                        }
                      />
                      {isProblematic(item.productId, item.color) && (
                        <span className="absolute top-2 right-2 text-red-600 text-sm font-medium">
                          {getProblematicReason(item.productId, item.color)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!isCartEmpty && (
                <button
                  onClick={() => navigate("/shop")}
                  className="mt-6 w-full text-black-800 hover:text-orange-900 py-2 rounded-lg font-medium transition-colors"
                >
                  Continue Shopping
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <CartOrderSummary
            cart={cart}
            subtotal={subtotal}
            isCartEmpty={isCartEmpty}
            totalAmount={totalAmount}
            setProblematicItems={setProblematicItems} 
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;


