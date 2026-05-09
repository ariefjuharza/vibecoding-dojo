# VibeCoding Dojo 🥋
**Submission untuk Google VibeCoding Study Jam: #JuaraVibeCoding**

## Problem
Di era *AI-assisted development* (Vibe Coding), developer pemula dan mahasiswa sering kali kesulitan menerjemahkan kebutuhan bisnis atau permintaan fitur yang sangat abstrak dari *stakeholder* menjadi daftar fitur inti yang konkrit. Akibatnya, saat mereka memasukkan *prompt* yang terlalu umum ke alat AI, output yang dihasilkan tidak fokus, terlalu meluas, atau sulit diimplementasikan.

## Solution
**VibeCoding Dojo** adalah sebuah arena latihan interaktif berbasis web yang memiliki dua fasilitas penempaan (modul) utama:

1. **Jurus Prompt (Prompt Practice)**: Aplikasi memberikan tantangan berupa permintaan (*brief*) abstrak dari klien. Alih-alih menulis kode, pengguna diminta untuk **menulis prompt ke AI Mentor (Google Gemini)** guna mengidentifikasi 3-5 fitur utama dari permintaan tersebut.
2. **Refactor Lab (Tempa Kode)**: Pengguna menempelkan potongan kode yang bisa berjalan namun mungkin kotor (*code smell*). AI Mentor akan membedah kode tersebut, menjelaskan fungsinya, memberikan catatan perbaikan, dan memberikan versi kode yang telah di-*refactor* agar lebih idiomatik dan bersih (*Clean Code*).

Setelah *prompt* atau kode dikirim, AI Mentor (yang menggunakan persona sebagai seorang *Dojo Master* / Sensei yang tegas namun suportif) akan memberikan umpan balik terstruktur:
1. Skor Evaluasi / XP Dinamis
2. Kelebihan dari karya pengguna ("Kekuatan Kuda-kudamu")
3. Area Perbaikan ("Titik Kelemahan")
4. Contoh *Prompt* atau *Kode* yang Lebih Baik

Sistem ini memiliki gamifikasi ringan: setiap keberhasilan dikonversi menjadi XP, yang menaikkan level pengguna (Novice → Sensei), mendorong latihan berulang.

## Uniqueness
Keunikan aplikasi ini terletak pada pendekatannya. VibeCoding Dojo **tidak menggunakan AI untuk men-generate kode secara instan**, melainkan **menggunakan AI sebagai mentor untuk melatih cara berpikir** (*feature discovery*) dan cara berkomunikasi (*prompt engineering*) dengan AI itu sendiri. Ini adalah *meta-skill* yang sangat penting bagi developer masa depan.

## Tech Stack & Architecture
Proyek ini dibangun untuk siap-produksi di **Google Cloud Run** dengan arsitektur *Single Container*:
- **Frontend**: React + Vite + TypeScript (Vanilla CSS dengan *Glassmorphism*).
- **Backend**: Node.js + Express + TypeScript. Berfungsi sebagai REST API, mengintegrasikan Google Gemini API (`@google/genai`), dan melayani file statis hasil build frontend.
- **Model AI**: `gemini-2.5-flash`

## Cara Menjalankan Secara Lokal
```bash
# Clone repositori
git clone <url-repo-anda>
cd vibecoding-dojo

# Terminal 1: Build & Jalankan Frontend (Dev)
cd frontend
npm install
npm run dev

# Terminal 2: Build & Jalankan Backend (Dev)
cd backend
npm install
# Buat file .env dan isi dengan GEMINI_API_KEY=your_key_here
npm run dev
```

## Cara Deployment ke Google Cloud Run
Aplikasi ini dilengkapi dengan *multi-stage* `Dockerfile` yang mem-build frontend dan backend lalu menggabungkannya dalam satu service ringan.

1. Pastikan Anda telah menginstal `gcloud CLI` dan login.
2. Jalankan perintah deploy dari root direktori proyek (`vibecoding-dojo/`):
```bash
gcloud run deploy vibecoding-dojo \
  --source . \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=KUNCI_GEMINI_ANDA"
```
3. Anda akan mendapatkan URL publik aplikasi yang bisa langsung dibagikan!
