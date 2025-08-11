CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    short_description TEXT,
    image_url VARCHAR(255),
    linkedin_url VARCHAR(255) NOT NULL,
    years_experience INT DEFAULT NULL
);


CREATE TABLE mentor_skills (
    mentor_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (mentor_id, skill_name),
    FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE
);
