# KUANA API Documentation

Base URL: `https://kuana.org/api` (production) · `https://staging.kuana.org/api` (staging) · `http://localhost:4000/api` (local)

---

## Authentication

All write operations and sensitive read operations require a JWT Bearer token obtained from `/api/auth/login`.

**Header format:**
```
Authorization: Bearer <token>
```

Tokens expire after **8 hours**. There is no refresh endpoint — re-authenticate to obtain a new token.

---

## Rate Limits

| Scope | Limit |
|---|---|
| Global (all endpoints) | 200 requests / 15 min per IP |
| `POST /auth/login` | 10 requests / 15 min per IP |
| `POST /alumni/register` | 10 requests / hour per IP |
| `POST /contact` | 5 requests / hour per IP |
| `POST /donations` | 10 requests / hour per IP |
| Authenticated writes (POST/PUT/DELETE) | 60 requests / 15 min per IP |

Exceeded limits return `429 Too Many Requests`.

---

## Endpoints

- [Auth](#auth)
- [Events](#events)
- [Alumni](#alumni)
- [Contact](#contact)
- [Donations](#donations)
- [Media](#media)
- [Health](#health)

---

## Auth

### POST /auth/login

Authenticate as an admin. Returns a JWT token valid for 8 hours.

**Authentication:** None required

**Request body:**
```json
{
  "email": "admin@kuana.org",
  "password": "your-password"
}
```

**Success response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "name": "Kushan Maskey",
    "email": "admin@kuana.org",
    "role": "admin"
  }
}
```

**Error responses:**
```json
{ "error": "Email and password required" }           // 400
{ "error": "Invalid credentials" }                   // 401
{ "error": "Too many login attempts..." }            // 429
```

---

## Events

### GET /events

Returns all published events ordered by date descending.

**Authentication:** None required

**Success response `200`:**
```json
[
  {
    "id": 3,
    "title": "KUANA Reunion 2027",
    "description": "Join us in Boston, MA for the third biennial reunion...",
    "event_date": "2027-09-04",
    "end_date": "2027-09-04",
    "city": "Boston",
    "state_province": "MA",
    "country": "USA",
    "venue": null,
    "venue_address": null,
    "registration_url": null,
    "image_url": null,
    "is_featured": true,
    "is_published": true,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2026-07-28T18:00:00.000Z"
  },
  {
    "id": 1,
    "title": "KUANA Reunion 2025",
    "description": "Our second biennial reunion bringing together KU alumni...",
    "event_date": "2025-08-30",
    "end_date": "2025-08-31",
    "city": "Lewisville",
    "state_province": "TX",
    "country": "USA",
    "venue": "Hilton Garden Inn Dallas Lewisville",
    "venue_address": "785 State Hwy 121, Lewisville, TX 75067",
    "registration_url": null,
    "image_url": null,
    "is_featured": false,
    "is_published": true,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2026-07-28T18:00:00.000Z"
  }
]
```

---

### GET /events/:id

Returns a single event by ID.

**Authentication:** None required

**URL parameters:**

| Param | Type | Description |
|---|---|---|
| `id` | integer | Event ID (positive integer) |

**Success response `200`:**
```json
{
  "id": 2,
  "title": "KUANA Reunion 2023",
  "description": "Inaugural KUANA reunion — the first gathering of Kathmandu University Alumni in North America.",
  "event_date": "2023-09-01",
  "end_date": null,
  "city": "Trophy Club",
  "state_province": "TX",
  "country": "USA",
  "venue": "Holiday Inn Trophy Club by IHG",
  "venue_address": "725 Plaza Dr, Trophy Club, TX 76262",
  "registration_url": null,
  "image_url": null,
  "is_featured": false,
  "is_published": true
}
```

**Error responses:**
```json
{ "error": "Invalid event ID" }    // 400
{ "error": "Not found" }           // 404
```

---

### POST /events

Create a new event.

**Authentication:** Required

**Request body:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | string | Yes | Max 200 chars |
| `event_date` | string | Yes | Format: `YYYY-MM-DD` |
| `city` | string | Yes | Max 100 chars |
| `state_province` | string | Yes | Max 100 chars |
| `description` | string | No | Max 5000 chars |
| `end_date` | string | No | Format: `YYYY-MM-DD` |
| `country` | string | No | Max 100 chars |
| `venue` | string | No | Max 200 chars |
| `venue_address` | string | No | Max 300 chars |
| `registration_url` | string | No | Must start with `http://` or `https://` |
| `image_url` | string | No | Must start with `http://` or `https://` |
| `is_featured` | boolean | No | Default: `false` |
| `is_published` | boolean | No | Default: `true` |

**Example request:**
```json
{
  "title": "KUANA Reunion 2029",
  "description": "The fourth biennial reunion of Kathmandu University Alumni North America.",
  "event_date": "2029-09-05",
  "end_date": "2029-09-06",
  "city": "Chicago",
  "state_province": "IL",
  "country": "USA",
  "venue": "Hyatt Regency Chicago",
  "venue_address": "151 E Wacker Dr, Chicago, IL 60601",
  "registration_url": "https://kuana.org/register/2029",
  "is_featured": false,
  "is_published": false
}
```

**Success response `201`:**
```json
{
  "id": 4,
  "title": "KUANA Reunion 2029",
  "event_date": "2029-09-05",
  "end_date": "2029-09-06",
  "city": "Chicago",
  "state_province": "IL",
  "is_featured": false,
  "is_published": false
}
```

**Error responses:**
```json
{ "error": "title, event_date, city, and state_province are required" }           // 400
{ "error": "event_date must be a valid date (YYYY-MM-DD)" }                       // 400
{ "error": "registration_url must be a valid URL starting with http(s)://" }      // 400
{ "error": "Unauthorized" }                                                        // 401
```

---

### PUT /events/:id

Update an existing event. All fields must be provided.

**Authentication:** Required

**URL parameters:** `id` — integer, event ID

**Request body:** Same fields as `POST /events`

**Success response `200`:** Updated event object

**Error responses:**
```json
{ "error": "Invalid event ID" }    // 400
{ "error": "Not found" }           // 404
```

---

### DELETE /events/:id

Delete an event permanently.

**Authentication:** Required

**URL parameters:** `id` — integer, event ID

**Success response `200`:**
```json
{ "success": true }
```

**Error responses:**
```json
{ "error": "Invalid event ID" }    // 400
{ "error": "Not found" }           // 404
```

---

### PATCH /events/:id/featured

Toggle the featured status of an event. Featured events are highlighted on the public Events section.

**Authentication:** Required

**URL parameters:** `id` — integer, event ID

**Request body:**
```json
{ "is_featured": true }
```

| Field | Type | Required | Description |
|---|---|---|---|
| `is_featured` | boolean | Yes | `true` to feature the event, `false` to unfeature |

**Success response `200`:** Updated event object

**Error responses:**
```json
{ "error": "Invalid event ID" }                    // 400
{ "error": "is_featured must be a boolean" }       // 400
{ "error": "Not found" }                           // 404
{ "error": "Unauthorized" }                        // 401
```

---

## Alumni

### GET /alumni

Returns a paginated list of active alumni. Supports search and filtering.

**Authentication:** Required

**Query parameters:**

| Param | Type | Description | Constraints |
|---|---|---|---|
| `search` | string | Search by first name, last name, or email | Max 100 chars |
| `year` | integer | Filter by graduation year | 1991 – current year + 1 |
| `city` | string | Filter by city (partial match) | Max 100 chars |
| `page` | integer | Page number | Default: 1, 50 results/page |

**Example requests:**
```
GET /alumni?page=1
GET /alumni?search=Maskey
GET /alumni?year=2015&city=Dallas
GET /alumni?search=kushan&page=2
```

**Success response `200`:**
```json
[
  {
    "id": 1,
    "first_name": "Kushan",
    "last_name": "Maskey",
    "email": "kushan@example.com",
    "phone": "+1-214-555-0100",
    "graduation_year": 2010,
    "degree": "B.E. Computer Engineering",
    "department": "Computer Science and Engineering",
    "city": "Dallas",
    "state_province": "TX",
    "country": "USA",
    "linkedin_url": "https://www.linkedin.com/in/kushanmaskey/",
    "created_at": "2025-08-30T14:00:00.000Z"
  }
]
```

---

### POST /alumni/register

Register a new alumni member. Public endpoint.

**Authentication:** None required

**Request body:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `first_name` | string | Yes | Max 100 chars |
| `last_name` | string | Yes | Max 100 chars |
| `email` | string | Yes | Valid email format |
| `phone` | string | No | — |
| `graduation_year` | integer | No | 1991 – current year + 1 |
| `degree` | string | No | e.g. `B.E. Computer Engineering` |
| `department` | string | No | e.g. `Computer Science and Engineering` |
| `city` | string | No | — |
| `state_province` | string | No | e.g. `TX` |
| `country` | string | No | Default: `USA` |
| `bio` | string | No | Max 1000 chars |
| `linkedin_url` | string | No | — |

**Example request:**
```json
{
  "first_name": "Sajan",
  "last_name": "Shrestha",
  "email": "sajan.shrestha@example.com",
  "phone": "+1-972-555-0142",
  "graduation_year": 2012,
  "degree": "B.E. Electronics Engineering",
  "department": "Electronics and Computer Engineering",
  "city": "Lewisville",
  "state_province": "TX",
  "country": "USA",
  "linkedin_url": "https://www.linkedin.com/in/sajanshrestha/"
}
```

**Success response `201`:**
```json
{
  "success": true,
  "alumni": {
    "id": 42,
    "first_name": "Sajan",
    "last_name": "Shrestha",
    "email": "sajan.shrestha@example.com"
  }
}
```

**Error responses:**
```json
{ "error": "First name, last name, and email are required" }    // 400
{ "error": "Invalid email address" }                            // 400
{ "error": "Invalid graduation year" }                          // 400
{ "error": "Email already registered" }                         // 409
```

---

### PUT /alumni/:id

Update an alumni profile.

**Authentication:** Required

**URL parameters:** `id` — integer, alumni ID

**Request body:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `first_name` | string | Yes | Max 100 chars |
| `last_name` | string | Yes | Max 100 chars |
| `phone` | string | No | — |
| `graduation_year` | integer | No | 1991 – current year + 1 |
| `degree` | string | No | — |
| `department` | string | No | — |
| `city` | string | No | — |
| `state_province` | string | No | — |
| `country` | string | No | — |
| `bio` | string | No | Max 1000 chars |
| `linkedin_url` | string | No | — |
| `is_active` | boolean | No | Default: `true` |

**Success response `200`:**
```json
{
  "id": 42,
  "first_name": "Sajan",
  "last_name": "Shrestha",
  "email": "sajan.shrestha@example.com",
  "city": "Lewisville",
  "graduation_year": 2012
}
```

---

### DELETE /alumni/:id

Soft-delete an alumni record (sets `is_active = false`).

**Authentication:** Required

**Success response `200`:**
```json
{ "success": true }
```

---

## Contact

### POST /contact

Submit a contact form message. Sends an email notification to the KUANA team.

**Authentication:** None required

**Request body:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | Yes | Max 200 chars |
| `email` | string | Yes | Valid email format |
| `subject` | string | No | Max 255 chars |
| `message` | string | Yes | Max 5000 chars |

**Example request:**
```json
{
  "name": "Dipendra Bantawa",
  "email": "dipendra.bantawa@example.com",
  "subject": "Question about KUANA Reunion 2027 registration",
  "message": "Hello KUANA team,\n\nI wanted to ask when registration for the 2027 Boston reunion will open. Please let me know.\n\nThank you!"
}
```

**Success response `200`:**
```json
{
  "success": true,
  "message": "Your message has been received. We will get back to you soon!"
}
```

**Error responses:**
```json
{ "error": "Name, email, and message are required" }    // 400
{ "error": "Invalid email address" }                    // 400
{ "error": "Input too long" }                           // 400
```

---

### GET /contact

Returns paginated list of all contact messages.

**Authentication:** Required

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `page` | integer | Page number, default 1. 50 results/page. |

**Success response `200`:**
```json
[
  {
    "id": 5,
    "name": "Dipendra Bantawa",
    "email": "dipendra.bantawa@example.com",
    "subject": "Question about KUANA Reunion 2027 registration",
    "message": "Hello KUANA team...",
    "is_read": false,
    "created_at": "2026-07-28T19:30:00.000Z"
  }
]
```

---

### PATCH /contact/:id/read

Mark a contact message as read.

**Authentication:** Required

**URL parameters:** `id` — integer, message ID

**Success response `200`:**
```json
{ "success": true }
```

**Error responses:**
```json
{ "error": "Invalid message ID" }    // 400
{ "error": "Not found" }             // 404
```

---

### PATCH /contact/:id/unread

Mark a contact message as unread.

**Authentication:** Required

**URL parameters:** `id` — integer, message ID

**Success response `200`:**
```json
{ "success": true }
```

**Error responses:**
```json
{ "error": "Invalid message ID" }    // 400
{ "error": "Not found" }             // 404
```

---

## Donations

### POST /donations

Record a completed donation.

**Authentication:** None required

**Request body:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `donor_name` | string | Yes | Max 200 chars |
| `donor_email` | string | Yes | Valid email format |
| `amount` | number | Yes | > 0, ≤ 100,000 |
| `currency` | string | No | Default: `USD` |
| `purpose` | string | No | Max 200 chars |
| `message` | string | No | Max 1000 chars |
| `payment_reference` | string | No | External payment ID |
| `payment_method` | string | No | e.g. `zelle`, `venmo`, `paypal` |

**Example request:**
```json
{
  "donor_name": "Rajan Rijal",
  "donor_email": "rajan.rijal@example.com",
  "amount": 250.00,
  "currency": "USD",
  "purpose": "KUANA Reunion 2027 Fund",
  "message": "Happy to contribute to the Boston reunion!",
  "payment_reference": "ZL-20260728-00145",
  "payment_method": "zelle"
}
```

**Success response `201`:**
```json
{
  "success": true,
  "donation": {
    "id": 18,
    "amount": "250.00",
    "donor_name": "Rajan Rijal"
  }
}
```

**Error responses:**
```json
{ "error": "Name, email, and amount are required" }    // 400
{ "error": "Invalid email address" }                   // 400
{ "error": "Invalid donation amount" }                 // 400
```

---

### GET /donations

Returns a paginated list of all donations.

**Authentication:** Required

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `page` | integer | Page number, default 1. 50 results/page. |

**Success response `200`:**
```json
[
  {
    "id": 18,
    "alumni_id": 1,
    "donor_name": "Rajan Rijal",
    "donor_email": "rajan.rijal@example.com",
    "amount": "250.00",
    "currency": "USD",
    "purpose": "KUANA Reunion 2027 Fund",
    "message": "Happy to contribute to the Boston reunion!",
    "payment_reference": "ZL-20260728-00145",
    "payment_method": "zelle",
    "status": "completed",
    "donated_at": "2026-07-28T20:00:00.000Z",
    "first_name": "Rajan",
    "last_name": "Rijal"
  }
]
```

---

### GET /donations/stats

Returns aggregated donation statistics.

**Authentication:** Required

**Success response `200`:**
```json
{
  "total_donations": "47",
  "total_amount": "12350.00",
  "average_amount": "262.77",
  "unique_donors": "39"
}
```

---

## Media

### GET /media

Returns all published media entries.

**Authentication:** None required

**Query parameters:**

| Param | Type | Description | Constraints |
|---|---|---|---|
| `type` | string | Filter by type | Must be `photo` or `video` |
| `event_id` | integer | Filter by event | Positive integer |

**Example requests:**
```
GET /media
GET /media?type=photo
GET /media?type=video&event_id=1
```

**Success response `200`:**
```json
[
  {
    "id": 3,
    "title": "Keynote Address — Reunion 2025",
    "description": "Prof. Wagle delivering the keynote address",
    "media_type": "photo",
    "url": "https://kuana.org/assets/img/speakers/keynote.jpg",
    "thumbnail_url": null,
    "event_id": 1,
    "year": 2025,
    "city": "Lewisville",
    "is_published": true,
    "sort_order": 0,
    "created_at": "2025-09-01T12:00:00.000Z",
    "event_title": "KUANA Reunion 2025"
  }
]
```

**Error responses:**
```json
{ "error": "type must be one of: photo, video" }    // 400
{ "error": "Invalid event_id" }                      // 400
```

---

### POST /media

Create a new media entry.

**Authentication:** Required

**Request body:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | string | Yes | Max 200 chars |
| `media_type` | string | Yes | Must be `photo` or `video` |
| `url` | string | Yes | Valid URL (`http://` or `https://`) |
| `description` | string | No | Max 1000 chars |
| `thumbnail_url` | string | No | Valid URL |
| `event_id` | integer | No | Must match an existing event ID |
| `year` | integer | No | e.g. `2025` |
| `city` | string | No | e.g. `Lewisville` |
| `is_published` | boolean | No | Default: `true` |
| `sort_order` | integer | No | Default: `0` |

**Example request:**
```json
{
  "title": "Group Photo — Reunion 2025",
  "description": "All attendees gathered at the Hilton Garden Inn Lewisville",
  "media_type": "photo",
  "url": "https://kuana.org/assets/img/gallery/2025/group_photo.jpg",
  "thumbnail_url": "https://kuana.org/assets/img/gallery/2025/thumbs/group_photo.jpg",
  "event_id": 1,
  "year": 2025,
  "city": "Lewisville",
  "is_published": true,
  "sort_order": 1
}
```

**Success response `201`:** Full media object

**Error responses:**
```json
{ "error": "title, media_type, and url are required" }                      // 400
{ "error": "media_type must be one of: photo, video" }                      // 400
{ "error": "url must be a valid URL starting with http(s)://" }             // 400
```

---

### DELETE /media/:id

Delete a media entry.

**Authentication:** Required

**URL parameters:** `id` — integer, media ID

**Success response `200`:**
```json
{ "success": true }
```

**Error responses:**
```json
{ "error": "Invalid media ID" }    // 400
{ "error": "Not found" }           // 404
```

---

## Health

### GET /health

Service health check.

**Authentication:** None required

**Success response `200`:**
```json
{
  "status": "ok",
  "service": "KUANA API"
}
```

---

## Common Error Codes

| Status | Meaning |
|---|---|
| `400 Bad Request` | Missing required field, invalid format, or value out of range |
| `401 Unauthorized` | Missing or invalid/expired JWT token |
| `403 Forbidden` | Action not permitted (e.g. setup in production) |
| `404 Not Found` | Record does not exist |
| `409 Conflict` | Duplicate entry (e.g. email already registered) |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server-side error |
