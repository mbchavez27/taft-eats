USE taft_eats;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Review_Replies;
TRUNCATE TABLE Review_Votes;
TRUNCATE TABLE User_Bookmarks;
TRUNCATE TABLE Reviews;
TRUNCATE TABLE Restaurant_Tags;
TRUNCATE TABLE Restaurants;
TRUNCATE TABLE Users;

INSERT INTO Users (username, name, email, password_hash, role, bio, profile_picture_url) VALUES 
('john_doe', 'John Doe', 'john@student.dlsu.edu.ph', '$2b$10$FakeHashForPassword123', 'user', 'Love finding cheap eats near campus.', 'https://placehold.co/100/orange/white?text=JD'),
('jane_owner', 'Jane Smith', 'jane@taftburgers.com', '$2b$10$FakeHashForPassword123', 'owner', 'Owner of Taft Burgers since 2015.', 'https://placehold.co/100/purple/white?text=JS'),
('admin_guy', 'Admin User', 'admin@tafteats.com', '$2b$10$FakeHashForPassword123', 'admin', 'System Administrator.', 'https://placehold.co/100/black/white?text=ADM'),
('foodie_maria', 'Maria Santos', 'maria@gmail.com', '$2b$10$FakeHashForPassword123', 'user', 'Always looking for spicy food.', 'https://placehold.co/100/blue/white?text=MS');

INSERT INTO Restaurants (owner_user_id, name, description, price_range, rating, latitude, longitude, banner_picture_url) VALUES 
(2, 'Taft Burgers', 'The juiciest burgers in Manila. Student friendly prices!', '$$', 4.5, 14.5649, 120.9932, 'https://placehold.co/600x400/orange/white?text=Taft+Burgers'),
(2, 'Coffee & Code', '24/7 cafe with high speed fiber internet.', '$$$', 4.8, 14.5655, 120.9940, 'https://placehold.co/600x400/brown/white?text=Coffee+Code'),
(NULL, 'Street Pares', 'Authentic beef pares on the corner.', '$', 4.2, 14.5660, 120.9950, 'https://placehold.co/600x400/red/white?text=Street+Pares');

INSERT INTO Restaurant_Tags (restaurant_id, tag_name) VALUES 
(1, 'Burgers'), (1, 'American'), (1, 'Late Night'),
(2, 'Coffee'), (2, 'Study Spot'), (2, 'Wifi'),
(3, 'Filipino'), (3, 'Budget');

INSERT INTO Reviews (restaurant_id, user_id, rating, body) VALUES 
(1, 1, 5, 'Absolutely loved the cheese burger!'), -- John reviews Taft Burgers
(1, 4, 3, 'Good food but the service was a bit slow.'), -- Maria reviews Taft Burgers
(2, 1, 4, 'Great wifi, but the coffee is a bit pricey.'); -- John reviews Coffee & Code

INSERT INTO Review_Replies (review_id, owner_user_id, body) VALUES 
(2, 2, 'Hi Maria, sorry about the wait! We were short-staffed that day. Hope you try us again!');

INSERT INTO Review_Votes (review_id, user_id, vote_type) VALUES 
(1, 4, 'like'), -- Maria likes John's review
(2, 1, 'like'); -- John likes Maria's review

INSERT INTO User_Bookmarks (user_id, restaurant_id) VALUES 
(1, 2), -- John bookmarks Coffee & Code
(4, 1), -- Maria bookmarks Taft Burgers
(4, 3); -- Maria bookmarks Street Pares

SET FOREIGN_KEY_CHECKS = 1;