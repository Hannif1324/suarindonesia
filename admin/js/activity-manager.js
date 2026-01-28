import { supabase } from '../../js/services/supabase-client.js';
import { ImageUploader } from './image-uploader.js';
import { CustomDialog } from './custom-dialog.js';

export class ActivityManager {
    constructor() {
        this.currentActivity = null;
        this.imageUploader = new ImageUploader('activity-images');
        this.customDialog = new CustomDialog();
    }

    /**
     * Render the activity list view - MOBILE RESPONSIVE
     */
    async renderListView() {
        const { data: activities, error } = await supabase
            .from('activities')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching activities:', error);
            return '<div class="text-red-500">Error loading activities</div>';
        }

        return `
            <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 class="text-2xl font-bold">Manage Activities</h2>
                <button id="new-activity-btn" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full sm:w-auto">
                    + New Activity
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
                                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Location</th>
                                <th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${activities.map(activity => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 sm:px-6 py-4">
                                        <div class="text-sm font-medium text-gray-900">${activity.title}</div>
                                        <div class="text-xs text-gray-500 md:hidden">${activity.date}</div>
                                    </td>
                                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            ${activity.category}
                                        </span>
                                    </td>
                                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">${activity.date}</td>
                                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell truncate max-w-[150px]">${activity.location}</td>
                                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button class="text-indigo-600 hover:text-indigo-900 mr-2 sm:mr-3 edit-btn" data-id="${activity.id}">Edit</button>
                                        <button class="text-red-600 hover:text-red-900 delete-btn" data-id="${activity.id}">Del</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    renderEditorView(activity = null) {
        this.currentActivity = activity;

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
                <h2 class="text-2xl font-bold mb-6">${activity ? 'Edit Activity' : 'New Activity'}</h2>

                <form id="activity-form" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                        <input type="text" name="title" required value="${activity?.title || ''}" placeholder="e.g., Rapat Koordinasi Bulanan"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Nama kegiatan yang jelas dan ringkas.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                            <input type="text" name="date" required value="${activity?.date || ''}" placeholder="e.g., 12 Desember 2025"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-xs text-gray-500 mt-1">Format: Tanggal Bulan Tahun.</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <select name="category" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="" disabled ${!activity?.category ? 'selected' : ''}>Select Category</option>
                                <option value="rapat" ${activity?.category === 'rapat' ? 'selected' : ''}>Rapat & Pertemuan</option>
                                <option value="pelatihan" ${activity?.category === 'pelatihan' ? 'selected' : ''}>Pelatihan & Workshop</option>
                                <option value="sosialisasi" ${activity?.category === 'sosialisasi' ? 'selected' : ''}>Sosialisasi & Kampanye</option>
                                <option value="lapangan" ${activity?.category === 'lapangan' ? 'selected' : ''}>Program Lapangan</option>
                                <option value="monev" ${activity?.category === 'monev' ? 'selected' : ''}>Monitoring & Evaluasi</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                            <input type="number" name="participants" value="${activity?.participants || ''}" placeholder="e.g., 50"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-xs text-gray-500 mt-1">Estimasi jumlah peserta.</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                        <input type="text" name="location" required value="${activity?.location || ''}" placeholder="e.g., Aula Utama, Kantor Pusat"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea name="description" required rows="4" placeholder="e.g., Rapat ini bertujuan untuk mengevaluasi kinerja kuartal pertama..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">${activity?.description || ''}</textarea>
                        <p class="text-xs text-gray-500 mt-1">Deskripsi lengkap mengenai kegiatan.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Highlights (one per line)</label>
                        <textarea name="highlights" rows="3" placeholder="e.g.,&#10;- Pembahasan Anggaran&#10;- Penetapan Target Baru"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">${activity?.highlights?.join('\n') || ''}</textarea>
                        <p class="text-xs text-gray-500 mt-1">Poin-poin penting kegiatan, satu per baris.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                        <input type="text" name="image" required value="${activity?.image || ''}" id="activity-image-url" placeholder="e.g., https://example.com/activity.jpg"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2">
                        <p class="text-xs text-gray-500 mt-1">Upload foto dokumentasi kegiatan.</p>
                        <div id="activity-image-upload"></div>
                    </div>

                    <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
                        <button type="button" id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 w-full sm:w-auto">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full sm:w-auto">Save Activity</button>
                    </div>
                </form>
            </div>
        `;
    }

    attachEventListeners(container) {
        console.log('ActivityManager: attachEventListeners called', container);

        // New Activity button
        const newBtn = container.querySelector('#new-activity-btn');
        console.log('New activity button found:', newBtn);

        newBtn?.addEventListener('click', () => {
            console.log('New activity button CLICKED!');
            this.showEditor();
        });

        // Edit buttons
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const { data: activity } = await supabase.from('activities').select('*').eq('id', id).single();
                this.showEditor(activity);
            });
        });

        // Delete buttons
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const confirmed = await this.customDialog.confirm('Are you sure you want to delete this activity?', 'Delete Activity');
                if (!confirmed) return;

                const id = e.target.dataset.id;
                await supabase.from('activities').delete().eq('id', id);
                this.showList();
            });
        });

        // Back to list
        container.querySelector('#back-to-list')?.addEventListener('click', () => {
            this.showList();
        });

        // Image upload
        const imageUploadContainer = container.querySelector('#activity-image-upload');
        if (imageUploadContainer) {
            const widget = this.imageUploader.createUploadWidget((url) => {
                container.querySelector('#activity-image-url').value = url;
            });
            imageUploadContainer.appendChild(widget);
        }

        // Form submit
        container.querySelector('#activity-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveActivity(e.target);
        });

        // Cancel button
        container.querySelector('#cancel-btn')?.addEventListener('click', () => {
            this.showList();
        });
    }

    async saveActivity(form) {
        const formData = new FormData(form);

        const highlightsText = formData.get('highlights') || '';
        const participantsValue = formData.get('participants');

        const activityData = {
            title: formData.get('title') || '',
            date: formData.get('date') || '',
            category: formData.get('category') || 'rapat',
            location: formData.get('location') || '',
            participants: participantsValue ? parseInt(participantsValue) : null,
            description: formData.get('description') || '',
            highlights: highlightsText.split('\n').filter(h => h.trim()),
            image: formData.get('image') || ''
        };

        try {
            if (this.currentActivity) {
                await supabase.from('activities').update(activityData).eq('id', this.currentActivity.id);
            } else {
                await supabase.from('activities').insert([activityData]);
            }

            await this.customDialog.alert('Activity saved successfully!', 'Success');
            this.showList();
        } catch (error) {
            await this.customDialog.alert('Error saving activity: ' + error.message, 'Error');
        }
    }

    async showList() {
        console.log('ActivityManager: showList called');

        let container = document.getElementById('app-content-kegiatan');
        if (!container) {
            // Fallback if the specific ID isn't found
            const parent = document.getElementById('kegiatan');
            if (parent) {
                container = document.createElement('div');
                container.id = 'app-content-kegiatan';
                parent.appendChild(container);
            }
        }
        if (container) {
            container.innerHTML = await this.renderListView();
            this.attachEventListeners(container);
        }
    }

    showEditor(activity = null) {
        console.log('ActivityManager: showEditor called', activity);

        let container = document.getElementById('app-content-kegiatan');
        console.log('Container found:', container);

        if (!container) {
            const parent = document.getElementById('kegiatan');
            if (parent) {
                container = document.createElement('div');
                container.id = 'app-content-kegiatan';
                parent.appendChild(container);
            }
        }
        if (container) {
            container.innerHTML = this.renderEditorView(activity);
            this.attachEventListeners(container);
        }
    }
}
