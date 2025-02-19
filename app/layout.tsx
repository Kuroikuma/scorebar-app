"use client";

import "./styles/fonts.css";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { StrictMode } from "react";
import { Navigation } from "@/components/navigation";
import { Toaster, toast } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <StrictMode>
        <body className="antialiased bg-transparent">
          {/* <Navigation /> */}
          
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </body>
      </StrictMode>
    </html>
  );
}
