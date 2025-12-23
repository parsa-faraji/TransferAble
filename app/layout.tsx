import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "TransferAble - Your Path to Transfer Success",
    template: "%s | TransferAble",
  },
  description: "Smart course planning, personalized mentorship, and application support for community college students transferring to UC, CSU, and private universities. Free forever.",
  keywords: [
    "community college transfer",
    "UC transfer",
    "CSU transfer",
    "transfer planning",
    "course equivalency",
    "transfer mentorship",
    "PIQ essays",
    "transfer application",
    "California transfer",
    "college transfer guide",
    "transfer student resources",
  ],
  authors: [{ name: "TransferAble Team" }],
  creator: "TransferAble",
  publisher: "TransferAble",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "TransferAble",
    title: "TransferAble - Your Path to Transfer Success",
    description: "Free course planning, mentorship, and application support for community college students transferring to UC, CSU, and private universities.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TransferAble - Your Path to Transfer Success",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TransferAble - Your Path to Transfer Success",
    description: "Free transfer planning tool for community college students",
    images: ["/og-image.png"],
    creator: "@transferable",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes when ready
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
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
        <body className={poppins.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}


