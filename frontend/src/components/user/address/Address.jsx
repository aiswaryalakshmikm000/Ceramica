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
  const userId = user?._id;
  const [selectedAddress, setSelectedAddress] = useState(null); 

  if (!userId) {
    return <div>Please log in to manage addresses.</div>;
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

  if (isLoading) return <div>Loading addresses...</div>;
  if (error) return <div>Error loading addresses: {error?.data?.message || "Unknown error"}</div>;

  const breadcrumbItems = [
    { label: "My Account", href: "" },
    { label: "Addresses", href: "/account/addresses" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
      <div className="px-24 mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              My Addresses
            </h2>
          </div>
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center h-64 cursor-pointer"
              onClick={() => setShowForm(true)}
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Plus size={24} className="text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Add New Address</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Add a new shipping or billing address
              </p>
            </div>
            
            {addresses.map(address => (
              <div 
                key={address._id} 
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer animate-fade-in ${
                  selectedAddress && selectedAddress._id === address._id
                    ? "bg-orange-50 border border-orange-800"
                    : ""
                }`}
                onClick={() => handleSelectAddress(address)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <MapPin size={20} className="text-orange-800 mr-2" />
                    <h3 className="text-lg font-medium text-orange-800">
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
                      <Edit size={16} className="text-gray-600" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(address._id);
                      }}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 text-gray-600 space-y-1">
                  <p>{address.addressLine}</p>
                  <p>{address.city}, {address.state} {address.pincode}</p>
                  <p>Phone: {address.phone}</p>
                  <p>Email: {address.email}</p>
                  {address.landmark && <p>Landmark: {address.landmark}</p>}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  {address.isDefault && (
                    <span className="text-sm bg-orange-800/20 text-gray-700 py-1 px-3 rounded-full">
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