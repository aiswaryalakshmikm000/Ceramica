
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Textarea } from "../../../components/ui/input";
import { toast } from "react-toastify";

const CancelOrderDialog = ({ open, onOpenChange, order }) => {
  const [reason, setReason] = useState("");

  const handleCancel = () => {
    if (!order?.orderId) {
      toast.error("Invalid order information", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // This would call your API to cancel the order
    console.log(`Cancelling order ${order.orderId} with reason: ${reason}`);

    toast.success(`Order ${order.orderId} cancelled successfully`, {
      position: "top-right",
      autoClose: 3000,
    });

    setReason(""); // Reset the form
    onOpenChange(false); // Close the dialog
  };

  const handleClose = () => {
    setReason(""); // Reset form
    onOpenChange(false); // Close the dialog
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Cancel Order #{order?.orderId || "Unknown"}</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for cancellation (optional)
          </label>
          <Textarea
            id="cancel-reason"
            placeholder="Please share why you're cancelling this order..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Keep Order
          </Button>
          <Button
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Cancel Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderDialog;