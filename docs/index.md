<!-- [AGENT-GENERATED]
Description : Dokumentasi Hub Utama SuaR Indonesia
Created     : 2026-10-17
Modified    : 2026-10-17
Part of     : docs/index.md
-->

# 📖 Dokumentasi Teknis SuaR Indonesia

Selamat datang di Portal Dokumentasi Modular SuaR Indonesia. Seluruh spesifikasi teknis, arsitektur, dan riwayat rekayasa perangkat lunak dikelola secara modular sesuai standar enterprise Diátaxis & arc42.

---

## 🧭 Panduan Cepat Navigasi

| Modul | Deskripsi | Tautan |
|:---|:---|:---|
| **Arsitektur Sistem** | C4 context, data flow CMS, dan rendering pipeline | [Buka Modul Arsitektur](architecture/index.md) |
| **Alur Pembuatan Artikel** | Workflow Meja Redaksi Markdown, Live Preview & SEO | [Pelajari Alur Artikel](architecture/article-flow.md) |
| **Development Logs** | Log kronologis perubahan arsitektur dan refactoring | [Lihat DevLogs](logs/index.md) |

---

## ⚡ Cara Menjalankan Portal Dokumentasi Lokal

Untuk membaca dokumentasi ini secara interaktif di browser:

```bash
# Opsi 1: Menggunakan Docsify CLI
npx docsify-cli serve ./docs

# Opsi 2: Menggunakan Python
python -m http.server 3000 --directory docs
```

Buka peramban di `http://localhost:3000`.
