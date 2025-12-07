"use client";

import { TrendingUp, Users, Award, CheckCircle2 } from "lucide-react";

export function SocialProof() {
  return (
    <section className="py-12 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 mr-2" />
            </div>
            <div className="text-3xl font-bold mb-1">Free</div>
            <div className="text-sm text-blue-100">Always Free to Use</div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 mr-2" />
            </div>
            <div className="text-3xl font-bold mb-1">Real</div>
            <div className="text-sm text-blue-100">Built by Transfer Students</div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-2">
              <Award className="h-8 w-8 mr-2" />
            </div>
            <div className="text-3xl font-bold mb-1">Smart</div>
            <div className="text-sm text-blue-100">AI-Powered Tools</div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 mr-2" />
            </div>
            <div className="text-3xl font-bold mb-1">Trusted</div>
            <div className="text-sm text-blue-100">Verified Mentors</div>
          </div>
        </div>
      </div>
    </section>
  );
}

