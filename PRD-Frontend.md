# PRD Frontend — Portfolio App (React)

- **Owner:** Safain A.
- **Version:** 1.0
- **Date:** 2026-03-07
- **Status:** Approved for MVP build

## 1) Objective
Membangun antarmuka portfolio web yang visual-led, cepat, dan profesional untuk menampilkan karya 2D drafting + 3D design dengan narasi engineering yang jelas.

## 2) Stack & Dependencies
- React + Vite
- Tailwind CSS
- React Router
- Axios/fetch
- Opsional 3D: `three`, `@react-three/fiber`, `@react-three/drei`

## 3) In Scope (MVP)
- `/` Home
- `/projects` Projects list (search + filter)
- `/projects/:slug` Project detail
- `/about` About
- `/contact` Contact form

### Komponen inti
- Navbar, Footer
- Hero
- ProjectCard
- FilterBar + SearchInput
- MediaGallery
- ContactForm
- (Opsional) ModelViewer3D + fallback block

## 4) Functional Requirements
1. Menampilkan daftar project dari API backend.
2. Search berdasarkan title/summary/tag.
3. Filter berdasarkan kategori/tag.
4. Menampilkan detail project dengan section wajib:
   - Problem
   - Constraints
   - Approach
   - Result
   - Tools
   - Media
5. Menampilkan media: image/video/pdf/model (jika tersedia).
6. Jika model 3D tidak didukung/performa rendah, tampilkan fallback image/video.
7. Submit contact form ke backend endpoint.
8. Menampilkan state: loading, empty, error, success.

## 5) UI/UX Requirements
- Clean editorial feel (referensi Behance style)
- Strong typography, whitespace lega
- Mobile-first responsive
- Visual hierarchy kuat pada project detail
- CTA jelas di Home dan Contact

### UI References Source
- Semua gambar referensi UI disimpan pada folder:
  `C:\Users\a_sfn\@Project\Portofolio\References`
- Folder `References` menjadi acuan visual utama untuk:
  - layout direction
  - komposisi section
  - style card project
  - treatment typography/spacing
- Requirement implementasi:
  - Saat membuat halaman Home/Projects/Detail, frontend wajib cross-check terhadap aset di folder `References` agar konsisten dengan style target.

## 6) SEO & Accessibility
- Meta title/description per route utama
- OpenGraph metadata per project detail
- Alt text wajib untuk image
- Keyboard navigation dasar
- Kontras warna memadai

## 7) Frontend API Contract
### `GET /projects`
Query params:
- `q` (optional)
- `category` (optional)

### `GET /projects/:slug`
Return 1 project + media list.

### `POST /contact`
Payload:
```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

## 8) Non-Functional Requirements
- LCP target < 2.5s (desktop)
- Lazy load image/model
- Bundle awal ringan
- Error boundary untuk route-level crash

## 9) Acceptance Criteria (DoD)
- Semua route utama bisa diakses.
- Data list/detail tersaji dari API backend.
- Filter/search berjalan sesuai expected.
- Contact form berhasil kirim + feedback UI.
- 3D viewer hanya aktif di project tertentu dan memiliki fallback.

## 10) Sprint Tasks (Frontend)
### Sprint 1
- Scaffold React + Tailwind
- Setup routes
- Build layout + pages skeleton
- Build ProjectCard + list statis

### Sprint 2
- Integrasi API list/detail
- Implement search/filter
- Loading/error/empty states

### Sprint 3
- Media gallery + (opsional) 3D viewer
- Fallback strategy
- Perf pass (lazy loading)

### Sprint 4
- SEO pass
- Accessibility pass
- QA responsive + deploy readiness

## 11) Risks & Mitigation
- **3D berat** → selective use + lazy load + fallback
- **Inconsistent content quality** → wajib format case-study section
- **Scope creep UI** → freeze design token sejak Sprint 1

## 12) Skill Profile Content (for About/Skills Section)
Tambahkan section **Skills** di frontend (disarankan di halaman About, opsional ringkas di Home).

### Skill List + Proficiency (dot scale 1–5)
- Solidworks — **5/5**
- Rhinoceros — **5/5**
- Blender — **4/5**
- Autocad — **4/5**
- Illustrator — **4/5**
- Photoshop — **3/5**
- Fusion360 — **3/5**
- DaVinci Resolve — **3/5**

### Others
- Creo Parametric
- Vray
- Grasshopper
- Figma

### UI Requirement for Skills Block
- Tampilkan format dua kolom: nama skill (kiri) + indikator dot (kanan).
- Gunakan 5 titik total per skill (filled vs unfilled) agar konsisten visual.
- Pastikan tetap terbaca di mobile (boleh switch jadi stacked layout).
- Gaya visual mengikuti tone minimal, clean, high-contrast.
