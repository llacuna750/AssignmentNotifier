export function initSidebar() {
    const sidebar = document.getElementById("collapsible-bar");
    const hamburger = document.getElementById("hamburger");
    const menuItems = document.querySelectorAll(
        "#home-assTask-calender p, #burger > div"
    );

    if (!sidebar || !hamburger) return;

    hamburger.addEventListener("click", () => {
        const isCollapsed = sidebar.classList.toggle("container-toggle-hide");

        menuItems.forEach((item) => {
            item.classList.toggle("hide-hamburger-menu", isCollapsed);
        });

        hamburger.setAttribute("aria-expanded", String(!isCollapsed));
    });
}