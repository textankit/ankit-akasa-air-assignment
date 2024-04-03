document.addEventListener("DOMContentLoaded", function() {
    const categorySelect = document.getElementById('category');
    const itemsContainer = document.getElementById('items');
    const viewCartButton = document.getElementById('view-cart-btn'); // Get the view cart button

    // Function to fetch items from the backend based on category
    function fetchItems(category) {
        const url = category === 'all' ? 'http://127.0.0.1:5000/items' : `http://127.0.0.1:5000/items?category=${category}`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                itemsContainer.innerHTML = ''; // Clear previous items
                data.forEach(item => {
                    displayItem(item);
                });
            })
            .catch(error => console.error('Error fetching items:', error));
    }  

    // Function to display an item
    function displayItem(item) {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <div>${item.item_name} - Price: $${item.price}</div>
            <div>Quantity: <input type="number" value="1" min="1" step="1"></div>
            <button class="add-to-cart" data-item-name="${item.item_name}">Add to Cart</button>
        `;
        itemsContainer.appendChild(itemDiv);
    }
    

    // Event listener for category change
    categorySelect.addEventListener('change', function() {
        const selectedCategory = categorySelect.value;
        fetchItems(selectedCategory);
    });

    // Event listener for adding items to cart
    itemsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            const item_name = event.target.dataset.itemName;
            const quantity = event.target.parentElement.querySelector('input').value;
            addToCart(item_name, quantity);
        }
    });
    document.getElementById('logout-btn').addEventListener('click', function() {
        // Clear session storage
        sessionStorage.removeItem('email');
        window.location.href = 'landing.html';
    });
    document.getElementById('order-history').addEventListener('click', function() {
        window.location.href = 'orderHistory.html';
    });

    function addToCart(itemName, quantity) {
        const userEmail = sessionStorage.getItem('email');
        if (!userEmail) {
            alert('Please log in to add items to the cart.');
            return;
        }
    
        const data = {
            email: userEmail,
            item_name: itemName,
            quantity: parseInt(quantity)
        };
    
        if (parseInt(quantity) > 10) {
            alert(`Requested quantity exceeds available quantity for ${itemName}.`);
            return;
        }
    
        fetch('http://127.0.0.1:5000/add_to_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add item to cart.');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error adding item to cart:', error);
            alert('Failed to add item to cart. Please try again later.');
        });
    }
    

    // Event listener for the "View Cart" button
    viewCartButton.addEventListener('click', function() {
        window.location.href = 'cart.html'; // Redirect to cart.html
    });

    // Initially fetch items for the 'all' category
    fetchItems('all');
});