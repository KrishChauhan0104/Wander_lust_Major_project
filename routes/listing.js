const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const { storage} = require("../cloudConfig.js")
const upload = multer({ storage});


const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details.map((e) => e.message).join(", "));
  } else {
    next();
  }
};

// Index Route
router.get(
  "/",
  wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.newForm);

// Show Route
router.get(
  "/:id",
  wrapAsync(listingController.showTab)
);

// Create Route
router.post(
  "/",
  isLoggedIn,
  // validateListing,
  
  upload.single("listing[image]"),
    wrapAsync(listingController.createTab),
  
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editTab)
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateTab)
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroy)
);

module.exports = router;
