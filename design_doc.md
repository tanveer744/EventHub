# EventHub System Design Document

## 1. Project Overview

**EventHub** is a campus event reporting system that enables colleges to manage events, track student registrations, monitor attendance, and collect feedback. The system provides comprehensive reporting capabilities for event analytics and student participation tracking.

### Technology Stack
- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, Shadcn/ui components
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI primitives with custom styling

## 2. Data Models and Entities

### 2.1 Core Entities Tracked

The system tracks the following main data entities:

1. **Colleges** - Multi-tenant organization units
2. **Students** - Event participants belonging to colleges
3. **Events** - Campus activities with scheduling and location data
4. **Registrations** - Student sign-ups for events
5. **Attendance** - Physical presence tracking for registered students
6. **Feedback** - Post-event ratings and comments from attendees

### 2.2 Data Relationships

```
College (1) ──── (M) Students
College (1) ──── (M) Events
Student (M) ──── (M) Events (via Registrations)
Registration (1) ──── (1) Attendance
Event (1) ──── (M) Feedback
Student (1) ──── (M) Feedback
```

## 3. Database Schema

### 3.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Colleges  │       │   Students  │       │   Events    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄─────┐│ id (PK)     │       │ id (PK)     │
│ name (UQ)   │      ├│ college_id  │       │ college_id  │◄─┐
└─────────────┘      ││ full_name   │       │ title       │  │
                     ││ email       │       │ event_type  │  │
                     │└─────────────┘       │ starts_at   │  │
                     │                      │ ends_at     │  │
                     │                      │ location    │  │
                     │                      └─────────────┘  │
                     │                                       │
                     │   ┌─────────────┐                     │
                     │   │Registrations│                     │
                     │   ├─────────────┤                     │
                     └──►│ id (PK)     │                     │
                         │ event_id    │◄────────────────────┘
                         │ student_id  │
                         │ registered_at│
                         └─────────────┘
                                │
                                │
                         ┌─────────────┐       ┌─────────────┐
                         │ Attendance  │       │  Feedback   │
                         ├─────────────┤       ├─────────────┤
                         │ id (PK)     │       │ id (PK)     │
                         │registration_│       │ event_id    │
                         │    _id (UQ) │       │ student_id  │
                         │ present     │       │ rating      │
                         │ marked_at   │       │ comment     │
                         └─────────────┘       │ given_at    │
                                               └─────────────┘
```

### 3.2 Table Specifications

#### Colleges Table
```sql
CREATE TABLE colleges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
```
- **Purpose**: Multi-tenant organization structure
- **Constraints**: Unique college names
- **Indexes**: Primary key on `id`, unique index on `name`

#### Students Table
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  college_id INT NOT NULL REFERENCES colleges(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  UNIQUE (college_id, email)
);
```
- **Purpose**: Student registration and identification
- **Constraints**: Unique email per college, foreign key to colleges
- **Validation**: Email format validation in application layer

#### Events Table
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  college_id INT NOT NULL REFERENCES colleges(id),
  title TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('Hackathon','Workshop','TechTalk','Fest','Seminar')),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL
);
```
- **Purpose**: Event scheduling and categorization
- **Constraints**: Valid event types, end time after start time
- **Timezone**: All timestamps stored as UTC with timezone

#### Registrations Table
```sql
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, student_id)
);
```
- **Purpose**: Student event sign-ups
- **Constraints**: Prevents duplicate registrations
- **Cascade**: Deletes when event or student is removed

#### Attendance Table
```sql
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  registration_id INT NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
  present BOOLEAN NOT NULL,
  marked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```
- **Purpose**: Physical presence tracking
- **Constraints**: One attendance record per registration
- **Business Rule**: Once marked present, cannot be revoked (implemented in application)

#### Feedback Table
```sql
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  given_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, student_id)
);
```
- **Purpose**: Post-event evaluation
- **Constraints**: One feedback per student per event, rating 1-5 scale
- **Optional**: Comments are nullable

## 4. API Design

### 4.1 Base URL Structure
```
Base URL: http://localhost:3001/api
Authentication: None (demo system)
Content-Type: application/json
```

### 4.2 Endpoint Specifications

#### 4.2.1 Colleges API

**POST /api/colleges**
- **Purpose**: Create a new college
- **Request**:
```json
{
  "name": "University of Technology"
}
```
- **Response** (201):
```json
{
  "id": 1,
  "name": "University of Technology"
}
```
- **Errors**: 400 (validation), 409 (duplicate name)

#### 4.2.2 Students API

**GET /api/students?collegeId={id}**
- **Purpose**: List students by college
- **Response** (200):
```json
[
  {
    "id": 1,
    "college_id": 1,
    "full_name": "John Doe",
    "email": "john.doe@university.edu"
  }
]
```

**POST /api/students**
- **Purpose**: Register a new student
- **Request**:
```json
{
  "collegeId": 1,
  "fullName": "Jane Smith",
  "email": "jane.smith@university.edu"
}
```
- **Response** (201): Student object
- **Errors**: 400 (validation), 409 (duplicate email)

#### 4.2.3 Events API

**GET /api/events?collegeId={id}**
- **Purpose**: List events for a college
- **Response** (200):
```json
[
  {
    "id": 1,
    "college_id": 1,
    "title": "Spring Hackathon 2025",
    "event_type": "Hackathon",
    "starts_at": "2025-04-15T09:00:00.000Z",
    "ends_at": "2025-04-16T18:00:00.000Z",
    "location": "Computer Science Building"
  }
]
```

**GET /api/events/{id}**
- **Purpose**: Get specific event details
- **Response** (200): Single event object
- **Errors**: 404 (not found)

**POST /api/events**
- **Purpose**: Create a new event
- **Request**:
```json
{
  "collegeId": 1,
  "title": "Spring Hackathon 2025",
  "eventType": "Hackathon",
  "startsAt": "2025-04-15T09:00:00.000Z",
  "endsAt": "2025-04-16T18:00:00.000Z",
  "location": "Computer Science Building"
}
```
- **Response** (201): Event object
- **Errors**: 400 (validation), 500 (server error)

#### 4.2.4 Registrations API

**GET /api/registrations?eventId={id}**
- **Purpose**: Get registrations for an event
- **Response** (200):
```json
[
  {
    "id": 1,
    "event_id": 1,
    "student_id": 1,
    "registered_at": "2025-04-01T10:30:00.000Z",
    "full_name": "John Doe",
    "email": "john.doe@university.edu"
  }
]
```

**GET /api/registrations?studentId={id}**
- **Purpose**: Get registrations for a student
- **Response** (200): Array of registrations with event details

**POST /api/registrations**
- **Purpose**: Register student for event
- **Request**:
```json
{
  "eventId": 1,
  "studentId": 1
}
```
- **Response** (201): Registration object
- **Errors**: 409 (duplicate), 400 (invalid IDs)

#### 4.2.5 Attendance API

**GET /api/attendance?eventId={id}**
- **Purpose**: Get attendance records for event
- **Response** (200):
```json
[
  {
    "id": 1,
    "registration_id": 1,
    "student_id": 1,
    "event_id": 1,
    "present": true,
    "marked_at": "2025-04-15T09:15:00.000Z"
  }
]
```

**POST /api/attendance/mark**
- **Purpose**: Mark student attendance
- **Request**:
```json
{
  "registrationId": 1,
  "present": true
}
```
- **Response** (201): Attendance object
- **Errors**: 400 (invalid data, cannot revoke presence)

#### 4.2.6 Feedback API

**GET /api/feedback?eventId={id}**
- **Purpose**: Get feedback for an event
- **Response** (200):
```json
[
  {
    "id": 1,
    "event_id": 1,
    "student_id": 1,
    "rating": 5,
    "comment": "Excellent event, well organized!",
    "given_at": "2025-04-16T19:00:00.000Z",
    "full_name": "John Doe",
    "email": "john.doe@university.edu"
  }
]
```

**POST /api/feedback**
- **Purpose**: Submit event feedback
- **Request**:
```json
{
  "eventId": 1,
  "studentId": 1,
  "rating": 5,
  "comment": "Great learning experience!"
}
```
- **Response** (201): Feedback object
- **Errors**: 400 (validation), 500 (server error)

#### 4.2.7 Reports API

**GET /api/reports/event-popularity?collegeId={id}**
- **Purpose**: Get event registration statistics
- **Response** (200):
```json
[
  {
    "event_id": 1,
    "title": "Spring Hackathon 2025",
    "registrations": 45
  }
]
```

**GET /api/reports/attendance?eventId={id}**
- **Purpose**: Get attendance percentage for event
- **Response** (200):
```json
{
  "event_id": 1,
  "title": "Spring Hackathon 2025",
  "attendance_percent": 87.5
}
```

**GET /api/reports/avg-feedback?eventId={id}**
- **Purpose**: Get average feedback rating
- **Response** (200):
```json
{
  "event_id": 1,
  "title": "Spring Hackathon 2025",
  "avg_rating": 4.3,
  "feedback_count": 25
}
```

**GET /api/reports/student-participation?collegeId={id}**
- **Purpose**: Get student attendance statistics
- **Response** (200):
```json
[
  {
    "student_id": 1,
    "full_name": "John Doe",
    "email": "john.doe@university.edu",
    "events_attended": 5
  }
]
```

#### 4.2.8 Dashboard API

**GET /api/dashboard/stats?collegeId={id}**
- **Purpose**: Get overview statistics for dashboard
- **Response** (200):
```json
{
  "totalEvents": 12,
  "eventsTrend": 15,
  "activeRegistrations": 234,
  "registrationsTrend": 8,
  "avgAttendance": 82,
  "attendanceTrend": 5,
  "avgSatisfaction": 86,
  "satisfactionTrend": 3
}
```

## 5. System Workflows

### 5.1 Event Registration → Attendance → Reporting Sequence

#### 5.1.1 Event Creation Workflow
```
Admin → Create Event Form → Validation → POST /api/events → Database Insert → Event Created
```

**Steps**:
1. Admin navigates to Create Event page
2. Fills form with title, type, dates, location
3. Client validates date range (end > start)
4. Submits POST request to `/api/events`
5. Server validates all fields and constraints
6. Creates event record in database
7. Returns event object or error

**Validation Rules**:
- All fields required
- Event type must be in allowed list
- End time must be after start time
- College ID must exist

#### 5.1.2 Student Registration Workflow
```
Student Discovery → Event Selection → Registration → Confirmation
```

**Steps**:
1. Student browses available events
2. Selects event of interest
3. Clicks register button
4. System checks for duplicate registration
5. Creates registration record
6. Sends confirmation to student

**Edge Cases**:
- Duplicate registration prevented by DB constraint
- Invalid student/event IDs handled with 400 error

#### 5.1.3 Attendance Marking Workflow
```
Event Day → Admin Attendance View → Student Selection → Mark Present → Record Saved
```

**Steps**:
1. Admin accesses attendance page for event
2. Views list of registered students
3. Marks students as present/absent
4. System creates attendance record
5. Once marked present, cannot be revoked

**Business Rules**:
- Only registered students can have attendance marked
- Presence marking is irreversible (data integrity)
- Absence can be changed to presence

#### 5.1.4 Feedback Collection Workflow
```
Event Completion → Feedback Form → Rating & Comments → Submission → Analytics Update
```

**Steps**:
1. Event ends, feedback becomes available
2. Students access feedback form
3. Provide 1-5 star rating and optional comments
4. System validates and stores feedback
5. Updates aggregate statistics

**Constraints**:
- One feedback per student per event
- Rating must be 1-5 range
- Comments optional, max 1000 characters

#### 5.1.5 Reporting Workflow
```
Data Collection → Analytics Processing → Report Generation → Dashboard Display
```

**Report Types**:
1. **Event Popularity**: Registration counts by event
2. **Attendance Analytics**: Attendance percentages
3. **Feedback Analysis**: Average ratings and comments
4. **Student Participation**: Individual attendance tracking

## 6. Assumptions and Edge Cases

### 6.1 System Assumptions

1. **Single Database Instance**: Multi-tenancy handled via `college_id` field
2. **No Authentication**: Demo system without user login/security
3. **No Capacity Limits**: Events have unlimited registration capacity
4. **No Payment Processing**: All events are free
5. **Manual Attendance**: No automated check-in systems
6. **Basic Notifications**: No email/SMS integration
7. **Single Admin Role**: No role-based access control

### 6.2 Data Integrity Assumptions

1. **Immutable Attendance**: Once marked present, cannot be changed
2. **Cascade Deletes**: Related records deleted when parent is removed
3. **Unique Constraints**: Prevent duplicate registrations and feedback
4. **Referential Integrity**: Foreign keys ensure valid relationships

### 6.3 Edge Cases Handled

#### 6.3.1 Registration Edge Cases
- **Duplicate Registration**: Prevented by DB unique constraint
- **Invalid Student/Event IDs**: Returns 400 error with clear message
- **Concurrent Registrations**: Database handles with ACID properties

#### 6.3.2 Attendance Edge Cases
- **Attendance Without Registration**: Prevented by foreign key constraint
- **Retroactive Attendance**: Allowed but timestamps preserved
- **Revoking Presence**: Blocked in application logic for data integrity

#### 6.3.3 Feedback Edge Cases
- **Multiple Feedback**: Prevented by unique constraint, updates existing
- **Feedback Without Attendance**: Allowed (may not have attended)
- **Invalid Ratings**: Constrained to 1-5 range in database

#### 6.3.4 Date/Time Edge Cases
- **Timezone Handling**: All stored as UTC, displayed in local time
- **Past Event Registration**: Not prevented (admin flexibility)
- **Overlapping Events**: Allowed (students can double-book)

#### 6.3.5 Reporting Edge Cases
- **No Data Scenarios**: Returns zero values or empty arrays
- **Division by Zero**: Handled in attendance percentage calculations
- **Large Result Sets**: No pagination implemented (demo limitation)

### 6.4 Known Limitations

1. **Scalability**: Single server, no load balancing
2. **Security**: No authentication or authorization
3. **Backup**: No automated backup strategy
4. **Monitoring**: No logging or health checks
5. **Validation**: Basic client-side validation only
6. **Internationalization**: English only, no multi-language support

## 7. Performance Considerations

### 7.1 Database Indexes
- Primary keys on all tables
- Unique indexes on email fields
- Consider indexing frequently queried foreign keys

### 7.2 Query Optimization
- Use of JOINs for related data fetching
- Aggregate functions for statistics
- Pagination recommended for large datasets

### 7.3 Caching Strategy
- Frontend uses TanStack Query for API response caching
- No server-side caching implemented
- Browser caching for static assets

---

*This design document serves as the technical specification for the EventHub campus event reporting system. It should be updated as the system evolves and new requirements are identified.*
