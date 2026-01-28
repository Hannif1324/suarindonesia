import { supabase } from '../../js/services/supabase-client.js';

export class ImageUploader {
    constructor(bucketName) {
        this.bucketName = bucketName;
    }

    /**
     * Upload image to Supabase Storage
     * @param {File} file - Image file
     * @param {Function} onProgress - Progress callback (0-100)
     * @returns {Promise<string>} - Public URL of uploaded image
     */
    async upload(file, onProgress = null) {
        try {
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
        container.className = 'image-upload-widget';

        container.innerHTML = `
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                <input type="file" accept="image/*" class="hidden" id="file-input-${Date.now()}">
                <div class="upload-prompt">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <p class="mt-2 text-sm text-gray-600">Click to upload image</p>
                    <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <div class="upload-progress hidden">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p class="mt-2 text-sm text-gray-600">Uploading...</p>
                </div>
                <div class="upload-preview hidden">
                    <img src="" alt="Preview" class="max-h-48 mx-auto rounded">
                    <p class="mt-2 text-sm text-green-600">✓ Uploaded successfully</p>
                </div>
            </div>
        `;

        const input = container.querySelector('input[type="file"]');
        const uploadArea = container.querySelector('.border-dashed');
        const prompt = container.querySelector('.upload-prompt');
        const progress = container.querySelector('.upload-progress');
        const preview = container.querySelector('.upload-preview');
        const previewImg = preview.querySelector('img');

        uploadArea.addEventListener('click', () => input.click());

        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Show progress
            prompt.classList.add('hidden');
            progress.classList.remove('hidden');

            try {
                const url = await this.upload(file);

                // Show preview
                progress.classList.add('hidden');
                preview.classList.remove('hidden');
                previewImg.src = url;

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
