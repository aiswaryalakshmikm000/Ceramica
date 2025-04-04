

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

const ReturnOrderDialog = ({ open, onOpenChange, order }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleReturn = () => {
    if (!reason.trim()) {
      setError("Please provide a reason for your return");
      return;
    }

    if (!order?.orderId) {
      setError("Invalid order information");
      return;
    }

    // API call would go here
    console.log(`Returning order ${order.orderId} with reason: ${reason}`);
    
    toast.success(`Return request for order ${order.orderId} submitted`, {
      position: "top-right",
      autoClose: 3000,
    });
    
    setReason("");  // Reset form
    setError("");
    onOpenChange(false);  // Close the dialog
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onOpenChange(false);  // Close the dialog
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Return Order #{order?.orderId || "Unknown"}</DialogTitle>
          <DialogDescription>
            Please provide details about why you want to return this order.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <label 
            htmlFor="return-reason" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reason for return <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="return-reason"
            placeholder="Please explain the reason for your return..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
            className={`w-full ${error ? "border-red-500 focus:ring-red-500" : ""}`}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleReturn}
            className="bg-orange-800/90 hover:bg-orange-800 focus:ring-orange-800"
          >
            Submit Return
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnOrderDialog;