import React from "react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/input";
import StatusBadge from "../../common/StatusBadge";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OrderItems = ({
  order,
  selectedItemId,
  setSelectedItemId,
  itemCancelReasons,
  setItemCancelReasons,
  itemReturnReasons,
  setItemReturnReasons,
  cancelOrderItem,
  requestReturnItem,
  refetch,
}) => {
  const navigate = useNavigate();

  const handleItemCancel = async (itemId) => {
    const reason = itemCancelReasons[itemId];
    if (!reason?.trim()) {
      toast.error("Please provide a reason for cancelling this item", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      await cancelOrderItem({ orderId: order.orderNumber, itemId, cancelProductReason: reason }).unwrap();
      toast.success("Item cancelled successfully");
      setItemCancelReasons((prev) => ({ ...prev, [itemId]: "" }));
      setSelectedItemId(null);
      refetch();
    } catch (err) {
      toast.error(`Failed to cancel item: ${err.data?.message || "Unknown error"}`);
    }
  };

  const handleItemReturn = async (itemId) => {
    const reason = itemReturnReasons[itemId];
    if (!reason?.trim()) {
      toast.error("Please provide a reason for returning this item", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    try {
      await requestReturnItem({ orderId: order._id, itemId, reason: reason }).unwrap();
      toast.success("Return request submitted for item");
      setItemReturnReasons((prev) => ({ ...prev, [itemId]: "" }));
      setSelectedItemId(null);
      refetch();
    } catch (err) {
      toast.error(`Failed to submit return request: ${err.data?.message || "Unknown error"}`);
    }
  };

  const toggleItemActions = (itemId) => {
    setSelectedItemId(selectedItemId === itemId ? null : itemId);
  };

  return (
    <div className="lg:col-span-2">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Items Ordered</h3>
      <div className="space-y-4">
        {order.items.map((item) => {
          const itemStatus = item.status;
          const canCancelItem = itemStatus === "Pending" || itemStatus === "Confirmed";
          const canReturnItem = itemStatus === "Delivered";
          const isSelected = selectedItemId === item._id;

          return (
            <div
              key={item._id}
              className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="flex items-center cursor-pointer"
                onClick={() => toggleItemActions(item._id)}
              >
                <img
                  src={item?.image}
                  alt={item.name}
                  className="h-16 w-16 object-cover rounded-md mr-4"
                  onError={(e) => (e.target.src = "")}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/shop/${item.productId._id}`);
                  }}
                />
                <div className="flex-grow flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">
                      {item.name} <span className="text-gray-500">({item.color})</span>
                    </h4>
                    <p className="text-sm py-2 font-semibold text-gray-900">₹{item.totalPrice}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center">
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              </div>

              {isSelected && (canCancelItem || canReturnItem) && (
                <div className="mt-4">
                  <Textarea
                    placeholder={`Reason for ${canCancelItem ? "cancelling" : "returning"}...`}
                    value={
                      canCancelItem
                        ? itemCancelReasons[item._id] || ""
                        : itemReturnReasons[item._id] || ""
                    }
                    rows={4}
                    onChange={(e) =>
                      canCancelItem
                        ? setItemCancelReasons((prev) => ({
                            ...prev,
                            [item._id]: e.target.value,
                          }))
                        : setItemReturnReasons((prev) => ({
                            ...prev,
                            [item._id]: e.target.value,
                          }))
                    }
                    className="w-full mb-2 border-gray-200 focus:ring-orange-800/30"
                  />
                  <div className="flex gap-2 py-2">
                    {canCancelItem && (
                      <Button
                        onClick={() => handleItemCancel(item._id)}
                        className="bg-orange-800/90 hover:bg-orange-800 text-white text-sm"
                        size="sm"
                      >
                        Cancel Item
                      </Button>
                    )}
                    {canReturnItem && (
                      <Button
                        onClick={() => handleItemReturn(item._id)}
                        className="bg-orange-800/90 hover:bg-orange-800 text-white text-sm"
                        size="sm"
                      >
                        Return Item
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderItems;