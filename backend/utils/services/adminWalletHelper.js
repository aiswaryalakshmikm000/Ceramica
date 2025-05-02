
const AdminWallet = require("../../models/adminWalletModel");


// Helper function to credit admin wallet
const creditAdminWallet = async (amount, description, orderId, userId, transactionType = "order") => {
  console.log("@@@@@@@@@$4444444444444444444444444444444 amount, description, orderId, userId, transactionType", amount, description, orderId, userId, transactionType);
  try {
    let adminWallet = await AdminWallet.findOne();
    console.log("Admin wallet found", adminWallet);

    if (!adminWallet) {
      adminWallet = new AdminWallet();
      await adminWallet.save();
    }

    const transaction = {
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "credit",
      amount,
      description,
      orderId,
      userId,
      transactionType,
      status: "completed",
    };

    adminWallet.balance += amount;
    adminWallet.transactions.push(transaction);
    await adminWallet.save();

    console.log("Admin wallet updated after credit ", adminWallet);

    return { success: true, message: "Admin wallet credited successfully" };
  } catch (error) {
    console.error("Error crediting admin wallet:", error);
    return { success: false, message: "Failed to credit admin wallet", error: error.message };
  }
};
  
  // Helper function to debit admin wallet
  const debitAdminWallet = async (amount, description, orderId, userId, transactionType = "refund") => {
    try {
      let adminWallet = await AdminWallet.findOne();
      if (!adminWallet) {
        adminWallet = new AdminWallet();
        await adminWallet.save();
      }
  
  
      if (adminWallet.balance < amount) {
        throw new Error("Insufficient balance in admin wallet");
      }
  
      const transaction = {
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "debit",
        amount,
        description,
        orderId,
        userId,
        transactionType,
        status: "completed",
      };
  
      adminWallet.balance -= amount;
      adminWallet.transactions.push(transaction);
      await adminWallet.save();
  
      return { success: true, message: "Admin wallet debited successfully" };
    } catch (error) {
      console.error("Error debiting admin wallet:", error);
      return { success: false, message: "Failed to debit admin wallet", error: error.message };
    }
  };



  module.exports = {
    creditAdminWallet,
    debitAdminWallet,
  };