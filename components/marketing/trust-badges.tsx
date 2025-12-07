"use client";

import { Shield, Lock, Award, Users, Clock, CheckCircle2 } from "lucide-react";

export function TrustBadges() {
  return (
    <section className="py-12 bg-gray-50 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="text-center">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Secure & Private</p>
            <p className="text-xs text-gray-600">SOC 2 Compliant</p>
          </div>
          <div className="text-center">
            <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Data Protected</p>
            <p className="text-xs text-gray-600">End-to-end encryption</p>
          </div>
          <div className="text-center">
            <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Verified Mentors</p>
            <p className="text-xs text-gray-600">College email verified</p>
          </div>
          <div className="text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Growing Community</p>
            <p className="text-xs text-gray-600">Join the movement</p>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Always Updated</p>
            <p className="text-xs text-gray-600">Real-time course data</p>
          </div>
          <div className="text-center">
            <CheckCircle2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Free Forever</p>
            <p className="text-xs text-gray-600">Core features always free</p>
          </div>
        </div>
      </div>
    </section>
  );
}

