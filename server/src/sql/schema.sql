-- Colleges (to respect scale assumption; single DB, multi-tenant by college_id)
CREATE TABLE colleges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  college_id INT NOT NULL REFERENCES colleges(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  UNIQUE (college_id, email)
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  college_id INT NOT NULL REFERENCES colleges(id),
  title TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('Hackathon','Workshop','TechTalk','Fest','Seminar')),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at   TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL
  -- no "status" or "capacity" logic added since it's outside scope
);

CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, student_id) -- prevents duplicate registrations (edge case)
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  registration_id INT NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
  present BOOLEAN NOT NULL,
  marked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  given_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, student_id) -- 1 feedback per student per event
);
