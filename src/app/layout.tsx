import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Dropout Risk Detector",
  description:
    "Expert system UI for assessing student dropout risk and suggesting remedies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm">
                  ES
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight text-slate-900">
                    Student Dropout Risk Detector
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    Expert System Frontend
                  </span>
                </div>
              </Link>
              <Navigation />
            </div>
          </header>
          <main className="flex-1">
            <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
          </main>
          <footer className="border-t bg-white/80">
            <div className="mx-auto max-w-6xl px-6 py-4 text-sm font-medium text-slate-700">
              Student Dropout Risk Detector Expert System UI
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
