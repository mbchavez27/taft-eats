CREATE DATABASE IF NOT EXISTS taft_eats;

USE taft_eats;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS Users (
    user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(50) UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT,
    
    -- Supports 'user', 'owner' (restaurant owner), and 'admin'
    role ENUM('user', 'owner', 'admin') NOT NULL DEFAULT 'user',

    -- Allow Non user to not have username
    CONSTRAINT chk_username_role CHECK (
        (role IN ('owner', 'admin')) OR (username IS NOT NULL)
    ),
    
    profile_picture_url VARCHAR(2048) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS Restaurants (
    restaurant_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_user_id BIGINT UNSIGNED,
    
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location TEXT,
    price_range ENUM('$', '$$', '$$$', '$$$$') DEFAULT '$',
    
    -- Calculated average (0.00 to 5.00)
    rating DECIMAL(3, 2) UNSIGNED DEFAULT 0.00 CHECK (rating <= 5.00),
    
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    banner_picture_url VARCHAR(2048) DEFAULT NULL,
    is_temporarily_closed BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- If owner account is deleted, set this field to NULL
    FOREIGN KEY (owner_user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    
    INDEX idx_name (name)
);

CREATE TABLE Tags (
    tag_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category ENUM('tag', 'cuisine', 'food') NOT NULL
);

CREATE TABLE IF NOT EXISTS Restaurant_Tags (
    restaurant_id BIGINT UNSIGNED,
    tag_id BIGINT UNSIGNED,
    PRIMARY KEY (restaurant_id, tag_id),
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS User_Bookmarks (
    user_id BIGINT UNSIGNED,
    restaurant_id BIGINT UNSIGNED,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, restaurant_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Reviews (
    review_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    restaurant_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    
    rating TINYINT UNSIGNED CHECK (rating BETWEEN 1 AND 5),
    body VARCHAR(255) NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,

    INDEX idx_restaurant_reviews (restaurant_id)
);

CREATE TABLE IF NOT EXISTS Review_Votes (
    review_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED,
    vote_type ENUM('like', 'dislike') NOT NULL,
    
    PRIMARY KEY (review_id, user_id),
    FOREIGN KEY (review_id) REFERENCES Reviews(review_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Review_Replies (
    reply_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id BIGINT UNSIGNED UNIQUE, -- UNIQUE ensures only ONE reply per review
    owner_user_id BIGINT UNSIGNED,
    
    body VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (review_id) REFERENCES Reviews(review_id) ON DELETE CASCADE,
    FOREIGN KEY (owner_user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;

-- Trigger to delete the Owner when their Restaurant is deleted
DELIMITER //

CREATE TRIGGER after_restaurant_delete
AFTER DELETE ON Restaurants
FOR EACH ROW
BEGIN
    -- Only delete the user if they were actually assigned as the owner
    IF OLD.owner_user_id IS NOT NULL THEN
        DELETE FROM Users WHERE user_id = OLD.owner_user_id;
    END IF;
END //

DELIMITER ;