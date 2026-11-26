function loadComponent(elementId, filePath) {
    return fetch(filePath).then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
    }).then(data => { document.getElementById(elementId).innerHTML = data; })
      .catch(error => console.error(`Error loading ${filePath}:`, error));
}
function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const button = document.querySelector('.theme-toggle');
    if (button) {
        button.textContent = theme === 'dark' ? '☼' : '◐';
        button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        button.title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    }
}
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) hamburger.addEventListener('click', () => {
        const opened = navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(opened));
    });
    document.addEventListener('click', event => {
        if (event.target.closest('.nav-links a') && navLinks && hamburger) {
            navLinks.classList.remove('active'); hamburger.setAttribute('aria-expanded','false');
        }
    });
    const themeButton = document.querySelector('.theme-toggle');
    if (themeButton) themeButton.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next); try { localStorage.setItem('portfolio-theme', next); } catch (_) {}
    });
    const year = document.getElementById('copyright-year');
    if (year) year.textContent = new Date().getFullYear();
}
function initReveal() {
    const targets = document.querySelectorAll('.content-section, .project__container, .contact-callout, .timeline-item');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    targets.forEach(target => target.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    targets.forEach(target => observer.observe(target));
}
const route = event => {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    if (href.startsWith('/#')) {
        history.pushState({}, '', href);
        if (location.pathname !== '/') handleLocation().then(() => document.querySelector(href.slice(1))?.scrollIntoView());
        else document.querySelector(href.slice(2))?.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    history.pushState({}, '', href);
    handleLocation();
};
const routes = { 404: './404.html', '/': './home.html', '/about': './about.html', '/contact': './contact.html' };
const handleLocation = async () => {
    const path = location.pathname;
    const response = await fetch(routes[path] || routes[404]);
    const html = await response.text();
    document.getElementById('main__content').innerHTML = html;
    if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 40);
    initReveal();
};
const showMore = (elementId, pointsContainerId) => {
    const moreText = document.getElementById(elementId);
    const points = document.getElementById(pointsContainerId);
    if (!moreText || !points) return;
    const opening = moreText.style.display === 'none' || getComputedStyle(moreText).display === 'none';
    moreText.style.display = opening ? 'block' : 'none';
    points.textContent = opening ? 'Show less ↑' : 'Read more →';
};
const showMoreProjects = () => {
    const more = document.getElementById('more-projects');
    const button = document.getElementById('projects-next-btn');
    if (more) more.style.display = 'block';
    if (button) button.style.display = 'none';
};
window.addEventListener('DOMContentLoaded', async () => {
    let saved = 'light'; try { saved = localStorage.getItem('portfolio-theme') || 'light'; } catch (_) {}
    applyTheme(saved);
    await Promise.all([loadComponent('footer', './footer.html'), loadComponent('navbar', './navbar.html')]);
    initNavigation();
});
window.onpopstate = handleLocation;
window.route = route;
window.showMore = showMore;
window.showMoreProjects = showMoreProjects;
handleLocation();