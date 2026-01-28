/**
 * Generic Page (Layanan, Kegiatan, etc.)
 */

import { db } from '../../services/db.js';
import { DB_STORES } from '../../utils/constants.js';
import { DOM } from '../../utils/helpers.js';
import { logger } from '../../debugs/logger.js';

export class GenericPage {
    constructor(slug) {
        this.slug = slug;
    }

    async render() {
        logger.info('Rendering generic page', this.slug);

        const container = DOM.create('div', {
            className: 'fade-in'
        });

        // Load page data
        const page = await this.getPage(this.slug);

        if (!page) {
            return this.renderNotFound();
        }

        // Page Header
        const header = DOM.create('section', {
            className: 'relative h-80'
        });

        const imageUrl = page.coverImage || 'https://via.placeholder.com/1200x400?text=SuaR+Indonesia';

        header.innerHTML = `
            <div class="absolute inset-0">
                <img 
                    src="${imageUrl}" 
                    alt="${page.title}"
                    class="w-full h-full object-cover"
                    onerror="this.src='https://via.placeholder.com/1200x400?text=SuaR+Indonesia'"
                >
                <div class="absolute inset-0 bg-black bg-opacity-60"></div>
            </div>
            <div class="relative container mx-auto px-4 h-full flex flex-col justify-center text-center text-white">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    ${page.title}
                </h1>
                <div class="w-24 h-1 bg-primary mx-auto rounded"></div>
            </div>
        `;

        container.appendChild(header);

        // Page Content
        const contentSection = DOM.create('section', {
            className: 'py-16'
        });

        // Format content
        const paragraphs = page.content
            .split('\n')
            .filter(p => p.trim().length > 0)
            .map(p => `<p class="mb-6 text-gray-700 leading-relaxed text-lg">${p}</p>`)
            .join('');

        contentSection.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
                    <div class="prose prose-lg max-w-none">
                        ${paragraphs}
                    </div>
                </div>
            </div>
        `;

        container.appendChild(contentSection);

        return container;
    }

    async getPage(slug) {
        try {
            // Try to find in Pages store
            let page = await db.get(DB_STORES.PAGES, slug);

            // If not found, try Articles store
            if (!page) {
                page = await db.get(DB_STORES.ARTICLES, slug);
            }

            return page;
        } catch (error) {
            logger.error('Failed to get page', error);
            return null;
        }
    }

    renderNotFound() {
        const container = DOM.create('div', {
            className: 'fade-in py-20'
        });

        container.innerHTML = `
            <div class="container mx-auto px-4 text-center">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">Halaman Tidak Ditemukan</h1>
                <p class="text-xl text-gray-600 mb-8">Maaf, halaman yang Anda cari tidak tersedia.</p>
                <a href="/" class="inline-block bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-lg transition" data-link>
                    Kembali ke Beranda
                </a>
            </div>
        `;

        return container;
    }
}
