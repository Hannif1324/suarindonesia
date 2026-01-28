/**
 * Home Page Component
 */

import { DOM } from '../../utils/helpers.js';
import { homeData, fetchHomeData } from '../../services/data-service-home.js';
import { logger } from '../../debugs/logger.js';

export class HomePage {
    constructor() {
        this.data = homeData;
    }

    async render() {
        logger.info('Rendering home page');

        // Fetch latest data
        this.data = await fetchHomeData();

        const container = DOM.create('div', {
            className: 'fade-in'
        });

        // Hero Section
        container.appendChild(this.renderHero());

        // About Section
        container.appendChild(this.renderAbout());

        // Services Section
        container.appendChild(this.renderServices());

        // Activities Section
        container.appendChild(this.renderActivities());

        // Products Section
        container.appendChild(this.renderProducts());

        // Articles Section
        container.appendChild(this.renderArticles());

        // Newsletter Section
        container.appendChild(this.renderNewsletter());

        // Partners Section
        // Partners Section
        container.appendChild(this.renderPartners());

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
            id: 'hero',
            className: 'relative min-h-screen flex items-center overflow-hidden'
        });

        section.innerHTML = `
            <!-- Video Background Layer -->
            <div class="absolute inset-0 z-0">
                <video 
                    autoplay 
                    loop 
                    muted 
                    playsinline
                    class="w-full h-full object-cover hero-video"
                >
                    <source src="${this.data.hero.image}" type="video/mp4">
                </video>
                <!-- Lighter overlay for better visibility -->
                <div class="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/20"></div>
            </div>
            
            <!-- Responsive Video Position Styles -->
            <style>
                /* Default: Desktop - center position */
                .hero-video {
                    object-position: center 10%;
                }
                
                /* Tablet (768px and below) - show right side (head) */
                @media (max-width: 768px) {
                    .hero-video {
                        object-position: 75% center;
                    }
                }
                
                /* Mobile (425px and below) - focus more on head */
                @media (max-width: 425px) {
                    .hero-video {
                        object-position: 80% center;
                    }
                }
            </style>

            <!-- Decorative Elements Layer (between video and text) -->
            <div class="absolute inset-0 z-[5] pointer-events-none">
                <!-- Grid Pattern with Gradient Fade -->
                <div class="absolute inset-0 opacity-40">
                    <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <!-- Grid Pattern -->
                            <pattern id="hero-grid-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                <line x1="0" y1="0" x2="0" y2="60" stroke="white" stroke-width="1" opacity="0.2"/>
                                <line x1="0" y1="0" x2="50" y2="0" stroke="white" stroke-width="1" opacity="0.2"/>
                            </pattern>
                            
                            <!-- Gradient Mask - Fade from left to center -->
                            <linearGradient id="grid-fade-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:white;stop-opacity:1" />
                                <stop offset="40%" style="stop-color:white;stop-opacity:0.8" />
                                <stop offset="60%" style="stop-color:white;stop-opacity:0.3" />
                                <stop offset="80%" style="stop-color:white;stop-opacity:0" />
                                <stop offset="100%" style="stop-color:white;stop-opacity:0" />
                            </linearGradient>
                            
                            <!-- Mask using the gradient -->
                            <mask id="grid-fade-mask">
                                <rect width="100%" height="100%" fill="url(#grid-fade-gradient)"/>
                            </mask>
                        </defs>
                        
                        <!-- Apply grid pattern with mask -->
                        <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" mask="url(#grid-fade-mask)"/>
                    </svg>
                </div>
                
                <!-- Gradient Mesh Overlays -->
                <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/20 via-transparent to-transparent rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>
                <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-primary/20 via-pink-500/10 to-transparent rounded-full blur-3xl translate-y-1/4 -translate-x-1/4"></div>
                <div class="absolute top-1/2 left-[5%] w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl"></div>
                
                <!-- Vertical Accent Lines (Left Side) -->
                <div class="absolute left-[8%] top-[15%] h-40 w-[2px] bg-gradient-to-b from-transparent via-primary/40 to-transparent animate-glow"></div>
                <div class="absolute left-[12%] top-[25%] h-32 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent animate-glow-delayed"></div>
                <div class="absolute left-[6%] bottom-[20%] h-48 w-[2px] bg-gradient-to-b from-transparent via-purple-400/40 to-transparent animate-glow"></div>
                
                <!-- Floating Geometric Shapes -->
                <div class="absolute top-1/4 left-[10%] w-32 h-32 border-2 border-white/10 rounded-lg rotate-12 animate-float"></div>
                <div class="absolute bottom-1/3 left-[5%] w-20 h-20 border border-purple-400/20 rounded-full animate-float-delayed"></div>
                <div class="absolute top-[35%] left-[4%] w-24 h-24 border border-white/10 rounded-lg rotate-45 animate-float"></div>
                <div class="absolute top-[65%] left-[14%] w-16 h-16 border-2 border-primary/20 rounded-full animate-float-slow"></div>
                
                <!-- Glowing Particles -->
                <div class="absolute top-1/2 left-[15%] w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                <div class="absolute top-[60%] left-[8%] w-3 h-3 bg-primary/60 rounded-full animate-pulse-delayed"></div>
                <div class="absolute top-[30%] left-[7%] w-2 h-2 bg-purple-400/50 rounded-full animate-pulse-slow"></div>
                <div class="absolute top-[45%] left-[11%] w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse-delayed"></div>
                <div class="absolute bottom-[30%] left-[9%] w-2.5 h-2.5 bg-pink-400/40 rounded-full animate-pulse"></div>
                
                <!-- Hexagon Shapes -->
                <div class="absolute top-[40%] left-[3%] opacity-20">
                    <svg width="40" height="46" viewBox="0 0 40 46" fill="none">
                        <path d="M20 0L40 11.5V34.5L20 46L0 34.5V11.5L20 0Z" stroke="#ffffff" stroke-width="1.5"/>
                    </svg>
                </div>
                <div class="absolute bottom-[35%] left-[16%] opacity-15 animate-float-delayed">
                    <svg width="30" height="35" viewBox="0 0 40 46" fill="none">
                        <path d="M20 0L40 11.5V34.5L20 46L0 34.5V11.5L20 0Z" stroke="#a855f7" stroke-width="1"/>
                    </svg>
                </div>
                
                <!-- Scan line effect -->
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent animate-scan"></div>
            </div>
            
            <!-- Content Layer -->
            <div class="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                <div class="max-w-7xl mx-auto">
                    <!-- Left-aligned content on desktop, centered on mobile -->
                    <div class="flex items-center min-h-screen">
                        <div class="w-full md:w-3/5 lg:w-1/2 text-white text-center md:text-left">
                            <!-- Subtitle -->
                            <p class="text-sm md:text-base lg:text-lg font-bold tracking-[0.3em] mb-6 text-primary-light animate-fade-in-up">
                                ${this.data.hero.subtitle}
                            </p>
                            
                            <!-- Main Title -->
                            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-8 leading-tight drop-shadow-2xl animate-fade-in-up delay-100">
                                ${this.data.hero.title}
                            </h1>
                            
                            <!-- Description -->
                            <div class="mb-10 animate-fade-in-up delay-200">
                                <p class="text-base md:text-lg lg:text-xl text-gray-100 leading-relaxed whitespace-pre-line drop-shadow-lg">
                                    ${this.data.hero.description}
                                </p>
                            </div>
                            
                            <!-- CTA Button with Glassmorphism -->
                            <div class="animate-fade-in-up delay-300 pt-12">
                                <a 
                                    href="#tentang-kami" 
                                    class="inline-flex items-center gap-3 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/30 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl group" 
                                    data-link
                                >
                                    TENTANG KAMI
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Wave Overlay at Bottom (to cover watermark) -->
            <div class="absolute bottom-0 left-0 right-0 z-10 overflow-hidden">
                <svg class="w-full h-24 sm:h-32" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:rgba(88, 28, 135, 0.3);stop-opacity:1" />
                            <stop offset="100%" style="stop-color:rgba(255, 255, 255, 1);stop-opacity:1" />
                        </linearGradient>
                        
                        <!-- Middle wave gradient - Light purple -->
                        <linearGradient id="waveGradientMiddle" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:rgba(167, 139, 250, 0.2);stop-opacity:1" />
                            <stop offset="100%" style="stop-color:rgba(233, 213, 255, 0.6);stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    
                    <!-- Back wave (Layer 1 - Purple gradient) -->
                    <path class="wave-animate-1" fill="url(#waveGradient)" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                    
                    <!-- Middle wave (Layer 2 - Light purple) -->
                    <path class="wave-animate-3" fill="url(#waveGradientMiddle)" d="M0,80L48,82.7C96,85,192,90,288,88C384,85,480,75,576,72C672,69,768,75,864,80C960,85,1056,90,1152,85.3C1248,80,1344,64,1392,56L1440,48L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                    
                    <!-- Front wave (Layer 3 - White) -->
                    <path class="wave-animate-2" fill="white" d="M0,96L48,90.7C96,85,192,75,288,74.7C384,75,480,85,576,90.7C672,96,768,96,864,90.7C960,85,1056,75,1152,69.3C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                </svg>
                
                <!-- Wave Animation Styles -->
                <style>
                    /* 
                    WAVE ANIMATION SETTINGS:
                    - translateY: Seberapa tinggi naik/turun (dalam pixel). Semakin besar, semakin terlihat bergelombang
                    - scaleY: Sedikit mengubah tinggi wave (0.95-1.05). Lebih natural dengan sedikit scale
                    - Duration (contoh: 4s): Seberapa cepat animasi. Semakin kecil angka, semakin cepat
                    - ease-in-out: Membuat gerakan smooth (bisa diganti linear untuk konstan)
                    */
                    
                    /* Wave 1 - Back wave (Purple) */
                    @keyframes wave-flow-1 {
                        0%, 100% {
                            transform: translateY(0) scaleY(1);
                        }
                        50% {
                            transform: translateY(-10px) scaleY(0.96);
                        }
                    }
                    
                    /* Wave 2 - Front wave (White) */
                    @keyframes wave-flow-2 {
                        0%, 100% {   
                            transform: translateY(0.5px) scaleY(1);
                        }
                        50% {
                            transform: translateY(12px) scaleY(1.04);
                        }
                    }
                    
                    /* Wave 3 - Middle wave (Light Purple) */
                    @keyframes wave-flow-3 {
                        0%, 100% {
                            transform: translateY(0) scaleY(1);
                        }
                        50% {
                            transform: translateY(6px) scaleY(1.01);
                        }
                    }
                    
                    .wave-animate-1 {
                        animation: wave-flow-1 4s ease-in-out infinite;
                        transform-origin: center;
                    }
                    
                    .wave-animate-2 {
                        animation: wave-flow-2 3s ease-in-out infinite;
                        transform-origin: center;
                    }
                    
                    .wave-animate-3 {
                        animation: wave-flow-3 3.5s ease-in-out infinite;
                        transform-origin: center;
                    }
                </style>
            </div>

            <!-- Custom Animations -->
            <style>
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(12deg); }
                    50% { transform: translateY(-20px) rotate(12deg); }
                }
                
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-30px); }
                }
                
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-15px) scale(1.05); }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.3; }
                }
                
                @keyframes pulse-delayed {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.5); }
                }
                
                @keyframes glow {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.6; }
                }
                
                @keyframes glow-delayed {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 0.5; }
                }
                
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-float-delayed {
                    animation: float-delayed 8s ease-in-out infinite;
                    animation-delay: 1s;
                }
                
                .animate-float-slow {
                    animation: float-slow 10s ease-in-out infinite;
                    animation-delay: 2s;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                
                .animate-pulse-delayed {
                    animation: pulse-delayed 3s ease-in-out infinite;
                    animation-delay: 0.5s;
                }
                
                .animate-glow {
                    animation: glow 3s ease-in-out infinite;
                }
                
                .animate-glow-delayed {
                    animation: glow-delayed 4s ease-in-out infinite;
                    animation-delay: 1.5s;
                }
                
                .animate-scan {
                    animation: scan 10s linear infinite;
                }
                
                /* Ensure video aspect ratio is maintained */
                video {
                    min-width: 100%;
                    min-height: 100%;
                }
            </style>
        `;

        return section;
    }

    renderAbout() {
        const section = DOM.create('section', {
            id: 'tentang-kami',
            className: 'relative min-h-screen flex items-center py-20 bg-white overflow-hidden'
        });

        section.innerHTML = `
            <!-- Decorative Background -->
            <div class="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 opacity-60"></div>
            
            <!-- Decorative Pattern -->
            <div class="absolute inset-0 opacity-5">
                <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="home-about-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="1.5" fill="#673de6"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#home-about-pattern)"/>
                </svg>
            </div>

            <!-- Large Blur Shapes -->
            <div class="absolute top-1/4 left-0 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20 -translate-x-1/2"></div>
            <div class="absolute bottom-1/4 right-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20 translate-x-1/3"></div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="flex flex-col md:flex-row items-center gap-16">
                    
                    <!-- Left: Image - WILL APPEAR SECOND (0.5s delay) -->
                    <div class="w-full md:w-1/2 opacity-0 translate-x-10" data-animate="image">
                        <div class="relative group">
                            <div class="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-10 blur-lg transition duration-500 group-hover:opacity-20"></div>
                            <div class="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black transform transition duration-500 group-hover:scale-[1.01]" style="max-height:560px;">
                                <img src="${this.data.about.image}" alt="About Image" class="w-full h-full object-cover">
                                <!-- Overlay gradient -->
                                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                            </div>

                            <!-- Floating Badge - WILL APPEAR LAST (1.6s delay) -->
                            <div class="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl hidden md:block opacity-0 scale-90" data-animate="badge">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div>
                                        <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Pengalaman</p>
                                        <p class="text-lg font-bold text-gray-900">15+ Tahun</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right: Text Content -->
                    <div class="w-full md:w-1/2">
                        <div class="relative">
                            <!-- Text Header - WILL APPEAR FIRST (0s delay) -->
                            <div class="opacity-0 translate-y-8" data-animate="text">
                                <h2 class="text-primary font-bold tracking-wider mb-2 uppercase text-sm md:text-base flex items-center gap-2">
                                    <span class="w-8 h-0.5 bg-primary"></span>
                                    ${this.data.about.title}
                                </h2>
                                <h3 class="text-3xl md:text-5xl font-bold text-dark mb-6 leading-tight">
                                    ${this.data.about.subtitle}
                                </h3>
                                
                                <p class="text-gray-600 text-lg leading-relaxed mb-8">
                                    ${this.data.about.description}
                                </p>
                            </div>

                            <!-- Features Grid - WILL APPEAR ONE BY ONE (1.0s, 1.15s, 1.3s) -->
                            <div class="grid grid-cols-3 gap-4 mb-10">
                                <!-- Feature 1 - Profesional -->
                                <div class="text-center p-3 bg-purple-50 rounded-lg border border-purple-100 opacity-0 translate-y-6" data-animate="feature-1">
                                    <div class="w-10 h-10 mx-auto bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm mb-2">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <p class="text-xs font-bold text-gray-700">Profesional</p>
                                </div>
                                
                                <!-- Feature 2 - Terpercaya -->
                                <div class="text-center p-3 bg-pink-50 rounded-lg border border-pink-100 opacity-0 translate-y-6" data-animate="feature-2">
                                    <div class="w-10 h-10 mx-auto bg-white rounded-full flex items-center justify-center text-pink-600 shadow-sm mb-2">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                    </div>
                                    <p class="text-xs font-bold text-gray-700">Terpercaya</p>
                                </div>
                                
                                <!-- Feature 3 - Berdampak -->
                                <div class="text-center p-3 bg-blue-50 rounded-lg border border-blue-100 opacity-0 translate-y-6" data-animate="feature-3">
                                    <div class="w-10 h-10 mx-auto bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm mb-2">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </div>
                                    <p class="text-xs font-bold text-gray-700">Berdampak</p>
                                </div>
                            </div>

                            <!-- CTA Button - WILL APPEAR LAST (1.6s delay) -->
                            <div class="opacity-0 translate-y-4" data-animate="cta">
                                <a href="/suar-indonesia" class="inline-flex items-center gap-3 text-white bg-primary hover:bg-primary-dark px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group" data-link>
                                    VISI SUAR INDONESIA
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- CSS Animations -->
            <style>
                /* 1. Text content fade-up - 0s */
                @keyframes textAppear {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-text-appear {
                    animation: textAppear 0.8s ease-out forwards;
                }
                
                /* 2. Image fade-in from right - 0.5s delay */
                @keyframes imageAppear {
                    from {
                        opacity: 0;
                        transform: translateX(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-image-appear {
                    animation: imageAppear 0.8s ease-out 0.5s forwards;
                }
                
                /* 3. Feature cards fade-up one by one */
                @keyframes featureAppear {
                    from {
                        opacity: 0;
                        transform: translateY(24px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-feature-1 {
                    animation: featureAppear 0.6s ease-out 1.0s forwards;
                }
                
                .animate-feature-2 {
                    animation: featureAppear 0.6s ease-out 1.15s forwards;
                }
                
                .animate-feature-3 {
                    animation: featureAppear 0.6s ease-out 1.3s forwards;
                }
                
                /* 4. CTA button + Badge appear - 1.6s delay */
                @keyframes ctaAppear {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-cta-appear {
                    animation: ctaAppear 0.8s ease-out 1.6s forwards;
                }
                
                @keyframes badgeAppear {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-badge-appear {
                    animation: badgeAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.6s forwards;
                }
                
                /* Reusable bounce animation for badge */
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            </style>
        `;

        // Intersection Observer: trigger animations when section enters viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Section is visible, trigger animations sequentially
                    const textEl = section.querySelector('[data-animate="text"]');
                    const imageEl = section.querySelector('[data-animate="image"]');
                    const feature1El = section.querySelector('[data-animate="feature-1"]');
                    const feature2El = section.querySelector('[data-animate="feature-2"]');
                    const feature3El = section.querySelector('[data-animate="feature-3"]');
                    const ctaEl = section.querySelector('[data-animate="cta"]');
                    const badgeEl = section.querySelector('[data-animate="badge"]');

                    if (textEl) textEl.classList.add('animate-text-appear');
                    if (imageEl) imageEl.classList.add('animate-image-appear');
                    if (feature1El) feature1El.classList.add('animate-feature-1');
                    if (feature2El) feature2El.classList.add('animate-feature-2');
                    if (feature3El) feature3El.classList.add('animate-feature-3');
                    if (ctaEl) ctaEl.classList.add('animate-cta-appear');
                    if (badgeEl) badgeEl.classList.add('animate-badge-appear');

                    // Unobserve after animation triggered (only animate once)
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2 // Trigger when 20% of section is visible
        });

        // Start observing the section
        observer.observe(section);

        return section;
    }

    renderServices() {
        const section = DOM.create('section', {
            className: 'relative min-h-screen flex items-center py-20 bg-gray-50 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        const servicesHtml = this.data.services.map(service => `
            <div class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group">
                <div class="relative h-48 overflow-hidden">
                    <img 
                        src="${service.image}" 
                        alt="${service.title}" 
                        class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                    >
                    <div class="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition"></div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold text-dark mb-3 group-hover:text-primary transition">
                        ${service.title}
                    </h3>
                    <p class="text-gray-600 mb-4 line-clamp-3">
                        ${service.description}
                    </p>
                    <a href="${service.link}" class="text-primary font-medium hover:underline inline-flex items-center" data-link>
                        SELENGKAPNYA
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        `).join('');

        section.innerHTML = `
            <!-- Background Gradient -->
            <div class="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50"></div>
            
            <!-- Decorative Shapes -->
            <div class="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
            <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="text-center mb-20">
                    <h2 class="text-3xl md:text-5xl font-bold text-dark mb-6">JELAJAHI LAYANAN KAMI</h2>
                    <div class="w-24 h-1.5 bg-gradient-to-r from-primary to-purple-600 mx-auto rounded-full"></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${servicesHtml}
                </div>
            </div>
        `;

        return section;
    }

    renderActivities() {
        const section = DOM.create('section', {
            className: 'relative min-h-screen flex items-center py-20 bg-white opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        const activitiesHtml = this.data.activities.map(activity => `
            <a href="/kegiatan-suar-indonesia" class="group relative overflow-hidden rounded-2xl shadow-lg aspect-[4/5] md:aspect-[3/4] cursor-pointer block" data-link>
                <img 
                    src="${activity.image}" 
                    alt="${activity.title}" 
                    class="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div class="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div class="w-12 h-1 bg-primary mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    <h3 class="text-white text-2xl font-bold leading-tight mb-2 group-hover:text-primary-light transition-colors">
                        ${activity.title}
                    </h3>
                    <p class="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                        Klik untuk melihat detail kegiatan
                    </p>
                </div>
            </a>
        `).join('');

        section.innerHTML = `
            <!-- Decorative Elements -->
            <div class="absolute top-20 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            <div class="absolute bottom-20 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div class="max-w-2xl">
                        <h2 class="text-3xl md:text-5xl font-bold text-dark mb-4">KEGIATAN KAMI</h2>
                        <div class="w-24 h-1.5 bg-primary rounded-full mb-6"></div>
                        <p class="text-gray-600 text-lg">Berbagai aktivitas dan program yang kami jalankan untuk memberdayakan masyarakat dan lingkungan.</p>
                    </div>
                    <a href="/kegiatan-suar-indonesia" class="hidden md:inline-flex items-center px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300 group" data-link>
                        JELAJAHI LEBIH BANYAK
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    ${activitiesHtml}
                </div>
                <div class="mt-12 text-center md:hidden">
                    <a href="/kegiatan-suar-indonesia" class="inline-block bg-primary text-white font-semibold py-4 px-10 rounded-full hover:bg-primary-dark transition shadow-lg" data-link>
                        JELAJAHI LEBIH BANYAK
                    </a>
                </div>
            </div>
        `;

        return section;
    }

    renderProducts() {
        const section = DOM.create('section', {
            className: 'relative min-h-screen flex items-center py-20 bg-gray-900 text-white opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        const productsHtml = this.data.products.map(product => `
            <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-700 hover:border-primary transition duration-300 group">
                <div class="flex flex-col md:flex-row h-full">
                    <div class="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                        <img 
                            src="${product.image}" 
                            alt="${product.title}" 
                            class="w-full h-full object-cover absolute inset-0 transform group-hover:scale-110 transition duration-700"
                        >
                        <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                    </div>
                    <div class="w-full md:w-3/5 p-8 flex flex-col justify-center relative">
                        <!-- Decorative glow -->
                        <div class="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        
                        <h3 class="text-2xl font-bold mb-3 text-white group-hover:text-primary-light transition-colors">${product.title}</h3>
                        <p class="text-gray-400 mb-8 leading-relaxed">
                            ${product.description}
                        </p>
                        <div class="flex items-center justify-between mt-auto pt-6 border-t border-gray-700">
                            <span class="text-2xl font-bold text-white tracking-tight">${product.price}</span>
                            <a href="${product.link}" class="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-xl transition shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1" data-link>
                                Beli Sekarang
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        section.innerHTML = `
            <!-- Background Decorations -->
            <div class="absolute inset-0 bg-[url('/assets/pattern-dark.svg')] opacity-5"></div>
            <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
            <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px]"></div>

            <div class="container mx-auto px-4 relative z-10">
                <div class="text-center mb-20">
                    <h2 class="text-3xl md:text-5xl font-bold mb-6 tracking-tight">PRODUK SUAR</h2>
                    <p class="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">Dukung kemandirian komunitas dengan membeli produk-produk berkualitas dari kami. Setiap pembelian berkontribusi langsung pada program pemberdayaan.</p>
                </div>
                <div class="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
                    ${productsHtml}
                </div>
                <div class="text-center mt-16">
                    <a href="/produk" class="text-primary-light hover:text-white font-medium transition inline-flex items-center gap-2 text-lg group" data-link>
                        LIHAT DETAIL PRODUK
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        `;

        return section;
    }

    renderArticles() {
        const section = DOM.create('section', {
            className: 'relative min-h-screen flex items-center py-20 bg-gray-50 opacity-0 translate-y-10 transition-all duration-700 overflow-hidden'
        });

        const articlesHtml = this.data.articles.map(article => `
            <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full group transform hover:-translate-y-2">
                <div class="relative h-64 overflow-hidden">
                    <img 
                        src="${article.image}" 
                        alt="${article.title}" 
                        class="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                    >
                    <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                    <div class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-md">
                        BERITA
                    </div>
                </div>
                <div class="p-8 flex-grow flex flex-col">
                    <div class="flex items-center text-sm text-gray-500 mb-4">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span>${article.date}</span>
                        <span class="mx-3">•</span>
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>${article.readTime}</span>
                    </div>
                    <h3 class="text-xl font-bold text-dark mb-3 group-hover:text-primary transition line-clamp-2 leading-tight">
                        <a href="${article.link}" data-link>${article.title}</a>
                    </h3>
                    ${article.subtitle ? `<p class="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">${article.subtitle}</p>` : ''}
                    <div class="mt-auto pt-6 border-t border-gray-100">
                        <a href="${article.link}" class="text-primary font-semibold hover:text-primary-dark text-sm inline-flex items-center group/link" data-link>
                            BACA SELENGKAPNYA
                            <svg class="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

        section.innerHTML = `
            <!-- Background Elements -->
            <div class="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent"></div>
            
            <div class="container mx-auto px-4 relative z-10">
                <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 class="text-3xl md:text-5xl font-bold text-dark mb-4">ARTIKEL TERBARU</h2>
                        <div class="w-24 h-1.5 bg-primary rounded-full"></div>
                    </div>
                    <a href="/berita" class="hidden md:inline-flex items-center text-primary font-semibold hover:text-primary-dark transition group" data-link>
                        LIHAT SEMUA ARTIKEL
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    ${articlesHtml}
                </div>
                <div class="mt-12 text-center md:hidden">
                    <a href="/berita" class="inline-block bg-primary text-white font-semibold py-4 px-10 rounded-full hover:bg-primary-dark transition shadow-lg" data-link>
                        LIHAT SEMUA ARTIKEL
                    </a>
                </div>
            </div>
        `;

        return section;
    }

    renderNewsletter() {
        const section = DOM.create('section', {
            className: 'relative py-24 bg-gray-900 overflow-hidden'
        });

        section.innerHTML = `
            <div class="absolute inset-0 z-0">
                <img src="${this.data.newsletter.image}" alt="Newsletter" class="w-full h-full object-cover opacity-40">
                <div class="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900/80"></div>
            </div>
            
            <!-- Decorative Elements -->
            <div class="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div class="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div class="container mx-auto px-4 relative z-10 text-center">
                <div class="max-w-3xl mx-auto">
                    <h2 class="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        ${this.data.newsletter.title}
                    </h2>
                    <p class="text-gray-300 mb-10 text-lg leading-relaxed">${this.data.newsletter.subtitle}</p>
                    
                    <form class="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
                        <input 
                            type="email" 
                            placeholder="${this.data.newsletter.placeholder}"
                            class="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/20 transition backdrop-blur-sm"
                            required
                        >
                        <button 
                            type="submit"
                            class="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-xl transition shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1"
                        >
                            ${this.data.newsletter.buttonText}
                        </button>
                    </form>
                    <p class="text-gray-500 text-sm mt-6">Kami menghargai privasi Anda. Unsubscribe kapan saja.</p>
                </div>
            </div>
        `;

        return section;
    }


    renderPartners() {
        const section = DOM.create('section', {
            className: 'py-20 bg-white border-t border-gray-100 overflow-hidden'
        });

        // Duplicate partners array for seamless infinite scroll
        const duplicatedPartners = [...this.data.partners, ...this.data.partners];
        const partnerCount = this.data.partners.length;

        section.innerHTML = `
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-sm font-bold text-gray-400 mb-12 uppercase tracking-[0.2em]">Partner &amp; Kolaborator Kami</h2>
            <div class="partners-carousel-wrapper relative overflow-hidden">
                <div class="partners-carousel flex items-center" style="gap: 64px;">
                    ${duplicatedPartners.map(partner => `
                        <div class="partner-item flex-shrink-0 group">
                            <img 
                                src="${partner.image}" 
                                alt="${partner.name || 'Partner'}" 
                                class="h-12 md:h-16 object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"
                                style="min-width: 100px; max-width: 140px;"
                            >
                        </div>
                    `).join('')}
                </div>
                
                <!-- Gradient Masks -->
                <div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
            </div>
        </div>
        <style>
            .partners-carousel {
                will-change: transform;
                transform: translate3d(0, 0, 0);
                backface-visibility: hidden;
            }
        </style>
    `;

        // JavaScript-based seamless scroll animation
        setTimeout(() => {
            const carousel = section.querySelector('.partners-carousel');
            if (!carousel) return;

            const items = carousel.querySelectorAll('.partner-item');
            if (items.length === 0) return;

            // Calculate width of first set (half of total items)
            const gap = 64;
            let firstSetWidth = 0;
            for (let i = 0; i < partnerCount; i++) {
                firstSetWidth += items[i].offsetWidth + gap;
            }

            let scrollPos = 0;
            const speed = 1.5; // pixels per frame
            let isPaused = false;

            carousel.addEventListener('mouseenter', () => isPaused = true);
            carousel.addEventListener('mouseleave', () => isPaused = false);

            function animate() {
                if (!isPaused) {
                    scrollPos += speed;
                    if (scrollPos >= firstSetWidth) {
                        scrollPos = 0; // Reset seamlessly
                    }
                    carousel.style.transform = `translate3d(-${scrollPos}px, 0, 0)`;
                }
                requestAnimationFrame(animate);
            }

            animate();
        }, 100);

        return section;
    }
}
