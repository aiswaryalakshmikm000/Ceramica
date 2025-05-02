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
    const { page = 1, limit = 10, search = "", type = "", date = "" } = req.query;
    const wallet = await AdminWallet.findOne({}).populate(
      "transactions.userId",
      "name email"
    );

    if (!wallet) {
      res.status(404);
      throw new Error("Wallet not found");
    }

    let filteredTransactions = [...wallet.transactions];

    // Apply search filter
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

    // Apply type filter
    if (type && type !== "all") {
      filteredTransactions = filteredTransactions.filter(
        (transaction) => transaction.type === type
      );
    }

    // Apply date filter
    if (date && date !== "all") {
      const now = new Date();
      let startDate;

      if (date === "today") {
        startDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (date === "week") {
        startDate = new Date(now.setDate(now.getDate() - 7));
      } else if (date === "month") {
        startDate = new Date(now.setMonth(now.getMonth() - 1));
      }

      filteredTransactions = filteredTransactions.filter(
        (transaction) => new Date(transaction.createdAt) >= startDate
      );
    }

    // Sort transactions by date (newest first)
    filteredTransactions.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Pagination
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