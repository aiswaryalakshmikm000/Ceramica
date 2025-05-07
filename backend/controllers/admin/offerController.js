// const Offer = require("../../models/offerModel");
// const Product = require("../../models/productModel");
// const Category = require("../../models/categoryModel");
// const offerValidation = require("../../utils/validation/offerValidation");

// const roundToTwo = (num) => Number((Math.round(num * 100) / 100).toFixed(2));

// const getOffers = async (req, res) => {
//   try {
//     const { search, status, page = 1, limit = 10 } = req.query;

//     const now = new Date();
//     await Offer.updateMany(
//       { status: "active", expiryDate: { $lt: now } },
//       { status: "expired" }
//     );

//     const query = {};
//     if (search) {
//       query.name = { $regex: search, $options: "i" }; 
//     }
//     if (status) {
//       query.status = status;
//     }

//     const pageNum = parseInt(page, 10);
//     const limitNum = parseInt(limit, 10);
//     const skip = (pageNum - 1) * limitNum;

//     const offers = await Offer.find(query)
//       .populate("targetId", "name")
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limitNum);

//     const totalOffersCount = await Offer.countDocuments(query);
//     const totalPages = Math.ceil(totalOffersCount / limitNum);

//     res.status(200).json({
//       success: true,
//       message: "Offers fetched successfully",
//       data: {
//         offers,
//         totalPages,
//         totalOffersCount,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching offers:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch offers",
//       error: error.message,
//     });
//   }
// };


// const addOffer = async (req, res) => {
//   try {
//     const { error } = offerValidation.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const { targetType, targetId } = req.body;

//     const existingOffer = await Offer.findOne({
//       targetType,
//       targetId,
//       status: { $in: ["active", "inactive"] },
//     });

//     if (existingOffer) {
//       return res.status(400).json({ message: "Offer already exists for this product or category" });
//     }

//     if (targetType === "product") {
//       const product = await Product.findById(targetId);
//       if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//       }
//     } else if (targetType === "category") {
//       const category = await Category.findById(targetId);
//       if (!category) {
//         return res.status(404).json({ message: "Category not found" });
//       }
//     }

//     const offer = new Offer(req.body);
//     await offer.save();

//     if (targetType === "product") {
//       await Product.findByIdAndUpdate(targetId, { offerId: offer._id });
//     }

//     res.status(201).json({ message: "Offer created successfully", offer });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create offer", error });
//   }
// };


// const updateOffer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { error } = offerValidation.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const offer = await Offer.findById(id);
//     if (!offer) {
//       return res.status(404).json({ message: "Offer not found" });
//     }

//     const { targetType, targetId } = req.body;

//     if (targetType === "product") {
//       const product = await Product.findById(targetId);
//       if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//       }
//     } else if (targetType === "category") {
//       const category = await Category.findById(targetId);
//       if (!category) {
//         return res.status(404).json({ message: "Category not found" });
//       }
//     }

//     Object.assign(offer, req.body);
//     await offer.save();

//     if (targetType === "product") {
//       await Product.findByIdAndUpdate(targetId, { offerId: offer._id });
//     }

//     res.status(200).json({ message: "Offer updated successfully", offer });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update offer", error });
//   }
// };


// const statusToggle = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const offer = await Offer.findById(id);
//     if (!offer) {
//       return res.status(404).json({ message: "Offer not found" });
//     }

//     if (offer.status === "expired") {
//       return res.status(400).json({ message: "Cannot toggle status of an expired offer" });
//     }

//     const newStatus = offer.status === "active" ? "inactive" : "active";
//     offer.status = newStatus;
//     await offer.save();

//     if (offer.targetType === "product") {
//       await Product.findByIdAndUpdate(offer.targetId, {
//         offerId: newStatus === "active" ? offer._jm_id : null,
//       });
//     }

//     res.status(200).json({
//       message: `Offer status toggled to ${newStatus} successfully`,
//       status: newStatus,
//     });
//   } catch (error) {
//     console.error("Error toggling offer status:", error);
//     res.status(500).json({
//       message: "Failed to toggle offer status",
//       error: error.message,
//     });
//   }
// };


// module.exports = {
//   statusToggle,
//   updateOffer,
//   addOffer,
//   getOffers,
// };




const Offer = require("../../models/offerModel");
const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");
const offerValidation = require("../../utils/validation/offerValidation");

const roundToTwo = (num) => Number((Math.round(num * 100) / 100).toFixed(2));

const getOffers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const now = new Date();
    await Offer.updateMany(
      { status: "active", expiryDate: { $lt: now } },
      { status: "expired" }
    );

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" }; 
    }
    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const offers = await Offer.find(query)
      .populate("targetId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalOffersCount = await Offer.countDocuments(query);
    const totalPages = Math.ceil(totalOffersCount / limitNum);

    res.status(200).json({
      success: true,
      message: "Offers fetched successfully",
      data: {
        offers,
        totalPages,
        totalOffersCount,
      },
    });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch offers",
      error: error.message,
    });
  }
};

const addOffer = async (req, res) => {
  try {
    const { error } = offerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, targetType, targetId,discountValue } = req.body;
    
    console.log("$$$$$444  req.body req.body req.body req.body",  req.body )


    // Check for existing offer with the same name (case-insensitive)
    const existingOfferWithName = await Offer.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingOfferWithName) {
      return res.status(400).json({ message: "An offer with this name already exists" });
    }

    const existingOffer = await Offer.findOne({
      targetType,
      targetId,
      status: { $in: ["active", "inactive"] },
    });

    if (existingOffer) {
      return res.status(400).json({ message: "Offer already exists for this product or category" });
    }

    if (targetType === "Product") {
      const product = await Product.findById(targetId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
    } else if (targetType === "Category") {
      const category = await Category.findById(targetId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    const offer = new Offer({ ...req.body, discountType: 'percentage' });
    await offer.save();

    const product = await Product.findById(targetId);
    product.discount += Number(discountValue);

    product.save();

    if (targetType === "Product") {
      await Product.findByIdAndUpdate(targetId, { offerId: offer._id });
    }

    res.status(201).json({ message: "Offer created successfully", offer });
  } catch (error) {
    res.status(500).json({ message: "Failed to create offer", error });
  }
};

const statusToggle = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    if (offer.status === "expired") {
      return res.status(400).json({ message: "Cannot toggle status of an expired offer" });
    }

    const newStatus = offer.status === "active" ? "inactive" : "active";
    offer.status = newStatus;
    await offer.save();

    if (offer.targetType === "Product") {
      await Product.findByIdAndUpdate(offer.targetId, {
        offerId: newStatus === "active" ? offer._id : null,
      });
    }

    res.status(200).json({
      message: `Offer status toggled to ${newStatus} successfully`,
      status: newStatus,
    });
  } catch (error) {
    console.error("Error toggling offer status:", error);
    res.status(500).json({
      message: "Failed to toggle offer status",
      error: error.message,
    });
  }
};

module.exports = {
  statusToggle,
  addOffer,
  getOffers,
};