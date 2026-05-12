# 🖥️ GoBicycle Admin Dashboard & Backend

Sistem manajemen terpusat untuk aplikasi GoBicycle. Terdiri dari **Backend API (Hapi.js)** dan **Admin Web Portal (Angular)**.

---

## 🏗️ Struktur Proyek
*   `apps/backend`: Server API yang terhubung ke Supabase.
*   `apps/frontend`: Dashboard web untuk admin mengelola armada dan pengguna.

---

## 🚀 Panduan Setup

### 1. Persiapan Backend (Hapi.js)
1.  Masuk ke folder: `cd apps/backencd `
2.  Instal dependensi: `npm install`
3.  Buat file `.env` berdasarkan kredensial Supabase Anda:
    ```env
    PORT=4000
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_ANON_KEY=your-anon-key
    JWT_SECRET=rahasia-admin-123
    ```
4.  Jalankan server: `npm run dev`

### 2. Persiapan Dashboard (Angular)
1.  Masuk ke folder: `cd apps/frontend`
2.  Instal dependensi: `npm install`
3.  Pastikan URL backend di `src/app/services/api.service.ts` sudah mengarah ke `http://localhost:4000`.
4.  Jalankan dashboard: `npm start`
5.  Akses di browser: `http://localhost:4200`

---

## 🛠️ Fitur Admin
*   **Fleet Management**: Tambah, edit, hapus, dan **Reactivate** sepeda secara paksa.
*   **User Management**: Pantau pengguna terdaftar dan lakukan **Top Up Saldo** manual.
*   **Booking Monitor**: Lihat riwayat transaksi dan status penyewaan secara real-time.
*   **Real-time Refresh**: Tombol sinkronisasi data tanpa reload halaman.

---

## 🔐 Keamanan
Pastikan untuk tidak mengunggah file `.env` ke publik. Gunakan `JWT_SECRET` yang kuat untuk produksi.

---
*Dibuat oleh Zaidan Ikhsan Gumilar.*
