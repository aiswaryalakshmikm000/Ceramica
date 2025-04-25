import React, { useState } from "react";
import { MapPin, Plus, Edit, Check, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userAuth/userAuthSlice";
import { 
  useSetDefaultAddressMutation,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation
} from "../../../features/userAuth/userAddressApiSlice";
import AddressForm from "../address/AddressForm";
import { toast } from "react-toastify";
import Modal from "../../common/Modal";

const AddressStep = ({ addresses, selectedAddress, setSelectedAddress, onNext, userId }) => {
  const user = useSelector(selectUser);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [addressToDelete, setAddressToDelete] = useState(null); 
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

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

  const handleDeleteClick = (addressId) => {
    setAddressToDelete(addressId);
    setShowDeleteModal(true); 
  };

  const handleDeleteAddress = async () => {
    try {
      const result = await deleteAddress({ userId: user.id, addressId: addressToDelete }).unwrap();
      toast.success(result.message || "Address deleted successfully");
      setShowDeleteModal(false); 
      setAddressToDelete(null);
      if (selectedAddress && selectedAddress._id === addressToDelete) {
        setSelectedAddress(null);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete address");
      setShowDeleteModal(false); 
      setAddressToDelete(null);
    }
  };

  const [formData, setFormData] = useState({});

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center mb-6">
        <MapPin className="mr-2 text-orange-800" />
        <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
      </div>

      {isAddingAddress ? (
        <AddressForm
          formData={editingAddress || {}}
          setFormData={setFormData}
          handleCloseForm={handleCloseForm}
          editingAddress={editingAddress}
          userId={user.id}
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
                  className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border p-4 cursor-pointer ${
                    selectedAddress && selectedAddress._id === address._id
                      ? "bg-orange-50"
                      : "border-gray-200"
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(address._id); 
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="text-gray-600 text-sm">
                    <p>{address.addressLine}</p>
                    <p>
                      {address?.city}, {address?.state} - {address?.pincode}
                    </p>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setAddressToDelete(null);
        }}
        onConfirm={handleDeleteAddress}
        title="Confirm Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
      />
    </div>
  );
};

export default AddressStep;