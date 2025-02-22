'use client';

import './styles/fonts.css';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { StrictMode } from 'react';
import { Toaster } from 'sonner';
import { Header } from '@/components/header';
import Sidebar from '@/components/sidebar';
import { ThemeProvider } from '@/components/MatchComponents/theme-provider';
import { usePathname } from 'next/navigation';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <StrictMode>
        <body className="antialiased bg-transparent">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>{children}</AuthProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </StrictMode>
    </html>
  );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/login' || pathname.includes("/overlay")) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />

        <link rel="icon" href="/favicon.ico" />
      </head>
      <StrictMode>
        <body className="antialiased bg-transparent">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <Sidebar>{children}</Sidebar>
            </AuthProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </StrictMode>
    </html>
  );
}
