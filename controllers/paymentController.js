const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require('dotenv')

dotenv.config();

// Initialize Razorpay instance with your credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,   
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


// Controller to create an order
exports.createOrder = async (req, res) => {
  try {
    console.log(req.body);
    const { amount } = req.body; // Amount should be in rupees, multiply by 100 to convert to paise

    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise (multiply by 100 for INR)
      currency: "INR",
      receipt: "order_rcptid_3982",
    });

    console.log("Order created successfully:", order);

    // Create an order
    // razorpay.orders.create(options, (err, order) => {
    //   if (err) {
    //     console.error("Error creating order:", err); // Log the error
    //     return res.status(500).json({
    //       success: false,
    //       message: "something went wrong",
    //     });
    //   }

    //   console.log("Order created successfully:", order); // Log order details
    //   return res.status(200).json(order); // Send order details back to the client
    // });

    res.status(200).json({
      success: true,
      orderId: order.id, // Include this explicitly in the response
      amount: order.amount,
    });

  } catch (error) {
    console.error("Error creating order:", error); // Log unexpected errors
    res.status(500).json({ success: false, error: "Failed to create order." });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate required parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. Missing required parameters.",
      });
    }

    // console.log("Request body:", req.body);

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("Razorpay key secret is not set.");
      return res.status(500).json({
        success: false,
        message: "Server configuration error.",
      });
    }

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      return res
        .status(200)
        .json({ success: true, message: "Payment verified successfully." });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed." });
    }
  } catch (error) {
    console.error("Unexpected error in payment verification:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error during verification." });
  }
};
