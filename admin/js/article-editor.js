import { supabase } from '../../js/services/supabase-client.js';
import { ImageUploader } from './image-uploader.js';
import { VideoUploader } from './video-uploader.js';
import { CustomDialog } from './custom-dialog.js';

export class ArticleEditor {
    constructor() {
        this.currentArticle = null;
        this.sections = [];
        this.gallery = [];
        this.imageUploader = new ImageUploader('article-images');
        this.videoUploader = new VideoUploader('videos');
        this.customDialog = new CustomDialog();
    }

    /**
     * Render the article list view - MOBILE RESPONSIVE
     */
    async renderListView() {
        const { data: articles, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching articles:', error);
            return '<div class="text-red-500">Error loading articles</div>';
        }

        return `
            <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 class="text-2xl font-bold">Manage Articles</h2>
                <button id="new-article-btn" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full sm:w-auto">
                    + New Article
                </button>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <!-- Mobile-friendly horizontal scroll wrapper -->
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${articles.map(article => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 sm:px-6 py-4">
                                        <div class="text-sm font-medium text-gray-900">${article.title}</div>
                                        <div class="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-none">${article.slug}</div>
                                    </td>
                                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            ${article.category}
                                        </span>
                                    </td>
                                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">${article.date}</td>
                                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-indigo-600 hover:text-indigo-900 mr-2 sm:mr-3 edit-btn" data-id="${article.id}">Edit</button>
                                        <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${article.id}">Del</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * Render the article editor form
     */
    renderEditorView(article = null) {
        this.currentArticle = article;
        this.sections = article?.content || [];
        this.gallery = article?.gallery || [];

        return `
            <div class="mb-6">
                <button id="back-to-list" class="text-gray-600 hover:text-gray-900 flex items-center">
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to List
                </button>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-2xl font-bold mb-6">${article ? 'Edit Article' : 'New Article'}</h2>

                <form id="article-form" class="space-y-6">
                    <!-- Basic Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <input type="text" name="title" required value="${article?.title || ''}" placeholder="e.g., Pelatihan Digital Marketing untuk UMKM"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-xs text-gray-500 mt-1">Judul utama artikel yang menarik.</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                            <input type="text" name="slug" required value="${article?.slug || ''}" placeholder="e.g., pelatihan-digital-marketing-umkm"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-xs text-gray-500 mt-1">URL friendly, gunakan huruf kecil dan tanda hubung (-).</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
                        <textarea name="excerpt" required rows="3" placeholder="e.g., Suar Indonesia mengadakan pelatihan digital marketing untuk membantu UMKM..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">${article?.excerpt || ''}</textarea>
                        <p class="text-xs text-gray-500 mt-1">Ringkasan singkat artikel yang akan muncul di kartu preview.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <select name="category" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="" disabled ${!article?.category ? 'selected' : ''}>Select Category</option>
                                <option value="berita" ${article?.category === 'berita' ? 'selected' : ''}>Berita</option>
                                <option value="program" ${article?.category === 'program' ? 'selected' : ''}>Program</option>
                                <option value="kegiatan" ${article?.category === 'kegiatan' ? 'selected' : ''}>Kegiatan</option>
                                <option value="artikel" ${article?.category === 'artikel' ? 'selected' : ''}>Artikel</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                            <input type="text" name="date" required value="${article?.date || ''}" placeholder="e.g., 10 November 2025"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-xs text-gray-500 mt-1">Format: Tanggal Bulan Tahun (e.g., 17 Agustus 2024)</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                            <input type="text" name="author" required value="${article?.author || 'SuaR Indonesia'}" placeholder="e.g., Admin Suar"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                        <input type="text" name="tags" value="${article?.tags?.join(', ') || ''}" placeholder="e.g., pelatihan, umkm, digital, ekonomi"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Pisahkan kata kunci dengan koma.</p>
                    </div>

                    <!-- Hero Image -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Hero Image URL *</label>
                        <input type="text" name="image" required value="${article?.image || ''}" id="hero-image-url" placeholder="e.g., https://example.com/image.jpg"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2">
                        <p class="text-xs text-gray-500 mt-1">Upload gambar atau tempel URL gambar utama artikel.</p>
                        <div id="hero-image-upload"></div>
                    </div>

                    <!-- Video URL (Optional) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Video URL (Optional)</label>
                        <input type="url" name="video" value="${article?.video || ''}" id="main-video-url" placeholder="e.g., https://example.com/video.mp4 or https://youtube.com/watch?v=..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Tambahkan video untuk ditampilkan di artikel. Support: .mp4, .webm, YouTube, Vimeo.</p>
                        <div id="main-video-upload"></div>
                    </div>

                    <!-- Content Sections -->
                    <div>
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                            <label class="block text-sm font-medium text-gray-700">Content Sections</label>
                            <div class="flex flex-wrap gap-2">
                                <button type="button" class="add-section-btn bg-gray-600 text-white px-3 py-1 rounded text-sm" data-type="paragraph">+ Text</button>
                                <button type="button" class="add-section-btn bg-gray-600 text-white px-3 py-1 rounded text-sm" data-type="heading">+ Heading</button>
                                <button type="button" class="add-section-btn bg-gray-600 text-white px-3 py-1 rounded text-sm" data-type="image">+ Image</button>
                                <button type="button" class="add-section-btn bg-indigo-600 text-white px-3 py-1 rounded text-sm" data-type="video">+ Video</button>
                                <button type="button" class="add-section-btn bg-gray-600 text-white px-3 py-1 rounded text-sm" data-type="quote">+ Quote</button>
                            </div>
                        </div>
                        <div id="sections-container" class="space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px]">
                            ${this.sections.length === 0 ? '<p class="text-gray-400 text-center py-8">No sections yet. Click buttons above to add content.</p>' : ''}
                        </div>
                    </div>

                    <!-- Gallery -->
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <label class="block text-sm font-medium text-gray-700">Gallery Images</label>
                            <button type="button" id="add-gallery-btn" class="bg-gray-600 text-white px-3 py-1 rounded text-sm">+ Add Image</button>
                        </div>
                        <div id="gallery-container" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            ${this.gallery.length === 0 ? '<p class="text-gray-400 col-span-full text-center py-8">No gallery images</p>' : ''}
                        </div>
                    </div>

                    <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
                        <button type="button" id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full sm:w-auto">Save Article</button>
                    </div>
                </form>
            </div>
        `;
    }

    /**
     * Render a single section
     */
    renderSection(section, index) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section-item bg-gray-50 border border-gray-200 rounded-lg p-4 relative';
        sectionDiv.dataset.index = index;

        let content = '';
        switch (section.type) {
            case 'paragraph':
                content = `
                    <label class="block text-xs font-medium text-gray-600 mb-2">Paragraph</label>
                    <textarea class="section-content w-full px-3 py-2 border border-gray-300 rounded-md" rows="4">${section.content || ''}</textarea>
                    ${section.lead ? '<label class="inline-flex items-center mt-2"><input type="checkbox" class="section-lead" checked> <span class="ml-2 text-sm">Lead paragraph</span></label>' : ''}
                `;
                break;
            case 'heading':
                content = `
                    <label class="block text-xs font-medium text-gray-600 mb-2">Heading</label>
                    <input type="text" class="section-content w-full px-3 py-2 border border-gray-300 rounded-md" value="${section.content || ''}">
                `;
                break;
            case 'image':
                content = `
                    <label class="block text-xs font-medium text-gray-600 mb-2">Image</label>
                    <input type="text" class="section-image-url w-full px-3 py-2 border border-gray-300 rounded-md mb-2" placeholder="Image URL" value="${section.url || ''}">
                    <input type="text" class="section-caption w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Caption" value="${section.caption || ''}">
                    <div class="section-image-upload mt-2"></div>
                `;
                break;
            case 'video':
                content = `
                    <label class="block text-xs font-medium text-gray-600 mb-2">Video</label>
                    <input type="url" class="section-video-url w-full px-3 py-2 border border-gray-300 rounded-md mb-2" placeholder="Video URL (.mp4, .webm, YouTube, Vimeo)" value="${section.url || ''}">
                    <input type="text" class="section-caption w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Caption (optional)" value="${section.caption || ''}">
                    <p class="text-xs text-gray-500 mt-1">Paste direct video URL or YouTube/Vimeo link</p>
                    <div class="section-video-upload mt-2"></div>
                `;
                break;
            case 'quote':
                content = `
                    <label class="block text-xs font-medium text-gray-600 mb-2">Quote</label>
                    <textarea class="section-content w-full px-3 py-2 border border-gray-300 rounded-md mb-2" rows="3" placeholder="Quote text">${section.content || ''}</textarea>
                    <input type="text" class="section-author w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Author (optional)" value="${section.author || ''}">
                `;
                break;
        }

        sectionDiv.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-semibold text-gray-500 uppercase">${section.type}</span>
                <div class="flex space-x-2">
                    <button type="button" class="move-up text-gray-400 hover:text-gray-600" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button type="button" class="move-down text-gray-400 hover:text-gray-600">↓</button>
                    <button type="button" class="remove-section text-red-400 hover:text-red-600">✕</button>
                </div>
            </div>
            ${content}
        `;

        return sectionDiv;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners(container) {
        // New Article button
        container.querySelector('#new-article-btn')?.addEventListener('click', () => {
            this.showEditor();
        });

        // Edit buttons
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const { data: article } = await supabase.from('articles').select('*').eq('id', id).single();
                this.showEditor(article);
            });
        });

        // Delete buttons
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const confirmed = await this.customDialog.confirm('Are you sure you want to delete this article?', 'Delete Article');
                if (!confirmed) return;

                const id = e.target.dataset.id;
                await supabase.from('articles').delete().eq('id', id);
                this.showList();
            });
        });

        // Back to list
        container.querySelector('#back-to-list')?.addEventListener('click', () => {
            this.showList();
        });

        // Add section buttons
        container.querySelectorAll('.add-section-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.addSection({ type, content: '' });
            });
        });

        // Hero image upload
        const heroUploadContainer = container.querySelector('#hero-image-upload');
        if (heroUploadContainer) {
            const widget = this.imageUploader.createUploadWidget((url) => {
                container.querySelector('#hero-image-url').value = url;
            });
            heroUploadContainer.appendChild(widget);
        }

        // Main video upload
        const mainVideoUploadContainer = container.querySelector('#main-video-upload');
        if (mainVideoUploadContainer) {
            const widget = this.videoUploader.createUploadWidget((url) => {
                container.querySelector('#main-video-url').value = url;
            });
            mainVideoUploadContainer.appendChild(widget);
        }

        // Add gallery image
        container.querySelector('#add-gallery-btn')?.addEventListener('click', () => {
            this.addGalleryImage();
        });

        // Form submit
        container.querySelector('#article-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveArticle(e.target);
        });

        // Cancel button
        container.querySelector('#cancel-btn')?.addEventListener('click', () => {
            this.showList();
        });

        // Render existing sections
        if (this.sections.length > 0) {
            this.renderAllSections();
        }

        // Render existing gallery
        if (this.gallery.length > 0) {
            this.renderGallery();
        }
    }

    addSection(section) {
        this.sections.push(section);
        this.renderAllSections();
    }

    /**
     * Capture current form values from all sections before re-rendering
     */
    captureFormValues() {
        const container = document.getElementById('sections-container');
        if (!container) return [];

        const values = [];
        const sectionElements = container.querySelectorAll('.section-item');

        sectionElements.forEach((sectionEl, index) => {
            const sectionData = {};
            const type = this.sections[index]?.type;

            switch (type) {
                case 'paragraph':
                    sectionData.content = sectionEl.querySelector('.section-content')?.value || '';
                    sectionData.lead = sectionEl.querySelector('.section-lead')?.checked || false;
                    break;

                case 'heading':
                    sectionData.content = sectionEl.querySelector('.section-content')?.value || '';
                    break;

                case 'image':
                    sectionData.url = sectionEl.querySelector('.section-image-url')?.value || '';
                    sectionData.caption = sectionEl.querySelector('.section-caption')?.value || '';
                    break;

                case 'video':
                    sectionData.url = sectionEl.querySelector('.section-video-url')?.value || '';
                    sectionData.caption = sectionEl.querySelector('.section-caption')?.value || '';
                    break;

                case 'quote':
                    sectionData.content = sectionEl.querySelector('.section-content')?.value || '';
                    sectionData.author = sectionEl.querySelector('.section-author')?.value || '';
                    break;
            }

            values.push(sectionData);
        });

        return values;
    }

    /**
     * Render all sections - values are synced before mutation in event handlers
     */
    renderAllSections() {
        const container = document.getElementById('sections-container');
        if (!container) return;

        // Clear container
        container.innerHTML = '';

        // Re-render with current values from this.sections
        this.sections.forEach((section, index) => {
            const sectionEl = this.renderSection(section, index);
            container.appendChild(sectionEl);

            // Attach section-specific listeners
            this.attachSectionListeners(sectionEl, index);
        });
    }

    attachSectionListeners(sectionEl, index) {
        // Move up - sync values first, then get fresh index from DOM
        sectionEl.querySelector('.move-up')?.addEventListener('click', () => {
            this.syncSectionsFromDOM(); // Simpan nilai form sebelum mutasi
            const currentIndex = parseInt(sectionEl.dataset.index, 10); // Ambil index terbaru dari DOM
            if (currentIndex > 0) {
                [this.sections[currentIndex - 1], this.sections[currentIndex]] = [this.sections[currentIndex], this.sections[currentIndex - 1]];
                this.renderAllSections();
            }
        });

        // Move down - sync values first, then get fresh index from DOM
        sectionEl.querySelector('.move-down')?.addEventListener('click', () => {
            this.syncSectionsFromDOM(); // Simpan nilai form sebelum mutasi
            const currentIndex = parseInt(sectionEl.dataset.index, 10); // Ambil index terbaru dari DOM
            if (currentIndex < this.sections.length - 1) {
                [this.sections[currentIndex], this.sections[currentIndex + 1]] = [this.sections[currentIndex + 1], this.sections[currentIndex]];
                this.renderAllSections();
            }
        });

        // Remove - sync values first, then get fresh index from DOM
        sectionEl.querySelector('.remove-section')?.addEventListener('click', () => {
            this.syncSectionsFromDOM(); // Simpan nilai form sebelum mutasi
            const currentIndex = parseInt(sectionEl.dataset.index, 10); // Ambil index terbaru dari DOM
            this.sections.splice(currentIndex, 1);
            this.renderAllSections();
        });

        // Image upload for image sections
        const imageUploadContainer = sectionEl.querySelector('.section-image-upload');
        if (imageUploadContainer) {
            const widget = this.imageUploader.createUploadWidget((url) => {
                sectionEl.querySelector('.section-image-url').value = url;
            });
            imageUploadContainer.appendChild(widget);
        }

        // Video upload for video sections
        const videoUploadContainer = sectionEl.querySelector('.section-video-upload');
        if (videoUploadContainer) {
            const widget = this.videoUploader.createUploadWidget((url) => {
                sectionEl.querySelector('.section-video-url').value = url;
            });
            videoUploadContainer.appendChild(widget);
        }
    }

    /**
     * Sync this.sections array with current DOM form values
     * Harus dipanggil SEBELUM operasi mutasi array (delete, move)
     * untuk memastikan nilai form tersimpan dengan benar
     */
    syncSectionsFromDOM() {
        const container = document.getElementById('sections-container');
        if (!container) return;

        const sectionElements = container.querySelectorAll('.section-item');

        sectionElements.forEach((sectionEl) => {
            // Ambil index dari attribute DOM (selalu akurat)
            const index = parseInt(sectionEl.dataset.index, 10);
            if (isNaN(index) || !this.sections[index]) return;

            const type = this.sections[index].type;

            // Update this.sections dengan nilai terbaru dari form
            switch (type) {
                case 'paragraph':
                    this.sections[index].content = sectionEl.querySelector('.section-content')?.value || '';
                    this.sections[index].lead = sectionEl.querySelector('.section-lead')?.checked || false;
                    break;
                case 'heading':
                    this.sections[index].content = sectionEl.querySelector('.section-content')?.value || '';
                    break;
                case 'image':
                    this.sections[index].url = sectionEl.querySelector('.section-image-url')?.value || '';
                    this.sections[index].caption = sectionEl.querySelector('.section-caption')?.value || '';
                    break;
                case 'video':
                    this.sections[index].url = sectionEl.querySelector('.section-video-url')?.value || '';
                    this.sections[index].caption = sectionEl.querySelector('.section-caption')?.value || '';
                    break;
                case 'quote':
                    this.sections[index].content = sectionEl.querySelector('.section-content')?.value || '';
                    this.sections[index].author = sectionEl.querySelector('.section-author')?.value || '';
                    break;
            }
        });
    }

    addGalleryImage() {
        const container = document.getElementById('gallery-container');
        if (!container) return;

        const index = this.gallery.length;

        const imageDiv = document.createElement('div');
        imageDiv.className = 'relative border-2 border-dashed border-gray-300 rounded-lg p-4';
        imageDiv.innerHTML = `
            <input type="text" class="gallery-url w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2" placeholder="Image URL">
            <input type="text" class="gallery-caption w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2" placeholder="Caption">
            <div class="gallery-upload"></div>
            <button type="button" class="remove-gallery absolute top-2 right-2 text-red-500 hover:text-red-700">✕</button>
        `;

        const uploadContainer = imageDiv.querySelector('.gallery-upload');
        const widget = this.imageUploader.createUploadWidget((url) => {
            imageDiv.querySelector('.gallery-url').value = url;
        });
        uploadContainer.appendChild(widget);

        imageDiv.querySelector('.remove-gallery').addEventListener('click', () => {
            imageDiv.remove();
        });

        container.appendChild(imageDiv);
        this.gallery.push({ url: '', caption: '' });
    }

    renderGallery() {
        const container = document.getElementById('gallery-container');
        if (!container) return;
        container.innerHTML = '';
        this.gallery.forEach(() => this.addGalleryImage());
    }

    async saveArticle(form) {
        const formData = new FormData(form);

        // Collect sections data
        const sectionsContainer = document.getElementById('sections-container');
        const sectionElements = sectionsContainer.querySelectorAll('.section-item');
        const sections = Array.from(sectionElements).map(el => {
            const type = el.querySelector('.text-xs').textContent.toLowerCase();
            const section = { type };

            switch (type) {
                case 'paragraph':
                    section.content = el.querySelector('.section-content').value;
                    section.lead = el.querySelector('.section-lead')?.checked || false;
                    break;
                case 'heading':
                    section.content = el.querySelector('.section-content').value;
                    break;
                case 'image':
                    section.url = el.querySelector('.section-image-url').value;
                    section.caption = el.querySelector('.section-caption').value;
                    break;
                case 'video':
                    section.url = el.querySelector('.section-video-url').value;
                    section.caption = el.querySelector('.section-caption').value;
                    break;
                case 'quote':
                    section.content = el.querySelector('.section-content').value;
                    section.author = el.querySelector('.section-author').value;
                    break;
            }

            return section;
        });

        // Collect gallery data
        const galleryElements = document.querySelectorAll('#gallery-container > div');
        const gallery = Array.from(galleryElements).map(el => ({
            url: el.querySelector('.gallery-url').value,
            caption: el.querySelector('.gallery-caption').value
        })).filter(img => img.url);

        const tagsText = formData.get('tags') || '';

        const articleData = {
            slug: formData.get('slug') || '',
            title: formData.get('title') || '',
            excerpt: formData.get('excerpt') || '',
            content: sections,
            image: formData.get('image') || '',
            video: formData.get('video') || '',
            date: formData.get('date') || '',
            author: formData.get('author') || 'SuaR Indonesia',
            category: formData.get('category') || 'berita',
            read_time: '3 min read', // Could be calculated
            tags: tagsText.split(',').map(t => t.trim()).filter(t => t),
            gallery: gallery
        };

        try {
            if (this.currentArticle) {
                // Update
                await supabase.from('articles').update(articleData).eq('id', this.currentArticle.id);
            } else {
                // Insert
                await supabase.from('articles').insert([articleData]);
            }

            await this.customDialog.alert('Article saved successfully!', 'Success');
            this.showList();
        } catch (error) {
            await this.customDialog.alert('Error saving article: ' + error.message, 'Error');
        }
    }

    async showList() {
        let container = document.getElementById('app-content-berita');
        if (!container) {
            // Fallback: find the parent content section
            const parent = document.getElementById('berita');
            if (parent) {
                container = document.createElement('div');
                container.id = 'app-content-berita';
                parent.appendChild(container);
            }
        }
        if (container) {
            container.innerHTML = await this.renderListView();
            this.attachEventListeners(container);
        }
    }

    showEditor(article = null) {
        let container = document.getElementById('app-content-berita');
        if (!container) {
            // Fallback: find the parent content section
            const parent = document.getElementById('berita');
            if (parent) {
                container = document.createElement('div');
                container.id = 'app-content-berita';
                parent.appendChild(container);
            }
        }
        if (container) {
            container.innerHTML = this.renderEditorView(article);
            this.attachEventListeners(container);
        }
    }
}
