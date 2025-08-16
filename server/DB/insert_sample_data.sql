INSERT INTO users (first_name, last_name, password, email, phone, short_description, image_url, linkedin_url, years_experience, mentor)
VALUES
('Dana', 'Cohen', 'pass123', 'dana.cohen@example.com', '050-1111111', 'Full Stack Developer with a passion for teaching', NULL, 'https://linkedin.com/in/danacohen', 5, 1),
('Noa', 'Levi', 'pass456', 'noa.levi@example.com', '050-2222222', NULL, NULL, 'https://linkedin.com/in/noalevi', NULL, 0),
('Shira', 'Aviv', 'pass789', 'shira.aviv@example.com', '050-3333333', 'Data Scientist specializing in NLP', 'https://example.com/shira.jpg', 'https://linkedin.com/in/shiraaviv', 4, 1);

INSERT INTO mentor_skills (mentor_id, skill_name)
VALUES
(1, 'JavaScript'),
(1, 'Node.js'),
(1, 'React'),
(3, 'Python'),
(3, 'Machine Learning'),
(3, 'SQL');
UPDATE users
SET region = 'North'
WHERE id = 1;

UPDATE users
SET region = 'Center'
WHERE id = 2;

UPDATE users
SET region = 'South'
WHERE id = 3;

INSERT INTO mentorship_meetings (mentee_id, mentor_id, meeting_date, approved)
VALUES (2, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1);

INSERT INTO mentorship_meetings (mentee_id, mentor_id, meeting_date, approved)
VALUES (2, 3, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 1);

INSERT INTO mentorship_meetings (mentee_id, mentor_id, meeting_date, approved)
VALUES (2, 3, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 1);


INSERT INTO mentorship_meetings (mentee_id, mentor_id, meeting_date)
VALUES (2, 1, DATE_ADD(CURDATE(), INTERVAL 5 DAY));

INSERT INTO mentorship_meetings (mentee_id, mentor_id, meeting_date,approved)
VALUES (2, 3, DATE_ADD(CURDATE(), INTERVAL 3 DAY),1);
