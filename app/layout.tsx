import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aviek Pratap Singh | Developer Portfolio",
  description:
    "Aviek Pratap Singh is a Computer Science student at IILM University, building software, AI projects, and interactive web experiences.",
  keywords: [
    "Aviek Pratap Singh",
    "Developer Portfolio",
    "Computer Science",
    "Artificial Intelligence",
    "Web Development",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Aviek Pratap Singh" }],
  creator: "Aviek Pratap Singh",
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