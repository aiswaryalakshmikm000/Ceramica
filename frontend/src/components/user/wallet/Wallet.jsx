import React, { useState } from 'react';
import { PlusCircle, MinusCircle, CreditCard, Filter } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/userAuth/userAuthSlice';
import { useNavigate } from 'react-router-dom';
import Fallback from '../../common/Fallback';
import Breadcrumbs from '../../common/BreadCrumbs';
import Pagination from '../../common/Pagination';
import { useGetWalletQuery, useAddFundsMutation } from '../../../features/userAuth/userWalletApiSlice';
import { toast } from 'react-toastify';

const Wallet = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 10;

  const { data: wallet, isLoading, isError, error } = useGetWalletQuery({
    page: currentPage,
    limit: itemsPerPage,
    type: filterType,
  });
  const [addFunds] = useAddFundsMutation();

  const breadcrumbItems = [
    { label: 'My Account', href: '' },
    { label: 'Wallet', href: '/wallet' },
  ];

  if (!user) {
    return (
      <Fallback
        isLoading={false}
        error={null}
        noUser={!user}
        emptyMessage={null}
        emptyActionText="Continue Shopping"
        emptyActionPath="/shop"
      />
    );
  }

  if (isLoading) {
    return <Fallback isLoading={true} />;
  }

  if (isError) {
    return (
      <Fallback
        isLoading={false}
        error={error?.data?.message || 'Failed to load wallet'}
        emptyActionText="Try Again"
        emptyActionPath="/wallet"
      />
    );
  }

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount greater than 0');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await addFunds(parseFloat(amount)).unwrap();
      toast.success(response.message);
      setAmount('');
      setIsAddingFunds(false);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add funds');
    } finally {
      setIsSubmitting(false);
    }
  };

  const balance = wallet?.balance || 0;
  const transactions = wallet?.transactions || [];
  const totalItems = wallet?.totalItems || 0;
  const totalPages = wallet?.totalPages || 1;

  const startResult = (currentPage - 1) * itemsPerPage + 1;
  const endResult = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="min-h-screen bg-gray-50 py-20 my-2 px-4 sm:px-6 lg:px-8">
      <div className="px-24 mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">My Wallet</h2>
          </div>
          <Breadcrumbs items={breadcrumbItems} />

          {/* Balance Card */}
          <div className="bg-gradient-to-r from-orange-800 to-gray-900 rounded-xl text-white p-6 mt-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-medium text-gray-300">Current Balance</h2>
                <div className="text-3xl font-bold mt-2">₹{balance.toFixed(2)}</div>
              </div>
              <CreditCard size={40} className="text-gray-300" />
            </div>

            <div className="flex mt-8">
              <button
                onClick={() => setIsAddingFunds(true)}
                className="bg-white text-gray-900 px-4 py-2 rounded-md flex items-center text-sm hover:bg-gray-100 transition-colors"
                aria-label="Add funds to wallet"
              >
                <PlusCircle size={16} className="mr-2" />
                Add Funds
              </button>
            </div>

            {isAddingFunds && (
              <form onSubmit={handleAddFunds} className="mt-4">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    step="1"
                    className="flex-grow p-2 rounded-md border border-gray-300 text-gray-900"
                    aria-label="Amount to add"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors disabled:bg-green-400"
                    disabled={isSubmitting}
                    aria-label="Confirm add money"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Money'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingFunds(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors"
                    aria-label="Cancel adding funds"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Transaction History */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
                <div className="inline-block relative">
                  <div className="relative">
                    <label htmlFor="transaction-filter" className="sr-only">
                      Filter transactions
                    </label>
                    <Filter
                      size={18}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      aria-hidden="true"
                    />
                    <select
                      id="transaction-filter"
                      value={filterType}
                      onChange={(e) => {
                        setFilterType(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="appearance-none bg-white border border-gray-300 rounded-md pl-8 pr-8 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-800/20"
                      aria-label="Filter transactions by type"
                    >
                      <option value="all">All</option>
                      <option value="credit">Credit</option>
                      <option value="debit">Debit</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {transactions.length === 0 ? (
                  <div className="p-4 text-gray-600 text-center">
                    No transactions available
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction._id} className="p-4 flex items-center">
                      <div
                        className={`p-2 rounded-full mr-4 ${
                          transaction.type === 'credit'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {transaction.type === 'credit' ? (
                          <PlusCircle size={20} aria-label="Credit transaction" />
                        ) : (
                          <MinusCircle size={20} aria-label="Debit transaction" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div
                        className={`text-base font-medium ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="my-4 border-t border-gray-300 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startResult}</span> to{' '}
                <span className="font-medium">{endResult}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
              </p>
              <div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;