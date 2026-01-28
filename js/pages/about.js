/**
 * About Page Component (Tentang Kami)
 */

import { DOM } from '../../utils/helpers.js';
import { aboutData } from '../../services/data-service-about.js';
import { logger } from '../../debugs/logger.js';

export class AboutPage {
    constructor() {
        this.data = aboutData;
        this.activeSection = 'tentang-kami';
    }

    async render() {
        logger.info('Rendering about page');

        const container = DOM.create('div', {
            className: 'fade-in'
        });

        // Main Content
        container.appendChild(this.renderHero());
        container.appendChild(this.renderTentangSuar());
        container.appendChild(this.renderLogoSuar());
        container.appendChild(this.renderVisiMisi());
        container.appendChild(this.renderProgram());
        container.appendChild(this.renderBestPractice());
        container.appendChild(this.renderLegalitas());
        container.appendChild(this.renderPetaHotspot());
        container.appendChild(this.renderIsuStrategis());
        container.appendChild(this.renderRenstra());
        container.appendChild(this.renderMatrik());

        // Setup scroll animations after render
        setTimeout(() => this.setupScrollAnimations(container), 100);

        return container;
    }

    setupScrollAnimations(container) {
        const sections = container.querySelectorAll('section:not(#hero)');

        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Use requestAnimationFrame for smoother animation
                    requestAnimationFrame(() => {
                        entry.target.classList.add('animate-fade-up-active');
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            section.classList.add('animate-fade-up');
            observer.observe(section);
        });
    }


    renderHero() {
        const section = DOM.create('section', {
            // id: 'tentang-kami',
            className: 'relative min-h-screen flex items-center'
        });

        section.innerHTML = `
            <div class="absolute inset-0 z-0">
                <img src="${this.data.hero.image}" alt="Hero" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-purple-700/70 to-pink-600/80"></div>
            </div>
            <div class="container mx-auto px-4 relative z-10 text-center text-white">
                <div class="max-w-4xl mx-auto">
                    <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-relaxed italic drop-shadow-lg animate-fade-in-up">
                        "${this.data.hero.quote}"
                    </h1>
                    <div class="flex justify-center gap-4 animate-fade-in-up delay-100">
                        <a href="#tentang-kami" data-link class="inline-block bg-white text-purple-900 font-semibold py-4 px-8 rounded-full transition transform hover:scale-105 shadow-lg">
                            Pelajari Lebih Lanjut
                        </a>
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    renderTentangSuar() {
        const section = DOM.create('section', {
            id: 'tentang-kami',
            className: 'relative min-h-screen flex items-center py-20 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Decorative Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50"></div>
            
            <!-- Decorative Pattern -->
            <div class="absolute inset-0 opacity-5">
                <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="1.5" fill="#673de6"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
                </svg>
            </div>

            <!-- Floating Decorative Circles -->
            <div class="absolute top-20 left-10 w-32 h-32 bg-purple-300 rounded-full blur-2xl opacity-15"></div>
            <div class="absolute bottom-20 right-10 w-40 h-40 bg-pink-300 rounded-full blur-2xl opacity-15"></div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-6xl mx-auto">
                    <!-- Title with decorative line -->
                    <div class="text-center mb-12">
                        <div class="inline-block">
                            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                ${this.data.tentangSuar.title}
                            </h2>
                            <div class="h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
                        </div>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-12 items-center">
                        <!-- Image with decorative frame -->
                        <div class="relative group">
                            <div class="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-10"></div>
                            <div class="relative">
                                <img src="${this.data.tentangSuar.image}" alt="Tentang Suar" class="rounded-2xl shadow-2xl w-full transform group-hover:scale-[1.02] transition duration-300">
                            </div>
                        </div>
                        
                        <!-- Content with enhanced styling -->
                        <div class="space-y-6">
                            <div class="relative">
                                <div class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                                <p class="text-lg md:text-xl text-gray-700 leading-relaxed pl-6">
                                    ${this.data.tentangSuar.content}
                                </p>
                            </div>
                            
                            <!-- Decorative stats or highlights -->
                            <div class="grid grid-cols-3 gap-4 pt-8">
                                <div class="text-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                                    <div class="text-2xl font-bold text-purple-600">15+</div>
                                    <div class="text-sm text-gray-600 mt-1">Tahun</div>
                                </div>
                                <div class="text-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                                    <div class="text-2xl font-bold text-purple-600">1000+</div>
                                    <div class="text-sm text-gray-600 mt-1">Mitra</div>
                                </div>
                                <div class="text-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                                    <div class="text-2xl font-bold text-purple-600">50+</div>
                                    <div class="text-sm text-gray-600 mt-1">Program</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    renderLogoSuar() {
        const section = DOM.create('section', {
            className: 'relative min-h-screen flex items-center py-20 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Geometric Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50"></div>
            
            <!-- Geometric Shapes -->
            <div class="absolute top-0 right-0 w-96 h-96 opacity-10">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#673de6" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,40.1,76.8C26.4,84.6,10,87.6,-5.7,86.8C-21.4,86,-42.8,81.4,-58.4,71.8C-74,62.2,-83.8,47.6,-88.9,31.4C-94,15.2,-94.4,-2.6,-89.3,-18.9C-84.2,-35.2,-73.6,-50,-60.1,-58.4C-46.6,-66.8,-30.2,-68.8,-14.8,-72.9C0.6,-77,15.7,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>
            <div class="absolute bottom-0 left-0 w-80 h-80 opacity-10">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#ec4899" d="M39.5,-65.5C51.4,-58.1,61.3,-47.3,68.4,-34.8C75.5,-22.3,79.8,-8.1,79.3,6.1C78.8,20.3,73.5,34.5,64.8,46.3C56.1,58.1,44,67.5,30.4,72.8C16.8,78.1,1.7,79.3,-13.1,76.8C-27.9,74.3,-42.4,68.1,-54.3,58.4C-66.2,48.7,-75.5,35.5,-79.4,20.9C-83.3,6.3,-81.8,-9.7,-75.8,-23.5C-69.8,-37.3,-59.3,-48.9,-46.8,-56C-34.3,-63.1,-20.8,-65.7,-6.8,-66.9C7.2,-68.1,27.6,-72.9,39.5,-65.5Z" transform="translate(100 100)" />
                </svg>
            </div>

            <!-- Floating geometric elements -->
            <div class="absolute top-1/4 left-20 w-16 h-16 border-4 border-purple-300 rotate-45 opacity-20 animate-pulse"></div>
            <div class="absolute bottom-1/4 right-20 w-20 h-20 border-4 border-pink-300 rounded-full opacity-20 animate-pulse delay-200"></div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-6xl mx-auto">
                    <!-- Title -->
                    <div class="text-center mb-16">
                        <div class="inline-block">
                            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                ${this.data.logoSuar.title}
                            </h2>
                            <div class="h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
                        </div>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-16 items-center">
                        <!-- Logo with animated background -->
                        <div class="flex justify-center relative">
                            <div class="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-10"></div>
                            <div class="relative bg-white p-12 rounded-3xl shadow-2xl">
                                <img src="${this.data.logoSuar.image}" alt="Logo Suar" class="w-64 h-64 object-contain transform hover:scale-110 transition duration-500">
                                <!-- Decorative corner elements -->
                                <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-600 rounded-tl-lg"></div>
                                <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-600 rounded-tr-lg"></div>
                                <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-pink-600 rounded-bl-lg"></div>
                                <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-pink-600 rounded-br-lg"></div>
                            </div>
                        </div>
                        
                        <!-- Points with enhanced cards -->
                        <div class="space-y-4">
                            ${this.data.logoSuar.points.map((point, index) => `
                                <div class="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-purple-600 hover:border-pink-600">
                                    <div class="flex gap-4 items-start">
                                        <span class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            ${index + 1}
                                        </span>
                                        <p class="text-gray-700 leading-relaxed pt-2 group-hover:text-gray-900 transition-colors">${point}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    renderVisiMisi() {
        const section = DOM.create('section', {
            id: 'visi-misi',
            className: 'relative min-h-screen flex items-center py-20 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Inspirational Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-white via-purple-50/40 to-pink-50/40"></div>
            
            <!-- Decorative Stars/Sparkles -->
            <div class="absolute top-10 right-20 text-purple-300 opacity-20">
                <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            </div>
            <div class="absolute bottom-20 left-10 text-pink-300 opacity-20">
                <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            </div>

            <!-- Quote decoration -->
            <div class="absolute top-1/4 left-10 text-purple-200 opacity-20 text-9xl font-serif">"</div>
            <div class="absolute bottom-1/4 right-10 text-pink-200 opacity-20 text-9xl font-serif rotate-180">"</div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-6xl mx-auto space-y-20">
                    <!-- Visi -->
                    <div>
                        <div class="text-center mb-12">
                            <div class="inline-block">
                                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                    ${this.data.visi.title}
                                </h2>
                                <div class="h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
                            </div>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-12 items-center">
                            <div class="relative group">
                                <div class="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-10"></div>
                                <img src="${this.data.visi.image}" alt="Visi" class="relative rounded-2xl shadow-2xl w-full transform group-hover:scale-[1.02] transition duration-300">
                            </div>
                            <div class="relative">
                                <div class="absolute -top-6 -left-6 text-purple-600 opacity-20 text-6xl font-serif">"</div>
                                <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-10 rounded-2xl shadow-xl border-l-4 border-purple-600">
                                    <p class="text-xl md:text-2xl text-gray-800 leading-relaxed font-medium italic relative z-10">
                                        ${this.data.visi.content}
                                    </p>
                                </div>
                                <div class="absolute -bottom-6 -right-6 text-purple-600 opacity-20 text-6xl font-serif rotate-180">"</div>
                            </div>
                        </div>
                    </div>

                    <!-- Misi -->
                    <div>
                        <div class="text-center mb-12">
                            <div class="inline-block">
                                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                    ${this.data.misi.title}
                                </h2>
                                <div class="h-1 bg-gradient-to-r from-transparent via-pink-600 to-transparent"></div>
                            </div>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-12 items-start">
                            <div class="relative group order-2 md:order-1">
                                <div class="absolute -inset-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-10"></div>
                                <img src="${this.data.misi.image}" alt="Misi" class="relative rounded-2xl shadow-2xl w-full transform group-hover:scale-[1.02] transition duration-300">
                            </div>
                            <div class="space-y-4 order-1 md:order-2">
                                ${this.data.misi.items.map((item, index) => `
                                    <div class="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-pink-600 hover:border-purple-600">
                                        <div class="flex gap-4 items-start">
                                            <span class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                ${index + 1}
                                            </span>
                                            <p class="text-gray-700 leading-relaxed pt-2 group-hover:text-gray-900 transition-colors">${item}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    renderProgram() {
        const section = DOM.create('section', {
            id: 'program',
            className: 'relative min-h-screen flex items-center py-20 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Grid Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-purple-50/30"></div>
            
            <!-- Decorative Grid Pattern -->
            <div class="absolute inset-0 opacity-5">
                <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="program-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                            <rect x="0" y="0" width="1" height="60" fill="#673de6"/>
                            <rect x="0" y="0" width="60" height="1" fill="#673de6"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#program-grid)"/>
                </svg>
            </div>

            <!-- Floating Icons -->
            <div class="absolute top-20 right-20 text-purple-300 opacity-20">
                <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-6xl mx-auto">
                    <!-- Title -->
                    <div class="text-center mb-16">
                        <div class="inline-block">
                            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                ${this.data.program.title}
                            </h2>
                            <div class="h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
                        </div>
                    </div>
                    
                    <!-- Program Grid -->
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${this.data.program.items.map((item, index) => `
                            <div class="group bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-t-4 border-purple-600 hover:border-pink-600 transform hover:-translate-y-2">
                                <div class="flex items-start gap-4">
                                    <span class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                        ${index + 1}
                                    </span>
                                    <p class="text-gray-800 font-medium leading-relaxed pt-3 group-hover:text-gray-900 transition-colors">${item}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    renderBestPractice() {
        const section = DOM.create('section', {
            id: 'best-practice',
            className: 'relative min-h-screen flex items-center py-20 bg-gradient-to-b from-white via-purple-50/30 to-white opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="max-w-4xl mx-auto">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                        ${this.data.bestPractice.title}
                    </h2>
                    <p class="text-xl text-gray-600 mb-12 text-center font-medium">
                        ${this.data.bestPractice.subtitle}
                    </p>
                    
                    <div class="space-y-4" id="accordion-best-practice">
                        ${this.data.bestPractice.sections.map((item, index) => `
                            <div class="accordion-item group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-purple-100">
                                <button 
                                    class="accordion-header w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                                    data-accordion-target="accordion-content-${index}"
                                    aria-expanded="${index === 0 ? 'true' : 'false'}"
                                >
                                    <div class="flex items-center gap-4 flex-1">
                                        <span class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            ${index + 1}
                                        </span>
                                        <h3 class="text-lg md:text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                                            ${item.title}
                                        </h3>
                                    </div>
                                    <svg 
                                        class="accordion-chevron w-6 h-6 text-purple-600 transition-transform duration-300 flex-shrink-0 ${index === 0 ? 'rotate-180' : ''}" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div 
                                    id="accordion-content-${index}" 
                                    class="accordion-content overflow-hidden transition-all duration-500 ease-in-out ${index === 0 ? 'max-h-96' : 'max-h-0'}"
                                    aria-hidden="${index === 0 ? 'false' : 'true'}"
                                >
                                    <div class="px-6 pb-6 pt-2">
                                        <div class="pl-14 pr-4">
                                            <div class="h-px bg-gradient-to-r from-purple-200 via-pink-200 to-transparent mb-4"></div>
                                            <p class="text-gray-700 leading-relaxed text-base">
                                                ${item.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add accordion functionality
        setTimeout(() => {
            const accordionButtons = section.querySelectorAll('.accordion-header');

            accordionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const targetId = button.getAttribute('data-accordion-target');
                    const content = document.getElementById(targetId);
                    const chevron = button.querySelector('.accordion-chevron');
                    const isExpanded = button.getAttribute('aria-expanded') === 'true';

                    // Close all other accordions
                    accordionButtons.forEach(otherButton => {
                        if (otherButton !== button) {
                            const otherTargetId = otherButton.getAttribute('data-accordion-target');
                            const otherContent = document.getElementById(otherTargetId);
                            const otherChevron = otherButton.querySelector('.accordion-chevron');

                            otherButton.setAttribute('aria-expanded', 'false');
                            otherContent.setAttribute('aria-hidden', 'true');
                            otherContent.style.maxHeight = '0';
                            otherChevron.classList.remove('rotate-180');
                        }
                    });

                    // Toggle current accordion
                    if (isExpanded) {
                        button.setAttribute('aria-expanded', 'false');
                        content.setAttribute('aria-hidden', 'true');
                        content.style.maxHeight = '0';
                        chevron.classList.remove('rotate-180');
                    } else {
                        button.setAttribute('aria-expanded', 'true');
                        content.setAttribute('aria-hidden', 'false');
                        content.style.maxHeight = content.scrollHeight + 'px';
                        chevron.classList.add('rotate-180');
                    }
                });
            });

            // Set initial state for first item
            const firstContent = section.querySelector('#accordion-content-0');
            if (firstContent) {
                firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
            }
        }, 100);

        return section;
    }


    renderLegalitas() {
        const section = DOM.create('section', {
            id: 'legalitas',
            className: 'relative min-h-screen flex items-center py-20 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Document Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-purple-50/20"></div>
            
            <!-- Decorative Document Icons -->
            <div class="absolute top-10 left-10 text-purple-200 opacity-20">
                <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                </svg>
            </div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-5xl mx-auto text-center">
                    <!-- Title -->
                    <div class="mb-16">
                        <div class="inline-block">
                            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                ${this.data.legalitas.title}
                            </h2>
                            <div class="h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
                        </div>
                    </div>
                    
                    <!-- Document Showcase -->
                    <div class="relative group">
                        <div class="absolute -inset-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-10"></div>
                        <div class="relative bg-white p-10 rounded-2xl shadow-2xl">
                            <img src="${this.data.legalitas.image}" alt="Legalitas" class="w-full max-w-3xl mx-auto rounded-lg shadow-lg transform group-hover:scale-[1.02] transition duration-300">
                            <!-- Document badge -->
                            <div class="absolute top-4 right-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                Dokumen Resmi
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    renderPetaHotspot() {
        const section = DOM.create('section', {
            id: 'peta-hotspot',
            className: 'relative min-h-screen flex items-center py-20 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Map Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-white via-green-50/30 to-blue-50/30"></div>
            
            <!-- Map Pin Icons -->
            <div class="absolute top-20 right-20 text-green-300 opacity-20">
                <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
            </div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-5xl mx-auto text-center">
                    <!-- Title -->
                    <div class="mb-16">
                        <div class="inline-block">
                            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                ${this.data.petaHotspot.title}
                            </h2>
                            <div class="h-1 bg-gradient-to-r from-transparent via-green-600 to-transparent"></div>
                        </div>
                    </div>
                    
                    <!-- Map Container -->
                    <div class="relative group">
                        <div class="absolute -inset-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl opacity-10"></div>
                        <div class="relative bg-white p-8 rounded-2xl shadow-2xl">
                            <div class="relative">
                                <img src="${this.data.petaHotspot.image}" alt="Peta Hotspot" class="w-full max-w-4xl mx-auto rounded-xl shadow-lg">
                                <!-- Map overlay badge -->
                                <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                                    <p class="text-sm font-semibold text-gray-700">📍 Peta Sebaran Hotspot</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    renderIsuStrategis() {
        const section = DOM.create('section', {
            id: 'isu-strategis',
            className: 'relative min-h-screen flex items-center py-20 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Stats Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-orange-50/20"></div>
            
            <!-- Decorative Chart Icon -->
            <div class="absolute bottom-10 left-10 text-orange-200 opacity-20">
                <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                </svg>
            </div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-6xl mx-auto">
                    <!-- Title -->
                    <div class="text-center mb-16">
                        <div class="inline-block">
                            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                ${this.data.isuStrategis.title}
                            </h2>
                            <div class="h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent"></div>
                        </div>
                    </div>
                    
                    <!-- Issues Grid -->
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${this.data.isuStrategis.items.map((item, index) => `
                            <div class="group bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-l-4 border-orange-600 hover:border-purple-600 transform hover:-translate-y-2">
                                <div class="flex items-start gap-4">
                                    <span class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        ${index + 1}
                                    </span>
                                    <p class="text-gray-800 font-medium leading-relaxed pt-3 group-hover:text-gray-900 transition-colors">${item}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    renderRenstra() {
        const section = DOM.create('section', {
            id: 'renstra',
            className: 'relative min-h-screen flex items-center py-20 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Background with timeline pattern -->
            <div class="absolute inset-0 bg-gradient-to-br from-white via-purple-50/20 to-white"></div>
            
            <!-- Timeline decoration -->
            <div class="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-300 to-transparent opacity-30"></div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-4xl mx-auto">
                    <!-- Title -->
                    <div class="text-center mb-16">
                        <div class="inline-block">
                            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                ${this.data.renstra.title}
                            </h2>
                            <div class="h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
                        </div>
                    </div>
                    
                    <!-- Accordion -->
                    <div class="space-y-4" id="accordion-renstra">
                        ${this.data.renstra.sections.map((renstraSection, sectionIndex) => `
                            <div class="accordion-item group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-purple-100">
                                <button 
                                    class="accordion-header w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                                    data-accordion-target="renstra-content-${sectionIndex}"
                                    aria-expanded="${sectionIndex === 0 ? 'true' : 'false'}"
                                >
                                    <div class="flex items-center gap-4 flex-1">
                                        <!-- Timeline dot -->
                                        <div class="relative">
                                            <span class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                ${sectionIndex + 1}
                                            </span>
                                            <div class="absolute top-1/2 -left-8 w-8 h-px bg-purple-300 hidden md:block"></div>
                                        </div>
                                        <h3 class="text-lg md:text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                                            ${renstraSection.title}
                                        </h3>
                                    </div>
                                    <svg 
                                        class="accordion-chevron w-6 h-6 text-purple-600 transition-transform duration-300 flex-shrink-0 ${sectionIndex === 0 ? 'rotate-180' : ''}" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div 
                                    id="renstra-content-${sectionIndex}" 
                                    class="accordion-content overflow-hidden transition-all duration-500 ease-in-out ${sectionIndex === 0 ? 'max-h-[2000px]' : 'max-h-0'}"
                                    aria-hidden="${sectionIndex === 0 ? 'false' : 'true'}"
                                >
                                    <div class="px-6 pb-6 pt-2">
                                        <div class="pl-16 pr-4 space-y-6">
                                            <div class="h-px bg-gradient-to-r from-purple-200 via-pink-200 to-transparent mb-4"></div>
                                            
                                            ${renstraSection.items ? `
                                                <div class="space-y-3">
                                                    ${renstraSection.items.map((item, itemIndex) => `
                                                        <div class="flex gap-3 items-start bg-purple-50/50 p-4 rounded-lg hover:bg-purple-50 transition-colors">
                                                            <span class="flex-shrink-0 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                                                                ${itemIndex + 1}
                                                            </span>
                                                            <p class="text-gray-700 leading-relaxed text-sm">${item}</p>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            ` : ''}
                                            
                                            ${renstraSection.subsections ? `
                                                <div class="space-y-4 mt-6">
                                                    ${renstraSection.subsections.map((subsection, subIndex) => `
                                                        <div class="bg-gradient-to-r from-white to-purple-50/30 p-5 rounded-lg border-l-4 border-pink-600 hover:shadow-md transition-shadow">
                                                            <h4 class="text-base font-bold text-purple-800 mb-2 flex items-center gap-2">
                                                                <span class="w-6 h-6 bg-pink-600 text-white rounded flex items-center justify-center text-xs font-bold">
                                                                    ${String.fromCharCode(65 + subIndex)}
                                                                </span>
                                                                ${subsection.subtitle}
                                                            </h4>
                                                            <p class="text-gray-700 leading-relaxed text-sm pl-8">
                                                                ${subsection.content}
                                                            </p>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add accordion functionality
        setTimeout(() => {
            const accordionButtons = section.querySelectorAll('.accordion-header');

            accordionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const targetId = button.getAttribute('data-accordion-target');
                    const content = document.getElementById(targetId);
                    const chevron = button.querySelector('.accordion-chevron');
                    const isExpanded = button.getAttribute('aria-expanded') === 'true';

                    // Close all other accordions
                    accordionButtons.forEach(otherButton => {
                        if (otherButton !== button) {
                            const otherTargetId = otherButton.getAttribute('data-accordion-target');
                            const otherContent = document.getElementById(otherTargetId);
                            const otherChevron = otherButton.querySelector('.accordion-chevron');

                            otherButton.setAttribute('aria-expanded', 'false');
                            otherContent.setAttribute('aria-hidden', 'true');
                            otherContent.style.maxHeight = '0';
                            otherChevron.classList.remove('rotate-180');
                        }
                    });

                    // Toggle current accordion
                    if (isExpanded) {
                        button.setAttribute('aria-expanded', 'false');
                        content.setAttribute('aria-hidden', 'true');
                        content.style.maxHeight = '0';
                        chevron.classList.remove('rotate-180');
                    } else {
                        button.setAttribute('aria-expanded', 'true');
                        content.setAttribute('aria-hidden', 'false');
                        content.style.maxHeight = content.scrollHeight + 'px';
                        chevron.classList.add('rotate-180');
                    }
                });
            });

            // Set initial state for first item
            const firstContent = section.querySelector('#renstra-content-0');
            if (firstContent) {
                firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
            }
        }, 100);

        return section;
    }

    renderMatrik() {
        const section = DOM.create('section', {
            id: 'matrik',
            className: 'relative min-h-screen flex items-center py-20 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Grid Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50"></div>
            
            <!-- Decorative Grid Pattern -->
            <div class="absolute inset-0 opacity-5">
                <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="matrik-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="1" fill="#673de6"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#matrik-grid)"/>
                </svg>
            </div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-6xl mx-auto">
                    <!-- Title -->
                    <div class="text-center mb-16">
                        <div class="inline-block">
                            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                MATRIK RENSTRA SUAR INDONESIA
                            </h2>
                            <div class="h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
                        </div>
                    </div>
                    
                    <!-- Matrik Cards -->
                    <div class="grid md:grid-cols-3 gap-6 mb-12">
                        ${this.data.matrikSections.map((item, index) => `
                            <a href="${item.link}" data-link class="group block bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-t-4 border-purple-600 hover:border-pink-600 text-center transform hover:-translate-y-2">
                                <div class="mb-4">
                                    <span class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        ${index + 1}
                                    </span>
                                </div>
                                <h3 class="text-xl font-bold text-purple-900 group-hover:text-purple-700 transition mb-4">
                                    ${item.title}
                                </h3>
                                <div class="flex justify-center">
                                    <svg class="w-6 h-6 text-purple-600 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                    
                    <!-- Info Note -->
                    <div class="bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-purple-600 p-6 rounded-xl shadow-md">
                        <div class="flex items-start gap-4">
                            <svg class="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                            </svg>
                            <p class="text-gray-700 font-medium">
                                <strong>Catatan:</strong> Matrik detail untuk setiap section akan ditampilkan pada halaman terpisah.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return section;
    }
}
