/**
 * Kegiatan Page Component
 * Displays SuaR Indonesia activities with photo gallery and video documentation
 */

import { DOM } from '../../utils/helpers.js';
import { supabase } from '../services/supabase-client.js';
import { logger } from '../../debugs/logger.js';

export class KegiatanPage {
    constructor() {
        this.data = {
            hero: {
                title: "Kegiatan SuaR Indonesia",
                subtitle: "Rapat, Pertemuan, Sosialisasi, dan Program Pelatihan",
                description: "Dokumentasi kegiatan dan program SuaR Indonesia dalam memberdayakan masyarakat",
                image: "/public/images/kegiatan/ca8b51c5-e5a1-4069-9d86-59839d9337a2.jpeg"
            },
            categories: [
                { id: 'semua', label: 'Semua Kegiatan', icon: '📋' },
                { id: 'rapat', label: 'Rapat & Pertemuan', icon: '🤝' },
                { id: 'pelatihan', label: 'Pelatihan & Workshop', icon: '📚' },
                { id: 'sosialisasi', label: 'Sosialisasi & Kampanye', icon: '📢' },
                { id: 'lapangan', label: 'Program Lapangan', icon: '🌾' },
                { id: 'monev', label: 'Monitoring & Evaluasi', icon: '📊' }
            ],
            activities: [],
            photoGallery: [],
            videos: []
        };
        this.currentCategory = 'semua';
        this.currentPhotoIndex = 0;
    }

    async fetchActivities() {
        try {
            const { data, error } = await supabase
                .from('activities')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.data.activities = data;
            return data;
        } catch (error) {
            logger.error('Error fetching activities:', error);
            return [];
        }
    }

    async fetchPhotoGallery() {
        try {
            const { data, error } = await supabase
                .from('photo_gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.data.photoGallery = data;
            return data;
        } catch (error) {
            logger.error('Error fetching photo gallery:', error);
            return [];
        }
    }

    async fetchVideos() {
        try {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.data.videos = data;
            return data;
        } catch (error) {
            logger.error('Error fetching videos:', error);
            return [];
        }
    }

    async render() {
        logger.info('Rendering kegiatan page');

        const container = DOM.create('div', {
            className: 'fade-in'
        });

        // Fetch all data from Supabase
        await Promise.all([
            this.fetchActivities(),
            this.fetchPhotoGallery(),
            this.fetchVideos()
        ]);

        container.appendChild(this.renderHero());
        container.appendChild(this.renderCategoryFilter());
        container.appendChild(this.renderActivities());
        container.appendChild(this.renderPhotoGallery());
        container.appendChild(this.renderVideoDocumentation());
        container.appendChild(this.renderLightbox());

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
                    alt="Kegiatan Background" 
                    class="w-full h-full object-cover"
                >
                <div class="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-purple-700/70 to-pink-600/80"></div>
            </div>
            
            <div class="container mx-auto px-4 relative z-10 text-white text-center">
                <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg animate-fade-in-up">
                    ${this.data.hero.title}
                </h1>
                <p class="text-xl md:text-2xl text-purple-50 mb-4 animate-fade-in-up delay-100">
                    ${this.data.hero.subtitle}
                </p>
                <p class="text-lg text-purple-100 max-w-3xl mx-auto mb-10 animate-fade-in-up delay-200">
                    ${this.data.hero.description}
                </p>
                
                <div class="flex justify-center gap-4 animate-fade-in-up delay-300">
                    <a href="#kegiatan" class="inline-block bg-white text-purple-900 font-semibold py-4 px-8 rounded-full transition transform hover:scale-105 shadow-lg">
                        Lihat Kegiatan
                    </a>
                    <a href="#foto-dokumentasi" class="inline-block bg-purple-600 text-white font-semibold py-4 px-8 rounded-full transition transform hover:scale-105 shadow-lg border-2 border-white">
                        Galeri Foto
                    </a>
                </div>
            </div>
        `;

        return section;
    }

    renderCategoryFilter() {
        const section = DOM.create('section', {
            id: 'kegiatan',
            className: 'py-8 bg-white sticky top-20 z-30 shadow-md'
        });

        section.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="flex overflow-x-auto gap-2 md:gap-3 scrollbar-hide pb-2">
                    ${this.data.categories.map(cat => `
                        <button 
                            data-category="${cat.id}" 
                            class="category-filter flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${cat.id === 'semua' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'}"
                        >
                            <span class="text-lg">${cat.icon}</span>
                            <span>${cat.label}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        return section;
    }

    renderActivities() {
        const section = DOM.create('section', {
            className: 'py-16 bg-gray-50'
        });

        section.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Kegiatan Kami
                    </h2>
                    <div class="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
                </div>

                <div id="activities-grid" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${this.data.activities.map(activity => this.renderActivityCard(activity)).join('')}
                </div>
            </div>
        `;

        return section;
    }

    renderActivityCard(activity) {
        return `
            <div class="activity-card group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2" data-category="${activity.category}">
                <div class="relative h-56 overflow-hidden">
                    <img 
                        src="${activity.image}" 
                        alt="${activity.title}"
                        class="w-full h-full object-cover transition-transform duration-500"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    <!-- Badges -->
                    <div class="absolute top-4 left-4 flex gap-2">
                        <span class="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                            ${this.getCategoryLabel(activity.category)}
                        </span>
                    </div>
                    <div class="absolute top-4 right-4">
                        <span class="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
                            📅 ${activity.date}
                        </span>
                    </div>
                </div>

                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                        ${activity.title}
                    </h3>
                    
                    <div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                            </svg>
                            ${activity.location}
                        </span>
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                            </svg>
                            ${activity.participants} peserta
                        </span>
                    </div>

                    <p class="text-gray-700 mb-4 line-clamp-3">
                        ${activity.description}
                    </p>

                    ${activity.highlights ? `
                        <ul class="space-y-1 mb-4">
                            ${activity.highlights.slice(0, 2).map(item => `
                                <li class="flex items-start gap-2 text-sm text-gray-600">
                                    <svg class="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                    </svg>
                                    <span>${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    ` : ''}

                    <div class="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full group-hover:w-full transition-all duration-300"></div>
                </div>
            </div>
        `;
    }

    renderPhotoGallery() {
        const section = DOM.create('section', {
            id: 'foto-dokumentasi',
            className: 'py-16 bg-white scroll-mt-40'
        });

        section.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        📸 Galeri Foto Dokumentasi
                    </h2>
                    <p class="text-lg text-gray-600">Dokumentasi kegiatan SuaR Indonesia</p>
                    <div class="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full mt-4"></div>
                </div>

                <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    ${this.data.photoGallery.map((photo, index) => `
                        <div class="gallery-item group relative aspect-square overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition-all" data-index="${index}">
                            <img 
                                src="${photo.image}" 
                                alt="${photo.caption}"
                                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            >
                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <div class="text-white">
                                    <p class="font-semibold text-sm mb-1">${photo.caption}</p>
                                    <p class="text-xs text-gray-300">${photo.date}</p>
                                </div>
                            </div>
                            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        return section;
    }

    renderVideoDocumentation() {
        const section = DOM.create('section', {
            id: 'video-dokumentasi',
            className: 'py-16 bg-gray-50'
        });

        section.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        🎥 Video Dokumentasi
                    </h2>
                    <p class="text-lg text-gray-600">Video kegiatan dan program SuaR Indonesia</p>
                    <div class="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full mt-4"></div>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    ${this.data.videos.map(video => `
                        <div class="video-card group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
                            <div class="relative aspect-video overflow-hidden cursor-pointer" data-video-url="${video.video_url}">
                                <img 
                                    src="${video.thumbnail}" 
                                    alt="${video.title}"
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                >
                                <div class="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg class="w-8 h-8 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div class="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                    ${video.duration}
                                </div>
                            </div>
                            <div class="p-4">
                                <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                    ${video.title}
                                </h3>
                                <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                                    ${video.description}
                                </p>
                                <p class="text-xs text-gray-500">${video.date}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        return section;
    }

    renderLightbox() {
        const lightbox = DOM.create('div', {
            id: 'photo-lightbox',
            className: 'fixed inset-0 bg-black/95 z-50 hidden items-center justify-center'
        });

        lightbox.innerHTML = `
            <button id="lightbox-close" class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>

            <button id="lightbox-prev" class="absolute left-4 text-white hover:text-gray-300 transition-colors">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>

            <button id="lightbox-next" class="absolute right-4 text-white hover:text-gray-300 transition-colors">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>

            <div class="max-w-6xl max-h-[90vh] px-4">
                <img id="lightbox-image" src="" alt="" class="max-w-full max-h-[80vh] object-contain">
                <div class="text-center mt-4 text-white">
                    <p id="lightbox-caption" class="text-lg font-medium mb-2"></p>
                    <p id="lightbox-date" class="text-sm text-gray-300 mb-2"></p>
                    <p id="lightbox-counter" class="text-sm text-gray-400"></p>
                </div>
            </div>
        `;

        return lightbox;
    }

    attachEventListeners() {
        // Category filter
        const filterButtons = document.querySelectorAll('.category-filter');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterActivities(category);

                // Update active state
                filterButtons.forEach(b => {
                    b.classList.remove('bg-purple-600', 'text-white');
                    b.classList.add('bg-gray-100', 'text-gray-700');
                });
                e.currentTarget.classList.remove('bg-gray-100', 'text-gray-700');
                e.currentTarget.classList.add('bg-purple-600', 'text-white');
            });
        });

        // Photo gallery lightbox
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.openLightbox(index);
            });
        });

        // Lightbox controls
        document.getElementById('lightbox-close')?.addEventListener('click', () => this.closeLightbox());
        document.getElementById('lightbox-prev')?.addEventListener('click', () => this.prevPhoto());
        document.getElementById('lightbox-next')?.addEventListener('click', () => this.nextPhoto());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const lightbox = document.getElementById('photo-lightbox');
            if (!lightbox.classList.contains('hidden')) {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.prevPhoto();
                if (e.key === 'ArrowRight') this.nextPhoto();
            }
        });

        // Video click (placeholder - would open video modal)
        const videoCards = document.querySelectorAll('[data-video-url]');
        videoCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const videoUrl = e.currentTarget.dataset.videoUrl;
                // Placeholder: Open video in modal or new window
                window.open(videoUrl, '_blank');
            });
        });
    }

    filterActivities(category) {
        this.currentCategory = category;
        const cards = document.querySelectorAll('.activity-card');

        cards.forEach(card => {
            if (category === 'semua' || card.dataset.category === category) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    }

    openLightbox(index) {
        this.currentPhotoIndex = index;
        const photo = this.data.photoGallery[index];
        const lightbox = document.getElementById('photo-lightbox');

        document.getElementById('lightbox-image').src = photo.image;
        document.getElementById('lightbox-caption').textContent = photo.caption;
        document.getElementById('lightbox-date').textContent = photo.date;
        document.getElementById('lightbox-counter').textContent = `${index + 1} / ${this.data.photoGallery.length}`;

        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.getElementById('photo-lightbox');
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }

    prevPhoto() {
        this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.data.photoGallery.length) % this.data.photoGallery.length;
        this.openLightbox(this.currentPhotoIndex);
    }

    nextPhoto() {
        this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.data.photoGallery.length;
        this.openLightbox(this.currentPhotoIndex);
    }

    getCategoryLabel(categoryId) {
        const category = this.data.categories.find(c => c.id === categoryId);
        return category ? category.label : categoryId;
    }
}
