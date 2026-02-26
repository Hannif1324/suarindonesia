/**
 * Popup Manager for Admin Dashboard
 * Manages images for the landing page popup carousel
 * Menggunakan ImageUploader yang sudah ada untuk upload ke Supabase Storage
 */

// Tag: Import Supabase client dan ImageUploader
import { supabase } from '../../js/services/supabase-client.js';
import { ImageUploader } from './image-uploader.js';

export class PopupManager {
    constructor() {
        // Tag: Nama tabel di Supabase
        this.tableName = 'popups';
        // Tag: Inisialisasi ImageUploader dengan bucket 'popups'
        // Pastikan bucket 'popups' sudah dibuat di Supabase Storage
        this.imageUploader = new ImageUploader('popups');
        // Tag: Menyimpan URL gambar yang di-upload sementara
        this.uploadedImageUrl = '';
    }

    /**
     * Merender tampilan daftar gambar popup di admin
     * @returns {string} HTML string
     */
    async renderListView() {
        // Tag: Mengambil semua data popup dari Supabase (termasuk yang non-aktif)
        const { data: popups, error } = await supabase
            .from(this.tableName)
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        return `
            <div class="space-y-6">
                <!-- Header dengan tombol tambah -->
                <div class="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                    <h3 class="text-lg font-semibold">Daftar Gambar Popup</h3>
                    <button id="add-popup-btn" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                        Tambah Gambar
                    </button>
                </div>

                <!-- Grid daftar gambar -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${popups.map(popup => `
                        <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 group">
                            <!-- Preview gambar dengan overlay aksi -->
                            <div class="relative aspect-[3/4] bg-gray-100">
                                <img src="${popup.image_url}" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button class="edit-popup-btn p-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100" data-id="${popup.id}">
                                        Edit
                                    </button>
                                    <button class="delete-popup-btn p-2 bg-red-600 text-white rounded-lg hover:bg-red-700" data-id="${popup.id}">
                                        Hapus
                                    </button>
                                </div>
                            </div>
                            <!-- Info urutan dan toggle aktif -->
                            <div class="p-4 flex items-center justify-between">
                                <div>
                                    <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider">Urutan: ${popup.sort_order}</span>
                                    <p class="text-sm text-gray-500 mt-1">${popup.is_active ? 'Aktif' : 'Non-aktif'}</p>
                                </div>
                                <!-- Toggle switch untuk aktif/non-aktif -->
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" class="sr-only peer toggle-active" data-id="${popup.id}" ${popup.is_active ? 'checked' : ''}>
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                        </div>
                    `).join('')}
                    ${popups.length === 0 ? '<div class="col-span-full py-12 text-center text-gray-500">Belum ada gambar popup.</div>' : ''}
                </div>
                
                <!-- Modal untuk Tambah/Edit -->
                <div id="popup-modal-form" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 id="modal-title" class="text-xl font-bold mb-4">Tambah Gambar Popup</h3>
                        <form id="popup-form" class="space-y-4">
                            <input type="hidden" id="popup-id">
                            <input type="hidden" id="popup-image-url">
                            
                            <!-- Zona Upload Gambar -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Upload Gambar</label>
                                <div id="upload-widget-container"></div>
                            </div>

                            <!-- Atau input URL manual -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Atau masukkan URL manual</label>
                                <input type="url" id="popup-url-input" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://example.com/image.jpg">
                                <p class="text-xs text-gray-400 mt-1">Jika sudah upload file, abaikan kolom ini.</p>
                            </div>

                            <!-- Input urutan -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Urutan (Sort Order)</label>
                                <input type="number" id="popup-sort-order" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value="0">
                            </div>

                            <!-- Checkbox aktif -->
                            <div class="flex items-center gap-2">
                                <input type="checkbox" id="popup-is-active" checked class="w-4 h-4 text-indigo-600 rounded">
                                <label class="text-sm text-gray-700">Aktifkan Popup</label>
                            </div>

                            <!-- Tombol aksi -->
                            <div class="flex justify-end gap-3 mt-6">
                                <button type="button" id="close-modal-btn" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">Batal</button>
                                <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Memasang event listener untuk semua interaksi di halaman popup manager
     * @param {HTMLElement} container - Element parent dari konten popup manager
     */
    attachEventListeners(container) {
        const modal = container.querySelector('#popup-modal-form');
        const form = container.querySelector('#popup-form');
        const addBtn = container.querySelector('#add-popup-btn');
        const closeBtn = container.querySelector('#close-modal-btn');
        const uploadContainer = container.querySelector('#upload-widget-container');

        // Tag: Membuat widget upload menggunakan ImageUploader
        // Callback akan dipanggil setelah upload selesai, menyimpan URL ke hidden input
        const widget = this.imageUploader.createUploadWidget((url) => {
            // Tag: Menyimpan URL hasil upload ke hidden input dan state
            this.uploadedImageUrl = url;
            container.querySelector('#popup-image-url').value = url;
            // Tag: Mengosongkan input URL manual agar tidak konflik
            container.querySelector('#popup-url-input').value = '';
        });
        // Tag: Memasukkan widget ke dalam kontainer
        uploadContainer.appendChild(widget);

        // Tag: Event tombol Tambah Gambar — membuka modal kosong
        addBtn?.addEventListener('click', () => {
            container.querySelector('#modal-title').textContent = 'Tambah Gambar Popup';
            form.reset();
            container.querySelector('#popup-id').value = '';
            container.querySelector('#popup-image-url').value = '';
            this.uploadedImageUrl = '';
            modal.classList.remove('hidden');
        });

        // Tag: Event tombol Batal — menutup modal
        closeBtn?.addEventListener('click', () => modal.classList.add('hidden'));

        // Tag: Event Submit form — menyimpan data baru atau update ke Supabase
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = container.querySelector('#popup-id').value;
            const urlFromUpload = container.querySelector('#popup-image-url').value;
            const urlFromInput = container.querySelector('#popup-url-input').value;

            // Tag: Prioritas: URL dari upload, lalu dari input manual
            const finalImageUrl = urlFromUpload || urlFromInput;

            // Tag: Validasi — harus ada URL gambar
            if (!finalImageUrl) {
                alert('Silahkan upload gambar atau masukkan URL gambar.');
                return;
            }

            const payload = {
                image_url: finalImageUrl,
                sort_order: parseInt(container.querySelector('#popup-sort-order').value),
                is_active: container.querySelector('#popup-is-active').checked
            };

            let error;
            if (id) {
                // Tag: Mode Edit — update data berdasarkan ID
                ({ error } = await supabase.from(this.tableName).update(payload).eq('id', id));
            } else {
                // Tag: Mode Tambah — insert data baru
                ({ error } = await supabase.from(this.tableName).insert([payload]));
            }

            if (error) alert('Gagal menyimpan: ' + error.message);
            else location.reload();
        });

        // Tag: Event tombol Edit — mengisi form dengan data yang sudah ada
        container.querySelectorAll('.edit-popup-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const { data, error } = await supabase.from(this.tableName).select('*').eq('id', id).single();
                
                if (data) {
                    container.querySelector('#modal-title').textContent = 'Edit Gambar Popup';
                    container.querySelector('#popup-id').value = data.id;
                    container.querySelector('#popup-image-url').value = data.image_url;
                    container.querySelector('#popup-url-input').value = data.image_url;
                    container.querySelector('#popup-sort-order').value = data.sort_order;
                    container.querySelector('#popup-is-active').checked = data.is_active;
                    modal.classList.remove('hidden');
                }
            });
        });

        // Tag: Event tombol Hapus — menghapus data dari Supabase
        container.querySelectorAll('.delete-popup-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
                    const id = btn.dataset.id;
                    const { error } = await supabase.from(this.tableName).delete().eq('id', id);
                    if (error) alert('Gagal menghapus: ' + error.message);
                    else location.reload();
                }
            });
        });

        // Tag: Event Toggle Active — mengubah status aktif/non-aktif tanpa reload
        container.querySelectorAll('.toggle-active').forEach(toggle => {
            toggle.addEventListener('change', async () => {
                const id = toggle.dataset.id;
                const { error } = await supabase.from(this.tableName).update({ is_active: toggle.checked }).eq('id', id);
                if (error) {
                    alert('Gagal mengubah status: ' + error.message);
                    // Tag: Rollback toggle jika gagal
                    toggle.checked = !toggle.checked;
                }
            });
        });
    }
}
