import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Oddly Specific - Because Generic Compliments are Boring",
    template: "%s | Oddly Specific",
  },
  description:
    "Generate delightfully specific compliments that hit differently than your average praise.",
  openGraph: {
    title: "Oddly Specific",
    description:
      "Generate delightfully specific compliments that hit differently than your average praise.",
    url: "https://oddly-specific.vercel.app",
    siteName: "Oddly Specific",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png", // 1200x630 recommended
        width: 1200,
        height: 630,
        alt: "Oddly Specific",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oddly Specific",
    description:
      "Generate delightfully specific compliments that hit differently than your average praise.",
    creator: "@pushpalghoshal",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
