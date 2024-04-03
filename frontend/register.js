document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById('register-form');

    // Add event listener to the registration form submit event
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        // Get the email and password from the form inputs
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        // Create a JSON object with email and password
        const data = { email: email, password: password };
        
        axios.post('http://127.0.0.1:5000/register', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 201) {
                alert('User registered successfully');
                sessionStorage.setItem('email', email);
                window.location.href = 'login.html'; 
            } else {
                alert('Failed to register user, User already Exists');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to register user, User already Exists');
        });
    });
});
