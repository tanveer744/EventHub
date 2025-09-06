-- Seed data for testing
INSERT INTO colleges (name) VALUES ('Test College') ON CONFLICT (name) DO NOTHING;

INSERT INTO students (college_id, full_name, email) VALUES
(1, 'Alice Johnson', 'alice@testcollege.edu'),
(1, 'Bob Smith', 'bob@testcollege.edu'),
(1, 'Charlie Brown', 'charlie@testcollege.edu'),
(1, 'Diana Prince', 'diana@testcollege.edu'),
(1, 'Ethan Hunt', 'ethan@testcollege.edu')
ON CONFLICT (college_id, email) DO NOTHING;
