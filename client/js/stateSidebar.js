
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
    const navigation = document.getElementById('home-assTask-calender');
    const isMobileNav = window.matchMedia('(max-width: 64rem)').matches;
    const isMobileNavOpen = Boolean(navigation?.matches(':popover-open'));
    const toggleLabel = isMobileNav
        ? (isMobileNavOpen ? 'Close navigation' : 'Open navigation')
        : (isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');

    sidebarLayout.classList.add('container');
    sidebarLayout.classList.toggle('container-toggle-hide', isCollapsed);

    const toggleButton = document.getElementById('hamburger');
    toggleButton?.setAttribute(
        'aria-expanded',
        String(isMobileNav ? isMobileNavOpen : !isCollapsed)
    );
    toggleButton?.setAttribute('aria-label', toggleLabel);

    menuItems.forEach((item) => {
        item.classList.toggle('hide-hamburger-menu', isCollapsed && !isMobileNav);
    });
}


export { saveSidebarStatus, sidebarStateValidator, toggleSideBarState, sidebarView };
