document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Create a JSON object with email and password
            const data = { email: email, password: password };

            // Make a POST request to the login endpoint using Axios
            axios.post('http://127.0.0.1:5000/login', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.status === 200) {
                    // Redirect to category.html after successful login
                    sessionStorage.setItem('email', email);
                    window.location.href = 'category.html';
                } else {
                    // Display error message
                    document.getElementById('login-message').textContent = 'Invalid email or password';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    } else {
        console.error('Login form not found');
    }
});
