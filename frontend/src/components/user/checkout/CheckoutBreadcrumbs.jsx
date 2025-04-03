import React from "react";
import { Check } from "lucide-react";

const CheckoutBreadcrumbs = ({ steps, activeStep }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  index < activeStep
                    ? "bg-orange-800/90 text-white"
                    : index === activeStep
                    ? "bg-orange-800/90 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < activeStep ? (
                  <Check size={20} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <p
                className={`mt-2 text-sm ${
                  index <= activeStep ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step}
              </p>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  index < activeStep ? "bg-orange-700/50" : "bg-gray-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutBreadcrumbs;