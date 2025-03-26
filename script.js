function loadComponent(elementId, filePath) {
    fetch(filePath)
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
    loadComponent("navbar", "./navbar.html");
})


const showMore = (elementId, pointsContainerId) => {
    let points = document.getElementById(pointsContainerId);
    let moreText = document.getElementById(elementId);
    let showMoreButton = document.getElementById("show__more");

    if (points.style.display === "none") {
        moreText.style.display = "none";
        points.style.display = "inline";
        showMoreButton.style.display = "inline";
    } else {
        moreText.style.display = "inline";
        points.style.display = "none";
        showMoreButton.style.display = "none";
    }
};


const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
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

window.onpopstate = handleLocation;
window.route = route;
handleLocation();