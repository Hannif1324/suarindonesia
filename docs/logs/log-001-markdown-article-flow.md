<!-- [AGENT-GENERATED]
Description : DevLog 001 - Refactor Editor Artikel Markdown-First (Kemplo Style)
Created     : 2026-10-17
Modified    : 2026-10-17
Part of     : docs/logs/log-001-markdown-article-flow.md
-->

# DevLog 001: Refactor Editor Artikel Markdown-First (Kemplo Style)

- **Tanggal** : 2026-10-17
- **Author** : Gemini Agent (Senior Software Engineer)
- **Status** : Selesai (Completed)

---

## 📌 Ringkasan Pekerjaan
Merombak total modul editor artikel redaksi SuaR Indonesia (`admin/js/article-editor.js`) dari sistem block-builder yang kaku menjadi arsitektur **Markdown-First** dengan visual dan tata letak identik referensi **Kemplo**.

---

## 🛠️ Berkas yang Dimodifikasi & Dibuat

1. `admin/js/article-editor.js`
   - Rekonstruksi layout 2 kolom (Naskah Liputan + Sidebar Metadata & SEO).
   - Penambahan toolbar formatting Markdown (`B`, `I`, `U`, `H1-H3`, List, Quote, Link, Image, Video, Dateline).
   - Mode switcher: `Edit`, `Bagi (Split View)`, dan `Lihat (Preview)`.
   - Realtime counter karakter judul (0/70) dan lead (0/160).
   - Kalkulasi dinamis total kata & estimasi waktu baca (`read_time`).
   - Tag topik terkait interaktif berbasis Chip UI (tekan Enter/koma).
   - Modal Pratinjau Pembaca publik.
   - Pembedaan aksi redaksi: *Simpan Draf* (`status = 'draft'`) vs *Terbitkan Langsung* (`status = 'published'`).
2. `admin/index.html` & `index.html`
   - Penambahan CDN library `marked.js` dan `DOMPurify` untuk parse Markdown aman.
   - Pengaktifan plugin Tailwind Typography (`?plugins=typography`).
3. `admin/supabase_schema.sql`
   - Pendaftaran bucket storage `article-images` dan security policies RLS.
   - Penambahan kolom skema: `content_markdown`, `status`, `published_at`, `seo_title`, `seo_description`, `seo_keywords`.
4. `js/pages/article-detail-template.js`
   - Implementasi `renderMarkdownContent` dengan sanitasi `DOMPurify`.
   - Fallback 3-lapis untuk backward compatibility data lama.
5. `js/pages/berita.js` & `components/ui/card.js`
   - Filter artikel publik agar tidak menampilkan draf redaksi.
   - Optimasi pembacaan foto cover dan excerpt pada kartu.
6. `docs/`
   - Scaffolding sistem dokumentasi modular berbasis Docsify.

---

## 🧪 Verifikasi Manual
1. Buka `admin/index.html` dan login.
2. Masuk ke menu **Berita & Artikel**, klik **Tulis Konten Baru**.
3. Ketik judul dan perhatikan counter 0/70 dan auto-slug.
4. Tulis naskah dalam Markdown, klik tombol toolbar untuk format cepat.
5. Klik mode **[] Bagi** untuk melihat split live preview.
6. Masukkan tag di sidebar kanan dan tekan Enter.
7. Cek tab **SEO Google** untuk melihat live SERP preview.
8. Klik **Simpan Draf** atau **Terbitkan Langsung**.
9. Buka portal publik `index.html#/berita` untuk memverifikasi artikel terbit.

---

## 🔗 Navigasi
- Kembali ke [Indeks Development Logs](./index.md)
