# PRD Backend — Portfolio App API (Node/Express)

- **Owner:** Safain A.
- **Version:** 1.0
- **Date:** 2026-03-07
- **Status:** Approved for MVP build

## 1) Objective
Menyediakan API backend stabil untuk:
1. Menyajikan data project + media
2. Mendukung search/filter di project list
3. Menangani contact submission
4. Menjaga keamanan dasar dan performa responsif

## 2) Stack & Dependencies
- Node.js + Express
- PostgreSQL
- `pg`, `dotenv`, `cors`
- Opsional: `helmet`, `express-rate-limit`, `zod`

## 3) API Scope (MVP)
- `GET /health`
- `GET /projects`
- `GET /projects/:slug`
- `POST /contact`

## 4) Data Model
### Table: `projects`
- `id` (PK)
- `slug` (unique, not null)
- `title` (not null)
- `summary`
- `industry`
- `role`
- `problem`
- `constraints`
- `approach`
- `result`
- `tools` (text[])
- `tags` (text[])
- `featured` (boolean)
- `published_at` (timestamp)

### Table: `project_media`
- `id` (PK)
- `project_id` (FK -> projects.id)
- `type` (`image|video|pdf|model`)
- `url`
- `thumbnail_url`
- `caption`
- `sort_order`

## 5) Endpoint Requirements
### `GET /health`
- Return status service (`{ ok: true }`).

### `GET /projects`
- Support query:
  - `q`: search by title/summary
  - `category`: filter by tag
- Sorting default:
  1) featured desc
  2) published_at desc
- Return list ringkas untuk cards.

### `GET /projects/:slug`
- Return full project detail.
- Include media array terurut `sort_order`.
- Return 404 jika tidak ditemukan.

### `POST /contact`
- Payload required: `name`, `email`, `message`
- Validate required fields + format email basic
- MVP action: log/store incoming message
- Return success/error JSON konsisten

## 6) Security Requirements
- Input validation semua endpoint write
- Basic rate limiting untuk `POST /contact`
- Set secure headers (`helmet` disarankan)
- Jangan expose private CAD/native assets endpoint
- CORS hanya origin frontend yang disetujui

## 7) Non-Functional Requirements
- p95 response time:
  - list/detail < 500ms (dataset MVP)
- Uptime target: 99% (hosting standard)
- Error handling terstandar (JSON + status code)
- Logging minimal untuk request error + contact events

## 8) Standard Response Format
### Success
```json
{
  "ok": true,
  "data": {}
}
```

### Error
```json
{
  "ok": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "..."
  }
}
```

## 9) Acceptance Criteria (DoD)
- Semua endpoint MVP berjalan stabil.
- Query search/filter mengembalikan hasil benar.
- Endpoint detail include media sesuai project.
- Contact endpoint tervalidasi dan tidak spam-prone dasar.
- Tidak ada crash pada malformed request umum.

## 10) Sprint Tasks (Backend)
### Sprint 1
- Setup Express app + env + health endpoint
- Setup PostgreSQL connection
- Buat schema migration awal

### Sprint 2
- Build `GET /projects` + `GET /projects/:slug`
- Implement query search/filter + sorting
- Seed data sample

### Sprint 3
- Build `POST /contact` + validation
- Tambah rate limiting + helmet
- Standardize response + error handler middleware

### Sprint 4
- QA API + test manual endpoint
- Perf sanity check
- Deploy backend + DB + env hardening

## 11) Risks & Mitigation
- **Model data cepat berubah** → pisahkan contract dan migration jelas
- **Spam contact** → rate limiting + honeypot (phase 2)
- **Heavy media coupling** → simpan URL metadata saja, bukan file biner di DB
