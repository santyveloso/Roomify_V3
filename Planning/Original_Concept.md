# Original Concept

# What Roomify V1 was

**Purpose:** a course project to manage houses and rooms for students.

**Core capabilities (V1)**

* User registration and login (basic).
* CRUD for houses and rooms.
* Associate users to rooms.
* Simple UI to view house state; limited UX polish.

**V1 stack**

* Frontend: React (no framework details available).
* Backend: Django (monolith), default SQLite/Postgres unclear.
* Auth: Django built‑in auth.
* Storage: local or Django-backed static file serving.
* Infra: academic, not production-ready.

**Limitations observed**

* Tight coupling between frontend and backend; no clear API contract.
* No formal migration/test strategy.
* Minimal security controls and no CI/CD.
* UX and product polish lacking.
