"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Star, MessageSquare, University } from "lucide-react";
import { RequestMentorForm } from "@/components/mentors/request-mentor-form";
import { AskTemplates } from "@/components/mentors/ask-templates";
import { ChatInterface } from "@/components/mentors/chat-interface";
import { UniversityImage } from "@/components/ui/university-image";

interface Mentor {
  id: string;
  major: string;
  graduationYear: number | null;
  rating: number;
  totalSessions: number;
  specialties: string[];
  bio: string | null;
  isAvailable: boolean;
  university: {
    name: string;
  };
  user: {
    firstName: string | null;
    lastName: string | null;
  };
}

export function MentorsClient() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [activeMentorships, setActiveMentorships] = useState<any[]>([]);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    fetchMentors();
    fetchActiveMentorships();
  }, []);

  const fetchActiveMentorships = async () => {
    try {
      const response = await fetch("/api/mentors/requests");
      if (response.ok) {
        const data = await response.json();
        setActiveMentorships(data.requests || []);
      }
    } catch (error) {
      console.error("Error fetching active mentorships:", error);
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await fetch("/api/mentors");
      if (response.ok) {
        const data = await response.json();
        setMentors(data.mentors || []);
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowRequestForm(true);
    setRequestSuccess(false);
  };

  const handleRequestSuccess = () => {
    setRequestSuccess(true);
    setTimeout(() => {
      setShowRequestForm(false);
      setSelectedMentor(null);
    }, 2000);
  };

  if (loading) {
    return <div className="p-8">Loading mentors...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Mentor</h1>
        <p className="text-gray-600">
          Connect with verified mentors from your target universities
        </p>
      </div>

      {requestSuccess && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-green-800">✓ Mentorship request sent successfully!</p>
          </CardContent>
        </Card>
      )}

      {showRequestForm && selectedMentor && (
        <div className="mb-6">
          <RequestMentorForm
            mentorId={selectedMentor.id}
            mentorName={`${selectedMentor.user.firstName || ""} ${selectedMentor.user.lastName || ""}`.trim()}
            onSuccess={handleRequestSuccess}
            onClose={() => {
              setShowRequestForm(false);
              setSelectedMentor(null);
            }}
          />
        </div>
      )}

      {/* Active Connections */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Mentorships</CardTitle>
              <CardDescription>Your current mentor connections</CardDescription>
            </div>
            {showTemplates && (
              <Button variant="outline" size="sm" onClick={() => setShowTemplates(false)}>
                Hide Templates
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activeMentorships.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-4">
              You don't have any active mentorships yet. Browse available mentors below to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {activeMentorships.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{request.mentor?.user?.firstName} {request.mentor?.user?.lastName}</h4>
                      <p className="text-sm text-gray-600">{request.mentor?.university?.name}</p>
                      {request.topic && (
                        <p className="text-xs text-gray-500 mt-1">Topic: {request.topic}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setActiveRequestId(request.id);
                          setShowChat(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ask Templates */}
      {showTemplates && (
        <div className="mb-6">
          <AskTemplates
            onSelectTemplate={(template) => {
              if (selectedMentor) {
                setShowRequestForm(true);
                // TODO: Pre-fill form with template
              }
            }}
          />
        </div>
      )}

      {/* Chat Interface */}
      {showChat && activeRequestId && (
        <div className="mb-6">
          <ChatInterface
            requestId={activeRequestId}
          />
        </div>
      )}

      {/* Available Mentors */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Mentors</h2>
        {mentors.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-500 text-center py-8">
                No mentors available at the moment. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor, index) => (
              <Card 
                key={mentor.id}
                className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
                style={{
                  animation: `fade-in-up 0.5s ease-out ${index * 100}ms both`
                }}
              >
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <UniversityImage
                      name={mentor.university.name}
                      size="md"
                      className="flex-shrink-0"
                      animated={true}
                    />
                    <div className="flex-1 flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                          {mentor.user.firstName} {mentor.user.lastName}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <University className="h-4 w-4 mr-1" />
                          {mentor.university.name}
                        </CardDescription>
                      </div>
                      {mentor.isAvailable ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex-shrink-0">
                          Available
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full flex-shrink-0">
                          Busy
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Major:</span> {mentor.major}
                      </p>
                      {mentor.graduationYear && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Class of:</span> {mentor.graduationYear}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{mentor.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">
                        ({mentor.totalSessions} sessions)
                      </span>
                    </div>
                    {mentor.bio && (
                      <p className="text-sm text-gray-600">{mentor.bio}</p>
                    )}
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        {mentor.specialties.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-1 text-xs bg-primary-50 text-primary-700 rounded"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      disabled={!mentor.isAvailable}
                      onClick={() => handleRequestClick(mentor)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Request Mentorship
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Mentorship Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                <span className="text-primary-700 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Find a Mentor</h3>
              <p className="text-sm text-gray-600">
                Browse verified mentors from your target universities and majors
              </p>
            </div>
            <div>
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                <span className="text-primary-700 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Send a Request</h3>
              <p className="text-sm text-gray-600">
                Request mentorship with a message about what you need help with
              </p>
            </div>
            <div>
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                <span className="text-primary-700 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Get Guidance</h3>
              <p className="text-sm text-gray-600">
                Chat with your mentor and get personalized advice for your transfer journey
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

