SELECT * FROM items 
JOIN categories ON items.category_id = categories.id 
WHERE categories.name = 'Health';

Select count(*) from items;