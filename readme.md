Tentu, ini penjelasan cara mengelola dan melihat database Anda pada MVP saat ini:

### 1. Cara Menambah Project ke Database
Karena saat ini kita belum memiliki halaman Admin Dashboard (CMS), cara tercepat untuk menambah atau mengedit project adalah melalui file *seed*.

1. Buka file [c:\Users\a_sfn\@Project\Portofolio\backend\db\seed.js](cci:7://file:///c:/Users/a_sfn/@Project/Portofolio/backend/db/seed.js:0:0-0:0).
2. Pada bagian atas file, Anda akan melihat array **`mockProjects`**. Tambahkan block objek project Anda di dalam array tersebut. Contoh:
   ```javascript
   {
     slug: 'nama-project-baru',
     title: 'Judul Project Baru',
     summary: 'Deskripsi singkat karya Anda.',
     industry: 'Automotive Design',
     role: 'Mechanical Engineer',
     problem: 'Masalah yang dipecahkan...',
     constraints: 'Batasan project...',
     approach: 'Pendekatan yang dilakukan...',
     result: 'Hasil kerja...',
     tools: ['SolidWorks', 'Ansys'],
     tags: ['3D Modeling', 'Automotive'],
     featured: true
   }
   ```
3. Scroll sedikit ke bawah ke array **`mockMedia`** untuk menambahkan gambarnya. Pastikan `project_slug` sama persis dengan yang Anda buat di atas:
   ```javascript
   {
     project_slug: 'nama-project-baru',
     type: 'image',
     url: 'URL_GAMBAR_ANDA_DISINI',
     caption: 'Deskripsi gambar',
     sort_order: 1
   }
   ```
4. Setelah di-save, jalankan skrip seed tersebut melalui terminal di folder `backend`:
   ```bash
   node db/seed.js
   ```
   *(Perintah ini akan mereset database dan memasukkan project baru Anda secara otomatis).*

---

### 2. Cara Melihat Isi Database PostgreSQL
Database Anda berjalan di dalam Docker (container bernama `portfolio-postgres`). Ada dua cara untuk mengaksesnya:

**Cara A: Menggunakan Aplikasi GUI (Paling Mudah)**
Jika Anda ingin melihat isi tabel secara visual (seperti excel), Anda bisa mengunduh software Database Manager gratis seperti **[DBeaver](https://dbeaver.io/)**, **[pgAdmin](https://www.pgadmin.org/)**, atau **[TablePlus](https://tableplus.com/)**.
Buat koneksi baru dan masukkan kredensial berikut:
- **Host**: `localhost`
- **Port**: `5432`
- **Database Name**: `portfolio`
- **Username**: `postgres`
- **Password**: `password`

Anda akan bisa melihat dan mengedit langsung isi tabel `projects`, `project_media`, dan `contacts` (log pesan dari form kontak) melalui aplikasi tersebut.

**Cara B: Menggunakan Command Line (Terminal)**
Jika Anda ingin mengeceknya langsung dari terminal tanpa menginstall aplikasi GUI tambahan, jalankan perintah ini (pastikan Docker Desktop sedang menyala):
```bash
docker exec -it portfolio-postgres psql -U postgres -d portfolio
```
Setelah masuk ke prompt PostgreSQL (`portfolio=#`), Anda bisa mengetik perintah SQL standar seperti:
- `\dt` *(untuk melihat daftar tabel)*
- `SELECT * FROM projects;` *(untuk melihat semua project)*
- `SELECT * FROM contacts;` *(untuk melihat pesan dari halaman contact)*
- Ketik `\q` lalu Enter untuk keluar.

Apakah Anda ingin saya membuatkan langkah awal menyiapkan Admin Dashboard supaya kedepannya Anda tidak perlu menggunakan terminal/mengedit script lagi?


============================================================================


Admin Dashboard berhasil dibuat dan terintegrasi! 🎉

Ini rangkuman apa saja yang baru saja saya tambahkan:
1. **Routing `/admin`**: Sekarang Anda bisa membuka `http://localhost:5173/admin` di browser Anda.
2. **Login Aman**: Saat membuka halaman tersebut, Anda akan diminta memasukkan username & password.
   - **User**: `admin`
   - **Password**: `password123`
   *(Credential ini saya simpan di dalam file `.env` di folder backend Anda sehingga aman dan dapat Anda ganti kapan saja).*
3. **Tab Pesan (Contacts)**: Semua pesan yang dikirim oleh pengunjung melalui halaman Contact sekarang langsung ter-list secara rapi di dalam tabel dashboard Admin.
4. **Tab Tambah Project**: Ada formulir lengkap (Judul, Slug, Kategori, Ringkasan, URL Gambar dsb) yang apabila disubmit akan langsung masuk ke database Anda secara _real-time_. Project yang ditambahkan lewat form ini akan otomatis muncul juga di halaman utama "Projects" tanpa perlu restart server atau edit `seed.js` lagi.

Silakan coba **login ke [http://localhost:5173/admin](http://localhost:5173/admin)** dan temukan pengalaman mengelola konten dengan UI yang rapi. 
Apakah ada penyesuaian fungsional lain yang ingin kita selesaikan?

===================================================================================

Untuk menjalankan *backend*, Anda perlu masuk ke direktori `backend` dan menjalankan servernya menggunakan Node.js. 

Dari pantauan saya, saat ini hanya *frontend* yang sedang berjalan. Saya akan bantu langsung jalankan *backend*-nya untuk Anda dengan perintah `node --watch index.js` di dalam folder `backend` agar ia otomatis me-restart jika ada perubahan kode.

Jika Anda ingin menjalankannya sendiri di terminal baru, langkahnya adalah:
1. Buka terminal baru.
2. Pindah ke folder backend: `cd backend`
3. Jalankan perintah: `node --watch index.js` (atau `npm start` / `npm run dev` jika tersedia scriptnya di `package.json`).

Saya sedang menjalankannya sekarang di latar belakang!

Ran command: `node --watch index.js`

Berdasarkan perintah yang dijalankan, server *backend* sudah berjalan di latar belakang (mendeteksi perubahan file dengan `--watch`). Apabila Anda perlu melihat log-nya, Anda bisa memantau terminal `node --watch index.js` di editor Anda.

Beri tahu saya jika ada fitur atau masalah lain yang perlu kita selesaikan!

Server *backend* sudah sukses berjalan di `port 5000` ya! Silakan mencoba aplikasinya lagi. Kalau ada halaman atau menu yang butuh dimodifikasi lagi, kabari saja saya.