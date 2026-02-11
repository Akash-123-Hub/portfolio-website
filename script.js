/**
 * Portfolio site interactions:
 * - theme toggle (persisted)
 * - mobile nav open/close
 * - contact form -> mailto
 * - fill social links
 */

const CONFIG = {
  name: "Akash Kumar",
  location: "Bidar, Karnataka, India",
  email: "akashkumarce19006@gmail.com",
  github: "https://github.com/Akash-123-Hub",
  linkedin: "https://www.linkedin.com/in/akash-kumar-79b328309",
  projects: {
    "job-portal-demo": "#",
    "job-portal-code": "#",
    "ecom-demo": "#",
    "ecom-code": "#",
    "api-docs": "#",
    "api-code": "#",
  },
};

const THEME_KEY = "akash-portfolio-theme";

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

function getPreferredTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function initTheme() {
  setTheme(getPreferredTheme());

  const btn = qs("[data-theme-toggle]");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(current === "light" ? "dark" : "light");
  });
}

function initHeaderElevation() {
  const header = qs("[data-elevate]");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-elevated", window.scrollY > 4);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMobileNav() {
  const toggle = qs("[data-nav-toggle]");
  const panel = qs("[data-nav-panel]");
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    panel.classList.toggle("is-open", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => setOpen(!panel.classList.contains("is-open")));

  // close on link click
  qsa(".nav-link", panel).forEach((a) => a.addEventListener("click", () => setOpen(false)));

  // close on outside click
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest("[data-nav-panel]") || target.closest("[data-nav-toggle]")) return;
    setOpen(false);
  });

  // close on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function mailtoHref({ name, email, message }) {
  const to = CONFIG.email;
  const subject = `Portfolio enquiry — ${name}`;
  const body = `Hi%20${encodeURIComponent(CONFIG.name)},%0D%0A%0D%0A${encodeURIComponent(
    message
  )}%0D%0A%0D%0AFrom:%20${encodeURIComponent(
    name
  )}%0D%0AEmail:%20${encodeURIComponent(email)}%0D%0A`;

  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${body}`;
}

function initContactForm() {
  const form = qs("#contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!name || !email || !message) return;

    // open user's email client
    window.location.href = mailtoHref({ name, email, message });
  });
}

function initLinks() {
  // Quick links and contact card
  const linkMap = {
    github: CONFIG.github,
    linkedin: CONFIG.linkedin,
    email: `mailto:${CONFIG.email}`,
  };

  qsa("[data-link]").forEach((a) => {
    const key = a.getAttribute("data-link");
    const href = key && linkMap[key];
    if (href) a.setAttribute("href", href);
  });

  qsa('[data-value="email"]').forEach((el) => (el.textContent = CONFIG.email));
  qsa('[data-value="github"]').forEach((el) => (el.textContent = CONFIG.github.replace(/^https?:\/\//, "")));
  qsa('[data-value="linkedin"]').forEach((el) => (el.textContent = CONFIG.linkedin.replace(/^https?:\/\//, "")));

  // Project links
  qsa("[data-project]").forEach((a) => {
    const key = a.getAttribute("data-project");
    const href = key && CONFIG.projects[key];
    if (href) a.setAttribute("href", href);
  });

  // Resume link hint if missing
  const resume = qs("[data-resume]");
  if (resume) {
    fetch(resume.getAttribute("href"), { method: "HEAD" })
      .then((r) => {
        if (!r.ok) throw new Error("missing");
      })
      .catch(() => {
        resume.removeAttribute("download");
        resume.setAttribute("href", "#contact");
        resume.textContent = "Resume (add PDF)";
        const hint = qs("#formHint");
        if (hint) hint.textContent = "Tip: add a resume PDF in assets/ and update your links in script.js.";
      });
  }
}

function initFooterYear() {
  const year = qs("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

initTheme();
initHeaderElevation();
initMobileNav();
initContactForm();
initLinks();
initFooterYear();

