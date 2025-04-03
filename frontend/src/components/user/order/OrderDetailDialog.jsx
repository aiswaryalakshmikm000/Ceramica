import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { Badge } from "../../ui/OrderBadge";

const OrderDetailDialog = ({ open, onOpenChange, order, onDownloadInvoice }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "returned":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Add null check for order
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.orderId}</span>
            <Badge className={`${getStatusColor(order.status)}`}>
              {order.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Ordered on {order.date}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Shipping Address</h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Order Details</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tracking Number:</span>
                  <span>{order.trackingNumber}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{order.total}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div>
            <h3 className="text-sm font-medium mb-3">Items in Your Order</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex border border-gray-100 rounded-md p-3">
                  <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">{item.price}</p>
                    </div>
                    <div className="mt-1">
                      <Badge className={`${getStatusColor(item.status)} text-xs`}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onOpenChange(false)} // This ensures the dialog closes
          >
            Close
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadInvoice}
            >
              <Download size={14} className="mr-1.5" />
              Download Invoice
            </Button>
            
            {order.status === "Shipped" && (
              <Button
                variant="outline"
                size="sm"
              >
                <ExternalLink size={14} className="mr-1.5" />
                Track Order
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;