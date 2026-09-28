# Searchwyz_BE — Project Documentation

**Project Name:** Searchwyz_BE  
**Project Type:** Backend for a Missing Person Search and Location Prioritization System  
**Author:** [Your Name]  
**Date:** [Today's Date]  
**Version:** 1.0  
**Branch:** backend-setup

---

## 1. Overview

Searchwyz_BE is the backend of a **Missing Person Search and Location Prioritization System**.

The system is designed for reporting, managing, and investigating missing-person cases. It collects missing-person information, photographs, and reported sightings from the public and stores them in one centralized platform.

The main feature of the system is **automatic location prioritization**. When people submit sightings, each sighting includes a location. The system counts how many sightings were reported for each location. The location with the most reports is shown as the top-ranked search location (rank 1). This gives the admin and the reporter a simple, evidence-based view of where search efforts should be focused.

This version does **not** use AI. The ranking is not machine learning. It is simply counting and sorting reported locations per case.

The system is a **decision-support tool**. It does not claim to know the missing person’s exact real-time location. Final investigation remains with the authorized human responders.

---

## 2. Users and Roles

There are three primary user groups.

### 2.1 Public User (no login required)

A public user does not need an account.

They can:

- View verified missing-person cases.
- Search for missing persons by name, age range, gender, location, and case status.
- View the public details of a case: photograph, name, age, physical description, clothing last seen wearing, last-known location, date last seen, time last seen, and instructions for submitting information.
- Submit a sighting via a popup.

The popup asks for:

- Location where the person was seen.
- Date the person was seen.
- Time the person was seen.
- Description of what was observed.

A public user cannot:

- Edit a clue after submitting it.
- Access any user profile.
- Access admin routes.
- Access sensitive or private information.

### 2.2 Registered Reporter (user)

A registered reporter may be a family member, an authorized individual, or an organization permitted to submit a missing-person case.

They can:

- Register an account (full name, email, phone, password).
- Log in and log out.
- Create a missing-person case with:
  - Full name of the missing person.
  - Age.
  - Gender.
  - Height.
  - Physical description.
  - Clothing last seen wearing.
  - A recent photograph (uploaded via Cloudinary).
  - Last-known location.
  - Date last seen.
  - Time last seen.
  - Additional relevant information.
- View the status of their submitted case.
- View the clue summary and the top reported locations for their case.
- Reset their password via OTP.

A reporter cannot:

- Approve their own case.
- Verify or reject clues.
- Access the admin dashboard.
- Access other users’ profiles.

### 2.3 Administrator / Investigator

The admin has elevated privileges. Admin accounts are created by a backend seed script, not by public registration. Admin logs in through the same login endpoint as a user, but the backend routes them to the admin dashboard.

The admin can:

- Review newly submitted cases that are marked Pending Verification.
- Approve a case so it becomes publicly searchable.
- Reject a case.
- Request additional information from the reporter.
- Review submitted clues.
- Verify a clue, reject a clue, or mark it as Requires Review.
- Remove spam, false, fraudulent, or inappropriate reports.
- Update the case status to:
  - Pending Verification
  - Active (Search Still On)
  - Under Investigation
  - Person Found
  - Closed
  - Rejected
- Mark a person as Found.
- View the automatic location counts and ranking for any case.
- View dashboard totals: total cases, pending cases, active cases, resolved cases, pending clues, verified clues.
- View registered users.
- Restrict inappropriate user accounts.
- Manage system information.

The admin does not deal with AI. The ranking is automatic counting.

---

## 3. Features

### 3.1 Authentication

- Register a new user.
- Login for both users and admins using the same endpoint.
- Access token and refresh token issued on login.
- Cookies used for session handling.
- Refresh endpoint to get a new access token.
- Get current user (`/me`).
- Logout (this session).
- Logout from all devices.

### 3.2 Missing Person Cases

- Reporters create missing-person cases.
- Cases start with status **Pending Verification**.
- Admin approves or rejects cases.
- Only approved cases are publicly searchable.
- Reporters can see the status of their own case.

### 3.3 Photographs

- A recent photograph is uploaded with each case.
- Photos are stored on Cloudinary.
- Each photo is linked to its case and to the uploader.

### 3.4 Clues / Sightings

- Public users submit sightings via a popup.
- A clue contains:
  - Location.
  - Date.
  - Time.
  - Description.
- Clues cannot be edited after submission.
- Admin reviews each clue.
- Clue statuses: Pending, Verified, Rejected, Requires Review.

### 3.5 Location Prioritization

- The system counts how many clues were submitted for each location.
- Locations are sorted from highest count to lowest.
- The most-reported location becomes rank 1.
- The ranking is shown to admin and to the reporter of that case.
- Public users do not see the ranking.

### 3.6 Dashboards

- Admin dashboard: totals of cases, clues, and rankings.
- Reporter dashboard: their cases, their clues, and their ranking.

### 3.7 Sharing (planned)

- Generate a shareable missing-person link.
- Share picture and information together for social media.

---

## 4. System Architecture

### 4.1 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js (ES6 modules)
- **Database:** MongoDB with Mongoose
- **Photos:** Cloudinary
- **Email:** Nodemailer (real email, Gmail app password)
- **Validation:** Zod
- **Logging:** Winston with MongoDB transports
- **Security:** Helmet, CORS whitelist, bcrypt, JWT
- **Documentation:** Swagger (planned)


### 4.3 Data Models

**User**

- Full name, email, phone.
- Password (hashed).
- Role: `user`.
- Account status: `active` or `restricted`.
- OTP fields for password reset.
- Refresh tokens array (hashed token, user agent, IP, expiry).

**Admin**

- Full name, email.
- Password (hashed).
- Role: `admin` or `investigator`.
- Refresh tokens array.

**Case**

- Missing person details (name, age, gender, height, description, clothing).
- Photograph reference.
- Last-known location, date last seen, time last seen.
- Additional information.
- Reporter ID.
- Status.
- Embedded clues array.

**Photo**

- Cloudinary URL and public ID.
- Format and size.
- Linked to case and uploader.

---

## 5. API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/logout-all`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`

### Public (planned)

- `GET /api/public/cases`
- `GET /api/public/cases/:id`
- `POST /api/public/cases/:id/clues`

### User (planned)

- `POST /api/user/cases`
- `GET /api/user/cases`
- `GET /api/user/cases/:id`
- `GET /api/user/dashboard`

### Admin (planned)

- `GET /api/admin/cases/pending`
- `PATCH /api/admin/cases/:id/approve`
- `PATCH /api/admin/cases/:id/reject`
- `PATCH /api/admin/cases/:id/status`
- `GET /api/admin/clues`
- `PATCH /api/admin/clues/:id/status`
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/restrict`

---

## 6. Workflow

1. Reporter registers.
2. Reporter logs in.
3. Reporter creates a missing-person case with a photo.
4. Case is submitted for verification.
5. Admin reviews the case.
6. Admin approves or rejects it.
7. Approved case becomes publicly searchable.
8. Public users submit sightings via the popup.
9. Admin reviews and verifies clues.
10. The system counts locations automatically.
11. The most-reported location is shown as rank 1.
12. Admin and reporter view the ranking.
13. Admin updates the case status when new information arrives.
14. When the person is found, admin marks the case as **Person Found**.

---

## 7. Security and Privacy

- Passwords are hashed with bcrypt.
- Access tokens are short-lived JWTs.
- Refresh tokens are hashed in the database.
- Cookies are `httpOnly`, `sameSite: "lax"`, and `secure` in production.
- CORS whitelist is enforced.
- Helmet sets secure HTTP headers.
- Zod validates all input.
- Sensitive information is not exposed publicly.
- Private addresses and room numbers are never displayed.
- Users cannot access other users’ profiles.
- Unverified sightings are never treated as established facts.
- The system is a decision-support tool, not a tracking tool.

---

## 8. What Has Been Done (Day 1)

- Project setup with ES6 modules.
- Folder structure.
- Configuration (`CONFIG`, `CORS_WHITELISTS`, `CONSTANTS`).
- MongoDB connection.
- Cloudinary config.
- Nodemailer config (real email).
- Winston logger with dev and production transports.
- Models: User, Admin, Case, Photo.
- Admin seed script.
- Authentication:
  - Register.
  - Login (user and admin through the same route).
  - Refresh.
  - Get me.
  - Logout (this session).
  - Logout all devices.
- Access token (2 minutes) and refresh token (3 minutes), refresh tokens hashed in DB.
- Cookies for `accessToken` and `refreshToken`.
- Multiple session handling with a single active session rule.
- Role-based middleware (user vs admin/investigator).
- CORS whitelist from env.
- Zod validation for auth routes.
- Forgot password flow:
  - OTP by email.
  - Verify OTP.
  - Reset password.
  - Resend cooldown (1 minute).
  - OTP expiry (1 minute).
- Global error handler and 404 handler.
- Route index mounting `/api/public`, `/api/auth`, `/api/user`, `/api/admin`.

---

## 9. What Remains

### Day 2 — Cases and Photos

- Endpoint for a reporter to create a missing-person case.
- Cloudinary photo upload and storage.
- Link the photo to the case.
- Case starts as Pending Verification.
- Admin endpoints for pending cases, approve, reject, and request info.
- Case status management endpoint.
- Public endpoints to search verified cases and view case details.
- Wire new routes into the route index.

### Day 3 — Clues, Ranking, Dashboards

- Public clue submission via popup.
- Clue statuses and verification by admin.
- Automatic location counting and ranking per case.
- Admin dashboard endpoints.
- Reporter dashboard endpoints.
- User management endpoints.

### Day 4 — Sharing, Swagger, Testing

- Generate a shareable missing-person link.
- Share picture and information together for social media.
- Swagger documentation.
- Full end-to-end testing.
- Cleanup and SRS update.

### Later (not in the first prototype)

- Notification model.
- AuditLog model.
- AI-based search prioritization.
- SMS alerts.
- Mobile application.
- Official database integrations.
- Advanced geospatial modelling.

---

## 10. Case Statuses

- Pending Verification — newly submitted, awaiting admin review.
- Active / Search Still On — approved, publicly searchable, still missing.
- Under Investigation — actively being worked on.
- Person Found — located.
- Closed — closed for other reasons.
- Rejected — not valid, not shown publicly.

---

## 11. Clue Statuses

- Pending — newly submitted, awaiting admin review.
- Verified — confirmed by admin, counts toward ranking.
- Rejected — not credible or not relevant, does not count.
- Requires Review — needs more investigation before being verified or rejected.

---

## 12. Future Enhancements

- Advanced computer-vision-assisted identification.
- Integration with authorized CCTV systems.
- Integration with official missing-person databases.
- Mobile application support.
- SMS notifications.
- Emergency alerts.
- Improved geospatial modelling.
- More sophisticated machine-learning models.
- Multilingual support.
- Improved witness credibility mechanisms.
- Voluntary “I am safe” confirmation functionality.

---

## 13. Glossary

- **Case** — a missing-person report.
- **Clue / Sighting** — information submitted by the public about a possible sighting.
- **Ranking** — the list of locations sorted by the number of reports.
- **Access token** — short-lived token used to access protected endpoints.
- **Refresh token** — longer-lived token used to obtain a new access token.
- **Rank 1** — the location with the most reports.