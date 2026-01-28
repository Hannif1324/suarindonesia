import { supabase } from '../../js/services/supabase-client.js';
import { CustomDialog } from './custom-dialog.js';

export class SubmissionsManager {
    constructor() {
        this.currentSubmission = null;
        this.customDialog = new CustomDialog();
        this.pollInterval = null;
        this.lastCount = -1;
    }

    async renderListView() {
        const { data: submissions, error } = await supabase
            .from('contact_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching submissions:', error);
            return '<div class="text-red-500">Error loading submissions</div>';
        }

        // Calculate statistics
        const stats = {
            total: submissions.length,
            baru: submissions.filter(s => s.status === 'baru').length,
            diproses: submissions.filter(s => s.status === 'diproses').length,
            selesai: submissions.filter(s => s.status === 'selesai').length
        };

        return `
            <div class="space-y-6">
                <!-- Header with Stats -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Pengaduan & Pesan</h2>
                </div>

                <!-- Statistics Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-gray-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm font-medium">Total Pengaduan</p>F
                                <p class="text-2xl font-bold text-gray-900 mt-1">${stats.total}</p>
                            </div>
                            <div class="bg-gray-100 rounded-full p-3">
                                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm font-medium">Pesan Baru</p>
                                <p class="text-2xl font-bold text-red-600 mt-1">${stats.baru}</p>
                            </div>
                            <div class="bg-red-100 rounded-full p-3">
                                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm font-medium">Diproses</p>
                                <p class="text-2xl font-bold text-yellow-600 mt-1">${stats.diproses}</p>
                            </div>
                            <div class="bg-yellow-100 rounded-full p-3">
                                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-600 text-sm font-medium">Selesai</p>
                                <p class="text-2xl font-bold text-green-600 mt-1">${stats.selesai}</p>
                            </div>
                            <div class="bg-green-100 rounded-full p-3">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Filter Tabs -->
                <div class="bg-white rounded-lg shadow">
                    <div class="border-b border-gray-200">
                        <nav class="flex -mb-px">
                            <button class="status-filter-btn status-filter-active px-6 py-4 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600" data-status="all">
                                Semua (${stats.total})
                            </button>
                            <button class="status-filter-btn px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300" data-status="baru">
                                Baru (${stats.baru})
                            </button>
                            <button class="status-filter-btn px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300" data-status="diproses">
                                Diproses (${stats.diproses})
                            </button>
                            <button class="status-filter-btn px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300" data-status="selesai">
                                Selesai (${stats.selesai})
                            </button>
                        </nav>
                    </div>

                    <!-- Submissions Table -->
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="submissions-tbody" class="bg-white divide-y divide-gray-200">
                                ${submissions.map(sub => this.renderSubmissionRow(sub)).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderSubmissionRow(submission) {
        const statusColors = {
            'baru': 'bg-red-100 text-red-800',
            'diproses': 'bg-yellow-100 text-yellow-800',
            'selesai': 'bg-green-100 text-green-800'
        };

        const date = new Date(submission.created_at);
        const formattedDate = date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <tr class="submission-row hover:bg-gray-50 transition" data-status="${submission.status}" data-id="${submission.id}">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#${submission.id}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${submission.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-600">${submission.email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-600">${submission.phone}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[submission.status]}">
                        ${submission.status.toUpperCase()}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${formattedDate}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button class="view-detail-btn text-indigo-600 hover:text-indigo-900 font-medium mr-3" data-id="${submission.id}">
                        Detail
                    </button>
                    <button class="delete-submission-btn text-red-600 hover:text-red-900 font-medium" data-id="${submission.id}">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    }

    async showDetailModal(id) {
        const { data: submission, error } = await supabase
            .from('contact_submissions')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching submission:', error);
            return;
        }

        const date = new Date(submission.created_at);
        const formattedDate = date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const modalHTML = `
            <div id="detail-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-6">
                            <h3 class="text-2xl font-bold text-gray-900">Detail Pengaduan #${submission.id}</h3>
                            <button id="close-detail-modal" class="text-gray-400 hover:text-gray-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                <p class="text-gray-900">${submission.name}</p>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <p class="text-gray-900">${submission.email}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
                                    <p class="text-gray-900">${submission.phone}</p>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Kasus / Pengaduan</label>
                                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <p class="text-gray-900 whitespace-pre-wrap">${submission.case_description}</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select id="status-select" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="baru" ${submission.status === 'baru' ? 'selected' : ''}>Baru</option>
                                        <option value="diproses" ${submission.status === 'diproses' ? 'selected' : ''}>Diproses</option>
                                        <option value="selesai" ${submission.status === 'selesai' ? 'selected' : ''}>Selesai</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk</label>
                                    <p class="text-gray-900">${formattedDate}</p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 flex justify-end gap-3">
                            <button id="cancel-detail-btn" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Batal
                            </button>
                            <button id="save-status-btn" data-id="${submission.id}" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                Simpan Status
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById('close-detail-modal')?.addEventListener('click', () => {
            document.getElementById('detail-modal')?.remove();
        });

        document.getElementById('cancel-detail-btn')?.addEventListener('click', () => {
            document.getElementById('detail-modal')?.remove();
        });

        document.getElementById('save-status-btn')?.addEventListener('click', async () => {
            const newStatus = document.getElementById('status-select').value;
            await this.updateStatus(submission.id, newStatus);
            document.getElementById('detail-modal')?.remove();
        });

        document.getElementById('detail-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'detail-modal') {
                document.getElementById('detail-modal')?.remove();
            }
        });
    }

    async updateStatus(id, newStatus) {
        const { error } = await supabase
            .from('contact_submissions')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Error updating status:', error);
            await this.customDialog.alert('Gagal update status: ' + error.message, 'Error');
        } else {
            await this.customDialog.alert('Status berhasil diupdate!', 'Sukses');
            this.showList();
        }
    }

    attachEventListeners(container) {
        const filterButtons = container.querySelectorAll('.status-filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const status = e.currentTarget.dataset.status;
                this.filterByStatus(status, filterButtons);
            });
        });

        container.querySelectorAll('.view-detail-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.showDetailModal(id);
            });
        });

        container.querySelectorAll('.delete-submission-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                const confirmed = await this.customDialog.confirm(
                    'Apakah Anda yakin ingin menghapus pengaduan ini?',
                    'Konfirmasi Hapus'
                );
                if (confirmed) {
                    await this.deleteSubmission(id);
                }
            });
        });
    }

    filterByStatus(status, filterButtons) {
        filterButtons.forEach(btn => {
            btn.classList.remove('status-filter-active', 'border-indigo-600', 'text-indigo-600');
            btn.classList.add('border-transparent', 'text-gray-600');
        });
        const activeBtn = Array.from(filterButtons).find(btn => btn.dataset.status === status);
        activeBtn.classList.add('status-filter-active', 'border-indigo-600', 'text-indigo-600');
        activeBtn.classList.remove('border-transparent', 'text-gray-600');

        const rows = document.querySelectorAll('.submission-row');
        rows.forEach(row => {
            if (status === 'all' || row.dataset.status === status) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    async deleteSubmission(id) {
        const { error } = await supabase
            .from('contact_submissions')
            .delete()
            .eq('id', id);

        if (error) {
            await this.customDialog.alert('Gagal menghapus: ' + error.message, 'Error');
        } else {
            await this.customDialog.alert('Pengaduan berhasil dihapus', 'Sukses');
            this.showList();
        }
    }

    async showList() {
        let container = document.getElementById('app-content-pengaduan');
        if (!container) {
            const parent = document.getElementById('pengaduan');
            if (parent) {
                container = document.createElement('div');
                container.id = 'app-content-pengaduan';
                parent.appendChild(container);
            }
        }
        if (container) {
            container.innerHTML = await this.renderListView();
            this.attachEventListeners(container);
        }
    }

    // Notification polling
    async checkNewSubmissions() {
        try {
            const { count, error } = await supabase
                .from('contact_submissions')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'baru');

            if (error) {
                console.error('Error checking submissions:', error);
                return;
            }

            const newCount = count || 0;
            this.updateBadge(newCount);

            if (newCount > this.lastCount && this.lastCount >= 0) {
                const diff = newCount - this.lastCount;
                this.showToastNotification(diff);
            }

            this.lastCount = newCount;
        } catch (error) {
            console.error('Error in checkNewSubmissions:', error);
        }
    }

    updateBadge(count) {
        const badge = document.getElementById('pengaduan-badge');
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    showToastNotification(newCount) {
        const toast = document.getElementById('toast-notification');
        if (toast) {
            const message = toast.querySelector('#toast-message');
            if (message) {
                message.textContent = `${newCount} pengaduan baru masuk!`;
            }
            toast.classList.remove('hidden');

            setTimeout(() => {
                toast.classList.add('hidden');
            }, 5000);
        }
    }

    startPolling() {
        this.lastCount = -1;
        this.checkNewSubmissions();

        this.pollInterval = setInterval(() => {
            this.checkNewSubmissions();
        }, 10000);

        console.log('✅ Submissions polling started - checking every 10 seconds');
    }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
            console.log('Polling stopped');
        }
    }
}
