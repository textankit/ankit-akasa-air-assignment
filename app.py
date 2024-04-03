from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from bson.json_util import dumps
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash

app = Flask(__name__)
CORS(app)
client = MongoClient('mongodb://localhost:27017/')
db = client['food_ordering_platform']
users_collection = db['users']
products_collection = db['products']


@app.route('/register', methods=['POST'])
def register_user():
    
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Check if the user already exists
    if users_collection.find_one({'email': email}):
        return jsonify({'message': 'User already exists'}), 400
    
    # Hash the password
    hashed_password = generate_password_hash(password)
    
    # Create a new user document
    new_user = {
        'email': email,
        'password': hashed_password,
        'cart': []  # Initialize an empty cart
    }
    users_collection.insert_one(new_user)
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Find the user document in the collection
    user = users_collection.find_one({'email': email})
    
    if user and check_password_hash(user['password'], password):
        return jsonify({'message': 'User logged in successfully'}), 200
    
    return jsonify({'message': 'Invalid email or password'}), 401

@app.route('/logout', methods=['POST'])
def logout_user():
    # Handle user logout
    return jsonify({'message':'logged out successfully'})

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    item_name = data.get('item_name')
    quantity = data.get('quantity')  # Get the quantity parameter from the request

    item = products_collection.find_one({'item_name': item_name})
    
    if not item:
        return jsonify({'message': 'Item not found'}), 404
    
    user_email = data.get('email')
    
    if not user_email:
        return jsonify({'message': 'User not logged in'}), 401

    user = users_collection.find_one({'email': user_email})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    cart = user.get('cart', [])
    
    # Check if the item is already in the cart
    for cart_item in cart:
        if cart_item['item_name'] == item_name:
            # Update the quantity of the existing item
            cart_item['quantity'] += quantity
            users_collection.update_one({'_id': user['_id']}, {'$set': {'cart': cart}})
            return jsonify({'message': 'Quantity updated in cart successfully'}), 200
    
    # If the item is not already in the cart, add it with the quantity
    item['quantity'] = quantity
    cart.append(item)
    users_collection.update_one({'_id': user['_id']}, {'$set': {'cart': cart}})
    
    return jsonify({'message': 'Item added to cart successfully'}), 200


from flask import request

@app.route('/view_cart', methods=['GET'])
def view_cart():
    user_email = request.args.get('email')
    
    if not user_email:
        return jsonify({'message': 'User email not provided'}), 400

    # Find the user document in the collection
    user = users_collection.find_one({'email': user_email})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Extract the cart array from the user document
    cart = user.get('cart', [])

    if not cart:
        return jsonify({'message': 'Cart is empty'}), 200

    for item in cart:
        item['_id'] = str(item['_id'])

    return jsonify({'cart': cart}), 200


@app.route('/checkout', methods=['POST'])
def checkout():
    # Retrieve the user's email from the session
    data = request.get_json()
    user_email = data.get('email')

    
    if not user_email:
        return jsonify({'message': 'User not logged in'}), 401

    # Find the user document in the collection
    user = users_collection.find_one({'email': user_email})
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Update the cart array in the user document to an empty array
    users_collection.update_one({'email': user_email}, {'$set': {'cart': []}})
    return jsonify({'message': 'Checkout successful'}), 200

@app.route('/items', methods=['GET'])
def get_items():
    category = request.args.get('category')
    if category:
        items = list(products_collection.find({'category': category}))
    else:
        items = list(products_collection.find())

    # Convert ObjectId to string for serialization
    for item in items:
        item['_id'] = str(item['_id'])

    return jsonify(items), 200

@app.route('/order_history', methods=['POST'])
def add_order_to_history():
    data = request.get_json()
    email = data.get('email')
    order_id = data.get('orderID')

    if not email or not order_id:
        return jsonify({'message': 'Email and order ID are required'}), 400

    # Get the user by email
    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Check if the order ID already exists in the user's order history
    order_history = user.get('order_history', [])
    for order in order_history:
        if order.get('orderID') == order_id:
            return jsonify({'message': 'Order already exists in the order history'}), 400

    transaction_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    order_history.append({'orderID': order_id, 'transactionDate': transaction_date})
    
    # Update the user document with the new order history
    users_collection.update_one({'email': email}, {'$set': {'order_history': order_history}})

    return jsonify({'message': 'Order added to order history successfully'}), 201

@app.route('/order_history', methods=['GET'])
def get_order_history():
    # Get email from query parameters
    email = request.args.get('email')

    # Check if email is provided
    if not email:
        return jsonify({'error': 'Email is required as a query parameter'}), 400

    try:
        user = users_collection.find_one({'email': email}, {'_id': 0, 'order_history': 1})
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Retrieve order history from the user document
        order_history = user.get('order_history', [])
    except Exception as e:
        return jsonify({'error': f'Error fetching order history: {str(e)}'}), 500

    return jsonify(order_history)

if __name__ == '__main__':
    app.run(debug=True)
