const key = "issidebarCollapsed";
const saved = localStorage.getItem(key);
let isCollapsed =
    saved === null
        ? sidebar.classList.contains("container-toggle-hide")
        : saved === "true";

function applyState() {
    sidebar.classList.toggle("container-toggle-hide", isCollapsed);
    menuItems.forEach(item =>
        item.classList.toggle("hide-hamburger-menu", isCollapsed)
    );
    hamburger.setAttribute("aria-expanded", String(!isCollapsed));
}

applyState();

hamburger.addEventListener("click", () => {
    isCollapsed = !isCollapsed;
    localStorage.setItem(key, String(isCollapsed));
    applyState();
});


for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(key, localStorage.getItem(key));
}

// localStorage.setItem('key1', 'talusi')
// localStorage.setItem('2', 'jabol')
// localStorage.setItem('k3', 'jakoy')


// 1. Get existing items or start with an empty array
// let items = JSON.parse(localStorage.getItem('myList')) || [];

// 2. Add the new item
// items.push('New Value');

// 3. Save it back with the same key
// localStorage.setItem('myList', JSON.stringify(items));


// let books = JSON.parse(localStorage.getItem("books")) || [];

console.log(localStorage)


function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

// books.push('dang')


const athlete1 = { name: "Alice", age: "50" };
const athlete2 = { name: "Dave", age: "51" };
const athlete3 = { name: "Nicky", age: "49" };


// Map Object
const finishers = new Map();

finishers.set(athlete1, 10000);
finishers.set(athlete2, 7000);

// console.log(finishers);

// localStorage.clear()
// saveBooks()