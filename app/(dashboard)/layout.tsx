import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { BookOpen, LayoutDashboard, Calendar, Users, FileText, Award, Settings, GraduationCap } from "lucide-react";
import { HelpCenter } from "@/components/help/help-center";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/courses", label: "Course Plan", icon: BookOpen },
    { href: "/education-plan", label: "Education Plan", icon: GraduationCap },
    { href: "/study-tools", label: "Study Tools", icon: BookOpen },
    { href: "/timeline", label: "Timeline", icon: Calendar },
    { href: "/mentors", label: "Mentors", icon: Users },
    { href: "/applications", label: "Applications", icon: FileText },
    { href: "/homework-help", label: "Homework Help", icon: BookOpen, premium: true },
    { href: "/ai-counselor", label: "AI Counselor", icon: Users, premium: true },
    { href: "/resources", label: "Resources", icon: Award },
    { href: "/apply-mentor", label: "Become a Mentor", icon: GraduationCap },
    { href: "/payments", label: "Upgrade to Premium", icon: Award },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <BookOpen className="h-6 w-6 text-primary-600" />
            <span className="ml-2 text-lg font-bold text-gray-900">TransferAble</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center flex-1 min-w-0">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary-700">
                    {user.firstName?.[0] || 
                     (user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U")}
                  </span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName || user.lastName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.emailAddresses?.[0]?.emailAddress || "No email"}
                  </p>
                </div>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        {children}
      </div>

      {/* Help Center - Available on all dashboard pages */}
      <HelpCenter />
    </div>
  );
}


