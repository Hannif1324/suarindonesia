import { supabase } from '../../js/services/supabase-client.js';
import { ImageUploader } from './image-uploader.js';
import { CustomDialog } from './custom-dialog.js';

export class VideoManager {
    constructor() {
        this.currentVideo = null;
        this.imageUploader = new ImageUploader('video-thumbnails');
        this.customDialog = new CustomDialog();
    }

    async renderListView() {
        const { data: videos, error } = await supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching videos:', error);
            return '<div class="text-red-500">Error loading videos</div>';
        }

        return `
            <div class="mb-6 flex justify-between items-center">
                <h2 class="text-2xl font-bold">Manage Videos</h2>
                <button id="new-video-btn" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    + New Video
                </button>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    ${videos.map(video => `
                        <div class="group bg-white rounded-lg border border-gray-200 hover:border-indigo-500 transition-all overflow-hidden">
                            <div class="relative aspect-video overflow-hidden">
                                <img 
                                    src="${video.thumbnail}" 
                                    alt="${video.title}"
                                    class="w-full h-full object-cover"
                                >
                                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                                        <svg class="w-6 h-6 text-indigo-600 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
                                        </svg>
                                    </div>
                                </div>
                                ${video.duration ? `
                                    <div class="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                                        ${video.duration}
                                    </div>
                                ` : ''}
                            </div>
                            <div class="p-4">
                                <h3 class="font-bold text-gray-900 mb-1 line-clamp-2">${video.title}</h3>
                                <p class="text-sm text-gray-600 mb-2 line-clamp-2">${video.description}</p>
                                <p class="text-xs text-gray-500 mb-3">${video.date}</p>
                                <div class="flex gap-2">
                                    <button class="edit-video-btn flex-1 bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-indigo-700" data-id="${video.id}">
                                        Edit
                                    </button>
                                    <button class="delete-video-btn flex-1 bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-red-700" data-id="${video.id}">
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

    renderEditorView(video = null) {
        this.currentVideo = video;

        return `
            <div class="mb-6">
                <button id="back-to-list" class="text-gray-600 hover:text-gray-900 flex items-center">
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Videos
                </button>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-2xl font-bold mb-6">${video ? 'Edit Video' : 'Add New Video'}</h2>

                <form id="video-form" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                        <input type="text" name="title" required value="${video?.title || ''}" placeholder="e.g., Profil SuaR Indonesia"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Judul video yang menarik dan deskriptif.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea name="description" required rows="3" placeholder="e.g., Video profil organisasi SuaR Indonesia dan program-program yang dijalankan"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">${video?.description || ''}</textarea>
                        <p class="text-xs text-gray-500 mt-1">Deskripsi singkat tentang isi video.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image *</label>
                        <input type="text" name="thumbnail" required value="${video?.thumbnail || ''}" id="video-thumbnail-url" placeholder="e.g., https://example.com/thumbnail.jpg"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2">
                        <p class="text-xs text-gray-500 mt-1">Upload thumbnail/preview image untuk video.</p>
                        <div id="video-thumbnail-upload"></div>
                        ${video?.thumbnail ? `
                            <div class="mt-3">
                                <img src="${video.thumbnail}" alt="Thumbnail Preview" class="w-64 h-36 object-cover rounded-lg border">
                            </div>
                        ` : ''}
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Video URL *</label>
                        <input type="url" name="video_url" required value="${video?.video_url || ''}" placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">URL embed YouTube atau Vimeo. Format: https://www.youtube.com/embed/VIDEO_ID</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                            <input type="text" name="duration" value="${video?.duration || ''}" placeholder="e.g., 5:30"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-xs text-gray-500 mt-1">Format: MM:SS (opsional)</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                            <input type="text" name="date" required value="${video?.date || ''}" placeholder="e.g., Januari 2024"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-xs text-gray-500 mt-1">Format: Month YYYY</p>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Video</button>
                    </div>
                </form>
            </div>
        `;
    }

    attachEventListeners(container) {
        // New Video button
        const newBtn = container.querySelector('#new-video-btn');
        newBtn?.addEventListener('click', () => {
            this.showEditor();
        });

        // Edit buttons
        container.querySelectorAll('.edit-video-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const { data: video } = await supabase.from('videos').select('*').eq('id', id).single();
                this.showEditor(video);
            });
        });

        // Delete buttons
        container.querySelectorAll('.delete-video-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const confirmed = await this.customDialog.confirm('Are you sure you want to delete this video?', 'Delete Video');
                if (!confirmed) return;

                const id = e.target.dataset.id;
                await supabase.from('videos').delete().eq('id', id);
                this.showList();
            });
        });

        // Back to list
        container.querySelector('#back-to-list')?.addEventListener('click', () => {
            this.showList();
        });

        // Thumbnail upload
        const thumbnailUploadContainer = container.querySelector('#video-thumbnail-upload');
        if (thumbnailUploadContainer) {
            const widget = this.imageUploader.createUploadWidget((url) => {
                container.querySelector('#video-thumbnail-url').value = url;
            });
            thumbnailUploadContainer.appendChild(widget);
        }

        // Form submit
        container.querySelector('#video-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveVideo(e.target);
        });

        // Cancel button
        container.querySelector('#cancel-btn')?.addEventListener('click', () => {
            this.showList();
        });
    }

    async saveVideo(form) {
        const formData = new FormData(form);

        const videoData = {
            title: formData.get('title') || '',
            description: formData.get('description') || '',
            thumbnail: formData.get('thumbnail') || '',
            video_url: formData.get('video_url') || '',
            duration: formData.get('duration') || null,
            date: formData.get('date') || ''
        };

        try {
            if (this.currentVideo) {
                await supabase.from('videos').update(videoData).eq('id', this.currentVideo.id);
            } else {
                await supabase.from('videos').insert([videoData]);
            }

            await this.customDialog.alert('Video saved successfully!', 'Success');
            this.showList();
        } catch (error) {
            await this.customDialog.alert('Error saving video: ' + error.message, 'Error');
        }
    }

    async showList() {
        let container = document.getElementById('app-content-videos');
        if (!container) {
            const parent = document.getElementById('videos');
            if (parent) {
                container = document.createElement('div');
                container.id = 'app-content-videos';
                parent.appendChild(container);
            }
        }
        if (container) {
            container.innerHTML = await this.renderListView();
            this.attachEventListeners(container);
        }
    }

    showEditor(video = null) {
        let container = document.getElementById('app-content-videos');
        if (!container) {
            const parent = document.getElementById('videos');
            if (parent) {
                container = document.createElement('div');
                container.id = 'app-content-videos';
                parent.appendChild(container);
            }
        }
        if (container) {
            container.innerHTML = this.renderEditorView(video);
            this.attachEventListeners(container);
        }
    }
}
