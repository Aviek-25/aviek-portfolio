
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, ArrowUpRight } from "lucide-react";

type Project = {
  number: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  status: string;
};

const projects: Project[] = [
  {
    number: "01",
    slug: "fin-map",
    title: "Fin MAP — Personal Finance Tracker",
    description:
      "A personal finance dashboard for tracking income, expenses, monthly budgets, transactions, and spending analytics. Built with a Supabase-backed data layer and a responsive interface.",
    tags: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "Vercel",
    ],
    image: "/images/fin-map.png",
    status: "Live",
  },
  {
    number: "02",
    slug: "devvault",
    title: "DevVault",
    description:
      "A developer workspace to save, organize, search, and manage reusable code snippets and programming resources. Built with Firebase and Monaco Editor.",
    tags: [
      "Next.js",
      "TypeScript",
      "Firebase",
      "Firestore",
      "Monaco Editor",
      "Vercel",
    ],
    image: "/images/devvault.png",
    status: "Live",
  },
  {
    number: "03",
    slug: "cyberpulse",
    title: "CyberPulse",
    description:
      "A cybersecurity dashboard concept designed to present security-related information through a structured and modern interface.",
    tags: [
      "HTML",
      "CSS",
      "JavaScript",
      "Cybersecurity",
      "Dashboard",
    ],
    image: "/images/cyberpulse.png",
    status: "In Development",
  },
  {
    number: "04",
    slug: "kratos",
    title: "KRATOS AI — Voice Assistant",
    description:
      "A personal AI voice assistant inspired by JARVIS, exploring voice interaction, AI model integrations, and computer-assistant workflows.",
    tags: [
      "Python",
      "Gemini API",
      "OpenAI API",
      "OpenRouter",
      "Speech Recognition",
    ],
    image: "/images/kratos.png",
    status: "In Development",
  },
];

export default function ProjectsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme");
    const initialTheme = savedTheme === "light" ? "light" : "dark";

    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
    document.body.dataset.theme = initialTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.body.dataset.theme = nextTheme;

    window.localStorage.setItem("portfolio-theme", nextTheme);
  }

  return (
    <main id="home" className="all-projects-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Aviek home">
          aviek<span>.dev</span>
        </a>

        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
        </button>
      </header>

      <section className="section projects-section all-projects-section">
        <div className="archive-back-wrapper">
          <a href="/#projects" className="archive-back-button">
            <span>←</span>
            <span>Back to Portfolio</span>
          </a>
        </div>

        <div className="section-heading-row all-projects-heading">
          <div>
            <p className="section-label">PROJECT ARCHIVE</p>
            <h1 className="section-title">Things I've built.</h1>
            <p className="section-intro">
              A collection of projects, experiments, and ideas brought to life
              through code.
            </p>
          </div>

          <a
            className="text-link"
            href="https://github.com/Aviek-25"
            target="_blank"
            rel="noreferrer"
          >
            GitHub profile <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="project-grid all-projects-grid">
          {projects.map((project) => (
            <a
              className="project-card project-card-link"
              key={project.number}
              href={`/project-pages/${project.slug}`}
              aria-label={`Open ${project.title} project page`}
            >
              <div className="project-image-link">
                <img
                  src={project.image}
                  alt={`${project.title} preview`}
                  className="project-image"
                  loading="lazy"
                />
              </div>

              <div className="project-card-body">
                <div className="project-card-heading">
                  <h2>{project.title}</h2>
                  <span className="project-status">{project.status}</span>
                </div>

                <p>{project.description}</p>

                <div className="tag-list">
                  {project.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 Aviek Singh</span>
        <a href="/">Back to home ↑</a>
        <span>Designed with curiosity.</span>
      </footer>
    </main>
  );
}
