Running the Food Ordering Platform

Steps:
Download or Clone the Application Files:


Locate the downloaded or cloned application files from GitHub. You should see two components:
A folder containing the frontend code (user interface).
A single file named app.py containing the backend code (server-side logic).
Run the Backend Server:


Open a terminal window and navigate to the directory containing the app.py file.
In the terminal, execute the following command to start the backend server
python app.py   or python3 app.py (depending on your Python version)
This will start the server and display a message indicating it's running on http://127.0.0.1:5000/.


Database Configuration (Optional):
I used a local MongoDB database managed by MongoDB Compass.
The code snippet provided uses the connection string mongodb://localhost:27017/ to connect to the MongoDB server running on your machine.
Ensure you have MongoDB Compass installed and a database named food_ordering_platform is created with collections named Users and Products.
Database Collections:
Users: This collection stores user data such as email, hashed password, order history, and cart details (items added with price, quantity, etc.).
Products: This collection stores product information including item name, price, category, and available quantity in inventory.


This section explains how to access the user interface (frontend) of the food ordering platform after successfully running the backend server.
Frontend Navigation Flow:
The application follows a sequential navigation flow, typically starting with the landing page and progressing through various sections:
landing.html: This is the initial page users will see when they access the application. It likely serves as an introduction and may provide features like browsing categories or logging in/registering.


User Authentication:
Users can either register for a new account through a dedicated page (register.html) or log in using existing credentials (login.html).
Product Selection:


Upon successful authentication, users can navigate to a page displaying available product categories (category.html). This page likely allows users to filter and browse different food items.
Cart Management:


Users can add items to their cart while browsing categories. The cart details can be accessed through a dedicated page (cart.html). This page would typically display selected items, their quantities, and the total price.
Order History (Optional):


Some implementations may include an order history page (orderHistory.html) where users can view past orders and details.
Accessing the Landing Page:
To access the landing page, open a web browser and navigate to the following 
You can directly open the landing.html file on a browser after running backend server.
