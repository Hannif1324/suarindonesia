import { supabase } from '../../js/services/supabase-client.js';

export class VideoUploader {
    constructor(bucketName = 'videos') {
        this.bucketName = bucketName;
    }

    /**
     * Upload video to Supabase Storage
     * @param {File} file - Video file
     * @param {Function} onProgress - Progress callback (0-100)
     * @returns {Promise<string>} - Public URL of uploaded video
     */
    async upload(file, onProgress = null) {
        try {
            // Validate file type
            if (!file.type.startsWith('video/')) {
                throw new Error('File must be a video');
            }

            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(this.bucketName)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(this.bucketName)
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    /**
     * Create file input element with preview
     * @param {Function} onUpload - Callback when upload completes
     * @returns {HTMLElement} - File input container
     */
    createUploadWidget(onUpload) {
        const container = document.createElement('div');
        container.className = 'video-upload-widget mt-2';

        container.innerHTML = `
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-gray-50">
                <input type="file" accept="video/*" class="hidden" id="video-input-${Date.now()}">
                <div class="upload-prompt">
                    <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p class="mt-1 text-xs text-gray-600">Click to upload video</p>
                    <p class="text-[10px] text-gray-500">MP4, WebM (Max 50MB recommended)</p>
                </div>
                <div class="upload-progress hidden">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p class="mt-1 text-xs text-gray-600">Uploading...</p>
                </div>
                <div class="upload-preview hidden">
                    <video controls class="max-h-32 mx-auto rounded w-full bg-black"></video>
                    <p class="mt-1 text-xs text-green-600">✓ Uploaded successfully</p>
                </div>
            </div>
        `;

        const input = container.querySelector('input[type="file"]');
        const uploadArea = container.querySelector('.border-dashed');
        const prompt = container.querySelector('.upload-prompt');
        const progress = container.querySelector('.upload-progress');
        const preview = container.querySelector('.upload-preview');
        const previewVideo = preview.querySelector('video');

        uploadArea.addEventListener('click', (e) => {
            // Prevent triggering if clicking video controls
            if (e.target.tagName === 'VIDEO') return;
            input.click();
        });

        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Show progress
            prompt.classList.add('hidden');
            progress.classList.remove('hidden');
            preview.classList.add('hidden');

            try {
                const url = await this.upload(file);

                // Show preview
                progress.classList.add('hidden');
                preview.classList.remove('hidden');
                previewVideo.src = url;

                if (onUpload) onUpload(url);
            } catch (error) {
                alert('Upload failed: ' + error.message);
                prompt.classList.remove('hidden');
                progress.classList.add('hidden');
            }
        });

        return container;
    }
}
