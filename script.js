function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => 
            {
                // console.log(response.text)
                return response.text()})
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error(`Error loading ${filePath}:`, error));
}

loadComponent("footer", "./footer.html");
loadComponent("navbar", "./navbar.html");

const showMore = (elementId, pointsContainerId) => {

    let points = document.getElementById(pointsContainerId);
    let moreText = document.getElementById(elementId);
    let showMoreButton = document.getElementById("show__more")

    if (points.style.display === "none") {
        moreText.style.display = "none";
        points.style.display = "inline";
        showMoreButton.style.display = "inline";
    }
    else {
        moreText.style.display = "inline";
        points.style.display = "none";
        showMoreButton.style.display = "none";
    }
}