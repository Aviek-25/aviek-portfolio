
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
    tags: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vercel"],
    image: "/images/fin-map.png",
    status: "Deployed",
  },
  {
    number: "02",
    slug: "devvault",
    title: "DevVault",
    description:
      "A web project built to provide a useful developer-focused experience. Explore its features and implementation.",
    tags: ["Web Development", "Vercel"],
    image: "/images/devvault.png",
    status: "Deployed",
  },
  {
    number: "03",
    slug: "cyberpulse",
    title: "CyberPulse",
    description:
      "A cybersecurity dashboard project focused on presenting security-related information. The project is currently under development.",
    tags: ["Cybersecurity", "Dashboard", "Web Development"],
    image: "/images/cyberpulse.png",
    status: "Under development",
  },
  {
    number: "04",
    slug: "kratos",
    title: "KRATOS Voice Assistant",
    description:
      "An AI voice assistant designed to interact with your computer, answer questions, and simplify everyday tasks.",
    tags: ["Python", "AI", "Voice Assistant"],
    image: "/images/kratos.png",
    status: "In development",
  },
  {
    number: "05",
    slug: "sign-language",
    title: "Sign Language Recognition",
    description:
      "A computer vision project exploring image-based sign language recognition using machine learning.",
    tags: ["Python", "Computer Vision", "Machine Learning"],
    image: "/images/sign-language.png",
    status: "Project",
  },
  {
    number: "06",
    slug: "web-development",
    title: "Web Development Projects",
    description:
      "A collection of interactive web interfaces and frontend experiments built with modern web technologies.",
    tags: ["HTML", "CSS", "JavaScript"],
    image: "/images/web-projects.png",
    status: "Project",
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
            <h1 className="section-title">All projects.</h1>
            <p className="section-intro">
              A collection of projects, experiments, and things I have been building.
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
              href={`/project-pages/${project.slug}.html`}
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
