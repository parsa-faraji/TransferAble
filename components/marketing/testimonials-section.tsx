"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { UniversityImage } from "@/components/ui/university-image";

interface Testimonial {
  name: string;
  from: string;
  to: string;
  major: string;
  quote: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Transfer Student",
    from: "Berkeley City College",
    to: "UC Berkeley",
    major: "Computer Science",
    quote: "TransferAble made it so easy to track all my requirements. I never would have gotten into Cal without it! The course planning feature saved me from taking unnecessary classes.",
    rating: 5,
  },
  {
    name: "Transfer Student",
    from: "Diablo Valley College",
    to: "UCLA",
    major: "Engineering",
    quote: "The mentorship feature connected me with an amazing mentor who helped me with my PIQs. Game changer! I got accepted to all 3 UCs I applied to.",
    rating: 5,
  },
  {
    name: "Transfer Student",
    from: "Laney College",
    to: "UC San Diego",
    major: "Biology",
    quote: "The timeline feature kept me on track for all my deadlines. I felt so organized and confident throughout the entire process. Highly recommend!",
    rating: 5,
  },
  {
    name: "Transfer Student",
    from: "Mission College",
    to: "UC Irvine",
    major: "Business",
    quote: "As a first-generation student, I had no idea where to start. TransferAble gave me a clear roadmap and connected me with mentors who understood my journey.",
    rating: 5,
  },
  {
    name: "Transfer Student",
    from: "Los Medanos College",
    to: "UC Santa Barbara",
    major: "Psychology",
    quote: "The AI essay feedback was incredible. It helped me refine my PIQs and tell my story authentically. Got waitlisted at UCSB but accepted to UCI!",
    rating: 5,
  },
  {
    name: "Transfer Student",
    from: "College of Alameda",
    to: "UC Davis",
    major: "Environmental Science",
    quote: "Free and incredibly helpful. The course equivalency database is accurate and up-to-date. This should be required for all CC students!",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <Star className="h-6 w-6 text-yellow-400 mr-2 fill-yellow-400" />
            <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>
            <Star className="h-6 w-6 text-yellow-400 ml-2 fill-yellow-400" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real students, real results. See how TransferAble helped them achieve their transfer dreams.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
              style={{
                animation: `fade-in-up 0.6s ease-out ${index * 100}ms both`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600">{testimonial.from}</span> →{" "}
                      <span className="font-medium text-cyan-600">{testimonial.to}</span>
                    </p>
                    <p className="text-xs text-gray-500">{testimonial.major}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200 opacity-50" />
                  <p className="text-gray-700 italic text-sm leading-relaxed pl-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Real students sharing their transfer journey
          </p>
        </div>
      </div>
    </section>
  );
}

