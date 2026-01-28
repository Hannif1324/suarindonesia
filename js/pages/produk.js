/**
 * Produk Page Component
 * Displays a list of products with a hero section.
 */

import { DOM } from '../../utils/helpers.js';
import { supabase } from '../services/supabase-client.js';
import { logger } from '../../debugs/logger.js';

export class ProdukPage {
    constructor() {
        this.data = {
            hero: {
                title: "Produk Unggulan Komunitas",
                subtitle: "Dukung kemandirian ekonomi masyarakat melalui produk-produk berkualitas hasil karya komunitas binaan SuaR Indonesia.",
                backgroundImage: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=507,fit=crop/YZ9b16O2aksMXqwd/whatsapp-image-2025-09-20-at-1.05.35-pm-m7VDkB63V9hryMqo.jpeg",
                ctaText: "Lihat Produk",
                ctaLink: "#daftar-produk"
            },
            products: []
        };
    }

    async fetchProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform to match existing structure
            this.data.products = data.map(product => ({
                id: product.id,
                title: product.title,
                description: product.description,
                image: product.image,
                price: product.price,
                priceUnit: product.price_unit,
                variants: product.variants,
                sizes: product.sizes,
                whatsappLink: product.whatsapp_link
            }));

            return this.data.products;
        } catch (error) {
            logger.error('Error fetching products:', error);
            return [];
        }
    }

    async render() {
        logger.info('Rendering produk page');

        const container = DOM.create('div', {
            className: 'fade-in'
        });

        // Fetch products from Supabase
        await this.fetchProducts();

        // 1. Hero Section
        const heroSection = this.renderHero();
        container.appendChild(heroSection);

        // 2. Product List Section
        const productSection = this.renderProductList();
        container.appendChild(productSection);

        return container;
    }

    renderHero() {
        const hero = DOM.create('section', {
            className: 'relative min-h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden'
        });

        // Background Image with Overlay
        hero.innerHTML = `
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-gray-900/90 z-10"></div>
                <img 
                    src="${this.data.hero.backgroundImage}" 
                    alt="Produk SuaR Indonesia" 
                    class="w-full h-full object-cover opacity-50"
                    onerror="this.src='https://via.placeholder.com/1920x1080?text=SuaR+Indonesia+Produk'"
                >
            </div>
            
            <div class="relative z-20 container mx-auto px-4 text-center">
                <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
                    ${this.data.hero.title}
                </h1>
                <p class="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                    ${this.data.hero.subtitle}
                </p>
                <a href="${this.data.hero.ctaLink}" 
                   class="inline-flex items-center bg-white text-primary-dark hover:bg-gray-100 font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg animate-fade-in-up delay-200">
                    ${this.data.hero.ctaText}
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </a>
            </div>
        `;

        return hero;
    }

    renderProductList() {
        const section = DOM.create('section', {
            id: 'daftar-produk',
            className: 'py-20 bg-gray-50'
        });

        const container = DOM.create('div', {
            className: 'container mx-auto px-4'
        });

        // Section Header
        const header = DOM.create('div', {
            className: 'text-center mb-16'
        });
        header.innerHTML = `
            <span class="text-primary font-semibold tracking-wider uppercase">Katalog Kami</span>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mt-2">Pilihan Produk Terbaik</h2>
            <div class="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        `;
        container.appendChild(header);

        // Product Grid
        const grid = DOM.create('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto'
        });

        this.data.products.forEach(product => {
            const card = this.createProductCard(product);
            grid.appendChild(card);
        });

        container.appendChild(grid);
        section.appendChild(container);

        return section;
    }

    createProductCard(product) {
        const card = DOM.create('div', {
            className: 'bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col'
        });

        // Image Section
        const imageContainer = DOM.create('div', {
            className: 'relative h-80 overflow-hidden group'
        });
        imageContainer.innerHTML = `
            <img 
                src="${product.image}" 
                alt="${product.title}" 
                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                onerror="this.src='https://via.placeholder.com/600x400?text=${product.title}'"
            >
            <div class="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all"></div>
            <div class="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full font-bold shadow-lg">
                ${product.price} <span class="text-sm font-normal opacity-90">${product.priceUnit}</span>
            </div>
        `;
        card.appendChild(imageContainer);

        // Content Section
        const content = DOM.create('div', {
            className: 'p-8 flex-1 flex flex-col'
        });

        content.innerHTML = `
            <h3 class="text-2xl font-bold text-gray-800 mb-3">${product.title}</h3>
            <p class="text-gray-600 mb-6 leading-relaxed flex-1">
                ${product.description}
            </p>
            
            <div class="mb-8">
                <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Varian Tersedia:
                </h4>
                <ul class="space-y-2">
                    ${product.variants.map(variant => `
                        <li class="flex items-start text-sm text-gray-600">
                            <span class="mr-2 text-green-500">✓</span> ${variant}
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div class="mb-8">
                 <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                    </svg>
                    Ukuran:
                </h4>
                <div class="flex flex-wrap gap-2">
                    ${product.sizes.map(size => `
                        <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm font-medium border border-gray-200">
                            ${size}
                        </span>
                    `).join('')}
                </div>
            </div>

            <a href="${product.whatsappLink}" target="_blank" 
               class="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-bold py-4 rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center justify-center">
                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Beli Sekarang
            </a>
        `;

        card.appendChild(content);
        return card;
    }
}
