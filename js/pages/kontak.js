/**
 * Kontak (Contact) Page
 */

import { DOM } from '../../utils/helpers.js';
import { logger } from '../../debugs/logger.js';
import { supabase } from '../services/supabase-client.js';

export class KontakPage {
    async render() {
        logger.info('Rendering kontak page');

        const container = DOM.create('div', {
            className: 'fade-in'
        });

        // Page Header
        const header = DOM.create('section', {
            className: 'bg-gradient-to-r from-primary to-secondary text-white py-12'
        });

        header.innerHTML = `
            <div class="container mx-auto px-4">
                <h1 class="text-4xl font-bold mb-2">Hubungi Kami</h1>
                <p class="text-gray-100">Kami siap membantu Anda</p>
            </div>
        `;

        container.appendChild(header);

        // Contact Section
        const content = DOM.create('section', {
            className: 'py-12'
        });

        content.innerHTML = `
            <div class="container mx-auto px-4">
                <div class="max-w-6xl mx-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Contact Information -->
                        <div class="bg-white rounded-lg shadow-md p-8">
                            <h2 class="text-2xl font-bold mb-6 text-gray-800">Informasi Kontak</h2>
                            
                            <div class="space-y-6">
                                <div>
                                    <h3 class="font-bold text-primary mb-2">📍 Kantor Kediri</h3>
                                    <p class="text-gray-600">
                                        Pondok Doko Indah Blok A No. 1<br>
                                        Doko, Ngasem<br>
                                        Kabupaten Kediri, Jawa Timur
                                    </p>
                                </div>

                                <div>
                                    <h3 class="font-bold text-primary mb-2">📍 Kantor Jember</h3>
                                    <p class="text-gray-600">
                                        Jalan Suren Dampar RT 002 RW 002<br>
                                        Desa Suren, Ledokombo<br>
                                        Kabupaten Jember, Jawa Timur
                                    </p>
                                </div>

                                <div>
                                    <h3 class="font-bold text-primary mb-2">📧 Email</h3>
                                    <p class="text-gray-600">info@suarindonesia.org</p>
                                </div>

                                <div>
                                    <h3 class="font-bold text-primary mb-2">📱 Media Sosial</h3>
                                    <div class="flex gap-4 mt-2">
                                        <a href="https://www.facebook.com/suar.06" target="_blank" class="text-gray-600 hover:text-primary transition">
                                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                            </svg>
                                        </a>
                                        <a href="https://www.instagram.com/suar.indonesia/" target="_blank"class="text-gray-600 hover:text-primary transition">
                                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                                                <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                                            </svg>
                                        </a>
                                        <a href="http://wa.me/6281333900069/" target="_blank"class="text-gray-600 hover:text-primary transition">
                                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12.04 0C5.41 0 .04 5.37.04 12c0 2.12.55 4.19 1.59 6.01L0 24l6.18-1.62A11.9 11.9 0 0 0 12.04 24C18.66 24 24.04 18.63 24.04 12S18.66 0 12.04 0Zm0 21.82c-1.87 0-3.7-.5-5.31-1.45l-.38-.22-3.66.96.98-3.56-.25-.37A9.77 9.77 0 0 1 2.26 12c0-5.39 4.39-9.78 9.78-9.78 5.39 0 9.78 4.39 9.78 9.78 0 5.39-4.39 9.78-9.78 9.78Zm5.36-7.32c-.29-.14-1.71-.84-1.98-.94-.27-.1-.46-.14-.65.14-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.57-.89-2.15-.23-.55-.47-.48-.65-.49h-.55c-.19 0-.51.07-.77.36-.27.29-1.01.99-1.01 2.41s1.04 2.8 1.19 2.99c.14.19 2.05 3.13 4.97 4.39.7.3 1.25.48 1.67.61.7.22 1.33.19 1.83.11.56-.08 1.71-.7 1.95-1.38.24-.68.24-1.27.17-1.38-.07-.11-.27-.17-.56-.31Z"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Form -->
                        <div class="bg-white rounded-lg shadow-md p-8">
                            <h2 class="text-2xl font-bold mb-6 text-gray-800">Kirim Pesan</h2>
                            
                            <form id="contact-form" class="space-y-4">
                                <div>
                                    <label class="block text-gray-700 mb-2">Nama</label>
                                    <input 
                                        type="text"
                                        name="name"
                                        placeholder="Contoh: John Doe"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                        required
                                    >
                                </div>

                                <div>
                                    <label class="block text-gray-700 mb-2">Email</label>
                                    <input 
                                        type="email"
                                        name="email"
                                        placeholder="contoh@email.com"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                        required
                                    >
                                </div>

                                <div>
                                    <label class="block text-gray-700 mb-2">Nomor Handphone</label>
                                    <input 
                                        type="tel"
                                        name="phone"
                                        placeholder="08123456789"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                        required
                                    >
                                </div>

                                <div>
                                    <label class="block text-gray-700 mb-2">Kasus</label>
                                    <textarea 
                                        rows="5"
                                        name="case_description"
                                        placeholder="Jelaskan kasus/pengaduan Anda secara detail..."
                                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                        required
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit"
                                    id="submit-btn"
                                    class="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition"
                                >
                                    Kirim Pesan
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(content);

        // Add Success Modal
        const successModal = DOM.create('div', {
            id: 'success-modal',
            className: 'hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'
        });

        successModal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Pesan Terkirim!</h3>
                    <p class="text-gray-600 mb-6">Pesan telah terkirim, mohon tunggu balasan dari tim kami.</p>
                    <button 
                        id="close-success-modal"
                        class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        `;

        container.appendChild(successModal);

        // Add Error Modal
        const errorModal = DOM.create('div', {
            id: 'error-modal',
            className: 'hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'
        });

        errorModal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Gagal Mengirim</h3>
                    <p id="error-modal-text" class="text-gray-600 mb-6"></p>
                    <button 
                        id="close-error-modal"
                        class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        `;

        container.appendChild(errorModal);

        // Add form handler with Supabase integration
        setTimeout(() => {
            this.attachEventListeners();
        }, 100);

        return container;
    }

    attachEventListeners() {
        const form = document.getElementById('contact-form');
        const submitBtn = document.getElementById('submit-btn');
        const successModal = document.getElementById('success-modal');
        const errorModal = document.getElementById('error-modal');
        const errorModalText = document.getElementById('error-modal-text');
        const closeSuccessBtn = document.getElementById('close-success-modal');
        const closeErrorBtn = document.getElementById('close-error-modal');

        // Close modal handlers
        closeSuccessBtn?.addEventListener('click', () => {
            successModal?.classList.add('hidden');
        });

        closeErrorBtn?.addEventListener('click', () => {
            errorModal?.classList.add('hidden');
        });

        // Close modal on backdrop click
        successModal?.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.add('hidden');
            }
        });

        errorModal?.addEventListener('click', (e) => {
            if (e.target === errorModal) {
                errorModal.classList.add('hidden');
            }
        });

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Get form data
                const formData = new FormData(form);
                const submissionData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    case_description: formData.get('case_description')
                };

                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <div class="flex items-center justify-center">
                        <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                    </div>
                `;

                try {
                    // Submit to Supabase
                    const { data, error } = await supabase
                        .from('contact_submissions')
                        .insert([submissionData]);

                    if (error) throw error;

                    // Show success modal
                    successModal?.classList.remove('hidden');

                    // Reset form
                    form.reset();

                    logger.info('Contact form submitted successfully');
                } catch (error) {
                    logger.error('Error submitting contact form:', error);

                    // Show error modal
                    errorModalText.textContent = error.message || 'Terjadi kesalahan. Silakan coba lagi.';
                    errorModal?.classList.remove('hidden');
                } finally {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Kirim Pesan';
                }
            });
        }
    }
}
