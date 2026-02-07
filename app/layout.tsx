import React from "react"
import type { Metadata, Viewport } from "next";
import { Dancing_Script, Nunito } from "next/font/google";

import "./globals.css";

const _dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-serif",
});
const _nunito = Nunito({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Will You Be My Valentine?",
  description: "A special question for a special someone",
};

export const viewport: Viewport = {
  themeColor: "#e11d63",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${_dancingScript.variable} ${_nunito.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
