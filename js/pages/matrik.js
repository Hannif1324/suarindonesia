/**
 * Matrik Page Component
 * Displays detailed matrix information based on route parameter
 */

import { DOM } from '../../utils/helpers.js';
import { aboutData } from '../../services/data-service-about.js';
import { logger } from '../../debugs/logger.js';

export class MatrikPage {
    constructor() {
        this.data = aboutData;
    }

    async render(params) {
        logger.info('Rendering matrik page', params);

        const matrikId = params.id;
        const matrikData = this.data.matrikSections.find(m => m.id === matrikId);

        if (!matrikData) {
            return this.renderNotFound();
        }

        const container = DOM.create('div', {
            className: 'fade-in pt-24 pb-16 min-h-screen bg-gray-50'
        });

        container.innerHTML = `
            <div class="container mx-auto px-4">
                <!-- Back Button -->
                <div class="mb-6">
                    <a href="/suar-indonesia#matrik" data-link class="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors group">
                        <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7 7-7m-7 7h18"></path>
                        </svg>
                        Kembali
                    </a>
                </div>

                <!-- Breadcrumb -->
                <nav class="flex mb-8 text-sm text-gray-500">
                    <a href="/" class="hover:text-purple-600 transition">Beranda</a>
                    <span class="mx-2">/</span>
                    <a href="/suar-indonesia" class="hover:text-purple-600 transition">Tentang Kami</a>
                    <span class="mx-2">/</span>
                    <span class="text-gray-900 font-medium truncate">${matrikData.title}</span>
                </nav>

                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="p-8 md:p-12 border-b border-gray-100">
                        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                            ${matrikData.title}
                        </h1>
                        <p class="text-gray-600 text-center max-w-2xl mx-auto text-lg">
                            ${matrikData.description}
                        </p>
                    </div>

                    <div class="p-4 md:p-8 bg-gray-50">
                        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                            <img 
                                src="${matrikData.image}" 
                                alt="${matrikData.title}" 
                                class="w-full h-auto"
                                loading="lazy"
                            >
                        </div>
                    </div>

                    <div class="p-8 md:p-12 text-center">
                        <a href="/suar-indonesia#matrik" data-link class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 transition-colors">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Kembali ke Matrik Renstra
                        </a>
                    </div>
                </div>
            </div>
        `;

        return container;
    }

    renderNotFound() {
        const container = DOM.create('div', {
            className: 'pt-32 pb-16 min-h-screen bg-gray-50 flex items-center justify-center'
        });

        container.innerHTML = `
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Matrik Tidak Ditemukan</h1>
                <p class="text-gray-600 mb-8">Maaf, data matrik yang Anda cari tidak tersedia.</p>
                <a href="/suar-indonesia" class="text-purple-600 hover:text-purple-800 font-medium">
                    Kembali ke Tentang Kami
                </a>
            </div>
        `;

        return container;
    }
}
