/**
 * Staff Page Component
 * Displays SuaR Indonesia staff members with modern card design
 */

import { DOM } from '../../utils/helpers.js';
import { staffData } from '../../services/data-service-staff.js';
import { logger } from '../../debugs/logger.js';

export class StaffPage {
    constructor() {
        this.data = staffData;
    }

    async render() {
        logger.info('Rendering staff page');

        const container = DOM.create('div', {
            className: 'fade-in'
        });

        container.appendChild(this.renderHero());
        container.appendChild(this.renderManagement());
        container.appendChild(this.renderStaff());
        container.appendChild(this.renderOffices());

        return container;
    }

    renderHero() {
        const section = DOM.create('section', {
            className: 'relative min-h-[400px] flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 overflow-hidden'
        });

        section.innerHTML = `
            <div class="absolute inset-0 bg-black opacity-20"></div>
            <div class="absolute inset-0">
                <div class="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div class="absolute top-20 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div class="absolute bottom-10 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
            
            <div class="container mx-auto px-4 relative z-10 text-center">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                    ${this.data.hero.title}
                </h1>
                <p class="text-xl md:text-2xl text-purple-100 mb-4 font-medium">
                    ${this.data.hero.subtitle}
                </p>
                <p class="text-lg text-purple-50 max-w-3xl mx-auto">
                    ${this.data.hero.description}
                </p>
            </div>
        `;

        return section;
    }

    renderManagement() {
        const section = DOM.create('section', {
            className: 'py-16 bg-white'
        });

        section.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Manajemen
                    </h2>
                    <div class="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
                </div>

                <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    ${this.data.management.map(member => this.renderStaffCard(member, true)).join('')}
                </div>
            </div>
        `;

        return section;
    }

    renderStaff() {
        const section = DOM.create('section', {
            className: 'py-16 bg-gray-50'
        });

        section.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Tim Kami
                    </h2>
                    <div class="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
                </div>

                <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    ${this.data.staff.map(member => this.renderStaffCard(member, false)).join('')}
                </div>
            </div>
        `;

        return section;
    }

    renderStaffCard(member, isManagement = false) {
        const cardSize = isManagement ? 'lg' : 'md';

        return `
            <div class="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                <!-- Image Container with Gradient Overlay -->
                <div class="relative ${isManagement ? 'h-80' : 'h-64'} overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                    <img 
                        src="${member.image}" 
                        alt="${member.name}"
                        class="w-full h-full object-cover ${member.imagePosition === 'center' ? 'object-center' : 'object-top'} transition-transform duration-500"
                        loading="lazy"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <!-- Location Badge -->
                    <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                            </svg>
                            <span class="text-xs font-medium text-gray-700">${member.location}</span>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        ${member.name}
                    </h3>
                    <p class="text-sm text-gray-600 font-medium mb-3">
                        ${member.role}
                    </p>
                    
                    <!-- Decorative Line -->
                    <div class="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full group-hover:w-full transition-all duration-300"></div>
                </div>

                <!-- Hover Effect Border -->
                <div class="absolute inset-0 border-2 border-transparent group-hover:border-purple-400 rounded-xl transition-colors duration-300 pointer-events-none"></div>
            </div>
        `;
    }

    renderOffices() {
        const section = DOM.create('section', {
            className: 'py-16 bg-gradient-to-br from-purple-900 to-purple-700 text-white'
        });

        section.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold mb-4">
                        Kantor Kami
                    </h2>
                    <div class="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-300 mx-auto rounded-full"></div>
                </div>

                <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    ${this.data.offices.map(office => `
                        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                            <div class="flex items-start gap-4 mb-6">
                                <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold mb-2">${office.city}</h3>
                                    <p class="text-purple-100 leading-relaxed">${office.address}</p>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-3 pt-4 border-t border-white/20">
                                <svg class="w-5 h-5 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                </svg>
                                <a href="tel:${office.phone}" class="text-lg font-medium hover:text-pink-200 transition-colors">
                                    ${office.phone}
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="text-center mt-12">
                    <a href="mailto:official@suarindonesia.org" class="inline-flex items-center gap-2 bg-white text-purple-900 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                        official@suarindonesia.org
                    </a>
                </div>
            </div>
        `;

        return section;
    }
}
