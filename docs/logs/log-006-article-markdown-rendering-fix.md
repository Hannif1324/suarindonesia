<!-- [AGENT-GENERATED]
Description : DevLog 006 - Perbaikan Render Markdown Artikel Publik & Upload Foto Naskah
Created     : 2026-10-21
Modified    : 2026-10-21
Part of     : Documentation Engine
-->

# DevLog 006: Perbaikan Render Markdown Artikel Publik & Fitur Unggah Foto Naskah

## 📌 Ringkasan Masalah (Root Cause)
Pada pengujian di lingkungan produksi, artikel yang dibuat melalui Admin Meja Redaksi tampil rapi pada panel *Live Preview*, namun saat diakses pada halaman detail publik (`#/artikel/:slug`), seluruh teks menjadi satu paragraf raksasa tanpa baris baru, format heading (`###`) tidak berubah, dan gambar (`![alt](url)`) tercetak mentah sebagai teks biasa.

### Akar Masalah Teknis
1. **Kolom Database Belum Termigrasi**: Kolom `content_markdown` pada tabel `articles` di Supabase production belum ditambahkan, sehingga penyimpanan ke kolom tersebut menghasilkan error PostgreSQL `42703 (column does not exist)`.
2. **Fallback Diam-diam di Editor**: Sistem editor menyelamatkan data naskah dengan memasukkannya ke kolom legacy `content: [{ type: 'paragraph', content: markdownText }]`.
3. **Renderer Publik Tanpa Parser Markdown**: Komponen publik [`js/pages/article-detail-template.js`](file:///c:/Users/user/Hannif%20Folder/Development/suarindonesia/js/pages/article-detail-template.js) yang mendeteksi `content_markdown == null` langsung mengalihkan rendering ke `renderSections()`. Pada blok `type == 'paragraph'`, naskah dicetak mentah di dalam tag `<p>${section.content}</p>` tanpa melalui `marked.js`. Browser mengabaikan karakter newline (`\n`) di dalam tag `<p>`, mengakibatkan teks menggandeng menjadi satu dinding teks raksasa.
4. **Alur Unggah Gambar Naskah**: Tombol toolbar gambar pada editor sebelumnya mengandalkan `prompt()` URL, menyulitkan penulis yang ingin mengunggah foto langsung dari penyimpanan lokal (laptop/smartphone).

---

## 🛠️ Solusi yang Diimplementasikan

### 1. Smart Markdown Fallback di Halaman Publik
Pada [`js/pages/article-detail-template.js`](file:///c:/Users/user/Hannif%20Folder/Development/suarindonesia/js/pages/article-detail-template.js):
- **Deteksi Cerdas Naskah**: Jika `content_markdown` kosong namun `article.content` berisi single paragraph dengan token Markdown (`\n`, `#`, `![`, `**`), sistem secara otomatis mem-parse-nya dengan `renderMarkdownContent()`.
- **Dampak**: Semua artikel yang telah diterbitkan sebelumnya **langsung tampil rapi, terformat, dan gambar muncul seketika tanpa perlu disunting atau disimpan ulang di admin**.
- **Konfigurasi Marked**: Mengaktifkan `breaks: true` dan `gfm: true` agar perpindahan baris Enter penulis dihormati secara alami sebagai `<br>`.
- **Sanitasi DOMPurify**: Memperluas whitelist tag untuk `<figure>`, `<figcaption>`, dan atribut `alt`, `class`.

### 2. Direct File Upload pada Toolbar Naskah
Pada [`admin/js/article-editor.js`](file:///c:/Users/user/Hannif%20Folder/Development/suarindonesia/admin/js/article-editor.js):
- Mengintegrasikan dialog konfirmasi saat tombol ikon kamera/gambar diklik:
  - **OK**: Membuka file selector perangkat secara langsung ➔ Mengunggah file ke Supabase Storage bucket `article-images` ➔ Menyisipkan sintaks `![Judul](url)` dan keterangan foto tepat di posisi kursor.
  - **Batal**: Memungkinkan input URL gambar eksternal seperti sebelumnya.
- Menyediakan placeholder sementara `![Mengunggah foto: nama-file...]()` saat proses upload berlangsung agar penulis mendapatkan respons visual instan.

---

## 📂 Berkas yang Dimodifikasi

| Berkas | Detail Perubahan |
|:---|:---|
| [`js/pages/article-detail-template.js`](file:///c:/Users/user/Hannif%20Folder/Development/suarindonesia/js/pages/article-detail-template.js) | Smart Markdown fallback, `marked` breaks/gfm config, DOMPurify whitelist update |
| [`admin/js/article-editor.js`](file:///c:/Users/user/Hannif%20Folder/Development/suarindonesia/admin/js/article-editor.js) | Direct device image upload trigger, live preview upload placeholder |
| [`docs/logs/log-006-article-markdown-rendering-fix.md`](file:///c:/Users/user/Hannif%20Folder/Development/suarindonesia/docs/logs/log-006-article-markdown-rendering-fix.md) | Catatan log pemulihan dan dokumentasi teknis |
| [`docs/logs/index.md`](file:///c:/Users/user/Hannif%20Folder/Development/suarindonesia/docs/logs/index.md) & [`docs/_sidebar.md`](file:///c:/Users/user/Hannif%20Folder/Development/suarindonesia/docs/_sidebar.md) | Indeks riwayat pembaruan sistem |

---

## 🧪 Verifikasi & Pengujian
- **Sintaks Node.js**: Validasi `node -c` pada kedua berkas menghasilkan exit code 0 tanpa error.
- **Deteksi Logis**: Validasi algoritma `isSingleMarkdownSection` berhasil mendeteksi naskah artikel ID `5c2376c0-1332-4378-883d-84ec8dee97c4`.
