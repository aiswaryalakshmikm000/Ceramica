import React, { useState } from "react";
import { MapPin, Plus, Edit, Trash } from "lucide-react";
import { 
  useGetAddressesQuery, 
  useAddAddressMutation, 
  useUpdateAddressMutation, 
  useDeleteAddressMutation,
  useSetDefaultAddressMutation 
} from "../../../features/auth/userApiSlice";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/userAuthSlice";
import { toast } from "react-toastify";
import AddressForm from "./AddressForm";
import Breadcrumbs from "../../common/BreadCrumbs"; // Import the Breadcrumbs component
import Modal from "../../common/Modal";


const Address = () => {
  const user = useSelector(selectUser);
  const userId = user?._id;

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

  // Modified to show confirmation modal
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

  const handleSetDefault = async (addressId) => {
    try {
      const result = await setDefaultAddress({ addressId }).unwrap();
      toast.success(result.message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update default address");
    }
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

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    // { label: "Account", href: userId ? `/profile/${userId}` : "/login" },
    { label: "Address", href: `/address/${userId}` },
  ];

  if (isLoading) return <div>Loading addresses...</div>;
  if (error) return <div>Error loading addresses: {error?.data?.message || "Unknown error"}</div>;

  return (<div className="container mx-auto px-4 py-20">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-64 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setShowForm(true)}
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus size={24} className="text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">Add New Address</h3>
            <p className="text-sm text-gray-500 text-center mt-2">
              Add a new shipping or billing address
            </p>
          </div>
          
          {addresses.map(address => (
            <div key={address._id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <MapPin size={20} className="text-gray-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-800">{address.fullname} ({address.addressType})</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditAddress(address)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Edit size={16} className="text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(address._id)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Trash size={16} className="text-red-500" />
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
                    <span className="text-sm bg-gray-100 text-gray-700 py-1 px-3 rounded-full">
                      Default Address
                    </span>
                  )}
                </div>
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
        
        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteAddress(addressToDelete)}
          title="Confirm Delete Address"
          message="Are you sure you want to delete this address? This action cannot be undone."
        />
      </div>
    </div>
  );
};

export default Address;