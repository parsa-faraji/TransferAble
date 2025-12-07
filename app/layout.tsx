import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TransferAble - Your Path to Transfer Success | Free Transfer Planning Tool",
  description: "Smart course planning, personalized mentorship, and application support for community college students transferring to UC, CSU, and private universities. Free forever.",
  keywords: "community college transfer, UC transfer, CSU transfer, transfer planning, course equivalency, transfer mentorship, PIQ essays, transfer application",
  openGraph: {
    title: "TransferAble - Your Path to Transfer Success",
    description: "Free course planning, mentorship, and application support for community college students transferring to UC, CSU, and private universities.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TransferAble - Your Path to Transfer Success",
    description: "Free transfer planning tool for community college students",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-primary-600 hover:bg-primary-700",
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}


