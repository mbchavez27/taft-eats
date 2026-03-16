USE taft_eats;

-- Seed the initial tags, cuisines, and foods into the database
INSERT INTO Tags (tag_id, name, category) VALUES

-- initial_tags (Amenities/Vibes -> Category: 'tag')
(1, 'Open 24 hours', 'tag'),
(2, 'Student-friendly', 'tag'),
(3, 'Free WiFi', 'tag'),
(4, 'Vegetarian-friendly', 'tag'),
(5, 'Vegan-friendly', 'tag'),

-- initial_cuisines (Category: 'cuisine')
(6, 'Korean', 'cuisine'),
(7, 'Filipino', 'cuisine'),
(8, 'Chinese', 'cuisine'),
(9, 'Mexican', 'cuisine'),
(10, 'Japanese', 'cuisine'),

-- initial_foods (Category: 'food')
(11, 'Burger', 'food'),
(12, 'Pizza', 'food'),
(13, 'Pasta', 'food'),
(14, 'Buns', 'food'),
(15, 'Sushi', 'food'),
(16, 'Tacos', 'food'),
(17, 'Cake', 'food'),
(18, 'Fries', 'food'),
(19, 'Salad', 'food'),
(20, 'Chicken', 'food');