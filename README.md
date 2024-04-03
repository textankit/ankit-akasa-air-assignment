**Running the Food Ordering Platform**

**Steps:**
Download or Clone the Application Files:


Locate the downloaded or cloned application files from GitHub. You should see two components:
A folder containing the frontend code (user interface).
A single file named app.py containing the backend code (server-side logic).
Run the Backend Server:


Open a terminal window and navigate to the directory containing the app.py file.
In the terminal, execute the following command to start the backend server
**python app.py   or python3 app.py** (depending on your Python version)
This will start the server and display a message indicating **it's running on http://127.0.0.1:5000/**


**Database Configuration**:


I used a local MongoDB database managed by MongoDB Compass.
The code snippet provided uses the connection string **mongodb://localhost:27017/** to connect to the MongoDB server running on your machine.

Please make sure you have MongoDB Compass installed and a database named food_ordering_platform is created with collections named Users and Products.


This section explains how to access the user interface (frontend) of the food ordering platform after successfully running the backend server.


User Authentication:
Users can either register for a new account through a dedicated page (register.html) or log in using existing credentials (login.html).


Some implementations may include an order history page (orderHistory.html) where users can view past orders and details.
Accessing the Landing Page:
**To access the landing page, open a web browser and navigate to the following 
You can directly open the landing.html file on a browser after running backend server**.
