
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    short_description TEXT,
    image_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    years_experience INT DEFAULT NULL,
    mentor INT DEFAULT 0
);


CREATE TABLE mentor_skills (
    mentor_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (mentor_id, skill_name),
    FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE mentorship_meetings (
    mentee_id INT NOT NULL,
    mentor_id INT NOT NULL,
    meeting_date DATE NOT NULL,
    approved TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (mentee_id, mentor_id, meeting_date),
    FOREIGN KEY (mentee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE users
ADD region VARCHAR(50) DEFAULT NULL AFTER phone;

ALTER TABLE mentorship_meetings
ADD meeting_time TIME AFTER meeting_date;

Drop Table mentor_skills;
DROP TABLE users;
ALTER TABLE mentorship_meetings
MODIFY COLUMN meeting_date DATE NOT NULL;

ALTER TABLE users MODIFY image_url TEXT;