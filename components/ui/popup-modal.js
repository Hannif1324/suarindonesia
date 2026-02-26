/**
 * Popup Modal Component
 * Menampilkan carousel gambar popup dari Supabase
 * Desain diambil dari popup/popup-design.html
 * 
 * CATATAN: Menggunakan inline style karena Tailwind CDN tidak bisa
 * men-generate CSS untuk class yang dibuat secara dinamis lewat JavaScript.
 */

// Tag: Import utilitas DOM dari root /utils/
import { DOM } from '../../utils/helpers.js';
// Tag: Import logger dari root /debugs/
import { logger } from '../../debugs/logger.js';

export class PopupModal {
    /**
     * @param {Array} images - Daftar object popup dari Supabase
     */
    constructor(images) {
        // Tag: Menyimpan data gambar dari Supabase
        this.images = images;
        // Tag: Index slide yang sedang aktif
        this.currentIndex = 0;
        // Tag: Referensi ke element modal
        this.modal = null;
        // Tag: Referensi ke slides container untuk animasi geser
        this.slidesContainer = null;
        // Tag: Array referensi ke dot elements
        this.dots = [];
    }

    /**
     * Merender dan menampilkan modal popup ke DOM
     */
    render() {
        // Tag: Jangan render jika tidak ada gambar
        if (!this.images || this.images.length === 0) return;

        logger.info('Rendering popup modal with', this.images.length, 'images');

        // Tag: Overlay — fixed fullscreen, gelap 70%, blur, centered
        this.modal = document.createElement('div');
        Object.assign(this.modal.style, {
            position: 'fixed',
            inset: '0',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            animation: 'fade-in 0.3s ease-out forwards'
        });
        // Tag: Klik area gelap (overlay) menutup popup
        this.modal.onclick = (e) => {
            if (e.target === this.modal) this.close();
        };

        // Tag: Container utama — max-width 28rem (md), rounded, shadow
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'relative',
            maxWidth: '28rem',
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            animation: 'scale-up 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards'
        });
        // Tag: Class untuk animasi close (querySelector target)
        container.classList.add('popup-container');

        // Tag: Tombol Close — ✕ kecil pojok kanan atas
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '8px',
            right: '12px',
            zIndex: '50',
            fontSize: '1.25rem',
            color: '#9ca3af',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            lineHeight: '1',
            transition: 'color 0.2s'
        });
        // Tag: Hover merah pada close button
        closeBtn.onmouseenter = () => { closeBtn.style.color = '#ef4444'; };
        closeBtn.onmouseleave = () => { closeBtn.style.color = '#9ca3af'; };
        // Tag: Stop propagation agar tidak trigger overlay click
        closeBtn.onclick = (e) => { e.stopPropagation(); this.close(); };

        // Tag: Area Carousel — aspect-ratio 3/4, bg abu, overflow hidden
        const carousel = document.createElement('div');
        Object.assign(carousel.style, {
            position: 'relative',
            aspectRatio: '3/4',
            backgroundColor: '#f9fafb',
            overflow: 'hidden'
        });

        // Tag: Slides Container — flex horizontal, transisi geser 500ms
        this.slidesContainer = document.createElement('div');
        Object.assign(this.slidesContainer.style, {
            display: 'flex',
            height: '100%',
            transition: 'transform 0.5s ease-in-out'
        });

        // Tag: Membuat setiap slide gambar
        this.images.forEach((img, idx) => {
            const slide = document.createElement('div');
            Object.assign(slide.style, {
                minWidth: '100%',
                height: '100%'
            });
            // Tag: Gambar dengan object-contain agar tidak terpotong
            const image = document.createElement('img');
            image.src = img.image_url;
            image.alt = `Slide ${idx + 1}`;
            Object.assign(image.style, {
                width: '100%',
                height: '100%',
                objectFit: 'contain'
            });
            slide.appendChild(image);
            this.slidesContainer.appendChild(slide);
        });

        carousel.appendChild(this.slidesContainer);

        // Tag: Nav buttons dan dots hanya jika lebih dari 1 gambar
        if (this.images.length > 1) {
            // Tag: Tombol Prev — bulat putih w-8, panah primary
            carousel.appendChild(this.createNavBtn('left'));
            // Tag: Tombol Next — bulat putih w-8, panah primary
            carousel.appendChild(this.createNavBtn('right'));

            // Tag: Indikator Dots — pill transparan di bawah tengah
            const indicators = document.createElement('div');
            Object.assign(indicators.style, {
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px',
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: '6px 10px',
                borderRadius: '9999px',
                backdropFilter: 'blur(4px)'
            });

            this.dots = [];
            this.images.forEach((_, idx) => {
                const dot = document.createElement('button');
                Object.assign(dot.style, {
                    height: '8px',
                    width: idx === 0 ? '20px' : '8px',
                    borderRadius: '9999px',
                    backgroundColor: idx === 0 ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: 'none',
                    padding: '0',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                });
                // Tag: Klik dot untuk langsung ke slide tertentu
                dot.onclick = () => { this.currentIndex = idx; this.updateSlide(); };
                indicators.appendChild(dot);
                this.dots.push(dot);
            });
            carousel.appendChild(indicators);
        }

        // Tag: Susun struktur DOM
        container.appendChild(closeBtn);
        container.appendChild(carousel);
        this.modal.appendChild(container);

        // Tag: Tampilkan modal ke halaman
        document.body.appendChild(this.modal);
        // Tag: Cegah scroll body saat modal terbuka
        document.body.style.overflow = 'hidden';
    }

    /**
     * Membuat tombol navigasi Prev/Next
     * @param {string} direction - 'left' atau 'right'
     */
    createNavBtn(direction) {
        // Tag: Bulat putih w-8 h-8, tengah vertikal, shadow
        const btn = document.createElement('button');
        Object.assign(btn.style, {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            [direction === 'left' ? 'left' : 'right']: '8px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderRadius: '9999px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s'
        });
        // Tag: Hover: shadow lebih besar
        btn.onmouseenter = () => { btn.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; };
        btn.onmouseleave = () => { btn.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; };

        // Tag: SVG panah warna primary #673de6, stroke-width 3
        btn.innerHTML = direction === 'left'
            ? '<svg style="width:16px;height:16px" fill="none" viewBox="0 0 24 24" stroke="#673de6" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>'
            : '<svg style="width:16px;height:16px" fill="none" viewBox="0 0 24 24" stroke="#673de6" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>';

        // Tag: Klik untuk navigasi
        btn.onclick = () => {
            if (direction === 'left') this.prev();
            else this.next();
        };

        return btn;
    }

    /**
     * Navigasi ke slide berikutnya
     */
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateSlide();
    }

    /**
     * Navigasi ke slide sebelumnya
     */
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateSlide();
    }

    /**
     * Update posisi slide dan tampilan dots
     */
    updateSlide() {
        // Tag: Geser slides container berdasarkan currentIndex
        this.slidesContainer.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        // Tag: Update dots — aktif: putih w-20px, non-aktif: putih 50% w-8px
        if (this.dots) {
            this.dots.forEach((dot, idx) => {
                if (idx === this.currentIndex) {
                    dot.style.width = '20px';
                    dot.style.backgroundColor = '#fff';
                } else {
                    dot.style.width = '8px';
                    dot.style.backgroundColor = 'rgba(255,255,255,0.5)';
                }
            });
        }
    }

    /**
     * Menutup modal dengan animasi fade-out
     */
    close() {
        if (this.modal) {
            // Tag: Animasi keluar — opacity ke 0
            this.modal.style.transition = 'opacity 0.3s';
            this.modal.style.opacity = '0';

            // Tag: Container scale down
            const container = this.modal.querySelector('.popup-container');
            if (container) {
                container.style.transition = 'transform 0.3s';
                container.style.transform = 'scale(0.9)';
            }

            // Tag: Hapus modal dari DOM setelah animasi selesai
            setTimeout(() => {
                this.modal.remove();
                // Tag: Kembalikan scroll body
                document.body.style.overflow = '';
            }, 300);
        }
    }
}
