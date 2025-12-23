"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade when you need more. No credit card required.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Free Forever
              </CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Course planning & equivalency database</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Automated timeline generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>1 mentor connection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>PIQ essay editor</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Application tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Resource hub access</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-blue-500 shadow-xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Crown className="h-4 w-4" />
                Most Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Premium
              </CardTitle>
              <CardDescription>For serious transfer students</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-gray-600">/month</span>
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
                  <span>Unlimited mentor connections</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>AI-powered essay feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Transcript parsing & audit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Priority mentor matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Advanced analytics & insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Priority customer support</span>
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700" asChild>
                <Link href="/sign-up">Start Premium Trial</Link>
              </Button>
              <p className="text-xs text-center text-gray-500 mt-2">
                7-day free trial, cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            💡 <strong>Student Discount:</strong> Get 50% off Premium with a valid .edu email address
          </p>
        </div>
      </div>
    </section>
  );
}




