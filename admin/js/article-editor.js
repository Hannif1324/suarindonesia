// [AGENT-GENERATED]
// Description : Modul Editor Artikel Markdown-First dengan UI Kemplo Style, Live Preview, Metadata & SEO Google
// Created     : 2026-10-17
// Modified    : 2026-10-17
// Part of     : Admin CMS SuaR Indonesia (admin/js/article-editor.js)

import { supabase } from '../../js/services/supabase-client.js';
import { ImageUploader } from './image-uploader.js';
import { VideoUploader } from './video-uploader.js';
import { CustomDialog } from './custom-dialog.js';
import { icon } from '../../components/ui/icons.js';

export class ArticleEditor {
    /**
     * @description : Inisialisasi state editor artikel, uploader, dan konfigurasi lokal
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    constructor() {
        this.currentArticle = null;
        this.editorMode = 'edit'; // 'edit' | 'split' | 'preview'
        this.activeSidebarTab = 'metadata'; // 'metadata' | 'distribution' | 'seo'
        this.tags = [];
        this.gallery = [];
        this.autoSaveTimer = null;
        this.imageUploader = new ImageUploader('article-images');
        this.videoUploader = new VideoUploader('videos');
        this.customDialog = new CustomDialog();
    }

    /**
     * @description : Mengambil parser Markdown marked dengan fallback jika belum ter-load
     * @returns {Object} Library marked
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    getMarkedParser() {
        if (typeof window !== 'undefined' && window.marked) {
            return window.marked;
        }
        return {
            parse: (txt) => (txt || '').replace(/\n/g, '<br>')
        };
    }

    /**
     * @description : Sanitasi markup HTML menggunakan DOMPurify untuk mencegah XSS
     * @param {string} rawHtml - HTML mentah hasil parse markdown
     * @returns {string} HTML yang aman
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    sanitizeHtml(rawHtml) {
        if (typeof window !== 'undefined' && window.DOMPurify) {
            return window.DOMPurify.sanitize(rawHtml);
        }
        return rawHtml;
    }

    /**
     * @description : Konversi tanggal ke format teks Indonesia (contoh: "17 Oktober 2026")
     * @param {string|Date} dateVal - Tanggal masukan
     * @returns {string} Tanggal terformat Indonesia
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    formatIndonesianDate(dateVal) {
        if (!dateVal) return '';
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return String(dateVal);
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    /**
     * @description : Mengonversi struktur JSONB sections lama menjadi format Markdown murni
     * @param {Array|string} content - Konten legacy artikel
     * @returns {string} String Markdown yang siap diedit
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    convertLegacyContentToMarkdown(content) {
        if (!content) return '';
        if (typeof content === 'string') return content;
        if (!Array.isArray(content)) return '';

        return content.map(section => {
            switch (section.type) {
                case 'paragraph':
                    return section.content || '';
                case 'heading':
                    return `## ${section.content || ''}`;
                case 'quote':
                    return `> ${section.content || ''}${section.author ? `\n> — *${section.author}*` : ''}`;
                case 'image':
                    return `![${section.caption || 'Gambar'}](${section.url || ''})\n*${section.caption || ''}*`;
                case 'video':
                    return `@[video](${section.url || ''})\n*${section.caption || ''}*`;
                case 'list':
                    if (Array.isArray(section.items)) {
                        return section.items.map((item, idx) => 
                            section.ordered ? `${idx + 1}. ${item}` : `- ${item}`
                        ).join('\n');
                    }
                    return '';
                default:
                    return section.content || '';
            }
        }).filter(Boolean).join('\n\n');
    }

    /**
     * @description : Render tampilan daftar artikel (List View) dengan filter & status badge
     * @returns {Promise<string>} Template HTML string
     * @throws {Error} Gagal memuat data artikel
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    async renderListView() {
        const { data: articles, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching articles:', error);
            return '<div class="p-6 bg-red-50 text-red-600 rounded-lg">Gagal memuat daftar artikel dari database.</div>';
        }

        return `
            <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">Kelola Berita & Artikel</h2>
                    <p class="text-sm text-gray-500 mt-1">Total: ${articles.length} naskah publikasi dan draf redaksi</p>
                </div>
                <button id="new-article-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    <span>Tulis Konten Baru</span>
                </button>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50/80">
                            <tr>
                                <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Judul & Ringkasan</th>
                                <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
                                <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Tanggal</th>
                                <th class="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            ${articles.length === 0 ? `
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center text-gray-400">
                                        Belum ada artikel. Klik "Tulis Konten Baru" untuk memulai!
                                    </td>
                                </tr>
                            ` : articles.map(article => {
                                const status = article.status || 'published';
                                const isDraft = status === 'draft';
                                const badgeColor = isDraft 
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200';
                                const badgeText = isDraft ? 'Draf' : 'Terbit';

                                return `
                                    <tr class="hover:bg-gray-50/70 transition-colors">
                                        <td class="px-6 py-4">
                                            <div class="font-semibold text-gray-900 line-clamp-1">${article.title}</div>
                                            <div class="text-xs text-gray-400 mt-0.5 truncate max-w-md">${article.slug}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 uppercase">
                                                ${article.category || 'berita'}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2.5 py-1 text-xs font-semibold rounded-full ${badgeColor}">
                                                ${badgeText}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                            ${article.date || '-'}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <a href="#/artikel/${article.slug}" target="_blank" class="text-gray-400 hover:text-indigo-600 inline-block p-1" title="Lihat di Web">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                            </a>
                                            <button class="text-indigo-600 hover:text-indigo-900 font-semibold edit-btn px-2.5 py-1 rounded-lg hover:bg-indigo-50" data-id="${article.id}">
                                                Edit
                                            </button>
                                            <button class="text-red-500 hover:text-red-700 delete-btn px-2.5 py-1 rounded-lg hover:bg-red-50" data-id="${article.id}">
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * @description : Render tampilan utama form editor artikel (Kemplo Style Layout)
     * @param {Object|null} article - Objek artikel bila dalam mode edit
     * @returns {string} Template HTML editor lengkap
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    renderEditorView(article = null) {
        this.currentArticle = article;
        this.editorMode = 'edit';
        this.activeSidebarTab = 'metadata';

        // Persiapan data
        const markdownContent = article 
            ? (article.content_markdown || this.convertLegacyContentToMarkdown(article.content))
            : '';
        this.tags = Array.isArray(article?.tags) ? [...article.tags] : [];
        this.gallery = Array.isArray(article?.gallery) ? [...article.gallery] : [];

        const defaultCover = article?.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80';
        const initialTitle = article?.title || '';
        const initialExcerpt = article?.excerpt || '';

        return `
            <!-- Top Bar Navigasi Meja Redaksi -->
            <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div class="flex items-center gap-3">
                    <button id="back-to-list" class="text-gray-600 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                        <span>Meja Redaksi</span>
                    </button>
                    <span class="text-gray-300">/</span>
                    <span class="text-gray-800 font-semibold text-sm">
                        ${article ? 'Edit Konten Liputan' : 'Tulis Konten Baru'}
                    </span>
                    <div class="hidden lg:flex items-center gap-2 text-xs text-gray-500 bg-amber-50/80 border border-amber-200/60 text-amber-800 px-3 py-1 rounded-full font-medium ml-2">
                        <span id="stat-word-count" class="inline-flex items-center gap-1">${icon('file-text', 'w-3.5 h-3.5')} <span>0 kata</span></span>
                        <span>•</span>
                        <span id="stat-read-time" class="inline-flex items-center gap-1">${icon('clock', 'w-3.5 h-3.5')} <span>~1 mnt baca</span></span>
                    </div>
                </div>

                <!-- Tombol Aksi Redaksi -->
                <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <button type="button" id="btn-reader-preview" class="px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl flex items-center gap-1.5 transition">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        <span>Pratinjau Pembaca</span>
                    </button>
                    <button type="button" id="btn-save-draft" class="px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-amber-50 hover:text-amber-700 border border-gray-300 rounded-xl flex items-center gap-1.5 transition">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                        <span>Simpan Draf</span>
                    </button>
                    <button type="button" id="btn-publish-direct" class="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gray-900 hover:bg-black rounded-xl shadow-sm flex items-center gap-1.5 transition">
                        <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        <span>Terbitkan Langsung</span>
                    </button>
                </div>
            </div>

            <!-- Form Artikel Utama (Split Layout 2 Kolom) -->
            <form id="article-form" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                <!-- KOLOM KIRI (7/12 Desktop): Naskah & Teks Konten -->
                <div class="lg:col-span-8 space-y-6">
                    
                    <!-- 1. KARTU JUDUL BERITA UTAMA -->
                    <div class="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 sm:p-6 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                        <div class="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            <span class="flex items-center gap-1.5">
                                <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                Judul Berita Utama
                            </span>
                            <span id="title-char-counter" class="text-gray-400 font-mono">0/70 karakter</span>
                        </div>
                        <input type="text" name="title" id="input-article-title" required value="${initialTitle}" placeholder="Tulis judul berita di sini..."
                            class="w-full text-xl sm:text-2xl font-bold text-gray-900 placeholder-gray-300 border-0 focus:outline-none focus:ring-0 p-0 bg-transparent">
                        <p class="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">Gunakan judul informatif tanpa clickbait berlebihan.</p>
                        
                        <!-- Slug Field (Auto-sync) -->
                        <div class="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <span class="font-medium text-gray-400">URL Slug:</span>
                            <span class="text-gray-400">#/artikel/</span>
                            <input type="text" name="slug" id="input-article-slug" required value="${article?.slug || ''}" placeholder="judul-berita-otomatis"
                                class="flex-1 bg-transparent border-0 p-0 text-xs text-indigo-600 font-mono focus:outline-none focus:ring-0">
                        </div>
                    </div>

                    <!-- 2. KARTU PARAGRAF PEMBUKA / LEAD BERITA -->
                    <div class="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 sm:p-6 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                        <div class="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            <span>Paragraf Pembuka / Ringkasan Lead Berita</span>
                            <span id="excerpt-char-counter" class="text-gray-400 font-mono">0 karakter</span>
                        </div>
                        <textarea name="excerpt" id="input-article-excerpt" rows="3" required placeholder="1-2 kalimat pengantar memuat inti peristiwa yang memikat pembaca (idealnya 80-160 karakter)..."
                            class="w-full text-sm sm:text-base text-gray-700 placeholder-gray-300 border-0 focus:outline-none focus:ring-0 p-0 bg-transparent resize-y">${initialExcerpt}</textarea>
                        <p class="text-xs text-gray-400 mt-2">Ringkasan ini tampil di kartu beranda (terpotong rapi 2 baris) dan cuplikan mesin pencari Google.</p>
                    </div>

                    <!-- 3. LEMBAR NASKAH LIPUTAN (MARKDOWN EDITOR + LIVE PREVIEW) -->
                    <div class="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
                        
                        <!-- Header Toolbar & Mode Switcher -->
                        <div class="p-4 bg-gray-50/90 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                            <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Lembar Naskah Liputan
                            </span>

                            <!-- Mode Switcher: Edit | Bagi | Lihat -->
                            <div class="inline-flex rounded-lg border border-gray-300 bg-white p-0.5 text-xs font-medium">
                                <button type="button" class="mode-tab-btn px-3 py-1 rounded-md transition ${this.editorMode === 'edit' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}" data-mode="edit">
                                    <span class="inline-flex items-center gap-1.5">${icon('edit', 'w-3.5 h-3.5')} <span>Edit</span></span>
                                </button>
                                <button type="button" class="mode-tab-btn px-3 py-1 rounded-md transition ${this.editorMode === 'split' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}" data-mode="split">
                                    <span class="inline-flex items-center gap-1.5">${icon('book-open', 'w-3.5 h-3.5')} <span>Bagi</span></span>
                                </button>
                                <button type="button" class="mode-tab-btn px-3 py-1 rounded-md transition ${this.editorMode === 'preview' ? 'bg-gray-900 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}" data-mode="preview">
                                    <span class="inline-flex items-center gap-1.5">${icon('eye', 'w-3.5 h-3.5')} <span>Lihat</span></span>
                                </button>
                            </div>
                        </div>

                        <!-- Formatting Toolbar (Hanya aktif di mode Edit & Split) -->
                        <div id="editor-toolbar" class="px-4 py-2 bg-white border-b border-gray-100 flex flex-wrap items-center gap-1 text-gray-700 text-sm">
                            <button type="button" class="toolbar-btn p-1.5 rounded hover:bg-gray-100 font-bold" data-action="bold" title="Tebal (Bold)">B</button>
                            <button type="button" class="toolbar-btn p-1.5 rounded hover:bg-gray-100 italic" data-action="italic" title="Miring (Italic)">I</button>
                            <button type="button" class="toolbar-btn p-1.5 rounded hover:bg-gray-100 underline" data-action="underline" title="Garis Bawah (Underline)">U</button>
                            <div class="h-4 w-px bg-gray-200 mx-1"></div>
                            <button type="button" class="toolbar-btn px-2 py-1 rounded hover:bg-gray-100 font-semibold text-xs" data-action="h1" title="Heading 1">H1</button>
                            <button type="button" class="toolbar-btn px-2 py-1 rounded hover:bg-gray-100 font-semibold text-xs" data-action="h2" title="Heading 2">H2</button>
                            <button type="button" class="toolbar-btn px-2 py-1 rounded hover:bg-gray-100 font-semibold text-xs" data-action="h3" title="Heading 3">H3</button>
                            <div class="h-4 w-px bg-gray-200 mx-1"></div>
                            <button type="button" class="toolbar-btn p-1.5 rounded hover:bg-gray-100" data-action="ul" title="Daftar Poin">≡</button>
                            <button type="button" class="toolbar-btn p-1.5 rounded hover:bg-gray-100" data-action="ol" title="Daftar Angka">1≡</button>
                            <button type="button" class="toolbar-btn p-1.5 rounded hover:bg-gray-100 font-serif" data-action="quote" title="Kutipan Narasumber">“”</button>
                            <div class="h-4 w-px bg-gray-200 mx-1"></div>
                            <button type="button" class="toolbar-btn p-1.5 rounded hover:bg-gray-100" data-action="link" title="Tautan Link">${icon('link', 'w-4 h-4 text-gray-600')}</button>
                            <button type="button" class="toolbar-btn p-1.5 rounded hover:bg-gray-100" data-action="image" title="Sisipkan Gambar">${icon('camera', 'w-4 h-4 text-gray-600')}</button>
                            <button type="button" class="toolbar-btn p-1.5 rounded hover:bg-gray-100" data-action="video" title="Sisipkan Video Embed">${icon('video', 'w-4 h-4 text-gray-600')}</button>
                            <button type="button" class="toolbar-btn p-1.5 rounded hover:bg-gray-100" data-action="hr" title="Garis Pembatas">—</button>
                            <button type="button" class="toolbar-btn p-1.5 rounded hover:bg-gray-100 text-xs font-mono" data-action="dateline" title="Dateline Berita (KEDIRI, SuaR —)">${icon('pin', 'w-4 h-4 text-gray-600')}</button>
                        </div>

                        <!-- Editor Textarea & Live Preview Body -->
                        <div id="editor-body-container" class="grid grid-cols-1 gap-0">
                            <!-- Textarea Markdown Input -->
                            <div id="markdown-input-wrapper" class="p-5">
                                <textarea name="content_markdown" id="markdown-textarea" rows="18" required
                                    placeholder="Ketik naskah liputan di sini. Gunakan tombol toolbar atas untuk format tebal, kutipan narasumber, sub-judul, atau foto..."
                                    class="w-full font-sans text-gray-800 placeholder-gray-400 border-0 focus:outline-none focus:ring-0 p-0 text-base leading-relaxed resize-y bg-transparent">${markdownContent}</textarea>
                            </div>

                            <!-- Live Preview Panel -->
                            <div id="markdown-preview-wrapper" class="hidden p-6 bg-gray-50/50 border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto max-h-[650px]">
                                <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                                    <span>Pratinjau Langsung (Live Preview)</span>
                                    <span class="text-indigo-600 font-mono">Rendered HTML</span>
                                </div>
                                <div id="markdown-preview-content" class="prose prose-purple max-w-none">
                                    <!-- Rendered HTML dimasukkan di sini via JS -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- KOLOM KANAN (4/12 Desktop): Sidebar Tabs (Metadata, Distribusi, SEO Google) -->
                <div class="lg:col-span-4 space-y-4">
                    
                    <!-- Segmented Control Tabs Header -->
                    <div class="bg-gray-100 p-1 rounded-2xl flex items-center justify-between text-xs font-semibold text-gray-600">
                        <button type="button" class="sidebar-tab-trigger flex-1 py-2 rounded-xl transition ${this.activeSidebarTab === 'metadata' ? 'bg-gray-900 text-white shadow' : 'hover:text-gray-900'}" data-tab="metadata">
                            <span class="inline-flex items-center justify-center gap-1.5">${icon('bolt', 'w-3.5 h-3.5')} <span>Metadata</span></span>
                        </button>
                        <button type="button" class="sidebar-tab-trigger flex-1 py-2 rounded-xl transition ${this.activeSidebarTab === 'distribution' ? 'bg-gray-900 text-white shadow' : 'hover:text-gray-900'}" data-tab="distribution">
                            <span class="inline-flex items-center justify-center gap-1.5">${icon('broadcast', 'w-3.5 h-3.5')} <span>Distribusi</span></span>
                        </button>
                        <button type="button" class="sidebar-tab-trigger flex-1 py-2 rounded-xl transition ${this.activeSidebarTab === 'seo' ? 'bg-gray-900 text-white shadow' : 'hover:text-gray-900'}" data-tab="seo">
                            <span class="inline-flex items-center justify-center gap-1.5">${icon('search', 'w-3.5 h-3.5')} <span>SEO Google</span></span>
                        </button>
                    </div>

                    <!-- TAB 1: METADATA & FOTO SAMPUL -->
                    <div id="tab-content-metadata" class="sidebar-tab-content bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 space-y-5">
                        
                        <div class="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider pb-2 border-b border-gray-100">
                            <span class="inline-flex items-center gap-1.5">${icon('settings', 'w-4 h-4 text-gray-500')} <span>Kategori & Foto Sampul</span></span>
                        </div>

                        <!-- Kanal & Kategori -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Kanal & Kategori *</label>
                            <select name="category" required class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="berita" ${article?.category === 'berita' || !article?.category ? 'selected' : ''}>Berita</option>
                                <option value="program" ${article?.category === 'program' ? 'selected' : ''}>Program</option>
                                <option value="kegiatan" ${article?.category === 'kegiatan' ? 'selected' : ''}>Kegiatan</option>
                                <option value="artikel" ${article?.category === 'artikel' ? 'selected' : ''}>Artikel</option>
                            </select>
                        </div>

                        <!-- Foto Sampul Utama (Cover) -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Foto Sampul Utama (Cover) *</label>
                            <div class="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 h-44 mb-3 group">
                                <img id="cover-preview-img" src="${defaultCover}" alt="Cover Preview" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <span class="text-white text-xs font-medium bg-black/60 px-3 py-1.5 rounded-full">Ganti Gambar</span>
                                </div>
                            </div>
                            
                            <input type="text" name="image" id="hero-image-url" required value="${article?.image || defaultCover}" placeholder="URL Foto Sampul"
                                class="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            
                            <div id="hero-image-upload-widget" class="mb-3"></div>

                            <input type="text" name="cover_caption" id="cover-caption" value="Dok. Redaksi SuaR Indonesia" placeholder="Kredit Foto (e.g., Dok. Redaksi)"
                                class="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600">
                        </div>

                        <!-- Tag Topik Terkait (Chip-Style) -->
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <label class="text-xs font-semibold text-gray-600">Tag Topik Terkait</label>
                                <span class="text-[10px] text-gray-400">Tekan Enter / Koma / Tab</span>
                            </div>
                            
                            <div id="tags-chip-container" class="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded-xl min-h-[44px] cursor-text focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                                <div id="tags-list" class="flex flex-wrap gap-1.5">
                                    ${this.tags.map((tag, idx) => `
                                        <span class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-900 text-white shadow-xs">
                                            #${tag}
                                            <button type="button" class="remove-tag-btn hover:text-red-300 transition flex items-center ml-0.5" data-index="${idx}" aria-label="Hapus tag">${icon('x', 'w-3 h-3')}</button>
                                        </span>
                                    `).join('')}
                                </div>
                                <input type="text" id="tag-input-field" placeholder="Tambah tag..." autocomplete="off"
                                    class="bg-transparent text-xs text-gray-800 border-0 p-1 focus:outline-none focus:ring-0 flex-1 min-w-[100px]">
                            </div>
                            <p class="text-[11px] text-gray-400 mt-1">Tekan Enter, Koma, atau pindah kursor untuk menyimpan tag.</p>
                        </div>

                        <!-- Penulis (Author) -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Penulis / Kontributor *</label>
                            <input type="text" name="author" required value="${article?.author || 'SuaR Indonesia'}" placeholder="e.g., Redaksi SuaR"
                                class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <!-- Tanggal Terbit -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Terbit *</label>
                            <input type="text" name="date" id="input-article-date" required value="${article?.date || this.formatIndonesianDate(new Date())}" placeholder="e.g., 17 Oktober 2026"
                                class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-[11px] text-gray-400 mt-1">Format: 17 Oktober 2026</p>
                        </div>

                        <!-- Video URL Opsional -->
                        <div>
                            <label class="block text-xs font-semibold text-gray-600 mb-1.5">Video URL (Opsional)</label>
                            <input type="url" name="video" value="${article?.video || ''}" id="main-video-url" placeholder="YouTube / Vimeo / MP4"
                                class="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2">
                            <div id="main-video-upload-widget"></div>
                        </div>
                    </div>

                    <!-- TAB 2: DISTRIBUSI -->
                    <div id="tab-content-distribution" class="sidebar-tab-content hidden bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 space-y-4">
                        <div class="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider pb-2 border-b border-gray-100">
                            <span class="inline-flex items-center gap-1.5">${icon('broadcast', 'w-4 h-4 text-gray-500')} <span>Kanal Distribusi & Sindikasi</span></span>
                        </div>
                        <div class="space-y-3 text-sm text-gray-700">
                            <label class="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100/70">
                                <input type="checkbox" checked class="mt-1 rounded text-indigo-600 focus:ring-indigo-500">
                                <div>
                                    <span class="font-semibold block text-xs text-gray-900">Portal Utama SuaR Indonesia</span>
                                    <span class="text-xs text-gray-500">Tayang di beranda dan halaman #/berita</span>
                                </div>
                            </label>
                            <label class="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100/70">
                                <input type="checkbox" checked class="mt-1 rounded text-indigo-600 focus:ring-indigo-500">
                                <div>
                                    <span class="font-semibold block text-xs text-gray-900">Sindikasi Media Sosial</span>
                                    <span class="text-xs text-gray-500">Buat cuplikan otomatis untuk WhatsApp & Facebook</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- TAB 3: SEO GOOGLE -->
                    <div id="tab-content-seo" class="sidebar-tab-content hidden bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 space-y-4">
                        <div class="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider pb-2 border-b border-gray-100">
                            <span class="inline-flex items-center gap-1.5">${icon('search', 'w-4 h-4 text-gray-500')} <span>Optimasi SEO Google</span></span>
                        </div>

                        <!-- SERP Preview Card -->
                        <div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div class="text-[11px] text-gray-400 mb-1">Pratinjau Cuplikan Google:</div>
                            <div class="text-xs text-emerald-700 truncate" id="seo-preview-url">https://suarindonesia.org/#/artikel/${article?.slug || 'judul-berita'}</div>
                            <div class="text-sm font-semibold text-blue-700 hover:underline line-clamp-1 mt-0.5" id="seo-preview-title">
                                ${article?.seo_title || article?.title || 'Judul Berita SuaR Indonesia'}
                            </div>
                            <div class="text-xs text-gray-600 line-clamp-2 mt-1" id="seo-preview-snippet">
                                ${article?.seo_description || article?.excerpt || 'Ringkasan berita akan muncul di sini sesuai lead artikel...'}
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                                <span>SEO Meta Title</span>
                                <span id="seo-title-count" class="text-gray-400 font-mono">0/60</span>
                            </div>
                            <input type="text" name="seo_title" id="input-seo-title" value="${article?.seo_title || ''}" placeholder="Biarkan kosong untuk menggunakan judul utama"
                                class="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <div>
                            <div class="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                                <span>SEO Meta Description</span>
                                <span id="seo-desc-count" class="text-gray-400 font-mono">0/160</span>
                            </div>
                            <textarea name="seo_description" id="input-seo-desc" rows="3" placeholder="Biarkan kosong untuk menggunakan lead naskah"
                                class="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y">${article?.seo_description || ''}</textarea>
                        </div>
                    </div>

                    <!-- Auto-save notification footer -->
                    <div class="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-2">
                        <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span id="autosave-status-text">Draft tersimpan di peramban</span>
                    </div>

                </div>
            </form>

            <!-- Modal Pratinjau Pembaca (Reader Preview Modal) -->
            <div id="reader-preview-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs hidden flex items-center justify-center p-4">
                <div class="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
                    <div class="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                        <span class="font-bold text-gray-800 text-sm flex items-center gap-2">
                            <span class="inline-flex items-center gap-1.5">${icon('book-open', 'w-4 h-4 text-gray-500')} <span>Pratinjau Tampilan Pembaca Publik</span></span>
                        </span>
                        <button type="button" id="close-reader-preview-btn" class="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-200 transition" aria-label="Tutup Pratinjau">${icon('x', 'w-5 h-5')}</button>
                    </div>
                    <div id="reader-preview-body" class="p-6 md:p-10 overflow-y-auto space-y-6">
                        <!-- Dynamic rendered full article -->
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * @description : Menghubungkan seluruh event listener untuk interaksi UI editor
     * @param {HTMLElement} container - Kontainer elemen editor
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    attachEventListeners(container) {
        if (!container) return;

        // Navigasi Kembali ke List
        container.querySelector('#back-to-list')?.addEventListener('click', () => {
            this.showList();
        });

        // Tombol Buat Baru dari List
        container.querySelector('#new-article-btn')?.addEventListener('click', () => {
            this.showEditor();
        });

        // Tombol Edit dari List
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                const { data: article } = await supabase.from('articles').select('*').eq('id', id).single();
                this.showEditor(article);
            });
        });

        // Tombol Hapus dari List
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const confirmed = await this.customDialog.confirm('Apakah Anda yakin ingin menghapus artikel ini?', 'Hapus Artikel');
                if (!confirmed) return;
                const id = e.currentTarget.dataset.id;
                await supabase.from('articles').delete().eq('id', id);
                this.showList();
            });
        });

        const form = container.querySelector('#article-form');
        if (!form) return; // Jika hanya di list view, selesai

        // Cegah submit bawaan browser agar tidak memicu reload halaman
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // 1. Inisialisasi Uploader Cover
        const coverUploadContainer = container.querySelector('#hero-image-upload-widget');
        if (coverUploadContainer) {
            const widget = this.imageUploader.createUploadWidget((url) => {
                container.querySelector('#hero-image-url').value = url;
                const previewImg = container.querySelector('#cover-preview-img');
                if (previewImg) previewImg.src = url;
            });
            coverUploadContainer.appendChild(widget);
        }

        // 2. Inisialisasi Uploader Video Utama
        const videoUploadContainer = container.querySelector('#main-video-upload-widget');
        if (videoUploadContainer) {
            const widget = this.videoUploader.createUploadWidget((url) => {
                container.querySelector('#main-video-url').value = url;
            });
            videoUploadContainer.appendChild(widget);
        }

        // 3. Realtime Character Counters & Auto-Slug
        const titleInput = container.querySelector('#input-article-title');
        const slugInput = container.querySelector('#input-article-slug');
        const excerptInput = container.querySelector('#input-article-excerpt');
        const titleCounter = container.querySelector('#title-char-counter');
        const excerptCounter = container.querySelector('#excerpt-char-counter');
        const markdownTextarea = container.querySelector('#markdown-textarea');

        const updateStats = () => {
            const titleVal = titleInput?.value || '';
            const excerptVal = excerptInput?.value || '';
            const markdownVal = markdownTextarea?.value || '';

            // Title counter (0/70)
            if (titleCounter) {
                titleCounter.textContent = `${titleVal.length}/70 karakter`;
                titleCounter.className = titleVal.length > 70 
                    ? 'text-red-500 font-mono font-bold' 
                    : 'text-gray-400 font-mono';
            }

            // Excerpt counter (0/160)
            if (excerptCounter) {
                excerptCounter.textContent = `${excerptVal.length}/160 karakter`;
                excerptCounter.className = excerptVal.length > 160 
                    ? 'text-amber-500 font-mono font-bold' 
                    : 'text-gray-400 font-mono';
            }

            // Word count & Read time
            const totalWords = (markdownVal.trim().match(/\S+/g) || []).length;
            const readMinutes = Math.max(1, Math.ceil(totalWords / 180));
            
            const wordCountEl = container.querySelector('#stat-word-count');
            const readTimeEl = container.querySelector('#stat-read-time');
            if (wordCountEl) wordCountEl.innerHTML = `${icon('file-text', 'w-3.5 h-3.5')} <span>${totalWords} kata</span>`;
            if (readTimeEl) readTimeEl.innerHTML = `${icon('clock', 'w-3.5 h-3.5')} <span>~${readMinutes} mnt baca</span>`;

            // Update Live Preview jika panel terlihat
            this.updateLivePreview(container);

            // Update SEO Card & Counters
            const seoTitleInput = container.querySelector('#input-seo-title');
            const seoDescInput = container.querySelector('#input-seo-desc');
            const seoTitleCount = container.querySelector('#seo-title-count');
            const seoDescCount = container.querySelector('#seo-desc-count');

            if (seoTitleCount && seoTitleInput) {
                seoTitleCount.textContent = `${seoTitleInput.value.length}/60`;
                seoTitleCount.className = seoTitleInput.value.length > 60 ? 'text-red-500 font-mono font-bold' : 'text-gray-400 font-mono';
            }
            if (seoDescCount && seoDescInput) {
                seoDescCount.textContent = `${seoDescInput.value.length}/160`;
                seoDescCount.className = seoDescInput.value.length > 160 ? 'text-amber-500 font-mono font-bold' : 'text-gray-400 font-mono';
            }

            this.updateSeoPreview(container);
        };

        titleInput?.addEventListener('input', () => {
            // Auto generate slug jika artikel baru atau belum diedit manual
            if (!this.currentArticle && slugInput) {
                slugInput.value = this.generateSlug(titleInput.value);
            }
            updateStats();
        });

        excerptInput?.addEventListener('input', updateStats);
        markdownTextarea?.addEventListener('input', updateStats);
        container.querySelector('#input-seo-title')?.addEventListener('input', updateStats);
        container.querySelector('#input-seo-desc')?.addEventListener('input', updateStats);

        // 4. Mode Switcher (Edit | Bagi | Lihat)
        container.querySelectorAll('.mode-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.setEditorMode(mode, container);
            });
        });

        // 5. Toolbar Formatting Actions
        container.querySelectorAll('.toolbar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.applyToolbarAction(action, markdownTextarea);
                updateStats();
            });
        });

        // 6. Sidebar Tab Switcher (Metadata | Distribusi | SEO Google)
        container.querySelectorAll('.sidebar-tab-trigger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.setSidebarTab(tab, container);
            });
        });

        // 7. Chip Tags Management
        const tagsContainer = container.querySelector('#tags-chip-container');
        const tagInput = tagsContainer?.querySelector('#tag-input-field');

        // Klik area container otomatis memfokuskan input field
        tagsContainer?.addEventListener('click', (e) => {
            if (e.target === tagsContainer || e.target.id === 'tags-list') {
                tagInput?.focus();
            }
        });

        const addTag = (rawText) => {
            if (!rawText) return;
            // Dukung input beruntun atau paste teks berpemisah koma/titik koma/newline
            const parts = String(rawText).split(/[,;\n]+/);
            let hasAdded = false;

            parts.forEach(part => {
                const clean = part.replace(/^#+/, '').replace(/[, ]+$/, '').trim().toLowerCase();
                if (clean && !this.tags.includes(clean)) {
                    this.tags.push(clean);
                    hasAdded = true;
                }
            });

            if (hasAdded) {
                this.renderTagChips(tagsContainer);
            }
            if (tagInput) {
                tagInput.value = '';
                tagInput.focus();
            }
        };

        // Keydown listener dengan event delegation agar tetap tangguh
        tagsContainer?.addEventListener('keydown', (e) => {
            const target = e.target;
            if (target && target.id === 'tag-input-field') {
                if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
                    e.preventDefault();
                    e.stopPropagation();
                    addTag(target.value);
                } else if (e.key === 'Backspace' && !target.value && this.tags.length > 0) {
                    this.tags.pop();
                    this.renderTagChips(tagsContainer);
                }
            }
        });

        // Blur / focusout: jika user mengetik teks lalu klik ke tempat lain tanpa menekan Enter, otomatis simpan tag
        tagsContainer?.addEventListener('focusout', (e) => {
            const target = e.target;
            if (target && target.id === 'tag-input-field' && target.value.trim()) {
                addTag(target.value);
            }
        });

        // Hapus tag chip via event delegation
        tagsContainer?.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-tag-btn');
            if (removeBtn) {
                e.preventDefault();
                e.stopPropagation();
                const idx = parseInt(removeBtn.dataset.index, 10);
                if (!isNaN(idx) && idx >= 0 && idx < this.tags.length) {
                    this.tags.splice(idx, 1);
                    this.renderTagChips(tagsContainer);
                    tagInput?.focus();
                }
            }
        });

        // 8. Tombol Simpan Draf
        container.querySelector('#btn-save-draft')?.addEventListener('click', () => {
            this.saveArticle(form, 'draft');
        });

        // 9. Tombol Terbitkan Langsung
        container.querySelector('#btn-publish-direct')?.addEventListener('click', () => {
            this.saveArticle(form, 'published');
        });

        // 10. Tombol Pratinjau Pembaca Modal
        container.querySelector('#btn-reader-preview')?.addEventListener('click', () => {
            this.openReaderPreviewModal(container);
        });

        container.querySelector('#close-reader-preview-btn')?.addEventListener('click', () => {
            container.querySelector('#reader-preview-modal')?.classList.add('hidden');
        });

        // Jalankan kalkulasi awal
        updateStats();
    }

    /**
     * @description : Mengatur mode tampilan editor (edit penuh, split live preview, atau preview penuh)
     * @param {'edit'|'split'|'preview'} mode - Mode editor
     * @param {HTMLElement} container - Kontainer editor
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    setEditorMode(mode, container) {
        this.editorMode = mode;
        const inputWrapper = container.querySelector('#markdown-input-wrapper');
        const previewWrapper = container.querySelector('#markdown-preview-wrapper');
        const editorBody = container.querySelector('#editor-body-container');
        const toolbar = container.querySelector('#editor-toolbar');

        // Update button states
        container.querySelectorAll('.mode-tab-btn').forEach(b => {
            if (b.dataset.mode === mode) {
                b.className = 'mode-tab-btn px-3 py-1 rounded-md transition bg-gray-900 text-white shadow-xs';
            } else {
                b.className = 'mode-tab-btn px-3 py-1 rounded-md transition text-gray-600 hover:text-gray-900';
            }
        });

        if (mode === 'edit') {
            editorBody.className = 'grid grid-cols-1 gap-0';
            inputWrapper.classList.remove('hidden');
            previewWrapper.classList.add('hidden');
            toolbar.classList.remove('hidden');
        } else if (mode === 'split') {
            editorBody.className = 'grid grid-cols-1 lg:grid-cols-2 gap-0';
            inputWrapper.classList.remove('hidden');
            previewWrapper.classList.remove('hidden');
            toolbar.classList.remove('hidden');
            this.updateLivePreview(container);
        } else if (mode === 'preview') {
            editorBody.className = 'grid grid-cols-1 gap-0';
            inputWrapper.classList.add('hidden');
            previewWrapper.classList.remove('hidden');
            toolbar.classList.add('hidden');
            this.updateLivePreview(container);
        }
    }

    /**
     * @description : Mengganti tab aktif di sidebar kanan (Metadata, Distribusi, SEO Google)
     * @param {string} tabId - ID tab yang dipilih
     * @param {HTMLElement} container - Kontainer editor
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    setSidebarTab(tabId, container) {
        this.activeSidebarTab = tabId;

        // Update tab buttons
        container.querySelectorAll('.sidebar-tab-trigger').forEach(btn => {
            if (btn.dataset.tab === tabId) {
                btn.className = 'sidebar-tab-trigger flex-1 py-2 rounded-xl transition bg-gray-900 text-white shadow';
            } else {
                btn.className = 'sidebar-tab-trigger flex-1 py-2 rounded-xl transition hover:text-gray-900 text-gray-600';
            }
        });

        // Hide all, show targeted
        container.querySelectorAll('.sidebar-tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        const target = container.querySelector(`#tab-content-${tabId}`);
        if (target) target.classList.remove('hidden');
    }

    /**
     * @description : Render chip-tag interaktif di sidebar tanpa menghancurkan elemen input di DOM
     * @param {HTMLElement} container - Kontainer chip tag
     * @returns {void}
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    renderTagChips(container) {
        if (!container) return;
        let list = container.querySelector('#tags-list');

        // Pastikan container memiliki #tags-list permanen tanpa menghancurkan #tag-input-field
        if (!list) {
            list = document.createElement('div');
            list.id = 'tags-list';
            list.className = 'flex flex-wrap gap-1.5';
            const inputField = container.querySelector('#tag-input-field');
            if (inputField) {
                container.insertBefore(list, inputField);
            } else {
                container.prepend(list);
            }
        }

        const chipsHtml = this.tags.map((tag, idx) => `
            <span class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-900 text-white shadow-xs">
                #${tag}
                <button type="button" class="remove-tag-btn hover:text-red-300 transition flex items-center ml-0.5" data-index="${idx}" aria-label="Hapus tag">${icon('x', 'w-3 h-3')}</button>
            </span>
        `).join('');

        // HANYA update innerHTML milik list, jangan pernah sentuh atau replace container.innerHTML!
        list.innerHTML = chipsHtml;
    }

    /**
     * @description : Menerapkan format Markdown ke posisi kursor di textarea
     * @param {string} action - Aksi formatting (bold, italic, h1, link, dll)
     * @param {HTMLTextAreaElement} textarea - Elemen textarea
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    applyToolbarAction(action, textarea) {
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selected = text.substring(start, end);

        let replacement = '';
        let cursorOffset = 0;

        switch (action) {
            case 'bold':
                replacement = `**${selected || 'teks tebal'}**`;
                cursorOffset = selected ? replacement.length : 2;
                break;
            case 'italic':
                replacement = `*${selected || 'teks miring'}*`;
                cursorOffset = selected ? replacement.length : 1;
                break;
            case 'underline':
                replacement = `<u>${selected || 'garis bawah'}</u>`;
                cursorOffset = selected ? replacement.length : 3;
                break;
            case 'h1':
                replacement = `\n# ${selected || 'Judul Utama'}\n`;
                cursorOffset = replacement.length;
                break;
            case 'h2':
                replacement = `\n## ${selected || 'Sub Judul Bagian'}\n`;
                cursorOffset = replacement.length;
                break;
            case 'h3':
                replacement = `\n### ${selected || 'Poin Pembahasan'}\n`;
                cursorOffset = replacement.length;
                break;
            case 'ul':
                replacement = `\n- ${selected || 'Item poin'}\n- Item poin kedua\n`;
                cursorOffset = replacement.length;
                break;
            case 'ol':
                replacement = `\n1. ${selected || 'Langkah pertama'}\n2. Langkah kedua\n`;
                cursorOffset = replacement.length;
                break;
            case 'quote':
                replacement = `\n> "${selected || 'Kutipan penting dari narasumber'}"\n> — *Nama Tokoh*\n`;
                cursorOffset = replacement.length;
                break;
            case 'link':
                replacement = `[${selected || 'Teks tautan'}](https://example.com)`;
                cursorOffset = replacement.length - 1;
                break;
            case 'image':
                const promptUrl = prompt('Masukkan URL Gambar (atau unggah via sidebar):', 'https://');
                if (promptUrl) {
                    replacement = `\n![${selected || 'Keterangan foto'}](${promptUrl})\n*Keterangan foto dokumentasi*\n`;
                }
                break;
            case 'video':
                const videoUrl = prompt('Masukkan URL Video (YouTube/Vimeo/MP4):', 'https://www.youtube.com/watch?v=');
                if (videoUrl) {
                    replacement = `\n@[video](${videoUrl})\n`;
                }
                break;
            case 'hr':
                replacement = `\n\n---\n\n`;
                cursorOffset = replacement.length;
                break;
            case 'dateline':
                replacement = `**KEDIRI, SuaR Indonesia** — `;
                cursorOffset = replacement.length;
                break;
        }

        if (replacement) {
            textarea.value = text.substring(0, start) + replacement + text.substring(end);
            textarea.focus();
            textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
        }
    }

    /**
     * @description : Memperbarui tampilan live preview Markdown
     * @param {HTMLElement} container - Kontainer editor
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    updateLivePreview(container) {
        const previewContent = container.querySelector('#markdown-preview-content');
        const textarea = container.querySelector('#markdown-textarea');
        if (!previewContent || !textarea) return;

        const rawMarkdown = textarea.value || '';
        const marked = this.getMarkedParser();
        const parsed = marked.parse(rawMarkdown);
        previewContent.innerHTML = this.sanitizeHtml(parsed);
    }

    /**
     * @description : Memperbarui cuplikan Google SERP di tab SEO
     * @param {HTMLElement} container - Kontainer editor
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    updateSeoPreview(container) {
        const titleInput = container.querySelector('#input-article-title');
        const excerptInput = container.querySelector('#input-article-excerpt');
        const slugInput = container.querySelector('#input-article-slug');
        const seoTitleInput = container.querySelector('#input-seo-title');
        const seoDescInput = container.querySelector('#input-seo-desc');

        const serpTitle = container.querySelector('#seo-preview-title');
        const serpSnippet = container.querySelector('#seo-preview-snippet');
        const serpUrl = container.querySelector('#seo-preview-url');

        const activeTitle = seoTitleInput?.value || titleInput?.value || 'Judul Berita SuaR Indonesia';
        const activeDesc = seoDescInput?.value || excerptInput?.value || 'Ringkasan berita akan muncul di sini sesuai lead naskah...';
        const activeSlug = slugInput?.value || 'judul-berita';

        if (serpTitle) serpTitle.textContent = activeTitle;
        if (serpSnippet) serpSnippet.textContent = activeDesc;
        if (serpUrl) serpUrl.textContent = `https://suarindonesia.org/#/artikel/${activeSlug}`;
    }

    /**
     * @description : Menampilkan modal pratinjau pembaca publik
     * @param {HTMLElement} container - Kontainer editor
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    openReaderPreviewModal(container) {
        const modal = container.querySelector('#reader-preview-modal');
        const previewBody = container.querySelector('#reader-preview-body');
        if (!modal || !previewBody) return;

        const rawTitle = container.querySelector('#input-article-title')?.value || 'Judul Belum Diisi';
        const rawExcerpt = container.querySelector('#input-article-excerpt')?.value || '';
        const rawCategory = container.querySelector('select[name="category"]')?.value || 'berita';
        const rawAuthor = container.querySelector('input[name="author"]')?.value || 'SuaR Indonesia';
        const rawDate = container.querySelector('#input-article-date')?.value || this.formatIndonesianDate(new Date());
        const rawCover = container.querySelector('#hero-image-url')?.value || '';
        const rawMarkdown = container.querySelector('#markdown-textarea')?.value || '';

        // Sanitasi seluruh teks dinamis menggunakan DOMPurify untuk mencegah XSS
        const title = this.sanitizeHtml(rawTitle);
        const excerpt = this.sanitizeHtml(rawExcerpt);
        const category = this.sanitizeHtml(rawCategory);
        const author = this.sanitizeHtml(rawAuthor);
        const date = this.sanitizeHtml(rawDate);
        const cover = encodeURI(rawCover.trim());

        const marked = this.getMarkedParser();
        const parsedBody = this.sanitizeHtml(marked.parse(rawMarkdown));

        previewBody.innerHTML = `
            <div class="max-w-3xl mx-auto space-y-6">
                <!-- Kategori & Meta -->
                <div class="flex items-center gap-3">
                    <span class="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                        ${category}
                    </span>
                    <span class="text-xs text-gray-500">${date}</span>
                    <span class="text-xs text-gray-500">• Oleh ${author}</span>
                </div>

                <!-- Judul Utama -->
                <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                    ${title}
                </h1>

                <!-- Lead Paragraph -->
                ${excerpt ? `
                    <div class="text-lg text-gray-700 font-medium italic border-l-4 border-purple-600 pl-4 py-1 bg-purple-50/50 rounded-r-lg">
                        ${excerpt}
                    </div>
                ` : ''}

                <!-- Cover Image -->
                ${cover ? `
                    <figure class="rounded-2xl overflow-hidden shadow-lg my-6">
                        <img src="${cover}" alt="${title}" class="w-full max-h-[450px] object-cover">
                    </figure>
                ` : ''}

                <!-- Body Naskah Markdown -->
                <article class="prose prose-lg prose-purple max-w-none text-gray-800 leading-relaxed">
                    ${parsedBody}
                </article>

                <!-- Tags -->
                ${this.tags.length > 0 ? `
                    <div class="pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                        ${this.tags.map(t => `
                            <span class="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                #${t}
                            </span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        modal.classList.remove('hidden');
    }

    /**
     * @description : Membuat slug URL ramah SEO dari judul teks
     * @param {string} text - Teks judul
     * @returns {string} Slug URL bersih
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    generateSlug(text) {
        return (text || '')
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * @description : Menyimpan artikel ke database Supabase (Draf atau Terbit Langsung)
     * @param {HTMLFormElement} form - Elemen form artikel
     * @param {'draft'|'published'} targetStatus - Status target artikel
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    async saveArticle(form, targetStatus = 'published') {
        const formData = new FormData(form);

        const title = (formData.get('title') || '').trim();
        let slug = (formData.get('slug') || '').trim();
        const excerpt = (formData.get('excerpt') || '').trim();
        const markdown = (formData.get('content_markdown') || '').trim();

        // Validasi
        if (!title) {
            await this.customDialog.alert('Judul berita utama wajib diisi!', 'Peringatan');
            return;
        }

        if (!slug) {
            slug = this.generateSlug(title);
        }

        if (targetStatus === 'published' && !markdown) {
            await this.customDialog.alert('Naskah liputan artikel masih kosong!', 'Peringatan');
            return;
        }

        // Kalkulasi kata dan estimasi waktu baca
        const totalWords = (markdown.match(/\S+/g) || []).length;
        const readTime = `${Math.max(1, Math.ceil(totalWords / 180))} min read`;

        // Susun objek data artikel
        const articleData = {
            slug: slug,
            title: title,
            excerpt: excerpt,
            content_markdown: markdown,
            content: [{ type: 'paragraph', content: markdown }], // Backward compatibility
            image: formData.get('image') || '',
            video: formData.get('video') || '',
            date: formData.get('date') || this.formatIndonesianDate(new Date()),
            author: formData.get('author') || 'SuaR Indonesia',
            category: formData.get('category') || 'berita',
            read_time: readTime,
            tags: this.tags,
            gallery: this.gallery,
            status: targetStatus,
            seo_title: formData.get('seo_title') || '',
            seo_description: formData.get('seo_description') || '',
            seo_keywords: this.tags
        };

        if (targetStatus === 'published' && (!this.currentArticle || this.currentArticle.status !== 'published')) {
            articleData.published_at = new Date().toISOString();
        }

        try {
            if (this.currentArticle) {
                // Update
                const { error } = await supabase.from('articles').update(articleData).eq('id', this.currentArticle.id);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase.from('articles').insert([articleData]);
                if (error) throw error;
            }

            const successMsg = targetStatus === 'published' 
                ? 'Artikel berhasil diterbitkan secara publik!' 
                : 'Draf artikel berhasil disimpan di redaksi.';
            
            await this.customDialog.alert(successMsg, 'Sukses');
            this.showList();
        } catch (error) {
            console.warn('Initial save attempt failed:', error);

            // Cek jika error disebabkan kolom baru belum dimigrasi di remote Supabase
            if (error?.message && (error.message.includes('does not exist') || error.message.includes('column'))) {
                try {
                    // Fallback: Simpan hanya kolom legacy yang pasti ada di Supabase
                    const legacyArticleData = {
                        slug: articleData.slug,
                        title: articleData.title,
                        excerpt: articleData.excerpt,
                        content: articleData.content, // JSONB sections
                        image: articleData.image,
                        video: articleData.video,
                        date: articleData.date,
                        author: articleData.author,
                        category: articleData.category,
                        read_time: articleData.read_time,
                        tags: articleData.tags,
                        gallery: articleData.gallery
                    };

                    if (this.currentArticle) {
                        const { error: retryError } = await supabase.from('articles').update(legacyArticleData).eq('id', this.currentArticle.id);
                        if (retryError) throw retryError;
                    } else {
                        const { error: retryError } = await supabase.from('articles').insert([legacyArticleData]);
                        if (retryError) throw retryError;
                    }

                    await this.customDialog.alert(
                        'Artikel berhasil disimpan dalam mode kompatibilitas!\n\nCatatan: Jalankan skrip di admin/supabase_schema.sql pada Supabase SQL Editor untuk mengaktifkan kolom status & markdown.',
                        'Tersimpan (Mode Kompatibilitas)'
                    );
                    this.showList();
                    return;
                } catch (retryErr) {
                    console.error('Retry save error:', retryErr);
                }
            }

            await this.customDialog.alert('Terjadi kesalahan saat menyimpan artikel: ' + error.message, 'Gagal Menyimpan');
        }
    }

    /**
     * @description : Menampilkan view list artikel di kontainer admin
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    async showList() {
        let container = document.getElementById('app-content-berita');
        if (!container) {
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

    /**
     * @description : Menampilkan view editor artikel di kontainer admin
     * @param {Object|null} article - Objek artikel bila mengedit
     * @author : Gemini Agent
     * @modified : 2026-10-17
     */
    showEditor(article = null) {
        let container = document.getElementById('app-content-berita');
        if (!container) {
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
