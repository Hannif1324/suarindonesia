/**
 * Layanan Page Component
 * Displays SuaR Indonesia services and programs with modern design
 */

import { DOM } from '../../utils/helpers.js';
import { layananData } from '../../services/data-service-layanan.js';
import { logger } from '../../debugs/logger.js';

export class LayananPage {
    constructor() {
        this.data = layananData;
    }

    async render() {
        logger.info('Rendering layanan page');

        const container = DOM.create('div', {
            className: 'fade-in'
        });

        container.appendChild(this.renderHero());
        container.appendChild(this.renderNavigation());
        container.appendChild(this.renderHIVProgram());
        container.appendChild(this.renderDisasterProgram());
        container.appendChild(this.renderEducationProgram());
        container.appendChild(this.renderResearchProgram());
        container.appendChild(this.renderChildProtection());
        container.appendChild(this.renderInternship());

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
            className: 'relative min-h-screen flex items-center'
        });

        section.innerHTML = `
            <div class="absolute inset-0 z-0">
                <img 
                    src="/public/images/home/d8be2edf-1e8e-4191-a782-8bc687f5fd66.jpeg" 
                    alt="Layanan Background" 
                    class="w-full h-full object-cover"
                >
                <div class="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-purple-700/70 to-pink-600/80"></div>
            </div>
            
            <div class="container mx-auto px-4 relative z-10 text-white text-center">
                <p class="text-xl md:text-2xl text-purple-100 mb-6 italic font-light max-w-4xl mx-auto animate-fade-in-up">
                    "${this.data.hero.quote}"
                </p>
                <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg animate-fade-in-up delay-100">
                    ${this.data.hero.title}
                </h1>
                <p class="text-xl md:text-2xl text-purple-50 mb-10 animate-fade-in-up delay-200">
                    ${this.data.hero.subtitle}
                </p>
                
                <div class="flex justify-center gap-4 animate-fade-in-up delay-300">
                    <a href="#hiv-aids" data-link class="inline-block bg-white text-purple-900 font-semibold py-4 px-8 rounded-full transition transform hover:scale-105 shadow-lg">
                        Lihat Program
                    </a>
                </div>
            </div>
        `;

        return section;
    }

    renderNavigation() {
        // Navigation removed - using only main navbar
        return DOM.create('div', { className: 'hidden' });
    }

    renderHIVProgram() {
        const service = this.data.services.hivAids;
        const section = DOM.create('section', {
            id: service.id,
            className: 'relative min-h-screen flex items-center py-20 bg-white opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Decorative Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-purple-50 opacity-60"></div>
            
            <!-- Medical Themed Decorations -->
            <div class="absolute top-20 right-10 w-32 h-32 text-red-100 opacity-50 animate-pulse-slow">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>
            </div>
            <div class="absolute bottom-20 left-10 w-40 h-40 bg-red-200 rounded-full blur-3xl opacity-20"></div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-6xl mx-auto">
                    ${this.renderServiceHeader(service)}
                    
                    <div class="grid md:grid-cols-2 gap-12 items-center">
                        <div class="relative group">
                            <div class="absolute -inset-4 bg-gradient-to-r from-red-400 to-purple-500 rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition duration-500"></div>
                            <img src="${service.image}" alt="${service.title}" class="relative w-full h-[400px] object-cover rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition duration-500">
                            
                            <!-- Floating Stat Card -->
                            <div class="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl animate-bounce-slow hidden md:block">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    </div>
                                    <div>
                                        <p class="text-xs text-gray-500 font-bold uppercase">Dampak</p>
                                        <p class="text-sm font-bold text-gray-900">Kesehatan Masyarakat</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <p class="text-gray-700 mb-8 leading-relaxed text-lg">${service.description}</p>
                            ${service.content ? `<div class="prose prose-purple max-w-none mb-8">${service.content}</div>` : ''}
                            
                            ${service.focus ? `
                                <div class="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-red-100 shadow-sm">
                                    <h4 class="font-bold text-red-900 mb-4 flex items-center gap-2">
                                        <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                                        Fokus Utama
                                    </h4>
                                    <ul class="space-y-3">
                                        ${service.focus.map(item => `
                                            <li class="flex items-start gap-3">
                                                <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                                </svg>
                                                <span class="text-gray-700">${item}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        return section;
    }

    renderDisasterProgram() {
        const service = this.data.services.kebencanaan;
        const section = DOM.create('section', {
            id: service.id,
            className: 'relative min-h-screen flex items-center py-20 bg-gray-50 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Nature Themed Decorations -->
            <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div class="absolute top-20 left-20 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-30"></div>
                <div class="absolute bottom-20 right-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
                <svg class="absolute top-40 right-10 w-24 h-24 text-green-200 opacity-40 animate-float" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 22h20L12 2zm0 3l7.53 15H4.47L12 5z"/>
                </svg>
            </div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-6xl mx-auto">
                    ${this.renderServiceHeader(service)}
                    
                    <div class="grid md:grid-cols-2 gap-12 mb-12">
                        <div class="order-2 md:order-1">
                            <div class="relative group">
                                <div class="absolute -inset-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition duration-500"></div>
                                <img src="${service.image}" alt="${service.title}" class="relative w-full h-[400px] object-cover rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition duration-500">
                                
                                <!-- Floating Badge -->
                                <div class="absolute -top-6 -left-6 bg-white p-4 rounded-xl shadow-xl animate-bounce-slow hidden md:block">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                        </div>
                                        <div>
                                            <p class="text-xs text-gray-500 font-bold uppercase">Respon Cepat</p>
                                            <p class="text-sm font-bold text-gray-900">Tanggap Bencana</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="order-1 md:order-2">
                            <p class="text-gray-700 mb-8 leading-relaxed text-lg">${service.description}</p>
                            <ul class="space-y-4">
                                ${service.highlights.map(item => `
                                    <li class="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-50">
                                        <div class="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 text-green-600">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <span class="text-gray-700 font-medium mt-2">${item}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl border border-green-100 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div class="relative z-10">
                            <div class="flex flex-col md:flex-row gap-8 items-start">
                                <div class="flex-1">
                                    <h4 class="text-2xl font-bold text-green-900 mb-2 flex items-center gap-2">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                        ${service.caseStudy.title}
                                    </h4>
                                    <p class="text-green-700 font-medium mb-4 flex items-center gap-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        ${service.caseStudy.year}
                                    </p>
                                    <p class="text-gray-700 leading-relaxed">${service.caseStudy.description}</p>
                                </div>
                                <div class="flex flex-wrap gap-2 md:w-1/3 justify-end content-start">
                                    ${service.caseStudy.focus.map(item => `
                                        <span class="px-4 py-2 bg-white rounded-lg text-sm font-bold text-green-700 shadow-sm border border-green-100 hover:bg-green-50 transition-colors cursor-default">${item}</span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    renderEducationProgram() {
        const service = this.data.services.pendidikan;
        const section = DOM.create('section', {
            id: service.id,
            className: 'relative min-h-screen flex items-center py-20 bg-white opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Education Themed Decorations -->
            <div class="absolute top-0 right-0 w-1/3 h-full bg-yellow-50/50 skew-x-12 transform origin-top-right pointer-events-none"></div>
            <div class="absolute bottom-20 left-10 w-32 h-32 bg-yellow-100 rounded-full blur-3xl opacity-40"></div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-6xl mx-auto">
                    ${this.renderServiceHeader(service)}
                    
                    <div class="grid md:grid-cols-2 gap-16 items-center">
                        <div class="order-2 md:order-1">
                            <p class="text-gray-700 mb-8 leading-relaxed text-lg">${service.description}</p>
                            
                            <div class="bg-white rounded-2xl shadow-xl border border-yellow-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                                <div class="bg-yellow-50 p-6 border-b border-yellow-100">
                                    <h4 class="font-bold text-yellow-900 text-xl flex items-center gap-3">
                                        <span class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-yellow-600 shadow-sm">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg>
                                        </span>
                                        Program Pelatihan
                                    </h4>
                                </div>
                                <div class="p-6">
                                    <ul class="space-y-4">
                                        ${service.programs.map(item => `
                                            <li class="flex items-center gap-4 group/item">
                                                <div class="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 group-hover/item:bg-yellow-500 group-hover/item:text-white transition-colors duration-300">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                                </div>
                                                <span class="text-gray-700 font-medium group-hover/item:text-yellow-700 transition-colors">${item}</span>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="mt-8 p-6 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                                <p class="text-yellow-800 font-medium italic text-lg">"${service.goal}"</p>
                            </div>
                        </div>
                        
                        <div class="order-1 md:order-2 relative group">
                            <div class="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition duration-500"></div>
                            <img src="${service.image}" alt="${service.title}" class="relative w-full h-[500px] object-cover rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition duration-500">
                            
                            <!-- Floating Badge -->
                            <div class="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl animate-bounce-slow hidden md:block max-w-xs">
                                <p class="text-gray-500 text-xs font-bold uppercase mb-2">Fokus Kami</p>
                                <p class="text-gray-900 font-bold text-lg leading-tight">Menciptakan Generasi Cerdas & Berkarakter</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    renderResearchProgram() {
        const service = this.data.services.penelitian;
        const section = DOM.create('section', {
            id: service.id,
            className: 'relative min-h-screen flex items-center py-20 bg-gray-50 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Data Themed Decorations -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
                <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
                
                <!-- Grid Pattern -->
                <svg class="absolute inset-0 w-full h-full opacity-[0.03]" width="100%" height="100%">
                    <defs>
                        <pattern id="grid-research" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-research)"/>
                </svg>
            </div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-6xl mx-auto">
                    ${this.renderServiceHeader(service)}
                    
                    <div class="grid md:grid-cols-2 gap-12 items-center">
                        <div class="relative group">
                            <div class="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition duration-500"></div>
                            <img src="${service.image}" alt="${service.title}" class="relative w-full h-[450px] object-cover rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition duration-500">
                            
                            <!-- Floating Stats -->
                            <div class="absolute top-8 -right-8 bg-white p-4 rounded-xl shadow-xl animate-bounce-slow hidden md:block border border-blue-50">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                    </div>
                                    <div>
                                        <p class="text-xs text-gray-500 font-bold uppercase">Data Driven</p>
                                        <p class="text-sm font-bold text-gray-900">Analisis Mendalam</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <p class="text-gray-700 mb-8 leading-relaxed text-lg">${service.description}</p>
                            
                            <div class="bg-white rounded-xl p-8 shadow-lg border border-blue-50 relative overflow-hidden">
                                <div class="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-10 -mt-10"></div>
                                
                                <h4 class="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                    Fokus Penelitian
                                </h4>
                                
                                <ul class="space-y-4">
                                    ${service.focus.map(item => `
                                        <li class="flex items-start gap-3 group">
                                            <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                            <span class="text-gray-700 group-hover:text-blue-700 transition-colors">${item}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return section;
    }

    renderChildProtection() {
        const service = this.data.services.perlindunganAnak;
        const section = DOM.create('section', {
            id: service.id,
            className: 'relative min-h-screen flex items-center py-20 bg-white opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Protection Themed Decorations -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute top-1/4 left-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-40 animate-pulse-slow"></div>
                <div class="absolute bottom-1/4 right-10 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-40"></div>
                
                <!-- Shield Icons Background -->
                <svg class="absolute top-20 right-20 w-16 h-16 text-pink-100 opacity-60 transform rotate-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
            </div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-6xl mx-auto">
                    ${this.renderServiceHeader(service)}
                    
                    <div class="grid md:grid-cols-2 gap-12 items-center">
                        <div class="order-2 md:order-1">
                            <p class="text-gray-700 mb-8 leading-relaxed text-lg">${service.description}</p>
                            
                            <div class="grid gap-6">
                                <div class="bg-pink-50 rounded-xl p-6 border border-pink-100 hover:shadow-md transition-shadow duration-300">
                                    <h4 class="font-bold text-pink-900 mb-4 flex items-center gap-2">
                                        <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                        Isu Strategis
                                    </h4>
                                    <ul class="space-y-2">
                                        ${service.issues.map(item => `
                                            <li class="flex items-center gap-3 text-gray-700 text-sm">
                                                <span class="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                                                ${item}
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>

                                <div class="bg-purple-50 rounded-xl p-6 border border-purple-100 hover:shadow-md transition-shadow duration-300">
                                    <h4 class="font-bold text-purple-900 mb-2 flex items-center gap-2">
                                        <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Dampak Program
                                    </h4>
                                    <p class="text-purple-800 italic">"${service.impact}"</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="order-1 md:order-2 relative group">
                            <div class="absolute -inset-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition duration-500"></div>
                            <img src="${service.image}" alt="${service.title}" class="relative w-full h-[500px] object-cover rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition duration-500">
                            
                            <div class="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl animate-bounce-slow hidden md:block max-w-[200px]">
                                <p class="text-gray-500 text-xs font-bold uppercase mb-1">Komitmen Kami</p>
                                <p class="text-pink-600 font-bold text-sm">Melindungi Masa Depan Anak Indonesia</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return section;
    }

    renderInternship() {
        const service = this.data.services.magang;
        const section = DOM.create('section', {
            id: service.id,
            className: 'relative min-h-screen flex items-center py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        section.innerHTML = `
            <!-- Background Patterns -->
            <div class="absolute inset-0 opacity-10">
                <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid-intern" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="1" fill="white"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-intern)"/>
                </svg>
            </div>
            
            <!-- Glowing Orbs -->
            <div class="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[100px] opacity-20"></div>
            <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-[100px] opacity-20"></div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="max-w-6xl mx-auto">
                    <div class="text-center mb-16">
                        <div class="inline-block p-4 rounded-full bg-white/10 backdrop-blur-md mb-6 shadow-lg border border-white/20 animate-float">
                            <span class="text-5xl block">${service.icon}</span>
                        </div>
                        <h2 class="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                            ${service.title}
                        </h2>
                        <p class="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">${service.subtitle}</p>
                    </div>

                    <div class="grid md:grid-cols-2 gap-8 mb-12">
                        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-colors duration-300 group">
                            <h4 class="text-2xl font-bold mb-6 flex items-center gap-3 text-purple-200">
                                <span class="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">📋</span> 
                                Workshop Kelembagaan
                            </h4>
                            <ul class="space-y-4">
                                ${service.facilities.workshop.map(item => `
                                    <li class="flex items-start gap-4">
                                        <div class="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg class="w-3 h-3 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <span class="text-gray-100">${item}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-colors duration-300 group">
                            <h4 class="text-2xl font-bold mb-6 flex items-center gap-3 text-pink-200">
                                <span class="p-2 bg-pink-500/20 rounded-lg group-hover:bg-pink-500/30 transition-colors">🌾</span> 
                                Pendampingan Lapang
                            </h4>
                            <ul class="space-y-4">
                                ${service.facilities.fieldAssistance.map(item => `
                                    <li class="flex items-start gap-4">
                                        <div class="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg class="w-3 h-3 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <span class="text-gray-100">${item}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-white to-purple-50 text-gray-900 rounded-2xl p-10 text-center shadow-2xl transform hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                        <p class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 mb-2">${service.pricing.amount}</p>
                        <p class="text-gray-500 mb-8 font-medium uppercase tracking-wider text-sm">${service.pricing.duration}</p>
                        <p class="text-xl italic text-gray-700 font-serif max-w-3xl mx-auto">"${service.quote}"</p>
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    renderServiceHeader(service) {
        return `
            <div class="text-center mb-16">
                <div class="inline-block p-4 rounded-full bg-white shadow-lg mb-6 animate-bounce-slow">
                    <span class="text-5xl block">${service.icon}</span>
                </div>
                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    ${service.title}
                </h2>
                <p class="text-xl text-purple-600 font-medium max-w-2xl mx-auto">${service.subtitle}</p>
                <div class="w-24 h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full mt-6"></div>
            </div>
        `;
    }
}
