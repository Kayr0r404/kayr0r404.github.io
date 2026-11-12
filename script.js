function loadComponent(elementId, filePath) {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error(`Error loading ${filePath}:`, error));
}

window.addEventListener("load", () => {
    loadComponent("footer", "./footer.html");
    loadComponent("navbar", "./navbar.html").then(() => {
        initHamburger();
    });
})

function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    document.addEventListener('click', (e) => {
        if (e.target.closest('.nav-links a')) {
            if (navLinks) navLinks.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    });
}


const showMore = (elementId, pointsContainerId) => {
    let points = document.getElementById(pointsContainerId);
    let moreText = document.getElementById(elementId);
    let showMoreButton = document.getElementById("show__more"); 

    if (points.style.display === "none") {
        moreText.style.display = "none";
        points.style.display = "inline";
        showMoreButton.style.display = "inline";
    } else {
        moreText.style.display = "block";
        points.style.display = "none";
        showMoreButton.style.display = "none";
    }
};


const route = (event) => {
    event = event || window.event;
    event.preventDefault();

    // Ensure we're getting the href from the <a> element
    const href = event.currentTarget.getAttribute("href");
    
    window.history.pushState({}, "", href);
    handleLocation();
};

const routes = {
    404: "./404.html",
    "/": "./home.html",
    "/about": "./about.html",
    "/contact": "./contact.html"
};

const handleLocation = async () => {
    const path = window.location.pathname;
    console.log("path", path)
    const routePath = routes[path] || routes[404];
    
    try {
        const response = await fetch(routePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById("main__content").innerHTML = html;
    } catch (error) {
        console.error('Error loading page:', error);
        // Optionally load the 404 page here
        if (routePath !== routes[404]) {
            const response = await fetch(routes[404]);
            document.getElementById("main__content").innerHTML = await response.text();
        }
    }
};

const showMoreProjects = () => {
    const more = document.getElementById("more-projects");
    const btn = document.getElementById("projects-next-btn");
    if (more) {
        more.style.display = "block";
    }
    if (btn) {
        btn.style.display = "none";
    }
};

document.addEventListener("submit", async (e) => {
    const form = e.target;
    if (!form || form.id !== "contactForm") return;
    e.preventDefault();

    const status = document.getElementById("form-status");
    const button = document.getElementById("contactSubmit");
    const originalText = button ? button.textContent : "";

    if (button) {
        button.disabled = true;
        button.textContent = "Sending...";
    }
    if (status) {
        status.textContent = "Sending your message...";
    }

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: {
                Accept: "application/json"
            }
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === "false" || result.success === false) {
            throw new Error("Submission failed");
        }

        form.reset();
        if (status) {
            status.textContent = "Thanks! Your message has been sent. I'll get back to you soon.";
        }
    } catch (error) {
        if (status) {
            status.innerHTML = 'Something went wrong. Please email me directly at <a href="mailto:mahlarekarabo.702@gmail.com">mahlarekarabo.702@gmail.com</a>.';
        }
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = originalText || "Send Message";
        }
    }
});

window.onpopstate = handleLocation;
window.route = route;
handleLocation();

