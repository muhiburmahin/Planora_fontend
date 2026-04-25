"use client";

import { useState } from "react";
import { X, CreditCard, CheckCircle, AlertCircle, Loader2, Ticket, Shield } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ─── Types ───────────────────────────────────────────────────────────────────
interface Event {
  id: string;
  title: string;
  registrationFee: number;
  type: string;
}

interface JoinEventModalProps {
  event: Event;
  onClose: () => void;
  onSuccess: () => void;
}

// ─── Payment Form (inside Stripe Elements) ───────────────────────────────────
function PaymentForm({
  event,
  participationId,
  onSuccess,
  onError,
}: {
  event: Event;
  participationId: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);

    try {
      // 1. Get client secret from our backend
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participationId, amount: event.registrationFee }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment init failed");

      const { clientSecret } = data.data;

      // 2. Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) throw new Error(error.message);
      if (paymentIntent?.status === "succeeded") onSuccess();
    } catch (err: any) {
      onError(err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Card Details</p>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "15px",
                color: "#1f2937",
                "::placeholder": { color: "#9ca3af" },
                fontFamily: "inherit",
              },
            },
          }}
          className="py-2"
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Shield className="w-3.5 h-3.5 text-green-500" />
        <span>Secured by Stripe. Your card info is never stored.</span>
      </div>

      <button
        onClick={handlePay}
        disabled={processing || !stripe}
        className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Pay ৳{event.registrationFee}
          </>
        )}
      </button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function JoinEventModal({ event, onClose, onSuccess }: JoinEventModalProps) {
  const isFree = event.registrationFee === 0;
  const [step, setStep] = useState<"confirm" | "payment" | "success" | "error">("confirm");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [participationId, setParticipationId] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  const handleJoin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/participations/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to join event");

      const participation = data.data;
      setParticipationId(participation.id);
      setTicketNumber(participation.ticketNumber || "");

      if (isFree) {
        setStep("success");
      } else {
        setStep("payment");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setStep("success");
    setTimeout(onSuccess, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-slide-up">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10">
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Success State */}
        {step === "success" && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re In! 🎉</h3>
            <p className="text-gray-500 mb-4">Successfully registered for <strong>{event.title}</strong></p>
            {ticketNumber && (
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-primary-700">
                  <Ticket className="w-4 h-4" />
                  <span className="text-sm font-medium">Ticket Number</span>
                </div>
                <p className="text-lg font-bold text-primary-900 mt-1 font-mono">{ticketNumber}</p>
              </div>
            )}
            <p className="text-xs text-gray-400">A confirmation notification has been sent to you.</p>
            <button onClick={onClose} className="mt-4 w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">
              Done
            </button>
          </div>
        )}

        {/* Confirm State */}
        {step === "confirm" && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {isFree ? "Join Event" : "Register & Pay"}
              </h3>
              <p className="text-sm text-gray-500">Confirm your registration for this event</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-1">{event.title}</h4>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-500">Registration Fee</span>
                <span className={`font-bold text-lg ${isFree ? "text-green-600" : "text-primary-600"}`}>
                  {isFree ? "Free" : `৳${event.registrationFee}`}
                </span>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleJoin}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isFree ? "Confirm Join" : "Continue to Pay"}
              </button>
            </div>
          </div>
        )}

        {/* Payment State */}
        {step === "payment" && participationId && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Complete Payment</h3>
              <p className="text-sm text-gray-500">Registration fee for <strong>{event.title}</strong></p>
            </div>

            <div className="flex items-center justify-between bg-primary-50 rounded-xl p-3 mb-5 border border-primary-100">
              <span className="text-sm font-medium text-primary-700">Amount to pay</span>
              <span className="text-xl font-bold text-primary-700">৳{event.registrationFee}</span>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Elements stripe={stripePromise}>
              <PaymentForm
                event={event}
                participationId={participationId}
                onSuccess={handlePaymentSuccess}
                onError={(msg) => setError(msg)}
              />
            </Elements>

            <button onClick={() => setStep("confirm")} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors py-2">
              ← Go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}