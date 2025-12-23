"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Is TransferAble really free?",
    answer: "Yes! Our core features are completely free forever. This includes course planning, timeline generation, 1 mentor connection, PIQ editor, and application tracking. We offer a Premium plan ($9.99/month) with additional features like unlimited mentors and AI feedback, but the free plan is fully functional.",
  },
  {
    question: "How accurate is the course equivalency database?",
    answer: "Our database is updated regularly from ASSIST.org and verified by counselors. We also use AI to suggest equivalencies when official data isn't available. However, always double-check with your counselor before enrolling in courses.",
  },
  {
    question: "Are the mentors verified?",
    answer: "Yes! All mentors must verify their identity using their college/university email address. We also verify their transfer status and current enrollment. Mentors are rated by students to ensure quality.",
  },
  {
    question: "Can I use this for out-of-state transfers?",
    answer: "Currently, TransferAble is optimized for California community college transfers to UC, CSU, and California private universities. We're working on expanding to other states!",
  },
  {
    question: "How does the AI essay feedback work?",
    answer: "Our AI uses GPT-4 to provide constructive feedback on your PIQ essays, focusing on clarity, impact, and authenticity. It's designed to help you tell your story better, not write the essay for you.",
  },
  {
    question: "What if my community college isn't listed?",
    answer: "You can still use TransferAble! Just select 'Other' during onboarding and manually enter your courses. We're constantly adding new colleges based on user requests.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use industry-standard encryption, are SOC 2 compliant, and never share your personal information. Your data is yours and you can delete it anytime.",
  },
  {
    question: "Do you offer support for counselors?",
    answer: "Yes! We're building counselor dashboards and tools. Contact us at support@transferable.com to learn about our B2B offerings for community colleges.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about TransferAble
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>
                {openIndex === index && (
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}




