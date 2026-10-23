# Aviek Portfolio — Interactive Developer Portfolio

Welcome to my personal portfolio repository. This project is my digital space to showcase my background, technical skills, projects, and development journey. Built with a modern frontend stack, it combines a minimalist visual identity with smooth animations, interactive elements, and a custom backend-powered contact system.

The goal is to create an immersive and responsive experience that reflects my interests in software development, artificial intelligence, and building practical technology solutions.

## 🚀 Tech Stack Overview

- **Framework:** Next.js 16
- **Frontend:** React 19
- **Language:** TypeScript
- **Styling:** CSS3 and custom responsive styling
- **Animations:** Motion
- **Icons:** Lucide React
- **Backend:** Next.js API Routes
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **Email Service:** Resend
- **Rate Limiting:** Upstash Redis
- **Version Control:** Git and GitHub
- **Hosting:** Vercel

## ✨ Features, Animations & Interactions

This portfolio focuses on clean design, smooth transitions, and interactive user experiences.

- **Interactive Hero Section:** A personalized introduction with animated elements and a clean visual hierarchy.
- **Smooth Scroll Animations:** Motion-powered reveal effects and transitions that make page navigation feel fluid.
- **Dynamic Theme Transitions:** The visual theme changes as visitors scroll through different sections, transitioning into a Midnight Blue and Cyan aesthetic.
- **Interactive Navigation:** Responsive navigation with smooth section-based navigation and visual feedback.
- **Animated Project Showcase:** Dedicated project cards highlighting development work, technologies, and project details.
- **Responsive Layout:** Optimized layouts for desktop, tablet, and mobile screens.
- **Micro-interactions:** Subtle hover effects, animated buttons, transitions, and interactive visual elements.
- **Reduced Motion Support:** Animation behavior respects the user's reduced-motion preferences.

## 📨 Contact System & Backend Integration

The portfolio includes a functional contact system that connects the frontend to backend services.

**Contact form workflow:**

| Component | Technology | Purpose |
|---|---|---|
| Contact Form | React + TypeScript | Collects visitor messages |
| API Endpoint | Next.js API Routes | Processes form submissions |
| Database | Supabase | Stores contact messages |
| Email Service | Resend | Sends email notifications |
| Rate Limiting | Upstash Redis | Helps prevent spam submissions |

**How it works:**

1. A visitor submits a message through the contact form.
2. The frontend sends the form data to the contact API endpoint.
3. The backend validates and processes the submission.
4. The message is stored in the Supabase database.
5. Resend handles email notifications.
6. Rate limiting helps protect the endpoint from excessive requests.

## 🔐 Admin Dashboard

The portfolio also includes a private administration dashboard for managing contact messages.

**Dashboard capabilities:**

- Secure administrator login using Supabase Authentication.
- Server-side administrator authorization.
- View messages submitted through the contact form.
- Search and filter messages.
- Update message statuses.
- Archive and delete messages.
- Open individual messages in a detailed popup.
- Export message data to CSV.
- Responsive dashboard interface.

**Dashboard design:**

The administration interface uses a Midnight Graphite and Cyan visual theme, with subtle animations, interactive elements, and a responsive layout.

Access to administrative functionality is restricted through authentication and server-side authorization.

## 🎨 UI Design & Visual Identity

The portfolio uses a minimalist design approach with a focus on typography, spacing, contrast, and subtle visual effects.

- **Graphite & Silver:** A clean, monochromatic visual identity.
- **Midnight Blue & Cyan:** An alternative visual theme used for the interactive project experience.
- **Glass-inspired Elements:** Subtle layered surfaces and visual depth.
- **Responsive Components:** Layouts adapt to different screen sizes.
- **Interactive Feedback:** Hover states and transitions improve usability without overwhelming the interface.

## 📁 Project Structure

The project is organized using the Next.js App Router architecture.

```text
aviek-portfolio/
│
├── app/
│   ├── admin/
│   │   ├── login/
│   │   ├── page.tsx
│   │   └── AdminMessages.tsx
│   │
│   ├── api/
│   │   ├── admin/
│   │   └── contact/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       ├── proxy.ts
│       └── admins.ts
│
├── public/
│   └── images/
│
├── proxy.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```



## ⚡ Performance & Reliability

The project incorporates several practices to maintain a smooth and reliable experience.

- Responsive CSS layouts for different devices.
- Motion-based animations with reduced-motion considerations.
- Production builds validated with Next.js.
- TypeScript for improved code reliability.
- Backend validation for contact submissions.
- Rate limiting for additional API protection.
- Authentication and authorization for administrative operations.



---

*Crafted with creativity, driven by technology.*