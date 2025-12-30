"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, CreditCard, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function PaymentsClient() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<"FREE" | "PREMIUM">("FREE");

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setCurrentPlan(
          data.subscriptionTier || data.profile?.subscriptionTier || "FREE"
        );
      }
    } catch (error) {
      console.error("Error loading subscription:", error);
    }
  };

  const handleSubscribe = async (planType: string, priceId: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          planType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      alert("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Stripe Price ID - Replace with your actual Stripe price ID from dashboard
  const PREMIUM_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || "price_YOUR_PRICE_ID_HERE";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">
            Upgrade to unlock premium features and support TransferAble
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className={currentPlan === "FREE" ? "border-2 border-blue-500" : ""}>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <CardTitle>Free</CardTitle>
                {currentPlan === "FREE" && (
                  <span className="ml-auto px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Current Plan
                  </span>
                )}
              </div>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-600">/forever</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Basic course planning for 2 universities</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>ASSIST.org integration guide</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Application deadline tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Transfer timeline planner</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Resource hub access</span>
                </li>
              </ul>
              {currentPlan === "FREE" ? (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button className="w-full" variant="outline" disabled>
                  Already Free
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className={`relative ${currentPlan === "PREMIUM" ? "border-2 border-blue-500" : "border-2 border-blue-200"}`}>
            {currentPlan !== "PREMIUM" && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Crown className="h-4 w-4" />
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <CardTitle>Premium Annual</CardTitle>
                {currentPlan === "PREMIUM" && (
                  <span className="ml-auto px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <CardDescription>Everything you need for transfer success</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-gray-600">/year</span>
              </div>
              <div className="text-sm text-green-600 font-medium mt-1">
                Save $91 vs monthly pricing
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Everything in Free</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Unlimited university planning</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>TAG (Transfer Admission Guarantee) tracker</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>AI-powered transfer predictions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Priority mentor matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>SMS deadline reminders</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>PIQ essay editor & feedback</span>
                </li>
              </ul>
              {currentPlan === "PREMIUM" ? (
                <Button className="w-full" variant="outline" disabled>
                  <Check className="mr-2 h-4 w-4" />
                  Premium Active
                </Button>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  onClick={() => handleSubscribe("PREMIUM", PREMIUM_PRICE_ID)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Start Free Trial
                    </>
                  )}
                </Button>
              )}
              <p className="text-xs text-center text-gray-500 mt-2">
                14-day free trial, cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">
            <strong>Student Discount:</strong> Get 50% off Premium with a valid .edu email address
          </p>
          <p className="text-sm text-gray-600">
            Questions? Contact us at{" "}
            <a href="mailto:hello@transferable.app" className="text-blue-600 hover:underline">
              hello@transferable.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}



