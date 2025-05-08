const AdminWallet = require("../../models/adminWalletModel");

const getAdminWallet = async (req, res) => {
  try {
    const wallet = await AdminWallet.findOne({}).populate(
      "transactions.userId",
      "name email"
    );

    if (!wallet) {
      res.status(404);
      throw new Error("Wallet not found");
    }

    res.json({
      success: true,
      balance: wallet.balance,
      transactions: wallet.transactions,
    });
  } catch (error) {
    res.status(res.statusCode || 500);
    res.json({
      success: false,
      message: error.message,
    });
  }
};


const getWalletTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", type = ""} = req.query;
    const wallet = await AdminWallet.findOne({}).populate(
      "transactions.userId",
      "name email"
    );

    if (!wallet) {
      res.status(404);
      throw new Error("Wallet not found");
    }

    let filteredTransactions = [...wallet.transactions];

    if (search) {
      filteredTransactions = filteredTransactions.filter(
        (transaction) =>
          transaction.transactionId.toLowerCase().includes(search.toLowerCase()) ||
          (transaction.userId &&
            transaction.userId.name.toLowerCase().includes(search.toLowerCase())) ||
          (transaction.orderId &&
            transaction.orderId.toString().toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (type && type !== "all") {
      filteredTransactions = filteredTransactions.filter(
        (transaction) => transaction.type === type
      );
    }

    filteredTransactions.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const total = filteredTransactions.length;
    const paginatedTransactions = filteredTransactions.slice(
      (page - 1) * limit,
      page * limit
    );

    res.json({
      success: true,
      transactions: paginatedTransactions,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    res.status(res.statusCode || 500);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminWallet,
  getWalletTransactions,
};