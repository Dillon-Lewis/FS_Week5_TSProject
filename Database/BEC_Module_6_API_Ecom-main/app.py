import mysql.connector
from mysql.connector import Error
from flask import Flask, jsonify, request
from flask_marshmallow import Marshmallow
from marshmallow import ValidationError, fields
from flask_cors import CORS

app = Flask(__name__)
ma = Marshmallow(app)  ## Create instance of marshmallow to validate later
CORS(app)


#################VALIDATION WITH SCHEMA ########################

class CustomerSchema(ma.Schema):
    id = fields.Integer(required= False)
    name = fields.String(required= True)
    email = fields.String(required= True)
    phone = fields.String()
    user_password = fields.String(required=True)
    class Meta:
        fields = ('id', 'name', 'email', 'phone', 'user_password')

class CartSchema(ma.Schema):
    id = fields.Integer(required=False)
    order_id = fields.Integer(required=True)
    product_id = fields.Integer(required=True)
    quantity = fields.Integer(required=True)
    class Meta:
        fields = ('id', 'order_id', 'product_id', 'quantity')

class OrderSchema(ma.Schema):
    id = fields.Integer(required=False)
    date_ordered = fields.Date(required=True)  # This should be required
    customer_id = fields.Integer(required=True)
    
    class Meta:
        fields = ('id', 'date_ordered', 'customer_id')

class ProductSchema(ma.Schema):
    id = fields.Integer(required= False)
    product_name = fields.String(required= True)
    price = fields.Float(required= True)
    product_description = fields.String()
    class Meta:
        fields = ('id', 'product_name', 'price', 'product_description')

customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many = True)

order_schema = OrderSchema()
orders_schema = OrderSchema(many= True)

shopping_cart_schema= CartSchema()
shopping_carts_schema = CartSchema(many=True)

product_schema = ProductSchema()
products_schema = ProductSchema(many= True)

db_name = "e_commerce_db"
user = "root"
password = "1126"
host = "localhost"

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            database=db_name,
            user=user,
            password=password,
            host=host
        )

        if conn.is_connected():
            print("Connected successfully")
            return conn

    except Error as e:
        print(f"Error: {e}")
        return None

###########MAKING ROUTES#################################

######CUSTOMER######

# @app.route('/')
# def home():
#     return "Welcome to the Ecom Database, the final push into backend core!"


@app.route('/customers', methods = ['GET'])
def get_customers():
    try:
        # Establishing connection to the database
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM Customers"
        cursor.execute(query)
        customers = cursor.fetchall()
        return customers_schema.jsonify(customers)

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()


@app.route('/customers/<int:id>', methods=['GET'])
def get_customer(id):
    try: 
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        customer_to_get = (id, )
        cursor.execute("SELECT * FROM Customers WHERE id = %s", customer_to_get)
        customer = cursor.fetchall()
        return customers_schema.jsonify(customer)

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()

@app.route('/customers', methods=['POST'])
def add_customer():
    try:
        customer_data = customer_schema.load(request.json)
    except ValidationError as e:
        print(f"Error: {e}")
        return jsonify(e.messages), 400
    conn = get_db_connection()
    if conn is not None:    
        try:
            cursor = conn.cursor()
            new_customer = (customer_data['name'], customer_data['email'], customer_data['phone'], customer_data['user_password'])
            query = "INSERT INTO Customers (name, email, phone, user_password) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, new_customer)
            conn.commit()
            return jsonify({"message": "New customer added successfully"}), 201
        except Error as e:
            print(f"Error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()
    else:
        return jsonify({"error": "Databse connection failed"}), 500

@app.route('/customers/<int:id>', methods=['PUT'])
def update_customer(id):
    try:
        customer_data = customer_schema.load(request.json)
    except ValidationError as e:
        print(f"Error: {e}")
        return jsonify(e.messages), 400
    conn = get_db_connection()
    if conn is not None:
        try:

            cursor = conn.cursor()
            check_query = "SELECT * FROM customer WHERE id = %s"
            cursor.execute(check_query, (id,))
            customer= cursor.fetchone()
            if not customer:
                return jsonify({"error": "Customer was not found."}), 404
            
            updated_customer = (customer_data['name'], customer_data['email'], customer_data['phone'], customer_data['user_password'], id)

            query = "UPDATE Customers SET name = %s, email = %s, phone = %s, user_password = %s WHERE id = %s"

            cursor.execute(query, updated_customer)
            conn.commit()
            return jsonify({"message": "Customer details updated successfully"}), 200

        except Error as e:
            print(f"Error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()
    else:
        return jsonify({"error": "Databse connection failed"}), 500

@app.route("/customers/<int:id>", methods=['DELETE'])
def delete_customer(id):
    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Customers WHERE id = %s", (id,))
            customer = cursor.fetchone()
            if not customer:
                return jsonify({"error": "Customer not found"}), 404
            query = "DELETE FROM Customers WHERE id = %s"
            cursor.execute(query, (id,))
            conn.commit()
            return jsonify({"message": "Customer removed successfully"}), 200
        except Error as e:
            print(f"Error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500
        
        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()
    else: 
        return jsonify({"error": "Database connection failed"}), 500


# ########PRODUCTS#########################################################
@app.route("/products", methods=['GET'])
def get_product_list():
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM products")
        products = cursor.fetchall()
        return products_schema.jsonify(products)

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.route("/products/<int:id>", methods=['GET'])
def get_product(id):
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM products WHERE id = %s", (id,))
        product = cursor.fetchone()
        if product:
            return products_schema.jsonify(product)
        else:
            return jsonify({"error": "Product not found"}), 404

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/products', methods=['POST'])
def add_product():
    try:
        product_data = product_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            new_product = (product_data['product_name'], product_data['price'], product_data['product_description'])

            query = "INSERT INTO products (product_name, price, product_description) VALUES (%s, %s, %s)"
            cursor.execute(query, new_product)
            conn.commit()
            return jsonify({"message": "New product added successfully"}), 201

        except Error as e:
            print(f"Error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()
    else: 
        return jsonify({"error": "Database connection failed"}), 500

@app.route('/products/<int:id>', methods=['PUT'])
def update_product_info(id):
    try:
        product_data = product_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM products WHERE id = %s", (id,))
            product = cursor.fetchone()
            if not product:
                return jsonify({"error": "Product was not found."}), 404
            
            new_product = (product_data['product_name'], product_data['price'], product_data['product_description'], id)
            query = "UPDATE products SET product_name = %s, price = %s, product_description = %s WHERE id = %s"
            cursor.execute(query, new_product)
            conn.commit()
            return jsonify({"message": "Product details updated successfully"}), 200

        except Error as e:
            print(f"Error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()
    else:
        return jsonify({"error": "Database connection failed"}), 500

@app.route('/products/<int:id>', methods=['DELETE'])
def remove_product(id):
    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM products WHERE id = %s", (id,))
            product = cursor.fetchone()
            if not product:
                return jsonify({"error": "Product not found"}), 404
            
            query = "DELETE FROM products WHERE id = %s"
            cursor.execute(query, (id,))
            conn.commit()
            return jsonify({"message": "Product removed successfully"}), 200
            
        except Error as e:
            print(f"Error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()
    else:
        return jsonify({"error": "Database connection failed"}), 500
    
# ############ORDERS######################################################

@app.route("/orders", methods=['GET'])
def retrieve_orders():
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM orders")
        orders = cursor.fetchall()
        return orders_schema.jsonify(orders)

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.route("/orders/<int:order_id>", methods=['GET'])
def get_order(order_id):
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM orders WHERE id = %s", (order_id,))
        order = cursor.fetchone()
        if order:
            return orders_schema.jsonify(order)
        else:
            return jsonify({"error": "Order not found"}), 404

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/orders', methods=['POST'])
def add_order():
    try:
        order_info = order_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            new_order = (
                order_info['date_ordered'], 
                order_info['customer_id']
            )

            query = "INSERT INTO orders (date_ordered, customer_id) VALUES (%s, %s)"
            cursor.execute(query, new_order)
            conn.commit()
            order_id = cursor.lastrowid  # Get the ID of the newly created order

            return jsonify({"message": "New order added successfully", "order_id": order_id}), 201

        except Error as e:
            print(f"Error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()
    else: 
        return jsonify({"error": "Database connection failed"}), 500
    
@app.route('/orders/<int:id>', methods=['PUT'])
def update_order(id):
    try:
        order_info = order_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM orders WHERE id = %s", (id,))
            order = cursor.fetchone()
            if not order:
                return jsonify({"error": "Order not found."}), 404
            
            updated_order = (order_info['date_ordered'], order_info['customer_id'], id)
            query = "UPDATE orders SET date_ordered = %s, customer_id = %s WHERE id = %s"
            cursor.execute(query, updated_order)
            conn.commit()
            return jsonify({"message": "Order info updated successfully"}), 200

        except Error as e:
            print(f"Error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()
    else:        
        return jsonify({"error": "Database connection failed"}), 500

@app.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    conn = get_db_connection()
    if conn is not None:
        try:   
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM orders WHERE id = %s", (id,))
            order = cursor.fetchone()
            if not order:
                return jsonify({"error": "Order not found"}), 404
            
            # Delete correspondingshopping_cart
            cursor.execute("DELETE FROM shopping_cart WHERE order_id = %s", (id,))
            # Now delete the order
            cursor.execute("DELETE FROM orders WHERE id = %s", (id,))
            conn.commit()
            return jsonify({"message": "Order removed successfully"}), 200
        except Error as e:
            print(f"Error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()
    else:
        return jsonify({"error": "Database connection failed"}), 500

###shopping_cart Table#########################################################

# Retrieve all items in the shopping cart
@app.route("/shopping_cart", methods=['GET'])
def retrieve_shopping_cart():
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM shopping_cart")
        shopping_cart = cursor.fetchall()
        return shopping_carts_schema.jsonify(shopping_cart)

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

# Retrieve a specific item in the shopping cart
@app.route("/shopping_cart/<int:item_id>", methods=['GET'])
def get_shopping_cart(item_id):
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM shopping_cart WHERE id = %s", (item_id,))
        shopping_cart_item = cursor.fetchone()
        if shopping_cart_item:
            return shopping_cart_schema.jsonify(shopping_cart_item)
        else:
            return jsonify({"error": "Shopping cart item not found"}), 404

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

# Add a new item to the shopping cart
@app.route('/shopping_cart', methods=['POST'])
def add_shopping_cart():
    try:
        shopping_cart_info = shopping_cart_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            new_item = (
                shopping_cart_info['order_id'], 
                shopping_cart_info['product_id'], 
                shopping_cart_info['quantity']
            )
            query = "INSERT INTO shopping_cart (order_id, product_id, quantity) VALUES (%s, %s, %s)"
            cursor.execute(query, new_item)
            conn.commit()
            return jsonify({"message": "New order item added", "item_id": cursor.lastrowid}), 201

        except Error as e:
            print(f"Error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()
    else:
        return jsonify({"error": "Database connection failed"}), 500

# Update an item in the shopping cart
@app.route('/shopping_cart/<int:item_id>', methods=['PUT'])
def update_shopping_cart(item_id):
    try:
        shopping_cart_info = shopping_cart_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM shopping_cart WHERE id = %s", (item_id,))
            shopping_cart_item = cursor.fetchone()
            if not shopping_cart_item:
                return jsonify({"error": "Shopping cart item not found."}), 404
            
            updated_item = (
                shopping_cart_info['order_id'], 
                shopping_cart_info['product_id'], 
                shopping_cart_info['quantity'], 
                item_id
            )
            query = "UPDATE shopping_cart SET order_id = %s, product_id = %s, quantity = %s WHERE id = %s"
            cursor.execute(query, updated_item)
            conn.commit()
            return jsonify({"message": "Shopping cart item updated successfully"}), 200

        except Error as e:
            print(f"Error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()
    else:        
        return jsonify({"error": "Database connection failed"}), 500

# Delete an item from the shopping cart
@app.route('/shopping_cart/<int:item_id>', methods=['DELETE'])
def delete_shopping_cart(item_id):
    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM shopping_cart WHERE id = %s", (item_id,))
            shopping_cart_item = cursor.fetchone()
            if not shopping_cart_item:
                return jsonify({"error": "Shopping cart item not found"}), 404

            query = "DELETE FROM shopping_cart WHERE id = %s"
            cursor.execute(query, (item_id,))
            conn.commit()
            return jsonify({"message": "Shopping cart item removed successfully"}), 200
        except Error as e:
            print(f"Error: {e}")
            return jsonify({"error": "Internal Server Error"}), 500

        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()
    else:
        return jsonify({"error": "Database connection failed"}), 500    
            
if __name__ == "__main__":
    app.run(debug= True)
