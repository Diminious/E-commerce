CREATE TABLE categories (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(20),
    description varchar(50)
);

CREATE TABLE items (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(30),
    description varchar(50),
    category_id integer REFERENCES categories(id),
    price money
);

CREATE TABLE users (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name varchar(20),
    last_name varchar(20),
    email varchar UNIQUE
);

CREATE TABLE orders (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    total money,
    status varchar(10),
    modified timestamp,
    user_id integer REFERENCES users(id)
);

CREATE TABLE order_items (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id integer REFERENCES orders(id),
    item_id integer REFERENCES items(id),
    quantity integer,
    price money,
    name varchar(20)
);