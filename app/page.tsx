import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Calendar, FileText, Award, Star, MapPin } from "lucide-react";
import { AuthButton } from "@/components/auth/user-button";
import { SuccessStory } from "@/components/success-story";
import { UniversityImage } from "@/components/ui/university-image";
import { VideoHero } from "@/components/ui/video-hero";
import { ImageGallery } from "@/components/ui/image-gallery";
import { DynamicBackground } from "@/components/ui/dynamic-background";
import { RotatingBackground } from "@/components/ui/rotating-background";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { TrustBadges } from "@/components/marketing/trust-badges";
import { FAQSection } from "@/components/marketing/faq-section";
import { SocialProof } from "@/components/marketing/social-proof";
import { CTABanner } from "@/components/marketing/cta-banner";
import { Logo } from "@/components/ui/logo";
import { Mascot } from "@/components/ui/mascot";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Dynamic Background */}
      <DynamicBackground />
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" showText={true} />
            </Link>
            <AuthButton />
          </div>
        </div>
      </nav>

          {/* Hero Section */}
          <section className="relative py-32 overflow-hidden min-h-[90vh]">
            {/* Rotating University Background - Full Screen */}
            <RotatingBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full text-sm font-semibold shadow-lg border border-blue-200">
                Built by transfer students from UCLA, UC Berkeley & USC
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up drop-shadow-2xl">
              Your Clear Path to
              <span className="block bg-gradient-to-r from-yellow-300 to-cyan-300 bg-clip-text text-transparent"> Transfer Success</span>
            </h1>
            <p className="text-xl text-white/95 mb-8 max-w-3xl mx-auto animate-fade-in-up drop-shadow-lg" style={{ animationDelay: "0.2s" }}>
              Smart course planning, personalized mentorship, and application support
              for community college students transferring to UC, CSU, and private universities.
            </p>
            <div className="flex justify-center space-x-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <Link href="/sign-up">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-2 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <Link href="/demo">See How It Works</Link>
              </Button>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Free</div>
                <div className="text-sm text-gray-600 mt-1">Always Free to Use</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Real</div>
                <div className="text-sm text-gray-600 mt-1">Built by Transfer Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Smart</div>
                <div className="text-sm text-gray-600 mt-1">AI-Powered Tools</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transfer Journey Timeline */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Transfer Roadmap</h2>
            <p className="text-gray-600">Four simple steps to transfer success</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Plan Your Courses</h3>
              <p className="text-gray-600 text-sm">Map out all required courses and prerequisites for your major</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect with Mentors</h3>
              <p className="text-gray-600 text-sm">Get guidance from students who successfully transferred</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Write Your PIQs</h3>
              <p className="text-gray-600 text-sm">Craft compelling essays with AI-powered brainstorming</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit & Track</h3>
              <p className="text-gray-600 text-sm">Stay on top of deadlines and monitor your progress</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mascot Introduction */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="flex-shrink-0">
              <Mascot
                mood="happy"
                size="lg"
                showName={true}
                animated={true}
              />
            </div>
            <div className="text-center md:text-left max-w-2xl">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Meet Hootie - Your Transfer Companion
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Your intelligent guide throughout the transfer journey. From planning courses to celebrating acceptance letters,
                Hootie provides personalized wisdom and encouragement every step of the way.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-purple-100">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
                  <span className="font-medium text-gray-700">Daily Motivation</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-purple-100">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
                  <span className="font-medium text-gray-700">Study Tips</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-purple-100">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
                  <span className="font-medium text-gray-700">Progress Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Top Transfer Destinations</h2>
            <p className="text-gray-600">Popular universities for community college transfers</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {["UC Berkeley", "UCLA", "UC San Diego", "UC Santa Barbara", "UC Davis", "Stanford"].map((uni, index) => (
              <div
                key={uni}
                className="text-center group cursor-pointer"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${index * 100}ms both`
                }}
              >
                <UniversityImage
                  name={uni}
                  size="lg"
                  className="mx-auto mb-3 group-hover:shadow-2xl transition-all"
                />
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                  {uni}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Everything You Need to Transfer Successfully
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools designed by transfer students, for transfer students
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-primary-600" />}
              title="Smart Course Planning"
              description="Automatically track requirements, prerequisites, and course equivalencies across all your target universities."
              delay={0}
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-primary-600" />}
              title="Transfer Timeline"
              description="Never miss a deadline with personalized timelines that track applications, exams, and important dates."
              delay={100}
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-primary-600" />}
              title="Peer Mentorship"
              description="Connect with verified mentors from your target universities for personalized guidance and support."
              delay={200}
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-primary-600" />}
              title="Application Hub"
              description="PIQ brainstorming, essay tracking, activity logs, and automated feedback to strengthen your applications."
              delay={300}
            />
            <FeatureCard
              icon={<Award className="h-8 w-8 text-primary-600" />}
              title="Resource Library"
              description="Access scholarships, transfer stories, campus comparisons, and student-generated advice."
              delay={400}
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-primary-600" />}
              title="Progress Tracking"
              description="Visual dashboards show your transfer readiness, course completion, and application progress."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* Campus Gallery */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Campus Life</h2>
            <p className="text-gray-600">Explore beautiful campuses across California</p>
          </div>
          <ImageGallery
            images={[
              "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&q=80",
              "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop&q=80",
              "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&h=600&fit=crop&q=80",
              "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop&q=80",
              "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop&q=80",
              "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop&q=80",
              "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&q=80",
              "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80",
            ]}
            title="Campus Gallery"
          />
        </div>
      </section>

      {/* Social Proof */}
      <SocialProof />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTABanner />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Logo size="md" showText={true} className="brightness-0 invert" />
              </div>
              <p className="text-sm">
                Empowering community college students on their transfer journey.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/guides" className="hover:text-white">Guides</Link></li>
                <li><Link href="/community" className="hover:text-white">Community</Link></li>
              </ul>
            </div>
                <div>
                  <h3 className="font-semibold text-white mb-4">Company</h3>
                  <ul className="space-y-2 text-sm">
                    <li><Link href="/about" className="hover:text-white">About</Link></li>
                    <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                    <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                    <li>
                      <a href="mailto:hello@transferable.app" className="hover:text-white">
                        hello@transferable.app
                      </a>
                    </li>
                  </ul>
                </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 TransferAble. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay = 0 }: { icon: React.ReactNode; title: string; description: string; delay?: number }) {
  return (
    <div
      className="card group hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-blue-300 cursor-pointer relative overflow-hidden"
      style={{
        animation: `fade-in-up 0.6s ease-out ${delay}ms both`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{description}</p>
      </div>
    </div>
  );
}


