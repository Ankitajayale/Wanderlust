const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expresError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, cors } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.route("/category").get(wrapAsync(listingController.categorized));
router.route("/country").get(wrapAsync(listingController.getCountry));

router.route("/").get(wrapAsync(listingController.index)).post(
  isLoggedIn,
  // validateListing,
  upload.single("listing[url]"),
  wrapAsync(listingController.create),
);

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.show))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[url]"),
    // validateListing,
    wrapAsync(listingController.update),
  )
  .delete(
    isLoggedIn,
    isOwner,
    // validateListing,
    wrapAsync(listingController.destroy),
  );

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  // validateListing,
  wrapAsync(listingController.edit),
);

module.exports = router;
