"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTABanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center mb-4">
          <Sparkles className="h-6 w-6 mr-2" />
          <span className="text-sm font-semibold text-blue-100">Limited Time: Free Forever Plan</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
          Ready to Start Your Transfer Journey?
        </h2>
        <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Join thousands of students who are successfully transferring to their dream universities. 
          Get started in 2 minutes - no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="bg-white text-blue-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
          >
            <Link href="/sign-up">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-2 border-white bg-white/20 text-white hover:bg-white hover:text-blue-600 backdrop-blur-sm transition-all shadow-lg"
          >
            <Link href="/demo">Watch Demo</Link>
          </Button>
        </div>
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-blue-100">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            Free forever
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
}




