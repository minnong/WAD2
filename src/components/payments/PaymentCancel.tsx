import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect to My Rentals with a toast param
      navigate("/my-rentals?view=customer&tab=active-rentals&toast=payment-cancel", { replace: true });
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Cancelled</h1>
      <p className="text-gray-500">Returning you to your rentals...</p>
    </div>
  );
}
