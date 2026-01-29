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
                image: "/public/images/kegiatan/ca8b51c5-e5a1-4069-9d86-59839d9337a2.jpeg"
            },
            articles: []
        };
        this.carouselIndex = 0;
        this.sliderPage = 0; // Current page untuk artikel slider
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
        // Category filter dihapus sesuai permintaan
        container.appendChild(this.renderFeaturedCarousel());
        container.appendChild(this.renderArticleSlider());

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

    /**
     * Render artikel sebagai slider/carousel dengan tombol navigasi
     * Card design tetap sama, hanya layout yang berubah
     */
    renderArticleSlider() {
        const section = DOM.create('section', {
            className: 'py-12 bg-white'
        });

        section.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 border-l-4 border-purple-600 pl-4">
                        Artikel Terbaru
                    </h2>
                    <div class="flex gap-2">
                        <button id="grid-prev" class="p-3 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button id="grid-next" class="p-3 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>

                <!-- Slider viewport -->
                <div class="overflow-hidden">
                    <div id="articles-slider" class="transition-transform duration-500 ease-out">
                        <!-- Cards akan di-render dalam grid per halaman -->
                    </div>
                </div>
                
                <!-- Page Indicator -->
                <div id="slider-dots" class="flex justify-center gap-2 mt-8"></div>
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
        // Carousel navigation (Berita Unggulan)
        const track = document.getElementById('carousel-track');
        const carouselPrev = document.getElementById('carousel-prev');
        const carouselNext = document.getElementById('carousel-next');
        let scrollPos = 0;

        if (track && carouselPrev && carouselNext) {
            carouselNext.addEventListener('click', () => {
                scrollPos += 400;
                if (scrollPos > track.scrollWidth - track.clientWidth) scrollPos = track.scrollWidth - track.clientWidth;
                track.style.transform = `translateX(-${scrollPos}px)`;
            });

            carouselPrev.addEventListener('click', () => {
                scrollPos -= 400;
                if (scrollPos < 0) scrollPos = 0;
                track.style.transform = `translateX(-${scrollPos}px)`;
            });
        }

        // Initialize artikel slider
        this.initGridSlider();

        // Article click navigation
        document.addEventListener('click', (e) => {
            const cardEl = e.target.closest('[data-slug]');
            if (cardEl) {
                const slug = cardEl.dataset.slug;
                const baseUrl = window.location.origin + window.location.pathname;
                window.location.href = `${baseUrl}#/artikel/${slug}`;
            }
        });
    }

    /**
     * Inisialisasi slider untuk artikel grid
     * Responsive: 6 items (desktop), 4 items (tablet), 2 items (mobile)
     */
    initGridSlider() {
        const slider = document.getElementById('articles-slider');
        const prevBtn = document.getElementById('grid-prev');
        const nextBtn = document.getElementById('grid-next');
        const dotsContainer = document.getElementById('slider-dots');

        if (!slider || !prevBtn || !nextBtn) return;

        const articles = this.data.articles;

        // Fungsi untuk mendapat jumlah item per halaman berdasarkan viewport
        const getItemsPerPage = () => {
            if (window.innerWidth >= 1024) return 6;  // lg: 6 items (3 cols x 2 rows)
            if (window.innerWidth >= 640) return 4;   // sm: 4 items (2 cols x 2 rows)
            return 2;                                  // xs: 2 items (1 col x 2 rows)
        };

        // Fungsi untuk menghitung total halaman
        const getTotalPages = () => Math.ceil(articles.length / getItemsPerPage());

        // Fungsi untuk render halaman saat ini
        const renderCurrentPage = () => {
            const itemsPerPage = getItemsPerPage();
            const startIdx = this.sliderPage * itemsPerPage;
            const endIdx = startIdx + itemsPerPage;
            const pageArticles = articles.slice(startIdx, endIdx);

            // Render cards dalam grid (2 rows)
            slider.innerHTML = `
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${pageArticles.map(article => this.renderArticleCard(article)).join('')}
                </div>
            `;

            // Update button states
            prevBtn.disabled = this.sliderPage === 0;
            nextBtn.disabled = this.sliderPage >= getTotalPages() - 1;

            // Update dots
            renderDots();
        };

        // Fungsi untuk render dots indicator
        const renderDots = () => {
            if (!dotsContainer) return;
            const totalPages = getTotalPages();
            dotsContainer.innerHTML = Array.from({ length: totalPages }, (_, i) => `
                <button class="slider-dot w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === this.sliderPage ? 'bg-purple-600 w-8' : 'bg-gray-300 hover:bg-gray-400'}" data-page="${i}"></button>
            `).join('');

            // Attach click events to dots
            dotsContainer.querySelectorAll('.slider-dot').forEach(dot => {
                dot.addEventListener('click', (e) => {
                    this.sliderPage = parseInt(e.currentTarget.dataset.page, 10);
                    renderCurrentPage();
                });
            });
        };

        // Event listeners for navigation buttons
        prevBtn.addEventListener('click', () => {
            if (this.sliderPage > 0) {
                this.sliderPage--;
                renderCurrentPage();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (this.sliderPage < getTotalPages() - 1) {
                this.sliderPage++;
                renderCurrentPage();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            // Pastikan sliderPage tidak melebihi total pages setelah resize
            const maxPage = Math.max(0, getTotalPages() - 1);
            if (this.sliderPage > maxPage) {
                this.sliderPage = maxPage;
            }
            renderCurrentPage();
        });

        // Initial render
        renderCurrentPage();
    }
}
