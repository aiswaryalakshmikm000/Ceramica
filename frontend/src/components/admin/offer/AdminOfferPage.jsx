import React, { useState } from 'react';
import { useGetOffersQuery, useStatusToggleMutation } from '../../../features/adminAuth/adminOfferApiSlice';
import Breadcrumbs from '../../common/BreadCrumbs';
import Pagination from '../../common/Pagination';
import OfferFilterSearchBar from './OfferFilterSearchBar';
import AddOfferModal from './AddOfferModal';
import Fallback from '../../common/Fallback';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminOffersPage = () => {
  const [filter, setFilter] = useState({
    search: '',
    status: '',
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryParams = {
    search: filter.search || undefined,
    status: filter.status || undefined,
    page,
    limit,
  };

  const { data: offersData, isLoading, isError, error, refetch } = useGetOffersQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [statusToggle] = useStatusToggleMutation();

  const offers = offersData?.data?.offers || [];
  const totalPages = offersData?.data?.totalPages || 1;
  const totalOffersCount = offersData?.data?.totalOffersCount || 0;

  const handleFilterChange = (name, value) => {
    setFilter((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilter({ search: '', status: '' });
    setPage(1);
    toast.info('Filters reset successfully');
  };

  const handleRefresh = () => {
    refetch();
    toast.info('Offers refreshed successfully');
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleToggleStatus = async (offerId) => {
    try {
      const result = await statusToggle(offerId).unwrap();
      toast.success(result.message || `Offer status toggled to ${result.status} successfully`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to toggle offer status');
    }
  };

  const getActionButton = (offer) => {
    if (offer.status === 'expired') {
      return <span className="text-gray-400">No Actions Available</span>;
    }
    return (
      <button
        onClick={() => handleToggleStatus(offer._id)}
        className={`hover:underline ${offer.status === 'active' ? 'text-red-500' : 'text-green-500'}`}
      >
        {offer.status === 'active' ? 'Deactivate' : 'Activate'}
      </button>
    );
  };

  const breadcrumbItems = [
    { label: 'Admin' },
    { label: 'Offers', href: '/admin/offers' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-2xl font-bold text-[#3c73a8] mb-2">Offer Management</h1>
          <p className="text-gray-600">Manage offers, create new ones, and update status</p>
        </div>

        <OfferFilterSearchBar
          filter={filter}
          setFilter={setFilter}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          resetFilters={resetFilters}
          handleFilterChange={handleFilterChange}
          openModal={handleOpenModal}
          handleRefresh={handleRefresh}
        />

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#3c73a8] text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Target</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Discount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">End Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="8">
                      <Fallback isLoading={true} />
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="8">
                      <Fallback
                        error={{ message: error?.data?.message || 'Failed to load offers' }}
                        emptyActionText="Retry"
                        onEmptyAction={handleRefresh}
                      />
                    </td>
                  </tr>
                ) : offers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      <Fallback
                        emptyMessage="No offers available"
                        emptyActionText="Add Offer"
                        onEmptyAction={handleOpenModal}
                        emptyIcon={<Plus />}
                      />
                    </td>
                  </tr>
                ) : (
                  offers.map((offer) => (
                    <tr key={offer._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {offer.name || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {offer.targetType || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {offer.targetId?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {offer.discountType === 'flat'
                          ? `₹${offer.discountValue || 0}`
                          : `${offer.discountValue || 0}%`}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {offer.status || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {offer.validFrom ? new Date(offer.validFrom).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {offer.expiryDate ? new Date(offer.expiryDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        {getActionButton(offer)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {offers.length > 0 && (
            <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200">
              <div className="mb-2 sm:mb-0">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(page * limit, totalOffersCount)}</span> of{' '}
                  <span className="font-medium">{totalOffersCount}</span> results
                </p>
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalOffersCount}
                itemsPerPage={limit}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>

        {isModalOpen && <AddOfferModal closeModal={handleCloseModal} />}
      </main>
    </div>
  );
};

export default AdminOffersPage;