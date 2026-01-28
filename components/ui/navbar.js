/**
 * Navbar Component
 */

import { DOM } from '../../utils/helpers.js';

export class Navbar {
    constructor() {
        this.activeLink = '/';
    }

    render() {
        const nav = DOM.create('nav', {
            className: 'bg-white shadow-sm fixed top-0 left-0 right-0 z-50 h-20 flex items-center'
        });

        nav.innerHTML = `
            <div class="container mx-auto px-4 relative">
                <div class="flex justify-between items-center h-full">
                    <!-- Logo -->
                    <a href="/" class="flex items-center space-x-2 sm:space-x-3 group" data-link>
                        <img 
                            src="/public/suar_lg_98929874989.webp" 
                            alt="SuaR Indonesia Logo" 
                            class="h-14 md:h-18 w-auto object-contain transition-all group-hover:scale-105"
                        />
                        <span class="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 font-heading tracking-tight group-hover:text-primary transition-colors">SuaR Indonesia</span>
                    </a>

                    <!-- Desktop Menu -->
                    <div class="hidden lg:flex items-center space-x-6">
                        <!-- Tentang Kami Dropdown -->
                        <div class="relative group">
                            <a href="/suar-indonesia" class="nav-link flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors uppercase tracking-wide py-2" data-link>
                                <span>TENTANG KAMI</span>
                                <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </a>
                            <div class="absolute left-0 mt-0 w-64 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                                <a href="/staff-suar-indonesia" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors first:rounded-t-md" data-link>STAFF</a>
                                <a href="/suar-indonesia#visi-misi" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors" data-link>VISI & MISI</a>
                                <a href="/suar-indonesia#program" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors" data-link>PROGRAM</a>
                                <a href="/suar-indonesia#best-practice" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors" data-link>BEST PRACTICE</a>
                                <a href="/suar-indonesia#legalitas" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors" data-link>LEGALITAS</a>
                                <a href="/suar-indonesia#peta-hotspot" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors" data-link>PETA HOTSPOT</a>
                                <a href="/suar-indonesia#isu-strategis" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors" data-link>ISU STRATEGIS</a>
                                <a href="/suar-indonesia#renstra" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors" data-link>KEMITRAAN SUAR, HIV & PEREMPUAN</a>
                                <a href="/suar-indonesia#matrik" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors last:rounded-b-md" data-link>MATRIKS REGISTRA SUAR INDONESIA</a>
                            </div>
                        </div>

                        <!-- Layanan Dropdown -->
                        <div class="relative group">
                            <a href="/layanan" class="nav-link flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary transition-colors uppercase tracking-wide py-2" data-link>
                                <span>LAYANAN</span>
                                <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </a>
                            <div class="absolute left-0 mt-0 w-72 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                                <a href="/layanan#hiv-aids" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors first:rounded-t-md" data-link>PENANGGULANGAN HIV/AIDS</a>
                                <a href="/layanan#kebencanaan" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors" data-link>PROGRAM KEBENCANAAN</a>
                                <a href="/layanan#pendidikan" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors" data-link>PENDIDIKAN & PELATIHAN</a>
                                <a href="/layanan#penelitian" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors" data-link>PROGRAM PENELITIAN</a>
                                <a href="/layanan#perlindungan-anak" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors" data-link>PROGRAM PERLINDUNGAN PEREMPUAN & ANAK</a>
                                <a href="/layanan#magang" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors last:rounded-b-md" data-link>PROGRAM MAGANG</a>
                            </div>
                        </div>

                        <a href="/produk" class="nav-link text-sm font-medium text-gray-700 hover:text-primary transition-colors uppercase tracking-wide" data-link>PRODUK</a>
                        <a href="/kegiatan-suar-indonesia" class="nav-link text-sm font-medium text-gray-700 hover:text-primary transition-colors uppercase tracking-wide" data-link>KEGIATAN</a>
                        <a href="/berita" class="nav-link text-sm font-medium text-gray-700 hover:text-primary transition-colors uppercase tracking-wide" data-link>BERITA</a>
                        
                        <!-- Pengaduan Button -->
                        <a href="/kontak-tim-suar-indonesia" class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-md transition-all shadow-md hover:shadow-lg transform hover:scale-105" data-link>
                            PENGADUAN
                        </a>
                    </div>

                    <!-- Mobile Menu Button -->
                    <button id="mobile-menu-btn" class="lg:hidden text-gray-700 focus:outline-none">
                        <svg id="hamburger-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                        <svg id="close-icon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- Mobile Menu -->
                <div id="mobile-menu" class="hidden lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
                    <div class="flex flex-col space-y-2 p-4">
                        <a href="/" class="nav-link block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-primary rounded-md transition-colors uppercase tracking-wide" data-link>BERANDA</a>
                        
                        <!-- Tentang Kami with submenu -->
                        <div class="mobile-dropdown">
                            <button class="mobile-dropdown-btn w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-primary rounded-md transition-colors uppercase tracking-wide">
                                <span>TENTANG KAMI</span>
                                <svg class="w-4 h-4 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div class="mobile-dropdown-content hidden pl-4 mt-1 space-y-1">
                                <a href="/suar-indonesia" class="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-primary rounded-md" data-link>Tentang Kami</a>
                                <a href="/staff-suar-indonesia" class="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-primary rounded-md" data-link>Staff</a>
                                <a href="/suar-indonesia#visi-misi" class="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-primary rounded-md" data-link>Visi & Misi</a>
                                <a href="/suar-indonesia#program" class="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-primary rounded-md" data-link>Program</a>
                                <a href="/suar-indonesia#best-practice" class="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-primary rounded-md" data-link>Best Practice</a>
                                <a href="/suar-indonesia#legalitas" class="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-primary rounded-md" data-link>Legalitas</a>
                            </div>
                        </div>
                        
                        <!-- Mobile Layanan Dropdown -->
                        <div class="mobile-dropdown">
                            <button class="mobile-dropdown-btn w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-primary rounded-md transition-colors uppercase tracking-wide">
                                <span>LAYANAN</span>
                                <svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div class="mobile-dropdown-content hidden pl-4 mt-1 space-y-1">
                                <a href="/layanan" class="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-primary rounded-md" data-link>Layanan</a>
                                <a href="/layanan#hiv-aids" class="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-primary rounded-md" data-link>Penanggulangan HIV/AIDS</a>
                                <a href="/layanan#kebencanaan" class="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-primary rounded-md" data-link>Program Kebencanaan</a>
                                <a href="/layanan#pendidikan" class="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-primary rounded-md" data-link>Pendidikan & Pelatihan</a>
                                <a href="/layanan#penelitian" class="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-primary rounded-md" data-link>Program Penelitian</a>
                                <a href="/layanan#perlindungan-anak" class="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-primary rounded-md" data-link>Perlindungan Perempuan & Anak</a>
                                <a href="/layanan#magang" class="block px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-primary rounded-md" data-link>Program Magang</a>
                            </div>
                        </div>
                        
                        <a href="/produk" class="nav-link block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-primary rounded-md transition-colors uppercase tracking-wide" data-link>PRODUK</a>
                        <a href="/kegiatan-suar-indonesia" class="nav-link block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-primary rounded-md transition-colors uppercase tracking-wide" data-link>KEGIATAN</a>
                        <a href="/berita" class="nav-link block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-primary rounded-md transition-colors uppercase tracking-wide" data-link>BERITA</a>
                        <a href="/kontak-tim-suar-indonesia" class="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-md text-center text-sm uppercase tracking-wide" data-link>PENGADUAN</a>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners(nav);
        return nav;
    }

    attachEventListeners(nav) {
        const mobileMenuBtn = nav.querySelector('#mobile-menu-btn');
        const mobileMenu = nav.querySelector('#mobile-menu');
        const hamburgerIcon = nav.querySelector('#hamburger-icon');
        const closeIcon = nav.querySelector('#close-icon');

        // Toggle mobile menu
        mobileMenuBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu?.classList.toggle('hidden');
            hamburgerIcon?.classList.toggle('hidden');
            closeIcon?.classList.toggle('hidden');
        });

        // Handle mobile dropdown
        const mobileDropdownBtns = nav.querySelectorAll('.mobile-dropdown-btn');
        mobileDropdownBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = btn.nextElementSibling;
                const arrow = btn.querySelector('svg');

                dropdown?.classList.toggle('hidden');
                arrow?.classList.toggle('rotate-180');
            });
        });

        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu?.querySelectorAll('a[data-link]');
        mobileLinks?.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu?.classList.add('hidden');
                hamburgerIcon?.classList.remove('hidden');
                closeIcon?.classList.add('hidden');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileMenu?.classList.contains('hidden')) {
                mobileMenu?.classList.add('hidden');
                hamburgerIcon?.classList.remove('hidden');
                closeIcon?.classList.add('hidden');
            }
        });
    }

    setActive(path) {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === path || (href !== '/' && path.startsWith(href))) {
                link.classList.add('text-primary', 'font-bold');
            } else {
                link.classList.remove('text-primary', 'font-bold');
            }
        });
    }
}
