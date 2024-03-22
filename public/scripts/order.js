let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');

let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span')

let cartCount = 0;

let listProducts = [];

let cartItems = [];

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
    cartItems = []
    document.getElementById('cartCount').textContent = cartCount;
    document.getElementById('cartTotal').textContent = 0;
    listCartHTML.innerHTML = '';
};


// PROMOTION

const menuTypes = ['Promotion', 'Alacarte', 'Sides', 'Beverages', 'Desserts', 'Cafe'];

menuTypes.forEach(type => {
    const menuElement = document.getElementById(`menu-${type.toLowerCase()}`);

    fetch('/api/menuRoute') // Assuming this endpoint returns menu data
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(menuData => {
            console.log("Menu data fetched successfully:", menuData);
            const typeData = menuData.filter(item => item.type.toLowerCase() === type.toLowerCase());

            console.log("Type Data for", type, ":", typeData);

            typeData.forEach((item, index) => {
                if (index % (type === "Promotion" ? 1 : type === "Alacarte" ? 5 : type === "Sides" || type === "Beverages" ? 4 : 2) === 0) {
                    const newLine = document.createElement("div");
                    newLine.classList.add(type === "Promotion" || type === "Sides" || type === "Beverages" ? "box-1-1-1" : "box-1-2-1");
                    menuElement.appendChild(newLine);
                }

                const listItem = document.createElement("li");
                listItem.dataset.name = item.name;

                listItem.innerHTML =
                    `
                <div class="card">
                    <div class="card-content">
                        <img src="${item.image}" alt="${item.name}" id="order">
                        <h3>${item.name}</h3>
                        <div class="price">Rp ${item.price.toLocaleString()}</div>
                        <button class="addCart">
                            Add to Cart
                        </button>
                    </div>
                </div>
                `;
                const current = menuElement.lastChild;
                current.appendChild(listItem);

                listItem.addEventListener('click', (event) => {
                    let positionClick = event.target;
                    if (positionClick.classList.contains('addCart')) {
                        let selectedItemName = positionClick.closest('li').dataset.name;
                        let selectedItem = typeData.find(item => item.name === selectedItemName);

                        if (selectedItem) {
                            let item = {
                                name: selectedItem.name,
                                image: selectedItem.image,
                                price: selectedItem.price
                            };
                            showAlert(item);
                        }
                    }
                });

            });
        })
        .catch(error => console.error('Error fetching menu data:', error));
});


    

const showAlert = (item) => {
    alert(item.name + " - added to cart");
    
    // Check if the item is already in the cart
    const existingItem = cartItems.find(cartItem => cartItem.name === item.name);

    if (existingItem) {
        // If the item is already in the cart, update the quantity
        existingItem.quantity++;
    } else {
        // If the item is not in the cart, add it with quantity 1
        item.quantity = 1;
        cartItems.push(item);
    }

    // Update the shopping cart display
    updateCartDisplay();

    // Update the total cartCount based on the total quantity of items in the cart
    cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
};

const updateCartDisplay = () => {
    listCartHTML.innerHTML = ''; // Clear the existing cart items

    // Calculate and display the total price
    const totalPriceElement = document.getElementById('cartTotal');
    const cartCountElement = document.getElementById('cartCount');

    if (cartItems.length === 0) {
        totalPriceElement.textContent = '0';
        cartCountElement.textContent = '0';
    } else {
        const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

        totalPriceElement.textContent = totalPrice.toLocaleString();
        cartCountElement.textContent = totalQuantity.toString(); // Dynamically calculate cartCount
    }

    // Loop through the cartItems array and create HTML for each item
    cartItems.forEach(item => {
        const cartItemHTML = document.createElement('div');
        cartItemHTML.classList.add('item');

        cartItemHTML.innerHTML = `
            <div class="image">
                <img src="${item.image}">
            </div>
            <div class="name">
                ${item.name}
            </div>
            <div class="totalPrice">
                Rp ${item.price.toLocaleString()}
            </div>
            <div class="quantity">
                <span class="minus">-</span>
                <span>${item.quantity}</span>
                <span class="plus">+</span>
            </div>
        `;

        // Add event listeners for +/- buttons
        const plusButton = cartItemHTML.querySelector('.plus');
        const minusButton = cartItemHTML.querySelector('.minus');

        plusButton.addEventListener('click', () => {
            item.quantity++;
            cartCount++;
            updateCartDisplay();
        });

        minusButton.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                cartCount--;
            } else {
                // Set quantity to 0 to avoid negative values
                item.quantity = 0;
                cartCount--;
            }

            // Use filter to exclude items with quantity 0 or less
            cartItems = cartItems.filter(cartItem => cartItem.quantity > 0);
            // Update the shopping cart display
            updateCartDisplay()
        });

        listCartHTML.appendChild(cartItemHTML);
    });
};


const updateQuantity = (itemName, change) => {
    const itemToUpdate = cartItems.find(item => item.name === itemName);

    if (itemToUpdate) {
        // Update the quantity based on the change value (+1 or -1)
        itemToUpdate.quantity += change;

        // Ensure the quantity does not go below 1
        if (itemToUpdate.quantity < 1) {
            // If quantity is 0 or less, remove the item from the cart
            cartItems = cartItems.filter(item => item.name !== itemName);
        }

        // Update the shopping cart display
        updateCartDisplay();

        // Update the total cartCount based on the total quantity of items in the cart
        cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cartCount').textContent = cartCount;
    }
};
