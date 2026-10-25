import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore Aviek Pratap Singh's projects, including Fin MAP, DevVault, CyberPulse, and KRATOS AI. Discover web development, software, and AI experiments.",

  alternates: {
    canonical: "/projects",
  },

  openGraph: {
    title: "Projects | Aviek Pratap Singh",
    description:
      "Explore web development, software, and AI projects built by Aviek Pratap Singh.",
    url: "https://aviek-portfolio.vercel.app/projects",
    siteName: "Aviek Pratap Singh Portfolio",
    type: "website",
  },
};

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}