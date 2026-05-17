# SkillSwap API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Create a user and receive JWT |
| POST | `/auth/login` | Public | Login and receive JWT |
| GET | `/auth/me` | Protected | Return current user |

Protected routes require:

```http
Authorization: Bearer <token>
```

## Users

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/users` | Protected | List active users |
| GET | `/users/:id` | Protected | View public profile |
| PUT | `/users/me/profile` | Protected | Update bio and skills |
| POST | `/users/:id/report` | Protected | Report a user |

## Skill Listings

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/skills?search=&category=` | Public | Search and filter skills |
| GET | `/skills/:id` | Public | View one skill |
| POST | `/skills` | Protected | Create skill offer with optional PDF |
| PUT | `/skills/:id` | Owner | Update skill offer |
| DELETE | `/skills/:id` | Owner | Soft-delete skill offer |

Create skill requests can be JSON or `multipart/form-data`. For PDF uploads, send fields like `title`, `description`, `category`, `level`, `outcomes`, `lessons`, `thumbnailUrl`, `creditsPerHour`, `availability`, and file field `material`. Uploaded PDFs are stored locally under the backend container volume and served from `/uploads/skill-materials/...`.

Skill offers behave like lightweight courses. Each skill can include:

- `level`: Beginner, Intermediate, or Advanced
- `outcomes`: learning outcomes shown on the course detail page
- `lessons`: embedded curriculum items with `title`, `contentType`, and `contentData`
- `thumbnailUrl`: optional course banner image

## Bookings

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/bookings` | Protected | Request a session |
| GET | `/bookings/mine` | Protected | List learner/teacher bookings |
| PATCH | `/bookings/:id/status` | Participant | Accept with resource link, reject, complete, or cancel |

Teacher accepts a pending booking by sending `status: "accepted"` and `learningResourceUrl`, such as a YouTube or Google Drive class link. The learner opens the material and marks the accepted booking as `completed`. Completing an accepted booking transfers credits from learner to teacher.

## Reviews, Credits, Notifications

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/reviews` | Protected | Review completed booking |
| GET | `/reviews/user/:userId` | Protected | List user reviews |
| GET | `/transactions/mine` | Protected | Credit transaction history |
| GET | `/notifications` | Protected | List notifications |
| PATCH | `/notifications/:id/read` | Protected | Mark notification read |

## Admin

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/admin/analytics` | Admin | Platform metrics |
| GET | `/admin/users` | Admin | Manage users |
| PATCH | `/admin/users/:id/active` | Admin | Enable or disable user |
