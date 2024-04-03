document.addEventListener("DOMContentLoaded", function() {
    const cartItemsContainer = document.getElementById('cart-items');

    // Function to display cart items
    function displayCartItems(cartItems) {
        cartItemsContainer.innerHTML = ''; // Clear previous cart items
        let totalPrice = 0;
    
        cartItems.forEach(item => {
            const itemDiv = document.createElement('div');
            const itemTotal = item.price * item.quantity; // Calculate total price for each item
            totalPrice += itemTotal; 
    
            itemDiv.innerHTML = `
                <div class="item-info">
                    <div class="name">Name: ${item.item_name}</div>
                    <div class="price">Price: $${item.price}</div>
                    <div>Quantity: ${item.quantity}</div>
                    <div>Total: $${itemTotal}</div>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
    
        // Display total price at the end
        const totalPriceDiv = document.createElement('div');
        totalPriceDiv.textContent = `Total Price: $${totalPrice}`;
        totalPriceDiv.classList.add('total-price'); // Add CSS class
        cartItemsContainer.appendChild(totalPriceDiv);
    }
    

    // Function to fetch cart items from the backend
    function fetchCartItems() {
        const userEmail = sessionStorage.getItem('email');
        if (userEmail) {
            axios.get('http://127.0.0.1:5000/view_cart', {
                params: { email: userEmail }, // Pass email as query parameter
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                const cartItems = response.data.cart;
                displayCartItems(cartItems);
            })
            .catch(error => {
                console.error('Error fetching cart items:', error);
                alert('cart is empty! Please continue shopping');
                
                window.location.href = 'category.html';
            });
        } else {
            alert('Please log in to view your cart.');
        }
    }  
    
    // Display cart items when the page loads
    fetchCartItems();

    // Add event listener for the "Pay and Proceed" button
document.getElementById('checkout-btn').addEventListener('click', function() {
    const userEmail = sessionStorage.getItem('email');
    if (userEmail) {
        // Generate a random 7-digit order ID
        const orderId = Math.floor(1000000 + Math.random() * 9000000);
        
        axios.post('http://127.0.0.1:5000/checkout', { email: userEmail, orderId: orderId })
            .then(response => {
                alert('Order placed successfully. Your order ID is: ' + orderId);
                
                // Add the order to the order history
                axios.post('http://127.0.0.1:5000/order_history', { email: userEmail, orderID: orderId })
                    .then(historyResponse => {
                        // Redirect to category page after successful checkout and order history update
                        alert('Thank You for Shopping! Continue Shopping');
                        window.location.href = 'category.html';    
                    })
                    .catch(historyError => {
                        console.error('Error adding order to order history:', historyError);
                        alert('Error adding order to order history. Please try again later.');
                    });
            })
            .catch(error => {
                console.error('Error during checkout:', error);
                alert('Error during checkout. Please try again later.');
            });
    } else {
        alert('Please log in to proceed with checkout.');
    }
});

});
