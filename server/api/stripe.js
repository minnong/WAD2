import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config({ path: "../.env", override: true });

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// ✅ Auto-select correct frontend
const FRONTEND_URL =
  process.env.VERCEL_ENV === "production"
    ? "https://share-lah.vercel.app"
    : process.env.FRONTEND_URL || "http://localhost:5173";

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { itemName, itemImage, amount, renterEmail, rentalId } = req.body;

    if (!itemName || !amount || !renterEmail || !rentalId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const finalAmount = Math.round(amount * 1.2 * 100); // add 20% deposit
    const productData = { name: itemName || "Rental Item" };
    if (itemImage && itemImage.startsWith("http")) {
      productData.images = [encodeURI(itemImage)];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: renterEmail,
      line_items: [
        {
          price_data: {
            currency: "sgd",
            product_data: productData,
            unit_amount: finalAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/payment-success?rentalId=${rentalId}&status=success`,
      cancel_url: `${FRONTEND_URL}/my-rentals?view=customer&tab=active-rentals&status=cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe session creation failed:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
