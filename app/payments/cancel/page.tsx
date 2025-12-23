import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-6 text-center">
          <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Cancelled</h2>
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. No charges were made. You can try again anytime.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/payments">Try Again</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




