const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expresError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const bodyParser = require("body-parser");
const isLoggedIn = require("../middleware.js").isLoggedIn;
const isReviewAuthor = require("../middleware.js").isReviewAuthor;
const reviewController = require("../controllers/review.js")

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Reviews
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.reviewCreate),
);

//reviewDelete
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.reviewDestroy),
);

module.exports = router;
