import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HellScript AI",
  description: "AI-powered GitHub productivity and repository analysis platform.",
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
