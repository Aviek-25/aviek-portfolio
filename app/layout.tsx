import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aviek.in"),

  title: {
    default: "Aviek Pratap Singh | Developer Portfolio",
    template: "%s | Aviek Pratap Singh",
  },

  description:
    "Explore the portfolio of Aviek Pratap Singh, showcasing web development, AI engineering projects, technical skills, and interactive digital experiences.",

  keywords: [
    "Aviek Pratap Singh",
    "Aviek Singh Portfolio",
    "Developer Portfolio",
    "AI Engineering",
    "AI Projects",
    "Web Developer",
    "Frontend Development",
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "Computer Science",
  ],

  authors: [{ name: "Aviek Pratap Singh" }],
  creator: "Aviek Pratap Singh",
  publisher: "Aviek Pratap Singh",

  alternates: {
    canonical: "https://aviek.in",
  },

  openGraph: {
    title: "Aviek Pratap Singh | Developer Portfolio",
    description:
      "Explore my projects, technical skills, and work in web development and artificial intelligence.",
    url: "https://aviek.in",
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