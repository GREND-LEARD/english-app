import { Inter } from 'next/font/google';
import './globals.css';
import AnimatedBackground from '@/components/AnimatedBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'English Verb Master',
  description: 'Aprende verbos en inglés de manera divertida',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AnimatedBackground />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
} 