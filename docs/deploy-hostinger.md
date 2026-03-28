# Hostinger Deploy

## Tahap 1: Setup Database di Hostinger
1. Masuk ke hPanel Hostinger, buka menu **Databases** > **MySQL**.
2. Buat database baru (misal: `u123456_portfolio`). Catat *Database Name*, *Username*, dan *Password* yang Anda buat.
3. Klik **Enter phpMyAdmin** di database tersebut.
4. Buka tab **SQL** atau **Import**, lalu *copy-paste* seluruh isi file `backend/db/init.sql` milik kita ke sana dan jalankan (Go). Ini akan membuat struktur tabel `projects`, `project_media`, dan `contacts`.
5. Buka tab SQL lagi, *copy-paste* seluruh teks yang ada di dalam file `db/backups/backup-xxx.json` yang paling baru, tapi sayangnya phpMyAdmin tidak bisa membaca JSON langsung.
   *(Solusi mudah: Setelah backend Anda menyala di Hostinger nanti, Anda bisa menjalankan file `node db/restore.js` di server sana, atau Anda input ulang project awal via CMS.)*

## Tahap 2: Setup Aplikasi Node.js di Hostinger
1. Di hPanel Hostinger, buka menu **Advanced** -> **Node.js API/Web App** (sesuai antarmuka paket hosting Anda) atau **Git**.
2. Pilih untuk membuat aplikasi baru dari **GitHub**. Sambungkan ke repositori `safain-commits/personal-portofolio`.
3. Set **Document Root** (folder utama) ke direktori `backend` (karena yang dijalankan oleh Hostinger adalah backend yang merangkap API).
4. Di bagian **Startup File** atau *Start Command*, isi dengan: `node index.js`.
5. Di bagian **Environment Variables (ENV)**, tambahkan variabel berikut:
   - `DATABASE_URL` = `mysql://USERNAME_DB_ANDA:PASSWORD_DB_ANDA@localhost:3306/NAMA_DB_ANDA`
   - `PORT` = kosongkan atau biarkan Hostinger yang menentukan
   - `ADMIN_USER` = `admin`
   - `ADMIN_PASS` = `password_rahasia_anda`

## Tahap 3: Deploy Frontend (Static Hosting)
Karena frontend React (Vite) adalah web statis:
1. Di komputer lokal Anda, buka terminal di folder `frontend`.
2. Jalankan perintah `npm run build`. Anda akan mendapatkan folder `/dist`.
3. Buka File Manager Hostinger untuk domain utama Anda (misal `public_html`).
4. Upload semua isi file yang ada di dalam folder `/dist` tadi ke `public_html`.
5. Selesai. Saat seseorang membuka domain Anda, antarmuka React akan muncul lalu menembak API backend yang sudah disiapkan di Tahap 2.
