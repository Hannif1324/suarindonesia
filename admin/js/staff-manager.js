/**
 * Staff Manager
 * Mengelola data staff SuaR Indonesia via Supabase
 * CRUD operations: Create, Read, Update, Delete
 */

import { supabase } from '../../js/services/supabase-client.js';
import { ImageUploader } from './image-uploader.js';
import { CustomDialog } from './custom-dialog.js';

export class StaffManager {
    /**
     * Constructor - inisialisasi dependencies
     */
    constructor() {
        // Menyimpan data staff yang sedang diedit (null jika create new)
        this.currentStaff = null;
        // Instance ImageUploader dengan bucket 'staff-images'
        this.imageUploader = new ImageUploader('staff-images');
        // Instance CustomDialog untuk konfirmasi dan alert
        this.customDialog = new CustomDialog();
    }

    /**
     * Render tampilan daftar staff dalam bentuk tabel
     * Menampilkan semua staff terurut berdasarkan tipe dan display_order
     * @returns {Promise<string>} HTML string untuk list view
     */
    async renderListView() {
        // Fetch semua data staff dari Supabase
        // Urut berdasarkan: tipe (management dulu), lalu display_order
        const { data: staffList, error } = await supabase
            .from('staff')
            .select('*')
            .order('staff_type', { ascending: true })  // 'management' < 'staff' secara alphabetical
            .order('display_order', { ascending: true });

        // Handle error jika fetch gagal
        if (error) {
            console.error('Error fetching staff:', error);
            return '<div class="text-red-500">Error loading staff data</div>';
        }

        // Generate HTML untuk list view dengan tabel responsif
        return `
            <!-- Header dengan tombol tambah staff baru -->
            <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 class="text-2xl font-bold">Manage Staff</h2>
                <button id="new-staff-btn" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full sm:w-auto">
                    + New Staff
                </button>
            </div>

            <!-- Container tabel dengan scroll horizontal untuk mobile -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <!-- Header tabel -->
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Role</th>
                                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Location</th>
                                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <!-- Body tabel: loop setiap staff -->
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${staffList.map(staff => `
                                <tr class="hover:bg-gray-50">
                                    <!-- Kolom foto: thumbnail kecil -->
                                    <td class="px-4 sm:px-6 py-4">
                                        <img src="${staff.image}" alt="${staff.name}" 
                                            class="w-10 h-10 rounded-full object-cover object-${staff.image_position || 'top'}"
                                            loading="lazy">
                                    </td>
                                    <!-- Kolom nama + role (mobile) -->
                                    <td class="px-4 sm:px-6 py-4">
                                        <div class="text-sm font-medium text-gray-900">${staff.name}</div>
                                        <div class="text-xs text-gray-500 md:hidden">${staff.role}</div>
                                    </td>
                                    <!-- Kolom role (tablet+) -->
                                    <td class="px-4 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell">${staff.role}</td>
                                    <!-- Kolom tipe dengan badge warna -->
                                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${staff.staff_type === 'management' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}">
                                            ${staff.staff_type === 'management' ? 'Management' : 'Staff'}
                                        </span>
                                    </td>
                                    <!-- Kolom lokasi (desktop only) -->
                                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">${staff.location}</td>
                                    <!-- Kolom aksi: Edit & Delete -->
                                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-indigo-600 hover:text-indigo-900 mr-2 sm:mr-3 edit-btn" data-id="${staff.id}">Edit</button>
                                        <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${staff.id}">Del</button>
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
     * Render form editor untuk create/edit staff
     * @param {Object|null} staff - Data staff untuk edit, null untuk create baru
     * @returns {string} HTML string untuk editor view
     */
    renderEditorView(staff = null) {
        // Simpan referensi staff yang sedang diedit
        this.currentStaff = staff;

        return `
            <!-- Tombol kembali ke list -->
            <div class="mb-6">
                <button id="back-to-list" class="text-gray-600 hover:text-gray-900 flex items-center">
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to List
                </button>
            </div>

            <!-- Form container -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-2xl font-bold mb-6">${staff ? 'Edit Staff' : 'New Staff'}</h2>

                <form id="staff-form" class="space-y-6">
                    <!-- Field: Nama Staff (required) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                        <input type="text" name="name" required value="${staff?.name || ''}" 
                            placeholder="e.g., John Doe"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Nama lengkap staff.</p>
                    </div>

                    <!-- Field: Role/Jabatan (required) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                        <input type="text" name="role" required value="${staff?.role || ''}" 
                            placeholder="e.g., Program Manager"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Jabatan atau posisi staff.</p>
                    </div>

                    <!-- Row: Type, Location, Display Order -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Field: Staff Type (dropdown) -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Staff Type *</label>
                            <select name="staff_type" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="staff" ${staff?.staff_type === 'staff' || !staff ? 'selected' : ''}>Staff</option>
                                <option value="management" ${staff?.staff_type === 'management' ? 'selected' : ''}>Management</option>
                            </select>
                            <p class="text-xs text-gray-500 mt-1">Kategori staff.</p>
                        </div>
                        
                        <!-- Field: Location (dropdown) -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                            <select name="location" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="Kediri" ${staff?.location === 'Kediri' || !staff ? 'selected' : ''}>Kediri</option>
                                <option value="Jember" ${staff?.location === 'Jember' ? 'selected' : ''}>Jember</option>
                            </select>
                            <p class="text-xs text-gray-500 mt-1">Lokasi kerja.</p>
                        </div>

                        <!-- Field: Display Order (number) -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                            <input type="number" name="display_order" value="${staff?.display_order || 0}" 
                                min="0" placeholder="0"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-xs text-gray-500 mt-1">Urutan tampilan (0 = default).</p>
                        </div>
                    </div>

                    <!-- Field: Image Position -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Image Position</label>
                        <select name="image_position" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="top" ${staff?.image_position === 'top' || !staff ? 'selected' : ''}>Top (default)</option>
                            <option value="center" ${staff?.image_position === 'center' ? 'selected' : ''}>Center</option>
                        </select>
                        <p class="text-xs text-gray-500 mt-1">Posisi fokus foto (untuk foto potret gunakan 'top', untuk foto lain bisa 'center').</p>
                    </div>

                    <!-- Field: Image URL + Upload Widget -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                        <input type="text" name="image" required value="${staff?.image || ''}" id="staff-image-url"
                            placeholder="e.g., https://example.com/photo.jpg"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2">
                        <p class="text-xs text-gray-500 mt-1">Upload foto atau masukkan URL gambar.</p>
                        <!-- Container untuk upload widget -->
                        <div id="staff-image-upload"></div>
                    </div>

                    <!-- Tombol aksi: Cancel & Save -->
                    <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
                        <button type="button" id="cancel-btn" 
                            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto">
                            Cancel
                        </button>
                        <button type="submit" 
                            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full sm:w-auto">
                            Save Staff
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    /**
     * Attach event listeners ke container
     * Menghubungkan tombol dengan fungsi yang sesuai
     * @param {HTMLElement} container - Container element untuk attach events
     */
    attachEventListeners(container) {
        console.log('StaffManager: attachEventListeners called', container);

        // Event: Tombol "New Staff" - buka editor kosong
        const newBtn = container.querySelector('#new-staff-btn');
        newBtn?.addEventListener('click', () => {
            console.log('New staff button clicked');
            this.showEditor();
        });

        // Event: Tombol "Edit" pada setiap row - buka editor dengan data
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                // Ambil ID dari data attribute
                const id = e.target.dataset.id;
                // Fetch data staff berdasarkan ID
                const { data: staff } = await supabase
                    .from('staff')
                    .select('*')
                    .eq('id', id)
                    .single();
                // Buka editor dengan data yang diambil
                this.showEditor(staff);
            });
        });

        // Event: Tombol "Delete" pada setiap row - konfirmasi lalu hapus
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                // Tampilkan dialog konfirmasi
                const confirmed = await this.customDialog.confirm(
                    'Are you sure you want to delete this staff member?', 
                    'Delete Staff'
                );
                // Jika user membatalkan, hentikan proses
                if (!confirmed) return;

                // Ambil ID dan hapus dari database
                const id = e.target.dataset.id;
                await supabase.from('staff').delete().eq('id', id);
                // Refresh list setelah hapus
                this.showList();
            });
        });

        // Event: Tombol "Back to List" - kembali ke daftar
        container.querySelector('#back-to-list')?.addEventListener('click', () => {
            this.showList();
        });

        // Event: Image upload widget - set URL hasil upload ke input field
        const imageUploadContainer = container.querySelector('#staff-image-upload');
        if (imageUploadContainer) {
            // Buat widget upload dan attach callback
            const widget = this.imageUploader.createUploadWidget((url) => {
                // Set value input URL dengan hasil upload
                container.querySelector('#staff-image-url').value = url;
            });
            imageUploadContainer.appendChild(widget);
        }

        // Event: Form submit - simpan data staff
        container.querySelector('#staff-form')?.addEventListener('submit', (e) => {
            e.preventDefault();  // Prevent default form submit
            this.saveStaff(e.target);  // Panggil method saveStaff
        });

        // Event: Tombol "Cancel" - kembali ke daftar tanpa simpan
        container.querySelector('#cancel-btn')?.addEventListener('click', () => {
            this.showList();
        });
    }

    /**
     * Simpan data staff ke Supabase (insert atau update)
     * @param {HTMLFormElement} form - Form element dengan data staff
     */
    async saveStaff(form) {
        // Ekstrak data dari form
        const formData = new FormData(form);
        
        // Parse dan validasi display_order sebagai integer
        const displayOrderValue = formData.get('display_order');

        // Buat object data untuk disimpan
        const staffData = {
            name: formData.get('name') || '',           // Nama staff
            role: formData.get('role') || '',           // Jabatan
            staff_type: formData.get('staff_type') || 'staff',  // Tipe: management/staff
            location: formData.get('location') || 'Kediri',     // Lokasi kerja
            image_position: formData.get('image_position') || 'top',  // Posisi foto
            display_order: displayOrderValue ? parseInt(displayOrderValue) : 0,  // Urutan
            image: formData.get('image') || ''          // URL foto
        };

        try {
            if (this.currentStaff) {
                // Mode UPDATE: update data yang sudah ada
                await supabase
                    .from('staff')
                    .update(staffData)
                    .eq('id', this.currentStaff.id);
            } else {
                // Mode INSERT: tambah data baru
                await supabase
                    .from('staff')
                    .insert([staffData]);
            }

            // Tampilkan notifikasi sukses
            await this.customDialog.alert('Staff saved successfully!', 'Success');
            // Kembali ke list view
            this.showList();
        } catch (error) {
            // Tampilkan error jika gagal
            await this.customDialog.alert('Error saving staff: ' + error.message, 'Error');
        }
    }

    /**
     * Tampilkan list view di container
     * Method ini dipanggil untuk refresh atau navigasi ke list
     */
    async showList() {
        console.log('StaffManager: showList called');

        // Cari container dengan ID spesifik
        let container = document.getElementById('app-content-staff');
        if (!container) {
            // Fallback: buat container baru jika tidak ditemukan
            const parent = document.getElementById('staff');
            if (parent) {
                container = document.createElement('div');
                container.id = 'app-content-staff';
                parent.appendChild(container);
            }
        }
        if (container) {
            // Render list view dan attach event listeners
            container.innerHTML = await this.renderListView();
            this.attachEventListeners(container);
        }
    }

    /**
     * Tampilkan editor view di container
     * @param {Object|null} staff - Data staff untuk edit, null untuk create baru
     */
    showEditor(staff = null) {
        console.log('StaffManager: showEditor called', staff);

        // Cari container dengan ID spesifik
        let container = document.getElementById('app-content-staff');
        console.log('Container found:', container);

        if (!container) {
            // Fallback: buat container baru jika tidak ditemukan
            const parent = document.getElementById('staff');
            if (parent) {
                container = document.createElement('div');
                container.id = 'app-content-staff';
                parent.appendChild(container);
            }
        }
        if (container) {
            // Render editor view dan attach event listeners
            container.innerHTML = this.renderEditorView(staff);
            this.attachEventListeners(container);
        }
    }
}
