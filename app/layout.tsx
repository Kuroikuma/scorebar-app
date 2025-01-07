"use client";

import "./styles/fonts.css";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { StrictMode } from "react";
import { Navigation } from "@/components/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <StrictMode>
        <body className="antialiased bg-transparent">
          {/* <Navigation /> */}
          <AuthProvider>{children}</AuthProvider>
        </body>
      </StrictMode>
    </html>
  );
}
