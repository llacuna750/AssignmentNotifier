import { sidebarStateValidator, toggleSideBarState, sidebarView } from './stateSidebar.js';

export function sidebarStateChanger () {
    const hamburger = document.getElementById('hamburger');
    const navigation = document.getElementById('home-assTask-calender');
    if (!hamburger || !navigation) return;

    const mobileNav = window.matchMedia('(max-width: 64rem)');

    // Use the default only when there is no saved state yet.
    if (localStorage.getItem('lastAction') === null) {
        sidebarStateValidator('Close Sidebar');
    }
    
    function syncNavigationMode() {
        if (mobileNav.matches) {
            navigation.setAttribute('popover', 'auto');
            hamburger.setAttribute('popovertarget', navigation.id);
        } else {
            if (navigation.matches(':popover-open')) navigation.hidePopover();
            navigation.removeAttribute('popover');
            hamburger.removeAttribute('popovertarget');
        }

        sidebarView();
    }

    hamburger.addEventListener('click', function () {
        // On mobile the button's native popover behavior opens the nav.
        if (mobileNav.matches) return;

        toggleSideBarState();
        sidebarView();
    });

    navigation.addEventListener('toggle', sidebarView);
    mobileNav.addEventListener('change', syncNavigationMode);
    syncNavigationMode();
}

sidebarStateChanger()

function pageNavigation() {
    const links = [...document.querySelectorAll('[data-view-link]')];
    const views = [...document.querySelectorAll('[data-view]')];

    if (!links.length || !views.length) return;

    function activateView(viewName, moveFocus = false) {
        const activeView = views.find((view) => view.dataset.view === viewName);
        if (!activeView) return false;

        views.forEach((view) => {
            view.hidden = view !== activeView;
        });

        links.forEach((link) => {
            const isActive = link.dataset.viewLink === viewName;
            const navItem = link.querySelector('div');

            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }

            // Reuse the existing active-nav style and color from the dashboard.
            navItem?.classList.toggle('dashboardIcon', isActive);
        });

        const activeLink = links.find((link) => link.dataset.viewLink === viewName);
        document.title = `${activeLink?.getAttribute('aria-label') || 'Dashboard'} | Assignment Notifier App`;

        if (moveFocus) activeView.focus({ preventScroll: true });
        return true;
    }

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) return;

            event.preventDefault();

            const navigation = link.closest('nav');
            if (navigation?.matches(':popover-open')) navigation.hidePopover();

            const viewName = link.dataset.viewLink;
            if (window.location.hash !== `#${viewName}`) {
                window.history.pushState(null, '', `#${viewName}`);
            }

            activateView(viewName, true);
        });
    });

    function activateFromLocation() {
        const viewName = window.location.hash.slice(1);
        if (!activateView(viewName, true)) activateView('dashboard');
    }

    window.addEventListener('popstate', activateFromLocation);
    window.addEventListener('hashchange', activateFromLocation);

    const initialView = window.location.hash.slice(1);
    if (!activateView(initialView)) activateView('dashboard');
}

pageNavigation();

/*
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(key, localStorage.getItem(key));
}                                                                                                                                                                                                                                                                                                           

localStorage.setItem('key1', 'talusi')
localStorage.setItem('2', 'jabol')
localStorage.setItem('k3', 'jakoy')


1. Get existing items or start with an empty array
let items = JSON.parse(localStorage.getItem('myList')) || [];

2. Add the new item
items.push('New Value');

3. Save it back with the same key
localStorage.setItem('myList', JSON.stringify(items));


let books = JSON.parse(localStorage.getItem("books")) || [];



function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

books.push('dang')

const athlete1 = { name: "Alice", age: "50" };
const athlete2 = { name: "Dave", age: "51" };
const athlete3 = { name: "Nicky", age: "49" };

// Map Object
const finishers = new Map();

finishers.set(athlete1, 10000);
finishers.set(athlete2, 7000);

console.log(finishers);
saveBooks()
*/

