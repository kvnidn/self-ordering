let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');

let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span')

let cartCount = 0;

let listProducts = [];

let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

const checkout = () => {
    if (cartCount === 0) {
        alert("Nothing to purchase");
    } else {
        removeItem();
    }
}

const removeItem = () => {
    alert("Processing......");
    alert("Done");
    cartCount = 0;
    document.getElementById('cartCount').textContent = cartCount;
};

// function showAlert(message) {
//     cartCount++;

//     document.getElementById('cartCount').textContent = cartCount;

//     alert(message + 'added to cart!');
// }

// const menuPromotion = [
//     {
//         name: "Paket Kenyang",
//         price: "150000",
//         image: "../assets/menu/1-1.png"
//     },
//     {
//         name: "Paket Ngemil",
//         price: "110000",
//         image: "../assets/menu/1-2.png"
//     },
//     {
//         name: "Paket Manis",
//         price: "70000",
//         image: "../assets/menu/1-3.png"
//     }
// ]

// const menuPromotionList = document.getElementById("menu-promotion");

// menuPromotion.forEach(item => {
//     const list = document.createElement("li");
//     list.innerHTML =
//     `
//     <div class="card">
//         <div class="card-content">
//             <img src="${item.image}" alt="${item.name}">
//             <h3>${item.name}</h3>
//             <div class="price">Rp ${item.price.toLocaleString()}</div>
//             <button class="addCart" onclick="showAlert('${item.name} - Rp ${item.price.toLocaleString()}')">
//                 Add To Cart
//             </button>
//         </div>
//     </div>
//     `;
//     menuPromotionList.appendChild(list);
// })


// PROMOTION

const menuPromotion = document.getElementById("menu-promotion");

fetch('data_menu.json')
    .then(response => response.json())
    .then(menuPromotionData => {
        const typePromotion = menuPromotionData.filter(item => item.type === "Promotion");

        typePromotion.forEach(item => {
            const listItem = document.createElement("li");
            
            listItem.dataset.name = item.name;

            listItem.innerHTML =
            `
            <div class="card">
                <div class="card-content">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <div class="price">Rp ${item.price.toLocaleString()}</div>
                    <button class="addCart">
                        Add to Cart
                    </button>
                </div>
            </div>
            `
            menuPromotion.appendChild(listItem);

            
            listItem.addEventListener('click', (event) => {
                let positionClick = event.target;
                if(positionClick.classList.contains('addCart')){
                    let item_name = positionClick.closest('li').dataset.name;
                    showAlert(item_name);
                }
            })


        });
    })
    .catch(error => console.error('Error fetching menu data:', error));

// ALACARTE

const menuAlaCarte = document.getElementById("menu-alacarte");

fetch('data_menu.json')
    .then(response => response.json())
    .then(menuAlaCarteData => {
        const typeAlaCarte = menuAlaCarteData.filter(item => item.type === "alacarte");

        typeAlaCarte.forEach((item, index) => {

            if (index % 5 == 0){
                const newLine = document.createElement("div");
                newLine.classList.add("box-1-2-1");
                menuAlaCarte.appendChild(newLine);
            }

            const listItem = document.createElement("li");
            listItem.dataset.name = item.name;

            listItem.innerHTML =
            `
            <div class="card">
                <div class="card-content">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <div class="price">Rp ${item.price.toLocaleString()}</div>
                    <button class="addCart">
                        Add to Cart
                    </button>
                </div>
            </div>
            `;
            const current = menuAlaCarte.lastChild;
            current.appendChild(listItem);
            
            listItem.addEventListener('click', (event) => {
                let positionClick = event.target;
                if(positionClick.classList.contains('addCart')){
                    let item_name = positionClick.closest('li').dataset.name;
                    showAlert(item_name);
                }
            })


        });
    })
    .catch(error => console.error('Error fetching menu data:', error));

// SIDES

const menuSides = document.getElementById("menu-sides");

fetch('data_menu.json')
    .then(response => response.json())
    .then(menuSidesData => {
        const typeSides = menuSidesData.filter(item => item.type === "sides");

        typeSides.forEach((item, index) => {

            if (index % 4 == 0){
                const newLine = document.createElement("div");
                newLine.classList.add("box-1-1-1");
                menuSides.appendChild(newLine);
            }

            const listItem = document.createElement("li");
            listItem.dataset.name = item.name;

            listItem.innerHTML =
            `
            <div class="card">
                <div class="card-content">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <div class="price">Rp ${item.price.toLocaleString()}</div>
                    <button class="addCart">
                        Add to Cart
                    </button>
                </div>
            </div>
            `;
            const current = menuSides.lastChild;
            current.appendChild(listItem);
            
            listItem.addEventListener('click', (event) => {
                let positionClick = event.target;
                if(positionClick.classList.contains('addCart')){
                    let item_name = positionClick.closest('li').dataset.name;
                    showAlert(item_name);
                }
            })


        });
    })
    .catch(error => console.error('Error fetching menu data:', error));

    
//DESSERTS
const menuDesserts = document.getElementById("menu-desserts");

fetch('data_menu.json')
    .then(response => response.json())
    .then(menuDessertsData => {
        const typeSides = menuDessertsData.filter(item => item.type === "desserts");

        typeSides.forEach((item, index) => {

            if (index % 2 == 0){
                const newLine = document.createElement("div");
                newLine.classList.add("box-1-2-1");
                menuDesserts.appendChild(newLine);
            }

            const listItem = document.createElement("li");
            listItem.dataset.name = item.name;

            listItem.innerHTML =
            `
            <div class="card">
                <div class="card-content">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <div class="price">Rp ${item.price.toLocaleString()}</div>
                    <button class="addCart">
                        Add to Cart
                    </button>
                </div>
            </div>
            `;
            const current = menuDesserts.lastChild;
            current.appendChild(listItem);
            
            listItem.addEventListener('click', (event) => {
                let positionClick = event.target;
                if(positionClick.classList.contains('addCart')){
                    let item_name = positionClick.closest('li').dataset.name;
                    showAlert(item_name);
                }
            })


        });
    })
    .catch(error => console.error('Error fetching menu data:', error));

// BEVERAGES

const menuBeverages = document.getElementById("menu-beverages");

fetch('data_menu.json')
    .then(response => response.json())
    .then(menuBeveragesData => {
        const typeBeverages = menuBeveragesData.filter(item => item.type === "beverages");

        typeBeverages.forEach((item, index) => {
            if (index % 4 == 0){
                const newLine = document.createElement("div");
                newLine.classList.add("box-1-1-1");
                menuBeverages.appendChild(newLine);
            }

            const listItem = document.createElement("li");
            listItem.dataset.name = item.name;

            listItem.innerHTML =
            `
            <div class="card">
                <div class="card-content">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}<h3>
                    <div class="price">Rp ${item.price.toLocaleString()}<div>
                    <button class="addCart">
                        Add to Cart
                    </button>
                </div>
            </div>
            `
            const current = menuBeverages.lastChild;
            current.appendChild(listItem);

            
            listItem.addEventListener('click', (event) => {
                let positionClick = event.target;
                if(positionClick.classList.contains('addCart')){
                    let item_name = positionClick.closest('li').dataset.name;
                    showAlert(item_name);
                }
            })


        });
    })
    .catch(error => console.error('Error fetching menu data:', error));



//McCafé Pastries

const menuCafe = document.getElementById("menu-cafe");

fetch('data_menu.json')
    .then(response => response.json())
    .then(menuCafeData => {
        const typeCafe = menuCafeData.filter(item => item.type === "cafe");

        typeCafe.forEach((item, index) => {

            if (index % 2 == 0){
                const newLine = document.createElement("div");
                newLine.classList.add("box-1-2-1");
                menuCafe.appendChild(newLine);
            }

            const listItem = document.createElement("li");
            listItem.dataset.name = item.name;

            listItem.innerHTML =
            `
            <div class="card">
                <div class="card-content">
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <div class="price">Rp ${item.price.toLocaleString()}</div>
                    <button class="addCart">
                        Add to Cart
                    </button>
                </div>
            </div>
            `;
            const current = menuCafe.lastChild;
            current.appendChild(listItem);

            listItem.addEventListener('click', (event) => {
                let positionClick = event.target;
                if(positionClick.classList.contains('addCart')){
                    let item_name = positionClick.closest('li').dataset.name;
                    showAlert(item_name);
                }
            })

        });
    })
    .catch(error => console.error('Error fetching menu data:', error));


const showAlert = (item_name) => {
    alert(item_name + " - added to cart");
    cartCount++;

    document.getElementById('cartCount').textContent = cartCount;
}






