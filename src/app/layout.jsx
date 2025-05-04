import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from 'next-themes';
import ThemeToggle from '@/components/ThemeToggle';
import ConfettiButton from '@/components/ConfettiButton';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Verb Master App",
  description: "Learn and practice English verbs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="background-gradient" />
          <div className="particles-container">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
          </div>
          
          <Navbar />
          
          <ThemeToggle />
          <ConfettiButton />

          <main className="relative z-10 pt-20 pb-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
