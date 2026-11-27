const routes = {
  "/": "/home.html",
  "/blog/": "/pages/blog.html",
  "/notes/": "/pages/notes.html",
  "/shelves/": "/pages/shelves.html",
  "/projects/": "/pages/projects.html",
  "/series/": "/pages/series.html",
  "/about/": "/about.html",
  "/contact/": "/pages/contact.html",
  "/cv/": "/pages/cv.html",
  "/projects/plus27/": "/pages/projects/plus27.html",
  "/projects/rag-system/": "/pages/projects/rag-system.html",
  "/projects/tlik-marketplace/": "/pages/projects/tlik-marketplace.html",
  "/projects/notes-api/": "/pages/projects/notes-api.html",
  "/projects/thequide/": "/pages/projects/thequide.html",
  "/projects/logisticsconnect/": "/pages/projects/logisticsconnect.html",
  "/series/redpanda-kafka/": "/pages/series/redpanda-kafka.html",
  "/series/backend-services/": "/pages/series/backend-services.html",
  "/series/self-hosting/": "/pages/series/self-hosting.html",
};

const pageTitles = {
  "/": "Karabo Mahlare — Software Developer",
  "/blog/": "Blog — Karabo Mahlare",
  "/notes/": "Notes — Karabo Mahlare",
  "/shelves/": "Topic Shelves — Karabo Mahlare",
  "/projects/": "Projects — Karabo Mahlare",
  "/series/": "Learning Series — Karabo Mahlare",
  "/about/": "About — Karabo Mahlare",
  "/contact/": "Contact — Karabo Mahlare",
  "/cv/": "Curriculum Vitae — Karabo Mahlare",
  "/projects/plus27/": "Plus27 — Project Case Study",
  "/projects/rag-system/": "Intelligent RAG System — Project Case Study",
  "/projects/tlik-marketplace/": "tlik Marketplace — Project Case Study",
  "/projects/notes-api/": "Notes API Platform — Project Case Study",
  "/projects/thequide/": "TheQuide — Project Case Study",
  "/projects/logisticsconnect/": "LogisticsConnect — Project Case Study",
  "/series/redpanda-kafka/": "Redpanda for Application Developers",
  "/series/backend-services/": "Backend Services Across Languages",
  "/series/self-hosting/": "Self-hosted Application Platform",
};

const pageDescriptions = {
  "/": "Karabo Mahlare — software developer, Mathematical Sciences graduate and builder of backend systems, data-driven products and AI-enabled applications.",
  "/blog/":
    "Technical writing and planned articles on software engineering, backend systems, data engineering and applied AI.",
  "/notes/":
    "Short engineering notes from building projects, debugging and learning software development concepts.",
  "/shelves/":
    "Curated technical topic collections covering backend engineering, data platforms, distributed systems, applied AI and infrastructure.",
  "/projects/":
    "Selected software projects and engineering case studies by Karabo Mahlare.",
  "/series/":
    "Structured, practical learning journeys covering Redpanda, backend architecture and self-hosting.",
  "/about/":
    "Learn about Karabo Mahlare's software engineering experience, Mathematical Sciences background, education and technical interests.",
  "/contact/": "Contact Karabo Mahlare by email, LinkedIn or GitHub.",
  "/cv/":
    "View Karabo Mahlare’s software engineering experience, technical skills, projects, education and mentoring experience.",
  "/projects/plus27/":
    "Plus27 case study: an area-first community platform and its application architecture.",
  "/projects/rag-system/":
    "Intelligent RAG System case study: a document-grounded assistant using retrieval-augmented generation.",
  "/projects/tlik-marketplace/":
    "tlik Marketplace case study: a full-stack marketplace application.",
  "/projects/notes-api/":
    "Notes API Platform case study: authenticated notes and public or private sharing.",
  "/projects/thequide/": "TheQuide case study: an author and content platform.",
  "/projects/logisticsconnect/":
    "LogisticsConnect case study: parcel tracking and event-driven status updates.",
  "/series/redpanda-kafka/":
    "A developer-focused learning series on Redpanda and the Kafka API.",
  "/series/backend-services/":
    "A learning series on authentication, authorization and backend services across languages.",
  "/series/self-hosting/":
    "A practical learning series on deploying and operating self-hosted applications.",
};

let navigationSequence = 0;

function normalizePath(pathname) {
  let path = pathname.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
  if (path !== "/" && !path.endsWith("/")) path += "/";
  return path;
}

function loadComponent(id, path) {
  return fetch(path)
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.text();
    })
    .then((html) => {
      const element = document.getElementById(id);
      if (element) element.innerHTML = html;
    })
    .catch((error) => console.error("Component load failed:", path, error));
}

function applyTheme(theme) {
  const selectedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = selectedTheme;
  document.documentElement.classList.toggle(
    "is-dark",
    selectedTheme === "dark",
  );
  document.documentElement.classList.toggle(
    "is-light",
    selectedTheme === "light",
  );
  const button = document.querySelector(".theme-toggle");
  if (button) {
    button.setAttribute(
      "aria-label",
      selectedTheme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme",
    );
    button.setAttribute("aria-pressed", String(selectedTheme === "dark"));
  }
}

const COLOR_THEMES = ["yellow", "blue", "lavender", "pink", "green"];

function applyColor(color) {
  const selectedColor = COLOR_THEMES.includes(color) ? color : "yellow";
  document.documentElement.dataset.color = selectedColor;
  const current = document.getElementById("color-current");
  if (current)
    current.style.backgroundColor = "var(--theme-" + selectedColor + ")";
  document
    .querySelectorAll(".color-swatch, .dropdown-option")
    .forEach((button) => {
      const active = button.dataset.color === selectedColor;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
}

function updatePageChrome(path) {
  document.title = pageTitles[path] || "Page not found — Karabo Mahlare";

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute(
      "content",
      pageDescriptions[path] ||
        "The requested page could not be found in Karabo Mahlare's portfolio.",
    );
  }

  document.querySelectorAll("#navbar a[href^='/']").forEach((link) => {
    const linkPath = normalizePath(
      new URL(link.href, window.location.origin).pathname,
    );
    const isHome = linkPath === "/";
    const active = isHome
      ? path === "/"
      : path === linkPath || path.startsWith(linkPath);
    if (active) {
      link.setAttribute("aria-current", "page");
      link.classList.add("active");
    } else {
      link.removeAttribute("aria-current");
      link.classList.remove("active");
    }
  });
}

function initSidebar() {
  const themeButton = document.querySelector(".theme-toggle");
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const nextTheme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      try {
        localStorage.setItem("portfolio-theme", nextTheme);
      } catch (error) {
        // The theme still works for this page when storage is unavailable.
      }
    });
  }

  document
    .querySelectorAll(".color-swatch, .dropdown-option")
    .forEach((button) => {
      button.addEventListener("click", () => {
        applyColor(button.dataset.color);
        closeColorMenu();
        try {
          localStorage.setItem("portfolio-color", button.dataset.color);
        } catch (error) {
          // The selected accent remains active until the page is reloaded.
        }
      });
    });

  // Color dropdown
  const colorButton = document.getElementById("color-button");
  const colorResults = document.getElementById("color-results");
  function closeColorMenu() {
    if (!colorButton || !colorResults) return;
    colorResults.hidden = true;
    colorButton.setAttribute("aria-expanded", "false");
  }
  if (colorButton && colorResults) {
    colorButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = colorResults.hidden;
      colorResults.hidden = !open;
      colorButton.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (event) => {
      if (!colorResults.hidden && !event.target.closest("#color-picker"))
        closeColorMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeColorMenu();
    });
  }

  const year = document.getElementById("copyright-year");
  if (year) year.textContent = new Date().getFullYear();
}

function initReveal() {
  const nodes = document.querySelectorAll(
    ".garden-section, .project-entry, .entry, .about-page h2, .case-section",
  );
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  nodes.forEach((node) => node.classList.add("reveal"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06 },
  );

  nodes.forEach((node) => observer.observe(node));
}

async function handleLocation({ focusMain = false } = {}) {
  const requestId = ++navigationSequence;
  const path = normalizePath(window.location.pathname);
  const target = routes[path] || "/pages/404.html";
  const main = document.getElementById("main__content");
  if (!main) return;

  main.setAttribute("aria-busy", "true");

  try {
    const response = await fetch(target);
    if (!response.ok) throw new Error(response.status);
    const html = await response.text();
    if (requestId !== navigationSequence) return;
    main.innerHTML = html;
  } catch (error) {
    if (requestId !== navigationSequence) return;
    main.innerHTML =
      '<article class="page-wrap"><p class="eyebrow">PAGE UNAVAILABLE</p><h1>We could not load this page.</h1><p class="lead">Please check your connection and try again.</p><a href="/">Return home →</a></article>';
    console.error("Page load failed:", target, error);
  } finally {
    if (requestId === navigationSequence) main.removeAttribute("aria-busy");
  }

  if (requestId !== navigationSequence) return;
  updatePageChrome(path);
  initReveal();

  if (focusMain) {
    main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });
  }

  if (window.location.hash) {
    let id = window.location.hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch (error) {
      // Keep the original fragment if it is not valid encoded text.
    }
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 60);
  } else if (focusMain) {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

function handleInternalNavigation(event) {
  const link = event.target.closest("a[href]");
  if (!link || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (link.hasAttribute("download") || (link.target && link.target !== "_self"))
    return;

  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin) return;

  const path = normalizePath(destination.pathname);
  if (!Object.prototype.hasOwnProperty.call(routes, path)) return;

  if (
    path === normalizePath(window.location.pathname) &&
    destination.hash === window.location.hash
  )
    return;

  event.preventDefault();
  history.pushState(
    {},
    "",
    destination.pathname + destination.search + destination.hash,
  );
  handleLocation({ focusMain: true });
}

window.addEventListener("DOMContentLoaded", async () => {
  let theme =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  let color = "yellow";

  try {
    theme = localStorage.getItem("portfolio-theme") || theme;
    color = localStorage.getItem("portfolio-color") || color;
  } catch (error) {
    // Defaults are used when browser storage is unavailable.
  }
  if (!COLOR_THEMES.includes(color)) color = "yellow";

  applyTheme(theme);
  applyColor(color);

  await Promise.all([
    loadComponent("navbar", "/navbar.html"),
    loadComponent("footer", "/footer.html"),
  ]);

  initSidebar();
  applyTheme(theme);
  applyColor(color);
  document.addEventListener("click", handleInternalNavigation);
  await handleLocation();
});

window.addEventListener("popstate", () => handleLocation({ focusMain: true }));
