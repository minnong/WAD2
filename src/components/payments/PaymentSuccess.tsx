import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRentals } from "../../contexts/RentalsContext";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { markAsPaid } = useRentals();

  useEffect(() => {
    const rentalId = params.get("rentalId");
    const status = params.get("status");

    if (!rentalId) {
      navigate("/my-rentals?view=customer&tab=active-rentals");
      return;
    }

    if (status === "success") {
      // ✅ Update Firestore record or local rental state
      markAsPaid(rentalId);

      // ✅ Trigger one clean success toast
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            type: "success",
            message: "Payment received!",
          },
        })
      );
    } else if (status === "cancel") {
      // ❌ Trigger cancellation toast
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            type: "error",
            message: "Payment was cancelled. Please try again.",
          },
        })
      );
    }

    // ✅ Redirect back to My Rentals after 2 seconds
    const timer = setTimeout(() => {
      navigate("/my-rentals?view=customer&tab=active-rentals");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, params, markAsPaid]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-purple-600">Processing Payment...</h1>
      <p className="mt-2 text-gray-500">You’ll be redirected shortly.</p>
    </div>
  );
}

