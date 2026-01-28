import { supabase } from '../../js/services/supabase-client.js';
import { ImageUploader } from './image-uploader.js';
import { CustomDialog } from './custom-dialog.js';

export class PhotoGalleryManager {
    constructor() {
        this.currentPhoto = null;
        this.imageUploader = new ImageUploader('photo-gallery-images');
        this.customDialog = new CustomDialog();
    }

    async renderListView() {
        const { data: photos, error } = await supabase
            .from('photo_gallery')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching photo gallery:', error);
            return '<div class="text-red-500">Error loading photo gallery</div>';
        }

        return `
            <div class="mb-6 flex justify-between items-center">
                <h2 class="text-2xl font-bold">Manage Photo Gallery</h2>
                <button id="new-photo-btn" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    + New Photo
                </button>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                    ${photos.map(photo => `
                        <div class="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 hover:border-indigo-500 transition-all">
                            <img 
                                src="${photo.image}" 
                                alt="${photo.caption}"
                                class="w-full h-full object-cover"
                            >
                            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                <div class="text-white">
                                    <p class="text-sm font-semibold line-clamp-2 mb-1">${photo.caption}</p>
                                    <p class="text-xs text-gray-300">${photo.date}</p>
                                    <span class="inline-block mt-1 px-2 py-0.5 bg-indigo-500 text-xs rounded">${photo.category}</span>
                                </div>
                                <div class="flex gap-2">
                                    <button class="edit-photo-btn flex-1 bg-white text-gray-900 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-100" data-id="${photo.id}">
                                        Edit
                                    </button>
                                    <button class="delete-photo-btn flex-1 bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-700" data-id="${photo.id}">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderEditorView(photo = null) {
        this.currentPhoto = photo;

        return `
            <div class="mb-6">
                <button id="back-to-list" class="text-gray-600 hover:text-gray-900 flex items-center">
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Gallery
                </button>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-2xl font-bold mb-6">${photo ? 'Edit Photo' : 'Add New Photo'}</h2>

                <form id="photo-form" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Image *</label>
                        <input type="text" name="image" required value="${photo?.image || ''}" id="photo-image-url" placeholder="e.g., https://example.com/photo.jpg"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2">
                        <p class="text-xs text-gray-500 mt-1">Upload atau paste URL gambar dokumentasi.</p>
                        <div id="photo-image-upload"></div>
                        ${photo?.image ? `
                            <div class="mt-3">
                                <img src="${photo.image}" alt="Preview" class="w-48 h-48 object-cover rounded-lg border">
                            </div>
                        ` : ''}
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Caption *</label>
                        <input type="text" name="caption" required value="${photo?.caption || ''}" placeholder="e.g., Workshop GEDSI - BPBD Jawa Timur"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Deskripsi singkat tentang foto.</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                            <input type="text" name="date" required value="${photo?.date || ''}" placeholder="e.g., 20 April 2022"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-xs text-gray-500 mt-1">Format: DD Month YYYY</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <select name="category" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="" disabled ${!photo?.category ? 'selected' : ''}>Select Category</option>
                                <option value="rapat" ${photo?.category === 'rapat' ? 'selected' : ''}>Rapat & Pertemuan</option>
                                <option value="pelatihan" ${photo?.category === 'pelatihan' ? 'selected' : ''}>Pelatihan & Workshop</option>
                                <option value="sosialisasi" ${photo?.category === 'sosialisasi' ? 'selected' : ''}>Sosialisasi & Kampanye</option>
                                <option value="lapangan" ${photo?.category === 'lapangan' ? 'selected' : ''}>Program Lapangan</option>
                                <option value="monev" ${photo?.category === 'monev' ? 'selected' : ''}>Monitoring & Evaluasi</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Photo</button>
                    </div>
                </form>
            </div>
        `;
    }

    attachEventListeners(container) {
        // New Photo button
        const newBtn = container.querySelector('#new-photo-btn');
        newBtn?.addEventListener('click', () => {
            this.showEditor();
        });

        // Edit buttons
        container.querySelectorAll('.edit-photo-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const { data: photo } = await supabase.from('photo_gallery').select('*').eq('id', id).single();
                this.showEditor(photo);
            });
        });

        // Delete buttons
        container.querySelectorAll('.delete-photo-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const confirmed = await this.customDialog.confirm('Are you sure you want to delete this photo?', 'Delete Photo');
                if (!confirmed) return;

                const id = e.target.dataset.id;
                await supabase.from('photo_gallery').delete().eq('id', id);
                this.showList();
            });
        });

        // Back to list
        container.querySelector('#back-to-list')?.addEventListener('click', () => {
            this.showList();
        });

        // Image upload
        const imageUploadContainer = container.querySelector('#photo-image-upload');
        if (imageUploadContainer) {
            const widget = this.imageUploader.createUploadWidget((url) => {
                container.querySelector('#photo-image-url').value = url;
            });
            imageUploadContainer.appendChild(widget);
        }

        // Form submit
        container.querySelector('#photo-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePhoto(e.target);
        });

        // Cancel button
        container.querySelector('#cancel-btn')?.addEventListener('click', () => {
            this.showList();
        });
    }

    async savePhoto(form) {
        const formData = new FormData(form);

        const photoData = {
            image: formData.get('image') || '',
            caption: formData.get('caption') || '',
            date: formData.get('date') || '',
            category: formData.get('category') || 'rapat'
        };

        try {
            if (this.currentPhoto) {
                await supabase.from('photo_gallery').update(photoData).eq('id', this.currentPhoto.id);
            } else {
                await supabase.from('photo_gallery').insert([photoData]);
            }

            await this.customDialog.alert('Photo saved successfully!', 'Success');
            this.showList();
        } catch (error) {
            await this.customDialog.alert('Error saving photo: ' + error.message, 'Error');
        }
    }

    async showList() {
        let container = document.getElementById('app-content-photo-gallery');
        if (!container) {
            const parent = document.getElementById('photo-gallery');
            if (parent) {
                container = document.createElement('div');
                container.id = 'app-content-photo-gallery';
                parent.appendChild(container);
            }
        }
        if (container) {
            container.innerHTML = await this.renderListView();
            this.attachEventListeners(container);
        }
    }

    showEditor(photo = null) {
        let container = document.getElementById('app-content-photo-gallery');
        if (!container) {
            const parent = document.getElementById('photo-gallery');
            if (parent) {
                container = document.createElement('div');
                container.id = 'app-content-photo-gallery';
                parent.appendChild(container);
            }
        }
        if (container) {
            container.innerHTML = this.renderEditorView(photo);
            this.attachEventListeners(container);
        }
    }
}
