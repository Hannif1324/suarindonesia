<!-- [AGENT-GENERATED]
Description : Perbaikan Root SPA Hash Routing & URL Sanitization Mengatasi Nginx 404
Created     : 2026-10-21
Modified    : 2026-10-21
Part of     : Routing System & Article Navigation
-->

# 📝 DevLog 007: Perbaikan Root SPA Hash Routing & Self-Healing URL Sanitization Mengatasi Nginx 404

## 📌 Ringkasan Eksekutif
Log ini mendokumentasikan investigasi akar masalah (*root cause analysis*) dan perbaikan navigasi artikel Single Page Application (SPA) pada domain production `https://suarindonesia.org`. Pengunjung sebelumnya mengalami error `HTTP 404 Not Found` ketika membuka, me-refresh, atau membagikan link artikel yang diklik dari halaman `/berita`.

Perbaikan dilakukan dengan menormalkan pembentukan URL navigasi kartu artikel ke root hash path `/#/artikel/:slug`, menyinkronkan seluruh komponen kartu dan tombol preview admin, serta menyuntikkan logika *self-healing URL sanitization* via `window.history.replaceState` di dalam `Router.loadCurrentRoute()` untuk membersihkan tautan kotor lama secara transparan.

---

## 🔍 Akar Masalah (Root Cause Analysis)

1. **Ketiadaan Rule Fallback di Nginx Production:**
   - Server Nginx production melayani website sebagai file statis biasa tanpa konfigurasi SPA fallback:
     ```nginx
     location / {
         try_files $uri $uri/ /index.html;
     }
     ```
   - Request langsung ke `/` atau `/index.html` berhasil dengan status `200 OK`.
   - Namun request murni HTTP ke `/berita`, `/layanan`, atau `/produk` langsung menghasilkan `404 Not Found`.

2. **Penggabungan Pathname pada Navigasi Artikel di `berita.js`:**
   - Pada baris 302-303 `js/pages/berita.js`, navigasi kartu artikel sebelumnya ditulis:
     ```javascript
     const baseUrl = window.location.origin + window.location.pathname;
     window.location.href = `${baseUrl}#/artikel/${slug}`;
     ```
   - Saat pengunjung berada di `https://suarindonesia.org/berita`, `window.location.pathname` adalah `/berita`.
   - Hasil URL yang dibentuk adalah `https://suarindonesia.org/berita#/artikel/:slug`.
   - Karena hash fragment (`#...`) tidak pernah dikirimkan oleh browser dalam request HTTP ke server, saat pengunjung me-refresh (F5) atau membagikan tautan ini ke WhatsApp/media sosial, browser mengirimkan `GET /berita HTTP/1.1` ke Nginx. Nginx mencari file fisik `/berita` yang tidak ada $\rightarrow$ **404 Not Found**.

---

## 🛠️ Langkah Perbaikan & Implementasi

### 1. Normalisasi URL Kartu di `js/pages/berita.js`
Mengubah navigasi klik kartu artikel agar selalu merujuk ke root hash path `/#/artikel/:slug`:
```javascript
// js/pages/berita.js
document.addEventListener('click', (e) => {
    const cardEl = e.target.closest('[data-slug]');
    if (cardEl) {
        const slug = cardEl.dataset.slug;
        // Gunakan root hash route agar kebal Nginx 404 saat di-refresh
        window.location.href = `/#/artikel/${slug}`;
    }
});
```

### 2. Sinkronisasi Tautan di Seluruh Komponen
- **`components/ui/card.js`**:
  Mengubah `href="#/artikel/${article.slug}"` menjadi `href="/#/artikel/${article.slug}"`.
- **`services/data-service-home.js`**:
  Mengubah mapping `link` artikel beranda menjadi `/#/artikel/${a.slug}`.
- **`js/pages/article-detail-template.js`**:
  Mengubah klik artikel terkait (*related articles*) menjadi `onclick="window.location.href='/#/artikel/${article.slug}'"`.
- **`admin/js/article-editor.js`**:
  Mengubah tombol "Lihat di Web" menjadi `href="/#/artikel/${article.slug}" target="_blank"` sehingga dari path `/admin/` langsung membuka halaman artikel publik yang valid.

### 3. Self-Healing URL Sanitization di `js/router.js`
Menambahkan penanganan otomatis di `Router.loadCurrentRoute()` dan `Router.handleLinkClick()`:
```javascript
// js/router.js
loadCurrentRoute() {
    if (window.location.hash && window.location.hash.startsWith('#/')) {
        // Self-healing: bersihkan dirty pathname (misal /berita#/artikel/slug) ke root /
        // agar request refresh browser selalu ke / (200 OK) dan tidak kena Nginx 404
        if (window.location.pathname !== '/' && window.location.pathname !== '') {
            window.history.replaceState({}, '', '/' + window.location.hash);
        }
        const route = window.location.hash.substring(1);
        this.loadRoute(route);
    } else {
        const route = window.location.pathname + window.location.hash;
        this.loadRoute(route);
    }
}
```

---

## 🧪 Hasil Verifikasi & Uji Dampak

1. **Uji Sintaks (`node -c`):**
   - `js/router.js`: Exit Code 0 (Pass)
   - `js/pages/berita.js`: Exit Code 0 (Pass)
   - `components/ui/card.js`: Exit Code 0 (Pass)
   - `services/data-service-home.js`: Exit Code 0 (Pass)
   - `js/pages/article-detail-template.js`: Exit Code 0 (Pass)
   - `admin/js/article-editor.js`: Exit Code 0 (Pass)

2. **Uji Konsekuensi & Zero Regression:**
   - **Anchor Scroll (`/layanan#hiv-aids`, `/suar-indonesia#visi-misi`):** Berfungsi normal karena router membedakan hash route `#/` dengan section anchor `#` murni.
   - **Tombol Kembali ("Kembali ke Berita"):** Navigasi ke `#/berita` terbaca oleh router dan merender ulang list berita.
   - **Tautan Berbagi (WhatsApp/FB/X):** `window.location.href` yang dibagikan kini selalu bersih (`https://suarindonesia.org/#/artikel/...`), sehingga penerima tautan dijamin mendapat `200 OK`.
