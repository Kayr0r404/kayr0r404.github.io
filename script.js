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

function useNavBar() {
    fetch('./navbar.html')
        .then(response => 
            {
                console.log(response.text)
                return response.text()})
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.error(`Error loading ${'./navbar.html'}:`, error));
}