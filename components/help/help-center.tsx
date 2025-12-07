"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  X,
  BookOpen,
  Calendar,
  Users,
  FileText,
  Award,
  ChevronRight,
  Search,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpCenterProps {
  className?: string;
}

interface HelpTopic {
  id: string;
  title: string;
  icon: React.ReactNode;
  questions: {
    question: string;
    answer: string;
  }[];
}

const helpTopics: HelpTopic[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <BookOpen className="h-5 w-5" />,
    questions: [
      {
        question: "How do I create my education plan?",
        answer: "Navigate to the Education Plan page, enter your major, select your start date, and click 'Generate Plan'. The system will automatically create a semester-by-semester roadmap based on your target universities and major requirements."
      },
      {
        question: "How do I complete my profile?",
        answer: "Go to the Onboarding page from your dashboard. Select your community college, target universities, and major. This information helps us personalize your course recommendations and transfer requirements."
      },
      {
        question: "What information do I need to get started?",
        answer: "You'll need: your current community college, intended major(s), target universities, and any courses you've already completed. This helps us create an accurate transfer plan."
      }
    ]
  },
  {
    id: "course-planning",
    title: "Course Planning",
    icon: <Calendar className="h-5 w-5" />,
    questions: [
      {
        question: "How do I mark courses as completed?",
        answer: "In your Education Plan, check the box next to each course you've completed. The system will automatically recalculate your progress and update your semester plan."
      },
      {
        question: "Can I add courses that aren't in the system?",
        answer: "Yes! In the Education Plan setup section, use the 'Add a course that is missing' form to manually add courses. Include the course code, name, and units."
      },
      {
        question: "How does the semester planning work?",
        answer: "Our algorithm distributes your remaining courses across semesters based on your start date, targeting 12-15 units per term. It considers prerequisites and course sequencing to create a realistic timeline."
      }
    ]
  },
  {
    id: "applications",
    title: "Applications",
    icon: <FileText className="h-5 w-5" />,
    questions: [
      {
        question: "When should I start my transfer applications?",
        answer: "For UC and CSU systems, applications typically open in August for fall transfer. Start preparing your PIQs (Personal Insight Questions) and gathering materials at least 2-3 months before the deadline."
      },
      {
        question: "How do I track my application deadlines?",
        answer: "Use the Timeline feature to add important deadlines. The Applications page also provides a centralized hub for tracking all your application materials and progress."
      },
      {
        question: "What are PIQs and how do I write them?",
        answer: "PIQs (Personal Insight Questions) are required for UC applications. Use our PIQ Editor in the Applications section to brainstorm, draft, and get AI-powered feedback on your responses."
      }
    ]
  },
  {
    id: "mentorship",
    title: "Mentorship",
    icon: <Users className="h-5 w-5" />,
    questions: [
      {
        question: "How do I find a mentor?",
        answer: "Visit the Mentors page to browse verified mentors from your target universities. Use filters to find mentors by major, university, or interests, then send a connection request."
      },
      {
        question: "What can mentors help me with?",
        answer: "Mentors can provide guidance on course selection, application strategies, PIQ feedback, university insights, and general transfer advice based on their own experiences."
      },
      {
        question: "How do I communicate with my mentors?",
        answer: "Once connected, you can chat with mentors directly through the platform. You can also use ask templates for common questions to make communication easier."
      }
    ]
  },
  {
    id: "resources",
    title: "Resources",
    icon: <Award className="h-5 w-5" />,
    questions: [
      {
        question: "Where can I find scholarships?",
        answer: "Check the Resources page for curated scholarship opportunities specifically for transfer students. We regularly update this with new opportunities and deadlines."
      },
      {
        question: "How can I compare different universities?",
        answer: "The Resources section includes campus comparisons, transfer statistics, and student-generated advice to help you make informed decisions about your target schools."
      },
      {
        question: "Are there success stories from other transfer students?",
        answer: "Yes! Visit our Resources page and home page to read success stories from students who have successfully transferred using TransferAble."
      }
    ]
  }
];

export function HelpCenter({ className }: HelpCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = helpTopics.map(topic => ({
    ...topic,
    questions: topic.questions.filter(q =>
      searchQuery === "" ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(topic => topic.questions.length > 0);

  const currentTopic = selectedTopic
    ? filteredTopics.find(t => t.id === selectedTopic)
    : null;

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center gap-2 group",
          className
        )}
        aria-label="Open help center"
      >
        <HelpCircle className="h-6 w-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          Need Help?
        </span>
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-8 w-8" />
                <div>
                  <h2 className="text-2xl font-bold">Help Center</h2>
                  <p className="text-blue-100 text-sm">Find answers to common questions</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedTopic(null);
                  setSearchQuery("");
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close help center"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Topics Sidebar */}
              {!selectedTopic && (
                <div className="w-full overflow-y-auto p-6">
                  <h3 className="text-lg font-semibold mb-4">Browse by Topic</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {filteredTopics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic.id)}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {topic.icon}
                          </div>
                          <div>
                            <div className="font-semibold">{topic.title}</div>
                            <div className="text-sm text-gray-500">
                              {topic.questions.length} {topic.questions.length === 1 ? 'question' : 'questions'}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                      </button>
                    ))}
                  </div>

                  {/* Quick Contact */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-600 text-white rounded-lg">
                        <MessageCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Still need help?</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Can't find what you're looking for? Reach out to our support team.
                        </p>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => window.location.href = '/contact'}
                        >
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Topic Details */}
              {selectedTopic && currentTopic && (
                <div className="w-full overflow-y-auto p-6">
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
                  >
                    ← Back to topics
                  </button>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      {currentTopic.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{currentTopic.title}</h3>
                  </div>
                  <div className="space-y-4">
                    {currentTopic.questions.map((qa, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                          <span className="text-blue-600 mt-1">Q:</span>
                          {qa.question}
                        </h4>
                        <p className="text-gray-700 ml-6">{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
