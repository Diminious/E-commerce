CREATE TABLE categories (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(20) UNIQUE,
    description varchar(50)
);

CREATE TABLE items (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(30) UNIQUE,
    description varchar(50),
    price decimal(8, 2),
    category_id integer REFERENCES categories(id)
);

CREATE TABLE users (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email varchar(20) UNIQUE,
    password varchar(60) NOT NULL,
    firstname varchar(20) NOT NULL,
    lastname varchar(20)
);

CREATE TABLE orders (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    total decimal(8, 2),
    status varchar(16),
    modified timestamp DEFAULT NOW(),
    user_id integer REFERENCES users(id)
);

CREATE TABLE order_items (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id integer REFERENCES orders(id),
    item_id integer REFERENCES items(id),
    quantity integer,
    price decimal(8, 2),
    name varchar(20)
);

CREATE TABLE carts (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id integer REFERENCES users(id),
    modified timestamp DEFAULT NOW(),
    created timestamp DEFAULT NOW()
);

CREATE TABLE cart_items (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    cart_id integer REFERENCES carts(id) ON DELETE CASCADE,
    item_id integer REFERENCES items(id),
    quantity integer
);

INSERT INTO categories (name, description) VALUES
('Fruits', 'Fresh and dried fruits'),
('Vegetables', 'Fresh and dried vegetables'),
('Cereal', 'Cereal'),
('Meats', 'Meat and fish'),
('Dairy', 'Milk and dairy'),
('Cooking Oils', 'Cooking oils'),
('Sweets', 'Confectionery and snacks'),
('Drinks', 'Drinks including juices and sodas'),
('Health', 'Health and wellness products');

INSERT INTO items (name, description, price, category_id) VALUES
('Apple', 'Fresh red apples', 1.20, 1),
('Banana', 'Organic bananas', 0.80, 1),
('Raisins', 'Dried raisins', 1.60, 1),
('Tomato', 'Ripe tomatoes', 0.90, 1),
('Carrot', 'Crunchy carrots', 0.70, 2),
('Broccoli', 'Fresh broccoli', 1.50, 2),
('Spinach', 'Leafy spinach', 1.10, 2),
('Corn Flakes', 'Classic corn flakes', 3.00, 3),
('Oatmeal', 'Rolled oats', 2.50, 3),
('Granola', 'Nutty granola', 4.00, 3),
('Chicken Breast', 'Boneless chicken breast', 5.00, 4),
('Salmon Fillet', 'Fresh salmon fillet', 8.00, 4),
('Beef Steak', 'Prime beef steak', 7.50, 4),
('Beef Sausages', 'Angus beef sausages', 4.50, 4),
('Milk', 'Full cream milk', 2.30, 5),
('Cheddar Cheese', 'Aged cheddar cheese', 2.80, 5),
('Parmesan Cheese', 'Grated parmesan cheese', 3.40, 5),
('Yogurt', 'Plain yogurt', 1.00, 5),
('Olive Oil', 'Extra virgin olive oil', 6.00, 6),
('Sunflower Oil', 'Pure sunflower oil', 4.50, 6),
('Coconut Oil', 'Organic coconut oil', 7.00, 6),
('Chocolate Bar', 'Milk chocolate bar', 1.40, 7),
('Dark Chocolate Bar', 'Rich dark chocolate bar', 2.00, 7),
('Chocolate Mousse', 'Creamy chocolate mousse', 3.50, 7),
('Jelly beans', 'Assorted jelly beans', 1.30, 7),
('Thins Chips', 'Salted potato chips', 1.50, 7),
('Orange Juice', 'Fresh orange juice', 1.80, 8),
('Coca Cola', 'Classic cola soft drink', 1.20, 8),
('Mineral Water', 'Bottled mineral water', 0.90, 8),
('Lemonade', 'Homemade lemonade', 1.00, 8),
('Toothpaste', 'Fluoride whitening toothpaste', 4.50, 9),
('Razor', 'Shaving razor for men', 6.00, 9),
('Hand Soap', 'Antibacterial hand soap', 5.00, 9),
('Shampoo', 'Moisturizing shampoo', 7.00, 9);

INSERT INTO items (name, description, price, category_id) VALUES
('REDAPPLE', 'Fresh red apples', 1.20, 1) RETURNING *;

DELETE FROM carts;