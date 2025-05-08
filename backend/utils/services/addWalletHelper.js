const Wallet = require("../../models/walletModel");

const addWalletTransaction = async (
    userId,
    amount,
    type,
    description,
    orderId = null,
    status = "success"
  ) => {
    try {
      let wallet = await Wallet.findOne({ user: userId });

      if (!wallet) {
        wallet = new Wallet({ user: userId, balance: 0, transactions: [] });
      }
  
      const transaction = {
        type,
        amount,
        description,
        orderId,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      wallet.transactions.push(transaction);
      if (type === "credit") {
        wallet.balance += amount;
      } else if (type === "debit") {
        wallet.balance -= amount;
      }
  
      await wallet.save();
      return { success: true, wallet };
    } catch (error) {
      return {
        success: false,
        message: "Failed to add wallet transaction",
        error,
      };
    }
  };
  
  module.exports = {
    addWalletTransaction
  };