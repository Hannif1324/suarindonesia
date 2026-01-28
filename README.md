# SuaR Indonesia Website

Website untuk SuaR Indonesia menggunakan vanilla JavaScript dan IndexedDB.

## Struktur Folder

```
suarindonesia/
├── index.html              # Main HTML file
├── css/
│   └── custom.css         # Custom styles
├── js/
│   ├── main.js            # Application entry point
│   ├── router.js          # Client-side routing
│   └── pages/             # Page components
│       ├── home.js
│       ├── berita.js
│       ├── tentang.js
│       └── kontak.js
├── components/
│   ├── ui/                # UI components
│   │   ├── navbar.js
│   │   ├── footer.js
│   │   ├── card.js
│   │   └── button.js
│   └── layout/            # Layout components
│       └── main-layout.js
├── services/
│   ├── db.js              # IndexedDB service
│   └── data-loader.js     # Data loading service
├── utils/
│   ├── helpers.js         # Helper functions
│   └── constants.js       # Constants
└── debugs/
    └── logger.js          # Debug logger
```

## Cara Menjalankan

1. Buka terminal di folder `suarindonesia`
2. Jalankan local server (contoh dengan Python):
   ```bash
   python -m http.server 8000
   ```
   atau dengan Node.js:
   ```bash
   npx serve
   ```
3. Buka browser dan akses `http://localhost:8000`

## Fitur

- ✅ Single Page Application (SPA)
- ✅ IndexedDB untuk local database
- ✅ Responsive design dengan Tailwind CSS
- ✅ Client-side routing
- ✅ Modular component architecture
- ✅ Data loading dari JSON files

## Halaman

- **Beranda** (`/`) - Hero section dan berita terbaru
- **Berita** (`/berita`) - Daftar artikel dengan pagination
- **Tentang** (`/suar-indonesia`) - Informasi organisasi
- **Kontak** (`/kontak-tim-suar-indonesia`) - Form kontak dan informasi
- **Layanan** (`/layanan`) - Placeholder
- **Kegiatan** (`/kegiatan-suar-indonesia`) - Placeholder

## Teknologi

- Vanilla JavaScript (ES6 Modules)
- IndexedDB
- Tailwind CSS (via CDN)
- HTML5
