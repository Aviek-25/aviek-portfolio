import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aviek-portfolio.vercel.app"),

  title: {
    default: "Aviek Pratap Singh | Developer Portfolio",
    template: "%s | Aviek Pratap Singh",
  },

  description:
    "Explore the portfolio of Aviek Pratap Singh, a developer building web applications, AI projects, and interactive digital experiences.",

  keywords: [
    "Aviek Pratap Singh",
    "Developer Portfolio",
    "Web Developer",
    "Artificial Intelligence",
    "AI Projects",
    "Frontend Development",
    "React",
    "Next.js",
    "JavaScript",
    "Computer Science",
  ],

  authors: [{ name: "Aviek Pratap Singh" }],
  creator: "Aviek Pratap Singh",
  publisher: "Aviek Pratap Singh",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Aviek Pratap Singh | Developer Portfolio",
    description:
      "Explore my projects, technical skills, and work in web development and artificial intelligence.",
    url: "https://aviek-portfolio.vercel.app",
    siteName: "Aviek Pratap Singh Portfolio",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Aviek Pratap Singh | Developer Portfolio",
    description:
      "Explore my projects, technical skills, and work in web development and artificial intelligence.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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