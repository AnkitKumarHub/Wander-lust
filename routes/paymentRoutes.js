const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const { isLoggedIn } = require("../middleware");

// Routes with middleware
router.post("/createOrder", isLoggedIn, createOrder);
router.post("/verifyPayment", isLoggedIn, verifyPayment);

module.exports = router;
