import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft, Target, Users, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TransferAble</span>
            </Link>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About TransferAble</h1>
          <p className="text-xl text-gray-600">
            Empowering community college students on their transfer journey
          </p>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg leading-relaxed">
              TransferAble was born from a simple observation: transferring from community college to a 4-year university
              shouldn't be confusing, stressful, or overwhelming. We believe every student deserves a clear, personalized
              path to their dream university.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mt-4">
              Our platform combines smart technology with real human connections to provide the guidance, tools, and
              support students need to successfully transfer to UC, CSU, and private universities.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <Target className="h-10 w-10 text-primary-600 mb-4" />
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To become the go-to platform for every community college student planning to transfer,
                making the process transparent, accessible, and successful.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary-600 mb-4" />
              <CardTitle>Our Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Built by students, for students. Our community of mentors, counselors, and fellow
                transfer students support each other every step of the way.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-10 w-10 text-primary-600 mb-4" />
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We're committed to accessibility, transparency, and student success. Every feature
                we build is designed with students' needs in mind.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Join Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">
              Whether you're a student starting your transfer journey, a mentor looking to give back,
              or a counselor supporting students, we'd love to have you be part of the TransferAble community.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

