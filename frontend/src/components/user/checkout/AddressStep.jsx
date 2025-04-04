import React, { useState } from "react";
import { MapPin, Plus, Edit, Check } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userAuth/userAuthSlice";
import { useSetDefaultAddressMutation } from "../../../features/userAuth/userAddressApiSlice";
import AddressForm from "../address/AddressForm"; 
import { toast } from "react-toastify";
import { useAddAddressMutation, useUpdateAddressMutation } from "../../../features/userAuth/userAddressApiSlice";

const AddressStep = ({ addresses, selectedAddress, setSelectedAddress, onNext }) => {
  const user = useSelector(selectUser);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [setDefaultAddress] = useSetDefaultAddressMutation();
  const [addAddress] = useAddAddressMutation(); 
  const [updateAddress] = useUpdateAddressMutation(); 

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsAddingAddress(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsAddingAddress(true);
  };

  const handleCloseForm = () => {
    setIsAddingAddress(false);
    setEditingAddress(null);
  };

  const [formData, setFormData] = useState({});

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center mb-6">
        <MapPin className="mr-2 text-orange-800" />
        <h2 className="text-2xl font-semibold text-gray-800">Shipping Address</h2>
      </div>

      {isAddingAddress ? (
        <AddressForm
          formData={editingAddress || {}} 
          setFormData={setFormData} 
          handleCloseForm={handleCloseForm}
          editingAddress={editingAddress}
          userId={user._id} 
          addAddress={addAddress} 
          updateAddress={updateAddress} 
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {addresses && addresses.length > 0 ? (
              addresses.map((address) => (
                <div
                  key={address._id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedAddress && selectedAddress._id === address._id
                      ? "bg-orange-50"
                      : "border-gray-200 hover:border-orange-800"
                  }`}
                  onClick={() => handleSelectAddress(address)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${
                          selectedAddress && selectedAddress._id === address._id
                            ? "bg-orange-800 text-white"
                            : "border border-gray-300"
                        }`}
                      >
                        {selectedAddress && selectedAddress._id === address._id && (
                          <Check size={16} />
                        )}
                      </div>
                      <h3 className="font-medium">{address.fullname}</h3>
                      {address.isDefault && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddress(address);
                        }}
                        className="text-gray-500 hover:text-orange-800"
                      >
                        <Edit size={18} />
                      </button>
                      {/* {!address.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetDefault(address._id);
                          }}
                          className="text-xs text-gray-500 hover:text-orange-800 underline"
                        >
                          Set as default
                        </button>
                      )} */}
                    </div>
                  </div>

                  <div className="text-gray-600 text-sm">
                    <p>{address.addressLine}</p>
                    <p>{address?.city}, {address?.state} - {address?.pincode}</p>
                    <p className="mt-1">Phone: {address?.phone}</p>
                    <p>Landmark: {address?.landmark ? `${address.landmark}` : ""}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No addresses found. Please add a new address to continue.</p>
              </div>
            )}
          </div>

          <button
            onClick={handleAddNewAddress}
            className="mt-4 flex items-center text-orange-800 hover:text-orange-700 font-medium"
          >
            <Plus size={18} className="mr-1" />
            Add New Address
          </button>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onNext}
              disabled={!selectedAddress}
              className={`px-6 py-2 rounded-lg ${
                !selectedAddress
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-orange-800/90 hover:bg-orange-800 text-white"
              } transition-colors`}
            >
              Continue to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AddressStep;