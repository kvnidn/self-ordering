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

// const checkout = () => {
//     if (cartCount === 0) {
//         alert("Nothing to purchase");
//     } else {
//         console.log(cartItems);
//         removeItem();
//     }
// }

const checkout = () => {
    try {
        const username = document.getElementById('username').textContent;
        if (cartCount === 0) {
            Swal.fire({
                icon: "warning",
                html: "Nothing to purchase",
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false,
                scrollbarPadding: false,
                willClose: () => {
                    clearInterval(timerInterval);
                }
            });
        } else {
            // Send a POST request to the server to create a new cart
            console.log(JSON.stringify({username: username, cartOrder: cartItems}));
            fetch('/api/cartRoute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: username, cartOrder: cartItems })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create cart');
                }
                // Clear cartItems array and update cart display on successful creation
                removeItem();
                Swal.fire({
                    title: "Success!",
                    icon: "success",
                    html: "Cart created successfully",
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    scrollbarPadding: false,
                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                });
            })
            .catch(error => {
                console.error('Error creating cart:', error);
                Swal.fire({
                    title: "Error!",
                    icon: "error",
                    html: "Failed to create cart. Please try again later.",
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    scrollbarPadding: false,
                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                });
            });
        }} catch {
            Swal.fire({
                title: "Error!",
                icon: "error",
                html: "Please Sign In First!",
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false,
                scrollbarPadding: false,
                willClose: () => {
                    clearInterval(timerInterval);
                }
            });
        }
    };


const removeItem = () => {
    // alert("Processing......");
    // alert("Done");
    cartCount = 0;
    cartItems = []
    document.getElementById('cartCount').textContent = cartCount;
    document.getElementById('cartCountTotal').textContent = cartCount + ' item(s)';
    document.getElementById('cartTotal').textContent = 0;
    listCartHTML.innerHTML = '';
};


// PROMOTION

const menuTypes = ['Promotion', 'Ala Carte', 'Sides', 'Beverages', 'Desserts', 'Cafe'];

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
            // console.log("Menu data fetched successfully:", menuData);
            const typeData = menuData.filter(item => item.type.toLowerCase() === type.toLowerCase());

            // console.log("Type Data for", type, ":", typeData);
            typeData.forEach((item, index) => {
                if (index % 3 === 0) {
                    const newLine = document.createElement("ul");
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
                                price: selectedItem.price,
                                type: selectedItem.type
                            };
                            showAlert(item);
                        }
                    }
                });
                
            });
        })
        .catch(error => console.error('Error fetching menu data:', error));
    });
    

const searchInput = document.querySelector('.searchBar input');
const noMatchScreen = document.getElementById("no-match");
    
// Function to filter menu items based on partial matches of search text
function filterMenuItems(searchText) {
    searchText = searchText.toLowerCase().trim();
    let atleastOneMatch = false;

    // Iterate over each menu type
    menuTypes.forEach(type => {
        const lowerCaseType = type.toLowerCase();
        const menuElement = document.getElementById(`menu-${lowerCaseType}`);
        const items = menuElement.querySelectorAll('li');
        let categoryContainer;

        // Determine the correct category container based on menu type
        switch (lowerCaseType) {
            case 'promotion':
                categoryContainer = document.querySelector('.box-1-1'); // Promotion container
                break;
            case 'ala carte':
                categoryContainer = document.querySelector('.box-1-2'); // Ala Carte container
                break;
            case 'sides':
                categoryContainer = document.querySelectorAll('.box-1-1')[1]; // Sides container (second box-1-1)
                break;
            case 'desserts':
                categoryContainer = document.querySelectorAll('.box-1-2')[1]; // Desserts container (second box-1-2)
                break;
            case 'beverages':
                categoryContainer = document.querySelectorAll('.box-1-1')[2]; // Beverages container (third box-1-1)
                break;
            case 'cafe':
                categoryContainer = document.querySelectorAll('.box-1-2')[2]; // Cafe container (third box-1-2)
                break;
            default:
                categoryContainer = null;
        }

        if (!categoryContainer) return; // Exit if category container not found

        let categoryHasMatch = false;

        // Filter items based on search text
        items.forEach(item => {
            const itemName = item.dataset.name.toLowerCase();
            const itemMatchesSearch = searchText === '' || itemName.includes(searchText);

            item.style.display = itemMatchesSearch ? 'flex' : 'none';
            if (itemMatchesSearch) {
                categoryHasMatch = true;
                atleastOneMatch = categoryHasMatch
            }
        });

        // Show/hide category container based on matching items
        categoryContainer.style.display = categoryHasMatch ? 'block' : 'none';
    });

    if(!atleastOneMatch){
        noMatchScreen.style.display = "block";
    }
    else{
        noMatchScreen.style.display = "none";
    }
}

// Event listener for search input
searchInput.addEventListener('input', function(event) {
    const searchText = event.target.value;
    filterMenuItems(searchText);
});

// Alert
let timerInterval;

const showAlert = (item) => {
    // alert(`${item.name} - added to cart`);
        Swal.fire({
            title: "Success!",
            icon: "success",
            html: `<b>${item.name}</b> - added to cart`,
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
            scrollbarPadding: false,
            willClose: () => {
                clearInterval(timerInterval);
            }
        });
    
    
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
    document.getElementById('cartCountTotal').textContent = cartCount + ' item(s)';
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
            <div class="quantity">
                <span class="minus">-</span>
                <span>${item.quantity}</span>
                <span class="plus">+</span>
            </div>
            <div class="totalPrice">
                Rp ${(item.price * item.quantity).toLocaleString()}
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
    cartCountTotal = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCountTotal').textContent = cartCountTotal + ' item(s)';
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
        document.getElementById('cartCountTotal').textContent = cartCount + ' item(s)';
    }
};
