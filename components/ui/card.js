/**
 * Card Component
 */

import { DOM, formatDate, truncate } from '../../utils/helpers.js';

export class Card {
    /**
     * Create an article card
     */
    static article(article) {
        const card = DOM.create('div', {
            className: 'bg-white rounded-lg shadow-md overflow-hidden card-hover cursor-pointer'
        });

        const imageUrl = article.coverImage || 'https://via.placeholder.com/400x300?text=SuaR+Indonesia';
        const excerpt = truncate(article.content || article.meta?.description || 'Baca selengkapnya...', 120);

        card.innerHTML = `
            <div class="relative h-48 overflow-hidden">
                <img 
                    src="${imageUrl}" 
                    alt="${article.title}"
                    class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onerror="this.src='https://via.placeholder.com/400x300?text=SuaR+Indonesia'"
                >
            </div>
            <div class="p-4">
                <div class="text-xs text-gray-500 mb-2">
                    ${article.date ? formatDate(article.date) : 'Tanggal tidak tersedia'}
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    ${article.title}
                </h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                    ${excerpt}
                </p>
                <a 
                    href="#/artikel/${article.slug}" 
                    class="text-primary hover:text-secondary font-semibold text-sm inline-flex items-center"
                    data-link
                >
                    Baca Selengkapnya
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </a>
            </div>
        `;

        return card;
    }

    /**
     * Create a simple card
     */
    static simple(title, content, link = null) {
        const card = DOM.create('div', {
            className: 'bg-white rounded-lg shadow-md p-6 card-hover'
        });

        card.innerHTML = `
            <h3 class="text-xl font-bold text-gray-800 mb-3">${title}</h3>
            <p class="text-gray-600 mb-4">${content}</p>
            ${link ? `
                <a 
                    href="${link}" 
                    class="text-primary hover:text-secondary font-semibold inline-flex items-center"
                    data-link
                >
                    Selengkapnya
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </a>
            ` : ''}
        `;

        return card;
    }

    /**
     * Create a feature card
     */
    static feature(icon, title, description) {
        const card = DOM.create('div', {
            className: 'bg-white rounded-lg shadow-md p-6 text-center card-hover'
        });

        card.innerHTML = `
            <div class="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">${icon}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">${title}</h3>
            <p class="text-gray-600 text-sm">${description}</p>
        `;

        return card;
    }
}
