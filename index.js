console.log("Happy Coding!");

const toggleHmbgr = document.getElementById('collapsible-bar')
const paragraphs = document.querySelectorAll("#home-assTask-calender p");
const hamburgerlogoTitle = document.querySelectorAll('#burger div')


let isCollapsed = false;

function hamburgerToggle() {
    isCollapsed = !isCollapsed;

    toggleHmbgr.classList.toggle('container-toggle-hide', isCollapsed);
    paragraphs.forEach(p =>
        p.classList.toggle('hide-hamburger-menu', isCollapsed)
    );
    hamburgerlogoTitle.forEach(div =>
        div.classList.toggle('hide-hamburger-menu', isCollapsed)
    );
}

document
    .getElementById("hamburger")
    .addEventListener("click", hamburgerToggle);
