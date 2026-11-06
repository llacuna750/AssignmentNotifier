
function sidebarStateValidator(l_Action) {
    let status = l_Action === 'Close Sidebar';
    saveSidebarStatus(status)
}

function saveSidebarStatus(state) {
    const key = "lastAction"
    localStorage.setItem(key, state)
};


function toggleSideBarState() {
    localStorage.setItem('lastAction', !JSON.parse(localStorage.getItem('lastAction')))
}


function sidebarView() {
    const sidebarLayout = document.getElementById('sidebar')
    const menuItems = document.querySelectorAll(
        "#home-assTask-calender p, #burger > div"
    )
    if (!sidebarLayout) return;

    const isCollapsed = localStorage.getItem('lastAction') === 'true';

    sidebarLayout.classList.add('container');
    sidebarLayout.classList.toggle('container-toggle-hide', isCollapsed);

    menuItems.forEach((item) => {
        item.classList.toggle('hide-hamburger-menu', isCollapsed);
    });
}


export { saveSidebarStatus, sidebarStateValidator, toggleSideBarState, sidebarView };
