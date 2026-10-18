# 🐛 Development Log 002: Perbaikan Bug Chip Tags Input (Tag Kedua Tidak Bisa Ditambahkan)

> **Tanggal:** 17 Oktober 2026  
> **Author:** Gemini Agent (Senior QA & Software Engineer)  
> **Status:** Selesai (Verified 6/6 QA Scenarios Passed)  
> **Modul Terkait:** `admin/js/article-editor.js`

---

## 1. Gejala Permasalahan
Setelah menambahkan tag pertama (misal: `#advokasi ✕`), pengguna tidak dapat menambahkan tag kedua (misal: mengetik `kkamu`). Teks tertahan di dalam input box dan tidak berubah menjadi badge chip saat ditekan `Enter` atau `Koma`.

## 2. Analisis Akar Masalah (Root Cause)
1. **DOM Replacement & Event Listener Loss**:
   Pada implementasi awal, `renderTagChips()` menimpa seluruh kontainer (`container.innerHTML = ...`). Hal ini merusak elemen `<input id="tag-input-field">` yang asli dan menggantinya dengan elemen input baru yang belum memiliki event listener `keydown`.
2. **Keterbatasan Separator & Ketiadaan Auto-Commit on Blur**:
   Sistem hanya mendengarkan tombol `Enter` dan `,`. Jika pengguna berpindah fokus kursor (klik tombol Simpan Draf atau field lain), teks di input hilang dan tidak terkonversi menjadi chip tag.
3. **Form Enter Key Collision**:
   Elemen berada di dalam `<form id="article-form">` tanpa `e.stopPropagation()` dan `e.preventDefault()` di level form submit bawaan.

## 3. Langkah Rekayasa & Solusi
1. **Pemisahan Permanen DOM Node**:
   Node `#tags-list` (wadah khusus chip badge) dipisahkan secara permanen dari node `#tag-input-field`.
2. **Non-Destructive Render**:
   Method `renderTagChips(container)` **HANYA** memodifikasi `list.innerHTML = chipsHtml` dan tidak pernah menyentuh elemen `#tag-input-field`.
3. **Multi-Separator & Auto-Commit on Blur**:
   - Menambahkan event listener `focusout` untuk auto-commit sisa teks saat kursor berpindah.
   - Mendukung input beruntun via tombol `Enter`, `,` (koma), dan `Tab`.
   - Mendukung paste teks multi-tag berpemisah koma (`split(/[,;\n]+/)`).
   - Mencegah form submit default via `form.addEventListener('submit', (e) => e.preventDefault())`.

## 4. Hasil Verifikasi Pengujian (Automated QA Test Suite)
Semua 6 skenario pengujian unit lulus:
- `Test 1`: Tag 1 (`#advokasi`) via Enter -> **PASS**
- `Test 2`: Tag 2 (`#kkamu`) via Enter berturut-turut -> **PASS**
- `Test 3`: Tag 3 (`#kediri`) via pemisah koma `,` -> **PASS**
- `Test 4`: Tag 4 (`#umkm`) via Auto-commit Focusout / Blur -> **PASS**
- `Test 5`: Hapus tag via tombol `✕` (index 1) -> **PASS**
- `Test 6`: Paste teks multi-tag (`pendidikan, relawan, bantuan`) -> **PASS**
