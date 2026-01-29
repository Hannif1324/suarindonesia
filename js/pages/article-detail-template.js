/**
 * Article Detail Template Component
 * Renders individual article pages dynamically using Supabase data
 */

import { DOM } from '../../utils/helpers.js';
import { supabase } from '../services/supabase-client.js';
import { logger } from '../../debugs/logger.js';

export class ArticleDetailTemplate {
    constructor() {
        // No static data needed
    }

    async render(params) {
        const slug = params.slug;

        try {
            // Fetch article by slug
            const { data: article, error } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error || !article) {
                console.error('Error fetching article:', error);
                return this.renderNotFound();
            }

            logger.info(`Rendering article: ${article.title}`);

            const container = DOM.create('div', {
                className: 'fade-in bg-white min-h-screen'
            });

            container.appendChild(this.renderHero(article));
            container.appendChild(this.renderContent(article));

            // Render related articles asynchronously and append
            const relatedSection = await this.renderRelated(article);
            if (relatedSection) {
                container.appendChild(relatedSection);
            }

            // Scroll to top
            window.scrollTo(0, 0);

            return container;
        } catch (err) {
            console.error('Unexpected error rendering article:', err);
            return this.renderNotFound();
        }
    }

    renderHero(article) {
        const section = DOM.create('section', {
            className: 'relative h-[50vh] md:h-[60vh] flex items-end'
        });

        section.innerHTML = `
            <div class="absolute inset-0 z-0">
                <img 
                    src="${article.image}" 
                    alt="${article.title}" 
                    class="w-full h-full object-cover"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            </div>

            <!-- Back Button -->
            <div class="absolute top-24 left-4 md:left-8 z-20">
                <a href="#/berita" class="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/30 transition-all group">
                    <svg class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7 7-7m-7 7h18"></path>
                    </svg>
                    Kembali ke Berita
                </a>
            </div>
            
            <div class="container mx-auto px-4 relative z-10 text-white pb-12">
                <div class="max-w-4xl mx-auto">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="px-3 py-1 bg-purple-600 text-xs font-bold rounded-full uppercase tracking-wider">
                            ${article.category}
                        </span>
                        <span class="text-sm text-gray-300 border-l border-gray-500 pl-3">
                            ${article.date}
                        </span>
                        <span class="text-sm text-gray-300 border-l border-gray-500 pl-3">
                            ${article.read_time || '3 min read'}
                        </span>
                    </div>

                    <h1 class="text-3xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
                        ${article.title}
                    </h1>

                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-lg font-bold">
                            ${(article.author || 'S').charAt(0)}
                        </div>
                        <div>
                            <p class="font-medium text-white">${article.author || 'SuaR Indonesia'}</p>
                            <p class="text-xs text-gray-400">Penulis</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    renderContent(article) {
        // 1. Definisikan variabel URL dan Judul untuk Link Share
        const currentUrl = encodeURIComponent(window.location.href); 
        const shareTitle = encodeURIComponent(`Baca artikel menarik ini: ${article.title}`);
        const shareWa = `https://api.whatsapp.com/send?text=${shareTitle}%20${currentUrl}`;
        const shareFb = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
        const shareTw = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${currentUrl}`;
        const section = DOM.create('section', {
            className: 'py-12 md:py-16'
        });

        // Build content HTML
        let contentHTML = '';

        // Check if article has structured sections (JSONB) or plain text content
        if (Array.isArray(article.content)) {
            contentHTML = this.renderSections(article.content);
        } else {
            // Fallback to legacy content field or simple text
            contentHTML = `<article class="prose prose-lg prose-purple max-w-none mb-12">
                ${article.content || ''}
            </article>`;
        }

        // Build image gallery HTML if gallery exists
        let galleryHTML = '';
        if (article.gallery && article.gallery.length > 0) {
            galleryHTML = this.renderImageGallery(article.gallery);
        }

        // Build main video HTML if exists
        let videoHTML = '';
        if (article.video) {
            videoHTML = `
                <div class="mt-12 pt-8 border-t border-gray-200">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-purple-600 pl-4">
                        🎥 Video
                    </h3>
                    ${this.generateVideoHTML(article.video, '')}
                </div>
            `;
        }

        section.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="max-w-3xl mx-auto">
                    <!-- Breadcrumb -->
                    <nav class="flex text-sm text-gray-500 mb-8">
                        <a href="#/" class="hover:text-purple-600 transition">Home</a>
                        <span class="mx-2">/</span>
                        <a href="#/berita" class="hover:text-purple-600 transition">Berita</a>
                        <span class="mx-2">/</span>
                        <span class="text-gray-800 truncate max-w-[200px]">${article.title}</span>
                    </nav>

                    <!-- Article Body -->
                    ${contentHTML}

                    <!-- Main Video -->
                    ${videoHTML}

                    <!-- Image Gallery -->
                    ${galleryHTML}

                    <!-- Tags -->
                    ${article.tags && article.tags.length > 0 ? `
                        <div class="border-t border-b border-gray-100 py-6 mb-12">
                            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Tags</h4>
                            <div class="flex flex-wrap gap-2">
                                ${article.tags.map(tag => `
                                    <span class="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-purple-50 hover:text-purple-600 transition cursor-pointer">
                                        #${tag}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Share Section -->
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-t border-gray-100 mt-8">
                        <span class="font-medium text-gray-900">Bagikan artikel ini:</span>
                        <div class="flex gap-2">
                            <!-- WhatsApp -->
                            <a href="${shareWa}" 
                            target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:opacity-90 transition shadow-sm"
                            title="Share ke WhatsApp">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.683-2.031-9.672-.272-.248-.47-.372-.644-.372-.174 0-.371 0-.569.001h-.005c-.247.01-1.569.049-1.891.396-.322.347-1.238 1.213-1.238 2.962 0 1.748 1.288 3.447 1.461 3.696.173.247 2.502 3.858 6.075 5.433 3.57 1.579 3.57 1.054 4.212.982.643-.075 1.759-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                            </a>

                            <!-- Facebook -->
                            <a href="${shareFb}" 
                            target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-90 transition shadow-sm"
                            title="Share ke Facebook">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>

                            <!-- Twitter / X -->
                            <a href="${shareTw}" 
                            target="_blank" rel="noopener noreferrer"
                            class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition shadow-sm"
                            title="Share ke Twitter/X">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            </a>

                            <!-- Copy Link (Untuk Instagram/Lainnya) -->
                            <button id="copy-link-btn" 
                            class="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center hover:opacity-90 transition shadow-sm"
                            title="Salin Link">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add Event Listener for Copy Button with Custom Toast
        const copyBtn = section.querySelector('#copy-link-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href);
                this.showToast('Tautan artikel berhasil disalin!');
            });
        }

        return section;
    }

    showToast(message) {
        // Create toast element
        const toast = DOM.create('div', {
            className: 'fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-dark text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-50 opacity-0 transition-opacity duration-300'
        });

        toast.innerHTML = `
            <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="font-medium text-sm">${message}</span>
        `;

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('opacity-0');
        });

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('opacity-0');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    async renderRelated(currentArticle) {
        try {
            // Find related articles (same category, excluding current)
            const { data: related, error } = await supabase
                .from('articles')
                .select('id, title, slug, category, date, image')
                .eq('category', currentArticle.category)
                .neq('id', currentArticle.id)
                .limit(3);

            if (error || !related || related.length === 0) return DOM.create('div');

            const section = DOM.create('section', {
                className: 'py-12 bg-gray-50'
            });

            section.innerHTML = `
                <div class="container mx-auto px-4">
                    <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">Artikel Terkait</h3>
                    
                    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        ${related.map(article => `
                            <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer" onclick="window.location.href='#/artikel/${article.slug}'">
                                <div class="h-40 overflow-hidden">
                                    <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
                                </div>
                                <div class="p-4">
                                    <span class="text-xs font-bold text-purple-600 uppercase mb-2 block">${article.category}</span>
                                    <h4 class="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition">${article.title}</h4>
                                    <p class="text-xs text-gray-500">${article.date}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            return section;
        } catch (err) {
            console.error('Error fetching related articles:', err);
            return DOM.create('div');
        }
    }

    /**
     * Render structured sections
     */
    renderSections(sections) {
        let html = '<article class="prose prose-lg prose-purple max-w-none mb-12">';

        sections.forEach(section => {
            switch (section.type) {
                case 'paragraph':
                    const leadClass = section.lead ? 'text-xl text-gray-700 font-medium mb-6' : '';
                    html += `<p class="${leadClass}">${section.content}</p>`;
                    break;

                case 'heading':
                    html += `<h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4 border-l-4 border-purple-600 pl-4">${section.content}</h3>`;
                    break;

                case 'quote':
                    html += `
                        <blockquote class="border-l-4 border-purple-600 pl-6 py-4 my-6 bg-purple-50 rounded-r-lg">
                            <p class="text-lg italic text-gray-700 mb-2">"${section.content}"</p>
                            ${section.author ? `<cite class="text-sm font-semibold text-purple-700">— ${section.author}</cite>` : ''}
                        </blockquote>
                    `;
                    break;

                case 'image':
                    html += `
                        <figure class="my-8">
                            <img 
                                src="${section.url}" 
                                alt="${section.caption || ''}"
                                class="w-full rounded-lg shadow-lg"
                            >
                            ${section.caption ? `<figcaption class="text-center text-sm text-gray-600 mt-3">${section.caption}</figcaption>` : ''}
                        </figure>
                    `;
                    break;

                case 'video':
                    html += this.generateVideoHTML(section.url, section.caption);
                    break;

                case 'list':
                    const listTag = section.ordered ? 'ol' : 'ul';
                    const listClass = section.ordered ? 'list-decimal' : 'list-disc';
                    html += `<${listTag} class="${listClass} pl-6 my-4 space-y-2">`;
                    if (section.items) {
                        section.items.forEach(item => {
                            html += `<li class="text-gray-700">${item}</li>`;
                        });
                    }
                    html += `</${listTag}>`;
                    break;
            }
        });

        html += '</article>';
        return html;
    }

    generateVideoHTML(url, caption) {
        if (!url) return '';

        let embedHtml = '';

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            // YouTube
            const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
            embedHtml = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    class="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                ></iframe>`;
        } else if (url.includes('vimeo.com')) {
            // Vimeo
            const videoId = url.split('/').pop();
            embedHtml = `
                <iframe 
                    src="https://player.vimeo.com/video/${videoId}" 
                    frameborder="0" 
                    allow="autoplay; fullscreen; picture-in-picture" 
                    allowfullscreen
                    class="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                ></iframe>`;
        } else if (url.includes('drive.google.com')) {
            // Google Drive
            // Convert /view to /preview for embedding
            const driveUrl = url.replace('/view', '/preview').replace('?usp=sharing', '');
            embedHtml = `
                <iframe 
                    src="${driveUrl}" 
                    frameborder="0" 
                    allow="autoplay; fullscreen" 
                    allowfullscreen
                    class="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                ></iframe>`;
        } else {
            // Direct file (mp4, webm)
            embedHtml = `
                <video controls class="w-full rounded-lg shadow-lg bg-black">
                    <source src="${url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>`;
        }

        return `
            <figure class="my-8">
                <div class="relative w-full ${url.includes('youtube') || url.includes('vimeo') || url.includes('drive.google') ? 'pb-[56.25%]' : ''}">
                    ${embedHtml}
                </div>
                ${caption ? `<figcaption class="text-center text-sm text-gray-600 mt-3">${caption}</figcaption>` : ''}
            </figure>
        `;
    }

    /**
     * Render image gallery
     */
    renderImageGallery(gallery) {
        let html = `
            <div class="mt-12 pt-8 border-t border-gray-200">
                <h3 class="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-purple-600 pl-4">
                    📸 Galeri Foto
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        `;

        gallery.forEach(image => {
            html += `
                <figure class="group cursor-pointer">
                    <div class="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                        <img 
                            src="${image.url}" 
                            alt="${image.caption || ''}"
                            class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                        >
                    </div>
                    ${image.caption ? `<figcaption class="text-sm text-gray-600 mt-2 text-center">${image.caption}</figcaption>` : ''}
                </figure>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    renderNotFound() {
        const container = DOM.create('div', {
            className: 'min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4'
        });

        container.innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-4">😕</div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Artikel Tidak Ditemukan</h1>
                <p class="text-gray-600 mb-8">Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
                <a href="#/berita" class="inline-block bg-purple-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-purple-700 transition shadow-lg">
                    Kembali ke Berita
                </a>
            </div>
        `;

        return container;
    }
}
