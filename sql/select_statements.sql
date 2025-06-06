SELECT * FROM items 
JOIN categories ON items.category_id = categories.id 
WHERE categories.name = 'Health';

Select count(*) from items;

SELECT * from users;

SELECT cart_items.id, cart_id, items.name, quantity FROM cart_items JOIN items ON cart_items.item_id = items.id WHERE cart_id = 1;

SELECT * FROM orders;

SELECT * FROM order_items;

SELECT * FROM carts;