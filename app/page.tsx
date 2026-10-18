
"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Code2,
  UserRound,
  Mail,
  ExternalLink,
  Sparkles,
  Cpu,
  Terminal,
} from "lucide-react";

const projects = [
  {
    number: "01",
    title: "KRATOS Voice Assistant",
    description:
      "An AI voice assistant designed to interact with your computer, answer questions, and simplify everyday tasks.",
    tags: ["Python", "AI", "Voice Assistant"],
    github: "https://github.com/Aviek-25/KRATOS-Voice-Assistant",
    image: "/images/kratos.png",
    featured: true,
    status: "In development",
  },
  {
    number: "02",
    title: "Sign Language Recognition",
    description:
      "A computer vision project exploring image-based sign language recognition using machine learning.",
    tags: ["Python", "Computer Vision", "ML"],
    github: "https://github.com/Aviek-25",
    image: "/images/sign-language.png",
    featured: false,
    status: "Project",
  },
  {
    number: "03",
    title: "Web Development Projects",
    description:
      "Interactive web interfaces and frontend experiments built with modern web technologies.",
    tags: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/Aviek-25",
    image: "/images/web-projects.png",
    featured: false,
    status: "Project",
  },
];

const skillGroups = [
  { title: "Languages", skills: ["Java", "Python", "JavaScript", "C"] },
  { title: "Web", skills: ["HTML", "CSS", "React", "Next.js"] },
  {
    title: "AI / ML",
    skills: ["Machine Learning", "Computer Vision"],
  },
  { title: "Tools", skills: ["Git", "GitHub", "VS Code"] },
];

export default function Home() {
  const projectsRef = useRef<HTMLElement | null>(null);

  // Switch themes when the Projects section enters/leaves the viewport.
  const projectsInView = useInView(projectsRef, {
    amount: 0.15,
  });

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.body.dataset.theme = projectsInView ? "cyan" : "graphite";

    return () => {
      delete document.body.dataset.theme;
    };
  }, [projectsInView]);

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
          <a href="#projects">/projects</a>
          <a href="#skills">/skills</a>
          <a href="#about">/about</a>
          <a href="#contact">/contact</a>
        </nav>

        <a className="availability" href="#contact" aria-label="Available for opportunities">
          <span className="status-dot" />
          <span className="availability-text">Available for opportunities</span>
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
            I&apos;m Aviek, a B.Tech Computer Science student at IILM University,
            exploring full-stack development, artificial intelligence, and
            creative technology. I turn ideas into useful digital experiences.
          </motion.p>

          <motion.div className="hero-actions" variants={reveal}>
            <a className="button button-primary" href="#projects">
              View projects <ArrowDownRight size={17} />
            </a>
            <a className="button button-secondary" href="https://github.com/Aviek-25" target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight size={16} />
            </a>
            <a className="button button-secondary" href="#contact">
              Get in touch
            </a>
          </motion.div>

          <motion.div className="social-links" variants={reveal}>
            <a href="https://github.com/Aviek-25" target="_blank" rel="noreferrer">
              <Code2 size={17} /> GitHub
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              <UserRound size={17} /> LinkedIn
            </a>
            <a href="#contact">
              <Mail size={17} /> Email
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
          <span className="portrait-caption">BUILDING WITH PURPOSE · 2026</span>
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
            <div><Terminal size={19} /><span>Building projects</span></div>
            <div><Cpu size={19} /><span>Exploring AI</span></div>
            <div><Code2 size={19} /><span>Learning by doing</span></div>
          </div>
        </div>
      </motion.section>

      {/* PROJECTS — this section triggers the cyan theme */}
      <motion.section
        ref={projectsRef}
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
            <p className="section-label">02 / SELECTED WORK</p>
            <h2 className="section-title">Things I&apos;ve built.</h2>
          </div>

          <a
            className="text-link"
            href="https://github.com/Aviek-25"
            target="_blank"
            rel="noreferrer"
          >
            All repositories <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <motion.article
              className={`project-card ${project.featured ? "project-featured" : ""}`}
              key={project.number}
              variants={reveal}
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
                  <span className={`project-status ${project.featured ? "status-featured" : ""}`}>
                    {project.status}
                  </span>
                </div>

                <p>{project.description}</p>

                <div className="tag-list">
                  {project.tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>

                <a
                  className="project-open-link"
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  View project <ArrowUpRight size={16} />
                </a>
              </div>
            </motion.article>
          ))}
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
  <p className="section-label">~/skills</p>
  <h2 className="section-title">What I work with</h2>

  <div className="skills-grid">
    {[
      {
        title: "LANGUAGES",
        skills: ["Python", "Java", "C", "C++", "JavaScript", "HTML", "CSS"],
      },
      {
        title: "FRONTEND",
        skills: ["HTML/CSS", "JavaScript", "React", "Next.js", "Three.js"],
      },
      {
        title: "BACKEND & TOOLS",
        skills: ["Python", "Node.js", "Git & GitHub", "VS Code", "REST APIs"],
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
        className="section contact-section"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <p className="section-label">05 / CONTACT</p>
        <h2 className="section-title">Have an idea? Let&apos;s build it.</h2>
        <p className="section-intro">
          I&apos;m interested in connecting with people who build interesting
          things.
        </p>

        <a className="button button-primary" href="mailto:your-email@example.com">
          Say hello <ArrowUpRight size={17} />
        </a>
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
