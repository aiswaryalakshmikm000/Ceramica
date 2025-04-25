const mongoose = require('mongoose');
const Wallet = require('../../models/walletModel');

const fetchWallet = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const UserId = req.user.id;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (!mongoose.Types.ObjectId.isValid(UserId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    let wallet = await Wallet.findOne({ user: UserId }).populate('user', 'name email');
    if (!wallet) {
      return res.json({
        balance: 0,
        transactions: [],
        totalItems: 0,
        totalPages: 1,
        currentPage: pageNum,
        message: 'No wallet found for this user',
      });
    }

    const transactions = wallet.transactions;
    let filteredTransactions = transactions;
    
    if (type && type !== 'all') {
        filteredTransactions = transactions.filter((t) => t.type === type);
      }
  
      filteredTransactions.sort((a, b) => b.createdAt - a.createdAt);

    const totalItems = filteredTransactions.length;
    const totalPages = Math.ceil(totalItems / limitNum);

    const paginatedTransactions = filteredTransactions.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      balance: wallet.balance,
      transactions: paginatedTransactions,
      totalItems,
      totalPages,
      currentPage: pageNum,
      message: 'Wallet data fetched successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wallet data', error: error.message });
  }
};

const addFunds = async (req, res) => {
  const { amount } = req.body;
  const UserId = req.user.id;
 
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Please provide a valid amount greater than zero' });
  }
  if (!mongoose.Types.ObjectId.isValid(UserId)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }
  try {
    let wallet = await Wallet.findOne({ user: UserId });

    if (!wallet) {
      wallet = new Wallet({
        user: new mongoose.Types.ObjectId(UserId),
        balance: 0,
        transactions: [],
      });
    }

    wallet.balance += parseFloat(amount);

    wallet.transactions.push({
      type: 'credit',
      amount: parseFloat(amount),
      description: `Added ₹${amount} to wallet`,
      status: 'success',
      orderId: null,
    });

    await wallet.save();

    res.json({ message: `Successfully added ₹${amount} to wallet`, wallet });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add funds to wallet', error: error.message });
  }
};

module.exports = {
  fetchWallet,
  addFunds,
};