import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Vibe Template",
  description: "A template for building a web application with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
