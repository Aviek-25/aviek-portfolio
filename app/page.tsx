
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Code2,
  UserRound,
  Mail,
  Cpu,
  Terminal,
  Sun,
  Moon,
} from "lucide-react";

const projects = [
  {
    number: "01",
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
    github: "https://github.com/Aviek-25/finance-tracker",
    demo: "https://finance-tracker-beta-six-63.vercel.app",
    image: "/images/fin-map.png",
    featured: true,
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
    featured: false,
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
    featured: false,
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
    featured: false,
    status: "Project",
  },
];

export default function Home() {
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

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleContactSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setStatus("");
    setIsSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send your message.");
      }

      setStatus("Message sent successfully! I'll get back to you soon.");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  const reduceMotion = useReducedMotion();

  const reveal = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.65,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <main id="home">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Aviek home">
          aviek<span>.dev</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#about">/about</a>
          <a href="#skills">/skills</a>
          <a href="#projects">/projects</a>
          <a href="#contact">/contact</a>
        </nav>

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

        <a
          className="availability"
          href="#contact"
          aria-label="Available for opportunities"
        >
          <span className="status-dot" />
          <span className="availability-text">
            Available for opportunities
          </span>
        </a>
      </header>

      {/* HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.12,
              },
            },
          }}
        >
          <motion.div className="eyebrow" variants={reveal}>
            AVAILABLE FOR PROJECTS &amp; INTERNSHIPS
          </motion.div>

          <motion.h1 className="hero-title" id="hero-title" variants={reveal}>
            I build software,
            <br />
            AI tools, and
            <br />
            digital experiences.
          </motion.h1>

          <motion.p className="hero-description" variants={reveal}>
            I&apos;m Aviek, a B.Tech Computer Science student at IILM
            University, exploring full-stack development, artificial
            intelligence, and creative technology. I turn ideas into useful
            digital experiences.
          </motion.p>

          <motion.div className="hero-actions" variants={reveal}>
            <a className="button button-primary" href="#projects">
              View projects <ArrowDownRight size={17} />
            </a>

            <a
              className="button button-secondary"
              href="https://github.com/Aviek-25"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={16} />
            </a>

            <a className="button button-secondary" href="#contact">
              Get in touch
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-portrait"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, delay: 0.25 }}
        >
          <img
            src="/images/profile.png"
            alt="Portrait of Aviek"
            className="portrait-image"
          />
          <span className="portrait-caption">
            BUILDING WITH PURPOSE · 2026
          </span>
        </motion.div>
      </section>

      {/* ABOUT */}
      <motion.section
        id="about"
        className="section about-section"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="section-heading-row">
          <div>
            <p className="section-label">01 / ABOUT</p>
            <h2 className="section-title">About me.</h2>
          </div>
        </div>

        <div className="about-card">
          <p>
            Currently pursuing B.Tech in Computer Science at IILM University,
            I am exploring software engineering, artificial intelligence, and
            interactive web development.
          </p>

          <div className="about-details">
            <div>
              <Terminal size={19} />
              <span>Building projects</span>
            </div>
            <div>
              <Cpu size={19} />
              <span>Exploring AI</span>
            </div>
            <div>
              <Code2 size={19} />
              <span>Learning by doing</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SKILLS */}
      <motion.section
        id="skills"
        className="section skills-section"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <p className="section-label">02 / SKILLS</p>
        <h2 className="section-title">What I work with</h2>

        <div className="skills-grid">
          {[
            {
              title: "LANGUAGES",
              skills: [
                "Python",
                "Java",
                "C",
                "C++",
                "JavaScript",
                "HTML",
                "CSS",
              ],
            },
            {
              title: "FRONTEND",
              skills: [
                "HTML/CSS",
                "JavaScript",
                "React",
                "Next.js",
                "Three.js",
              ],
            },
            {
              title: "BACKEND & TOOLS",
              skills: [
                "Python",
                "Node.js",
                "Git & GitHub",
                "VS Code",
                "REST APIs",
              ],
            },
            {
              title: "AI / ML TOOLING",
              skills: [
                "Machine Learning",
                "Computer Vision",
                "TensorFlow",
                "Generative AI",
              ],
            },
          ].map((group) => (
            <div className="skill-group" key={group.title}>
              <h3>{group.title}</h3>

              <div className="skill-badges">
                {group.skills.map((skill) => (
                  <span className="skill-badge" key={skill}>
                    <span className="skill-badge-dot" aria-hidden="true" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

     
{/* PROJECTS */}
<motion.section
  id="projects"
  className="section projects-section"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.1 }}
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.12,
      },
    },
  }}
>
  <div className="section-heading-row">
    <div>
      <p className="section-label">03 / SELECTED WORK</p>
      <h2 className="section-title">Things I&apos;ve built.</h2>
    </div>
  </div>

  <div className="project-grid">
    {projects.slice(0, 3).map((project) => (
      <motion.article
        className={`project-card ${
          project.featured ? "project-featured" : ""
        }`}
        key={project.number}
        initial={false}
        whileHover={reduceMotion ? {} : { y: -5 }}
        transition={{ duration: 0.25 }}
      >
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
            loading={project.featured ? "eager" : "lazy"}
          />
        </a>

        <div className="project-card-body">
          <div className="project-card-heading">
            <h3>{project.title}</h3>
            <span
              className={`project-status ${
                project.featured ? "status-featured" : ""
              }`}
            >
              {project.status}
            </span>
          </div>

          <p>{project.description}</p>

          <div className="tag-list">
            {project.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
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
      </motion.article>
    ))}
  </div>

  {/* VIEW ALL PROJECTS BUTTON */}
  <div className="projects-footer">
    <a href="/projects" className="view-all-projects">
      View all projects
      <ArrowUpRight size={17} />
    </a>
  </div>
</motion.section>


      {/* EDUCATION */}
      <motion.section
        className="section education-section"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <p className="section-label">04 / EDUCATION</p>
        <h2 className="section-title">Currently learning.</h2>

        <div className="education-card">
          <span className="status-dot" />
          <div>
            <h3>IILM University</h3>
            <p>B.Tech — Computer Science</p>
            <p className="muted-text">
              Exploring software development, algorithms, and AI.
            </p>
          </div>
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.section
        id="contact"
        className="section contact-section contact-shell"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="contact-layout">
          <div className="contact-copy">
            <p className="section-label">05 / LET&apos;S CONNECT</p>

            <h2 className="contact-title">Get in touch.</h2>

            <p className="contact-description">
              I&apos;m interested in connecting with people who build
              interesting things. Whether you have a project idea,
              collaboration opportunity, or just want to talk about
              technology, feel free to reach out.
            </p>

            <div className="contact-links">
              <a
                className="contact-link-card"
                href="https://www.linkedin.com/in/aviek-pratap-singh-2857933ab/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-link-icon">
                  <UserRound size={20} />
                </span>

                <span className="contact-link-content">
                  <small>LinkedIn Profile</small>
                  <strong>linkedin.com/in/aviek-pratap-singh</strong>
                </span>

                <ArrowUpRight size={18} />
              </a>

              <a
                className="contact-link-card"
                href="https://github.com/Aviek-25"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-link-icon">
                  <Code2 size={20} />
                </span>

                <span className="contact-link-content">
                  <small>GitHub Repositories</small>
                  <strong>github.com/Aviek-25</strong>
                </span>

                <ArrowUpRight size={18} />
              </a>

              <a
                className="contact-link-card"
                href="mailto:aviekgaur58@gmail.com"
              >
                <span className="contact-link-icon">
                  <Mail size={20} />
                </span>

                <span className="contact-link-content">
                  <small>Email Address</small>
                  <strong>aviekgaur58@gmail.com</strong>
                </span>

                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          <div className="contact-form-panel">
            <h3>Send a Message</h3>

            <p className="contact-form-description">
              Have an opportunity or question? Send me a message directly.
            </p>

            <form
              id="contact-form"
              className="contact-form"
              onSubmit={handleContactSubmit}
            >
              <label htmlFor="contact-name">Your Name *</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Steve"
                maxLength={100}
                required
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />

              <label htmlFor="contact-email">Your Email *</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="steve@company.com"
                maxLength={254}
                required
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
              />

              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="Internship Opportunity / Project Collaboration"
                maxLength={150}
                required
                value={form.subject}
                onChange={(event) =>
                  setForm({ ...form, subject: event.target.value })
                }
              />

              <label htmlFor="contact-message">Message *</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Hi Aviek, I came across your portfolio and would like to talk..."
                rows={5}
                maxLength={5000}
                required
                value={form.message}
                onChange={(event) =>
                  setForm({ ...form, message: event.target.value })
                }
              />

              <button
                className="button button-primary contact-submit"
                type="submit"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Message"}
                <ArrowUpRight size={17} />
              </button>

              {status && (
                <p
                  className="contact-status"
                  role="status"
                  aria-live="polite"
                >
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="footer">
        <span>© 2026 Aviek Singh</span>
        <a href="#home">Back to top ↑</a>
        <span>Designed with curiosity.</span>
      </footer>
    </main>
  );
}
<div className="projects-footer">
  <a href="/projects" className="view-all-projects">
    View all projects
    <ArrowUpRight size={17} />
  </a>
</div>