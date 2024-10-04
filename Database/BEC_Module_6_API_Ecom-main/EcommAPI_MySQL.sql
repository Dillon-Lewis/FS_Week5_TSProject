CREATE DATABASE e_commerce_db;

CREATE TABLE customers (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(75) NOT NULL,
email VARCHAR(250) NOT NULL UNIQUE,
phone VARCHAR(14) NOT NULL,
user_password VARCHAR(16) NOT NULL
);

CREATE TABLE products (
id INT AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(100) NOT NULL,
price FLOAT NOT NULL,
product_description VARCHAR(300) NULL
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_ordered DATE NOT NULL,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE shopping_cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

INSERT INTO customers (name, email, phone, user_password)
VALUES 
    ('Iron Man', 'iron.man@marvel.com', '000-000-0000', 'Rocketman1'),
    ('Thor', 'thor@marvel.com', '111-111-1111', 'Thunderman1'),
    ('Spiderman', 'spider.man@marvel.com', '222-222-2222', 'Webman1'),
    ('Black Widow', 'black.widow@marvel.com', '333-333-3333', 'PerfectLanding1');

INSERT INTO products (product_name, price, product_description)
VALUES 
    ('Thunder Rocks', '189.95', 'Lightning infused rocks that will hold a burst of electrical charge capable of taking down not 1 charging elephant, but the whole pack.'),
	('Cryopod Fuel', '69.95', 'Sold buy the gallon, this liquid will allow you to sleep peacefully in your crypo-pods on those long intergalactic traverses!'),
    ('Canned Air', '3.99', "Keep your set up clean and tidy with powerful canned air! Dust bunny's be gone!")
    ;