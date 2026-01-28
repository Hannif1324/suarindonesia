/**
 * Main Application Entry Point
 */

import { logger } from '../debugs/logger.js';
import { db } from '../services/db.js';
import { dataService } from '../services/seed-data.js';
import { router } from './router.js';
import { MainLayout } from '../components/layout/main-layout.js';
import { HomePage } from './pages/home.js';
import { AboutPage } from './pages/about.js';
import { BeritaPage } from './pages/berita.js';
import { KontakPage } from './pages/kontak.js';
import { ArticleDetailTemplate } from './pages/article-detail-template.js';
import { GenericPage } from './pages/generic-page.js';
import { MatrikPage } from './pages/matrik.js';
import { StaffPage } from './pages/staff.js';
import { LayananPage } from './pages/layanan.js';
import { KegiatanPage } from './pages/kegiatan.js';
import { ProdukPage } from './pages/produk.js';
import { DOM, hideLoading, showLoading } from '../utils/helpers.js';

class App {
    constructor() {
        this.layout = new MainLayout();
        this.appRoot = DOM.get('app');
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            logger.info('Initializing application');
            showLoading();

            // Initialize database
            await db.init();
            logger.info('Database initialized');

            // Seed data from generated seed file
            logger.info('Seeding data...');
            await dataService.seedData();
            logger.info('Data seeded successfully');

            // Setup routes
            this.setupRoutes();

            // Initialize router
            router.init();

            hideLoading();
            logger.info('Application initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize application', error);
            this.showError('Gagal memuat aplikasi. Silakan refresh halaman.');
        }
    }

    /**
     * Setup application routes
     */
    setupRoutes() {
        // Home page
        router.on('/', async () => {
            const homePage = new HomePage();
            const content = await homePage.render();
            this.render(content, '/');
        });

        // Berita page
        router.on('/berita', async () => {
            const beritaPage = new BeritaPage();
            const content = await beritaPage.render();
            this.render(content, '/berita');
        });

        // Article Detail page
        router.on('/artikel/:slug', async (params) => {
            const articlePage = new ArticleDetailTemplate();
            const content = await articlePage.render(params);
            this.render(content, `/artikel/${params.slug}`);
        });

        // Tentang Kami page (About)
        router.on('/tentangkami', async () => {
            const aboutPage = new AboutPage();
            const content = await aboutPage.render();
            this.render(content, '/tentangkami');
        });

        // Alias for Tentang Kami
        router.on('/suar-indonesia', async () => {
            const aboutPage = new AboutPage();
            const content = await aboutPage.render();
            this.render(content, '/suar-indonesia');
        });

        // Layanan page
        router.on('/layanan', async () => {
            const layananPage = new LayananPage();
            const content = await layananPage.render();
            this.render(content, '/layanan');
        });

        // Kegiatan page
        router.on('/kegiatan-suar-indonesia', async () => {
            const kegiatanPage = new KegiatanPage();
            const content = await kegiatanPage.render();
            this.render(content, '/kegiatan-suar-indonesia');
        });

        // Kontak page
        router.on('/kontak-tim-suar-indonesia', async () => {
            const kontakPage = new KontakPage();
            const content = await kontakPage.render();
            this.render(content, '/kontak-tim-suar-indonesia');
        });

        // Staff page
        router.on('/staff-suar-indonesia', async () => {
            const staffPage = new StaffPage();
            const content = await staffPage.render();
            this.render(content, '/staff-suar-indonesia');
        });

        // Produk page
        router.on('/produk', async () => {
            const produkPage = new ProdukPage();
            const content = await produkPage.render();
            this.render(content, '/produk');
        });

        // Supervisi page
        router.on('/supervisi-program', async () => {
            const page = new GenericPage('supervisi-program');
            const content = await page.render();
            this.render(content, '/supervisi-program');
        });

        // Matrik pages (dynamic route)
        router.on('/matrik/:id', async (params) => {
            const matrikPage = new MatrikPage();
            const content = await matrikPage.render(params);
            this.render(content, `/matrik/${params.id}`);
        });

        // Generic catch-all for other pages (try to load as generic page)
        // Note: Router doesn't support regex catch-all easily, so we rely on specific routes.
        // But we can add common ones from the scraped data if needed.

        // 404 page
        router.on('/404', async () => {
            const content = this.create404Page();
            this.render(content, '/404');
        });

        logger.info('Routes configured');
    }

    /**
     * Render content with layout
     */
    render(content, path) {
        DOM.empty(this.appRoot);
        const layoutContent = this.layout.render(content);
        this.appRoot.appendChild(layoutContent);
        this.layout.updateNavbar(path);

        // Scroll to top
        window.scrollTo(0, 0);
    }

    /**
     * Create placeholder page
     */
    createPlaceholderPage(title, message) {
        const page = DOM.create('div', {
            className: 'fade-in'
        });

        page.innerHTML = `
            <section class="bg-gradient-to-r from-primary to-secondary text-white py-12">
                <div class="container mx-auto px-4">
                    <h1 class="text-4xl font-bold">${title}</h1>
                </div>
            </section>
            <section class="py-20">
                <div class="container mx-auto px-4 text-center">
                    <p class="text-xl text-gray-600">${message}</p>
                    <a href="/" class="inline-block mt-8 bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-lg transition" data-link>
                        Kembali ke Beranda
                    </a>
                </div>
            </section>
        `;

        return page;
    }

    /**
     * Create 404 page
     */
    create404Page() {
        const page = DOM.create('div', {
            className: 'fade-in'
        });

        page.innerHTML = `
            <section class="py-20">
                <div class="container mx-auto px-4 text-center">
                    <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
                    <p class="text-2xl text-gray-600 mb-8">Halaman tidak ditemukan</p>
                    <a href="/" class="inline-block bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-lg transition" data-link>
                        Kembali ke Beranda
                    </a>
                </div>
            </section>
        `;

        return page;
    }

    /**
     * Show error message
     */
    showError(message) {
        hideLoading();
        this.appRoot.innerHTML = `
            <div class="flex items-center justify-center min-h-screen">
                <div class="text-center">
                    <p class="text-xl text-red-600 mb-4">${message}</p>
                    <button 
                        onclick="location.reload()" 
                        class="bg-primary hover:bg-secondary text-white font-semibold py-2 px-6 rounded-lg transition"
                    >
                        Refresh Halaman
                    </button>
                </div>
            </div>
        `;
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new App();
        app.init();
    });
} else {
    const app = new App();
    app.init();
}
