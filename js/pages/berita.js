/**
 * Berita Page Component
 * Displays news articles with carousel and grid layout
 */

import { DOM } from '../../utils/helpers.js';
import { supabase } from '../services/supabase-client.js';
import { logger } from '../../debugs/logger.js';

export class BeritaPage {
    constructor() {
        this.data = {
            hero: {
                title: "Berita & Artikel",
                subtitle: "Informasi terkini seputar kegiatan dan program SuaR Indonesia",
                image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,fit=crop/YZ9b16O2aksMXqwd/whatsapp-image-2024-09-09-at-12.34.44-YKbrRk0pQ5sbwzEn.jpeg"
            },
            categories: [
                { id: 'semua', label: 'Semua' },
                { id: 'berita', label: 'Berita' },
                { id: 'program', label: 'Program' },
                { id: 'kegiatan', label: 'Kegiatan' },
                { id: 'artikel', label: 'Artikel' }
            ],
            articles: []
        };
        this.currentCategory = 'semua';
        this.carouselIndex = 0;
        this.isLoading = true;
    }

    async fetchArticles() {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform Supabase data to match existing structure
            this.data.articles = data.map(article => ({
                id: article.id,
                slug: article.slug,
                title: article.title,
                excerpt: article.excerpt,
                sections: article.content, // JSONB field
                image: article.image,
                date: article.date,
                author: article.author,
                category: article.category,
                readTime: article.read_time,
                tags: article.tags,
                gallery: article.gallery
            }));

            this.isLoading = false;
            return this.data.articles;
        } catch (error) {
            logger.error('Error fetching articles:', error);
            this.isLoading = false;
            return [];
        }
    }

    async render() {
        logger.info('Rendering berita page');

        const container = DOM.create('div', {
            className: 'fade-in'
        });

        // Fetch articles from Supabase
        await this.fetchArticles();

        container.appendChild(this.renderHero());
        container.appendChild(this.renderCategoryFilter());
        container.appendChild(this.renderFeaturedCarousel());
        container.appendChild(this.renderArticleGrid());

        // Attach event listeners after render
        setTimeout(() => this.attachEventListeners(), 100);

        return container;
    }

    renderHero() {
        const section = DOM.create('section', {
            className: 'relative min-h-screen flex items-center'
        });

        section.innerHTML = `
            <div class="absolute inset-0 z-0">
                <img 
                    src="${this.data.hero.image}" 
                    alt="Berita Background" 
                    class="w-full h-full object-cover"
                >
                <div class="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-pink-900/80"></div>
            </div>
            
            <div class="container mx-auto px-4 relative z-10 text-white text-center">
                <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg animate-fade-in-up">
                    ${this.data.hero.title}
                </h1>
                <p class="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-10 animate-fade-in-up delay-100">
                    ${this.data.hero.subtitle}
                </p>
                
                <div class="animate-fade-in-up delay-200">
                    <button onclick="document.getElementById('featured-news').scrollIntoView({behavior: 'smooth'})" class="bg-white text-purple-900 font-bold py-4 px-8 rounded-full shadow-lg hover:bg-purple-50 hover:scale-105 transition-all transform flex items-center gap-2 mx-auto">
                        <span>Baca Berita Terbaru</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        return section;
    }

    renderCategoryFilter() {
        const section = DOM.create('section', {
            className: 'py-8 bg-white sticky top-20 z-30 shadow-sm border-b'
        });

        section.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="flex overflow-x-auto gap-2 md:gap-3 scrollbar-hide pb-2 justify-start md:justify-center">
                    ${this.data.categories.map(cat => `
                        <button 
                            data-category="${cat.id}" 
                            class="category-filter px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${cat.id === 'semua' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'}"
                        >
                            ${cat.label}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        return section;
    }

    renderFeaturedCarousel() {
        const featuredArticles = this.data.articles.slice(0, 5); // Top 5 articles

        const section = DOM.create('section', {
            id: 'featured-news',
            className: 'py-12 bg-gray-50 overflow-hidden scroll-mt-40'
        });

        section.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-2xl font-bold text-gray-800">✨ Berita Unggulan</h2>
                    <div class="flex gap-2">
                        <button id="carousel-prev" class="p-2 rounded-full bg-white shadow hover:bg-purple-50 text-purple-600 transition">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button id="carousel-next" class="p-2 rounded-full bg-white shadow hover:bg-purple-50 text-purple-600 transition">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>

                <div class="relative">
                    <div id="carousel-track" class="flex gap-6 transition-transform duration-500 ease-out">
                        ${featuredArticles.map(article => `
                            <div class="carousel-item min-w-[300px] md:min-w-[400px] lg:min-w-[500px] relative group cursor-pointer" data-slug="${article.slug}">
                                <div class="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg">
                                    <img 
                                        src="${article.image}" 
                                        alt="${article.title}"
                                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    >
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                    
                                    <div class="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
                                        <span class="inline-block px-3 py-1 bg-purple-600 text-xs font-bold rounded-full mb-3 shadow-lg">
                                            ${article.category.toUpperCase()}
                                        </span>
                                        <h3 class="text-xl md:text-2xl font-bold leading-tight mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                                            ${article.title}
                                        </h3>
                                        <div class="flex items-center gap-4 text-sm text-gray-300">
                                            <span>📅 ${article.date}</span>
                                            <span>⏱️ ${article.readTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    renderArticleGrid() {
        const section = DOM.create('section', {
            className: 'py-12 bg-white min-h-screen'
        });

        section.innerHTML = `
            <div class="container mx-auto px-4">
                <h2 class="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-purple-600 pl-4">
                    Artikel Terbaru
                </h2>

                <div id="articles-grid" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${this.data.articles.map(article => this.renderArticleCard(article)).join('')}
                </div>
                
                <div id="empty-state" class="hidden text-center py-20">
                    <div class="text-6xl mb-4">🔍</div>
                    <h3 class="text-xl font-semibold text-gray-700">Tidak ada artikel ditemukan</h3>
                    <p class="text-gray-500">Coba pilih kategori lain.</p>
                </div>
            </div>
        `;

        return section;
    }

    renderArticleCard(article) {
        return `
            <div class="article-card group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full" data-category="${article.category}" data-slug="${article.slug}">
                <div class="relative h-48 overflow-hidden cursor-pointer">
                    <img 
                        src="${article.image}" 
                        alt="${article.title}"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    >
                    <div class="absolute top-4 left-4">
                        <span class="px-3 py-1 bg-white/90 backdrop-blur text-purple-700 text-xs font-bold rounded-full shadow-sm">
                            ${article.category.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div class="p-6 flex flex-col flex-grow">
                    <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span class="flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            ${article.date}
                        </span>
                        <span class="flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            ${article.readTime}
                        </span>
                    </div>

                    <h3 class="text-lg font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2 cursor-pointer">
                        ${article.title}
                    </h3>
                    
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                        ${article.excerpt}
                    </p>

                    <div class="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                        <span class="text-xs font-medium text-gray-500">
                            Oleh <span class="text-gray-700">${article.author}</span>
                        </span>
                        <button class="text-purple-600 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Baca Selengkapnya
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Category filter
        const filterButtons = document.querySelectorAll('.category-filter');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterArticles(category);

                // Update active state
                filterButtons.forEach(b => {
                    b.classList.remove('bg-purple-600', 'text-white', 'shadow-md');
                    b.classList.add('bg-gray-100', 'text-gray-600');
                });
                e.currentTarget.classList.remove('bg-gray-100', 'text-gray-600');
                e.currentTarget.classList.add('bg-purple-600', 'text-white', 'shadow-md');
            });
        });

        // Carousel navigation
        const track = document.getElementById('carousel-track');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        let scrollPos = 0;

        if (track && prevBtn && nextBtn) {
            nextBtn.addEventListener('click', () => {
                scrollPos += 400;
                if (scrollPos > track.scrollWidth - track.clientWidth) scrollPos = track.scrollWidth - track.clientWidth;
                track.style.transform = `translateX(-${scrollPos}px)`;
            });

            prevBtn.addEventListener('click', () => {
                scrollPos -= 400;
                if (scrollPos < 0) scrollPos = 0;
                track.style.transform = `translateX(-${scrollPos}px)`;
            });
        }

        // Article click navigation
        const articleLinks = document.querySelectorAll('[data-slug]');
        articleLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Prevent if clicking category button inside card
                if (e.target.closest('.category-filter')) return;

                const slug = e.currentTarget.dataset.slug;
                // Navigate to article detail page by replacing the entire URL
                const baseUrl = window.location.origin + window.location.pathname;
                window.location.href = `${baseUrl}#/artikel/${slug}`;
            });
        });
    }

    filterArticles(category) {
        this.currentCategory = category;
        const cards = document.querySelectorAll('.article-card');
        let visibleCount = 0;

        cards.forEach(card => {
            if (category === 'semua' || card.dataset.category === category) {
                card.style.display = 'flex'; // Restore flex layout
                card.classList.add('fade-in');
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        const emptyState = document.getElementById('empty-state');
        if (visibleCount === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }
}
