import React, { useState } from "react";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { 
  useGetAddressesQuery, 
  useAddAddressMutation, 
  useUpdateAddressMutation, 
  useDeleteAddressMutation,
  useSetDefaultAddressMutation 
} from "../../../features/userAuth/userAddressApiSlice";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userAuth/userAuthSlice";
import { toast } from "react-toastify";
import AddressForm from "./AddressForm";
import Modal from "../../common/Modal";
import Breadcrumbs from "../../common/BreadCrumbs";

const Address = () => {
  const user = useSelector(selectUser);
  const userId = user?.id;
  const [selectedAddress, setSelectedAddress] = useState(null); 

  if (!userId) {
    return <div className="text-center text-gray-700">Please log in to manage addresses.</div>;
  }

  const { 
    data: addresses = [], 
    isLoading, 
    error,
    refetch 
  } = useGetAddressesQuery(userId, { skip: !userId });
  
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    addressLine: "",
    city: "",
    state: "",
    landmark: "",
    pincode: "",
    addressType: "Home",
    isDefault: false,
  });

  const handleDeleteAddress = async (addressId) => {
    try {
      const result = await deleteAddress({ userId, addressId }).unwrap();
      toast.success(result.message);
      setShowDeleteModal(false);
      setAddressToDelete(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete address");
    }
  };

  const handleDeleteClick = (addressId) => {
    setAddressToDelete(addressId);
    setShowDeleteModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData({
      fullname: address.fullname,
      phone: address.phone,
      email: address.email,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      landmark: address.landmark || "",
      pincode: address.pincode,
      addressType: address.addressType,
      isDefault: address.isDefault,
    });
    setShowForm(true);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      fullname: "",
      phone: "",
      email: "",
      addressLine: "",
      city: "",
      state: "",
      landmark: "",
      pincode: "",
      addressType: "Home",
      isDefault: false,
    });
    refetch();
  };

  if (isLoading) return <div className="text-center text-gray-700">Loading addresses...</div>;
  if (error) return <div className="text-center text-red-500">Error loading addresses: {error?.data?.message || "Unknown error"}</div>;

  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Addresses", href: "/account/addresses" },
  ];

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-14 my-10 sm:my-14 lg:my-20 max-w-7xl">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              My Addresses
            </h2>
          </div>
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mt-4">
            <div 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-dashed border-gray-300 p-4 sm:p-6 flex flex-col items-center justify-center h-56 sm:h-64 cursor-pointer"
              onClick={() => setShowForm(true)}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Plus size={20} className="text-gray-600" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-700">Add New Address</h3>
              <p className="text-xs sm:text-sm text-gray-500 text-center mt-1 sm:mt-2">
                Add a new shipping or billing address
              </p>
            </div>
            
            {addresses.map(address => (
              <div 
                key={address._id} 
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 cursor-pointer animate-fade-in ${
                  selectedAddress && selectedAddress._id === address._id
                    ? "bg-orange-50 border border-orange-800"
                    : ""
                }`}
                onClick={() => handleSelectAddress(address)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <MapPin size={18} className="text-orange-800 mr-2" />
                    <h3 className="text-base sm:text-lg font-medium text-orange-800">
                      {address.fullname} ({address.addressType})
                    </h3>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Edit size={14} className="text-gray-600" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(address._id);
                      }}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 text-gray-600 text-sm sm:text-base space-y-1">
                  <p>{address.addressLine}</p>
                  <p>{address.city}, {address.state} {address.pincode}</p>
                  <p>Phone: {address.phone}</p>
                  <p>Email: {address.email}</p>
                  {address.landmark && <p>Landmark: {address.landmark}</p>}
                </div>
                
                <div className="mt-3 sm:mt-4 flex justify-between items-center">
                  {address.isDefault && (
                    <span className="text-xs sm:text-sm bg-orange-800/20 text-gray-700 py-1 px-2 sm:px-3 rounded-full">
                      Default Address
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {showForm && (
            <AddressForm
              formData={formData}
              setFormData={setFormData}
              handleCloseForm={handleCloseForm}
              editingAddress={editingAddress}
              userId={userId}
              addAddress={addAddress}
              updateAddress={updateAddress}
            />
          )}
          
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => handleDeleteAddress(addressToDelete)}
            title="Confirm Delete Address"
            message="Are you sure you want to delete this address? This action cannot be undone."
          />
        </div>
      </div>
    </div>
  );
};

export default Address;