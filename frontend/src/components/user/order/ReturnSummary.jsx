// ReturnSummary.js
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

const ReturnSummary = ({ order, formatDate }) => {
  const hasFullReturnRequest = order.returnRequest?.isRequested;
  const hasItemReturns = order.items.some((item) => item.returnRequest?.isRequested);

  if (!hasFullReturnRequest && !hasItemReturns) return null;

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Return Summary</h3>

      {/* Full Order Return Summary */}
      {hasFullReturnRequest && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 shadow-sm">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Full Order Return</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">Request Date:</span>{" "}
              {order.returnRequest.requestedAt
                ? formatDate(order.returnRequest.requestedAt)
                : "N/A"}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              {!order.returnRequest.isApproved ? (
                "Return Requested"
              ) : order.returnRequest.isApproved ? (
                <span className="flex items-center">
                  <CheckCircle size={14} className="text-green-600 mr-1" /> Approved
                  {order.returnRequest.approvedAt && (
                    <> on {formatDate(order.returnRequest.approvedAt)}</>
                  )}
                </span>
              ) : (
                <span className="flex items-center">
                  <XCircle size={14} className="text-red-600 mr-1" /> Rejected
                  {order.returnRequest.approvedAt && (
                    <> on {formatDate(order.returnRequest.approvedAt)}</>
                  )}
                </span>
              )}
            </p>
            <p>
              <span className="font-medium">Reason:</span> {order.returnRequest.reason || "N/A"}
            </p>
            {order.returnRequest.adminComment && (
              <p>
                <span className="font-medium">Admin Comment:</span>{" "}
                {order.returnRequest.adminComment}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Individual Item Return Summaries */}
      {hasItemReturns && (
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Item Returns</h4>
          {order.items.map((item) =>
            item.returnRequest?.isRequested ? (
              <div key={item._id} className="border-t border-gray-200 pt-4 mt-4 first:border-t-0 first:mt-0">
                <h5 className="text-md font-medium text-gray-700">{item.name}</h5>
                <div className="space-y-2 text-sm text-gray-600 mt-2">
                  <p>
                    <span className="font-medium">Request Date:</span>{" "}
                    {item.returnRequest.requestedAt
                      ? formatDate(item.returnRequest.requestedAt)
                      : "N/A"}
                  </p>

                  <p>
                    <span className="font-medium">Reason:</span>{" "}
                    {item.returnRequest.reason || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {item.returnRequest.isApproved === null ? (
                      "Pending"
                    ) : item.returnRequest.isApproved ? (
                      <span className="flex items-center">
                        <CheckCircle size={14} className="text-green-600 mr-1" /> Approved
                        {item.returnRequest.approvedAt && (
                          <> on {formatDate(item.returnRequest.approvedAt)}</>
                        )}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <XCircle size={14} className="text-red-600 mr-1" /> Rejected
                        {item.returnRequest.approvedAt && (
                          <> on {formatDate(item.returnRequest.approvedAt)}</>
                        )}
                      </span>
                    )}
                  </p>
                  
                  {item.returnRequest.adminComment && (
                    <p>
                      <span className="font-medium">Admin Comment:</span>{" "}
                      {item.returnRequest.adminComment}
                    </p>
                  )}
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default ReturnSummary;