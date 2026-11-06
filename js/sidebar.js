import { sidebarStateValidator, toggleSideBarState, sidebarView } from './stateSidebar.js';

export function sidebarStateChanger () {
    const hamburger = document.getElementById('hamburger');
    if (!hamburger) return;

    // Use the default only when there is no saved state yet.
    if (localStorage.getItem('lastAction') === null) {
        sidebarStateValidator('Close Sidebar');
    }
    
    hamburger.addEventListener('click', function () {
        toggleSideBarState();
        sidebarView();
    });
    
    sidebarView()
}

sidebarStateChanger()

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

