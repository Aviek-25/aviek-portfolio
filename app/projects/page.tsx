"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Moon, Sun } from "lucide-react";

const projects = [
  {
    number: "01",
    title: "Fin MAP — Personal Finance Tracker",
    description:
      "A personal finance dashboard for tracking income, expenses, monthly budgets, transactions, and spending analytics. Built with a Supabase-backed data layer and a responsive interface.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vercel"],
    github: "https://github.com/Aviek-25/finance-tracker",
    demo: "https://finance-tracker-beta-six-63.vercel.app",
    image: "/images/fin-map.png",
    status: "Deployed",
  },
  {
    number: "02",
    title: "KRATOS Voice Assistant",
    description:
      "An AI voice assistant designed to interact with your computer, answer questions, and simplify everyday tasks.",
    tags: ["Python", "AI", "Voice Assistant"],
    github: "https://github.com/Aviek-25/KRATOS-Voice-Assistant",
    image: "/images/kratos.png",
    status: "In development",
  },
  {
    number: "03",
    title: "Sign Language Recognition",
    description:
      "A computer vision project exploring image-based sign language recognition using machine learning.",
    tags: ["Python", "Computer Vision", "Machine Learning"],
    github: "https://github.com/Aviek-25",
    image: "/images/sign-language.png",
    status: "Project",
  },
  {
    number: "04",
    title: "Web Development Projects",
    description:
      "A collection of interactive web interfaces and frontend experiments built with modern web technologies.",
    tags: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/Aviek-25",
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
    <ArrowLeft size={16} />
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
            <article className="project-card" key={project.number}>
              <a
                className="project-image-link"
                href={project.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${project.title} on GitHub`}
              >
                <img
                  src={project.image}
                  alt={`${project.title} preview`}
                  className="project-image"
                  loading="lazy"
                />
              </a>

              <div className="project-card-body">
                <div className="project-card-heading">
                  <h2>{project.title}</h2>
                  <span className="project-status">{project.status}</span>
                </div>
                <p>{project.description}</p>
                <div className="tag-list">
                  {project.tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="project-actions">
                  <a
                    className="project-open-link"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub <ArrowUpRight size={16} />
                  </a>
                  {"demo" in project && project.demo && (
                    <a
                      className="project-open-link project-demo-link"
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live demo <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </article>
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
