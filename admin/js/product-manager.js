import { supabase } from '../../js/services/supabase-client.js';
import { ImageUploader } from './image-uploader.js';
import { CustomDialog } from './custom-dialog.js';

export class ProductManager {
    constructor() {
        this.currentProduct = null;
        this.imageUploader = new ImageUploader('product-images');
        this.customDialog = new CustomDialog();
    }

    async renderListView() {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            return '<div class="text-red-500">Error loading products</div>';
        }

        return `
            <div class="mb-6 flex justify-between items-center">
                <h2 class="text-2xl font-bold">Manage Products</h2>
                <button id="new-product-btn" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    + New Product
                </button>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${products.map(product => `
                    <div class="bg-white rounded-lg shadow overflow-hidden">
                        <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-cover">
                        <div class="p-4">
                            <h3 class="font-bold text-lg mb-2">${product.title}</h3>
                            <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-green-600 font-bold">${product.price}</span>
                                <div class="space-x-2">
                                    <button class="text-indigo-600 hover:text-indigo-900 text-sm edit-btn" data-id="${product.id}">Edit</button>
                                    <button class="text-red-600 hover:text-red-900 text-sm delete-btn" data-id="${product.id}">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEditorView(product = null) {
        this.currentProduct = product;

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
                <h2 class="text-2xl font-bold mb-6">${product ? 'Edit Product' : 'New Product'}</h2>

                <form id="product-form" class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Product ID (slug) *</label>
                        <input type="text" name="id" required value="${product?.id || ''}" ${product ? 'readonly' : ''} placeholder="e.g., kopi-bubuk-robusta-100g"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Gunakan huruf kecil dan tanda hubung (-). ID ini tidak bisa diubah setelah disimpan.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                        <input type="text" name="title" required value="${product?.title || ''}" placeholder="e.g., Kopi Bubuk Robusta"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Nama produk yang menarik.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea name="description" required rows="4" placeholder="e.g., Kopi asli dari pegunungan dengan cita rasa khas..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">${product?.description || ''}</textarea>
                        <p class="text-xs text-gray-500 mt-1">Jelaskan keunggulan dan detail produk.</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                            <input type="text" name="price" required value="${product?.price || ''}" placeholder="e.g., 15.000"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-xs text-gray-500 mt-1">Harga dalam Rupiah (tanpa Rp).</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Price Unit</label>
                            <input type="text" name="price_unit" value="${product?.price_unit || ''}" placeholder="e.g., / bungkus"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <p class="text-xs text-gray-500 mt-1">Satuan harga (opsional).</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Variants (one per line)</label>
                        <textarea name="variants" rows="3" placeholder="e.g.,&#10;Original&#10;Pedas&#10;Manis"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">${product?.variants?.join('\n') || ''}</textarea>
                        <p class="text-xs text-gray-500 mt-1">Varian rasa atau jenis, satu per baris.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Sizes (comma separated)</label>
                        <input type="text" name="sizes" value="${product?.sizes?.join(', ') || ''}" placeholder="e.g., 100g, 250g, 500g"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Ukuran yang tersedia, pisahkan dengan koma.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp Link *</label>
                        <input type="url" name="whatsapp_link" required value="${product?.whatsapp_link || ''}" placeholder="e.g., https://wa.me/628123456789"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <p class="text-xs text-gray-500 mt-1">Link langsung ke WhatsApp untuk pemesanan.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Product Image URL *</label>
                        <input type="text" name="image" required value="${product?.image || ''}" id="product-image-url" placeholder="e.g., https://example.com/product.jpg"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2">
                        <p class="text-xs text-gray-500 mt-1">Upload foto produk yang menarik.</p>
                        <div id="product-image-upload"></div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" id="cancel-btn" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Product</button>
                    </div>
                </form>
            </div>
        `;
    }

    attachEventListeners(container) {
        console.log('ProductManager: attachEventListeners called', container);

        // New Product button
        const newBtn = container.querySelector('#new-product-btn');
        console.log('New product button found:', newBtn);

        newBtn?.addEventListener('click', () => {
            console.log('New product button CLICKED!');
            this.showEditor();
        });

        // Edit buttons
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const { data: product } = await supabase.from('products').select('*').eq('id', id).single();
                this.showEditor(product);
            });
        });

        // Delete buttons
        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const confirmed = await this.customDialog.confirm('Are you sure you want to delete this product?', 'Delete Product');
                if (!confirmed) return;

                const id = e.target.dataset.id;
                await supabase.from('products').delete().eq('id', id);
                this.showList();
            });
        });

        // Back to list
        container.querySelector('#back-to-list')?.addEventListener('click', () => {
            this.showList();
        });

        // Image upload
        const imageUploadContainer = container.querySelector('#product-image-upload');
        if (imageUploadContainer) {
            const widget = this.imageUploader.createUploadWidget((url) => {
                container.querySelector('#product-image-url').value = url;
            });
            imageUploadContainer.appendChild(widget);
        }

        // Form submit
        container.querySelector('#product-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct(e.target);
        });

        // Cancel button
        container.querySelector('#cancel-btn')?.addEventListener('click', () => {
            this.showList();
        });
    }

    async saveProduct(form) {
        const formData = new FormData(form);

        const variantsText = formData.get('variants') || '';
        const sizesText = formData.get('sizes') || '';

        const productData = {
            id: formData.get('id') || '',
            title: formData.get('title') || '',
            description: formData.get('description') || '',
            price: formData.get('price') || '',
            price_unit: formData.get('price_unit') || '',
            variants: variantsText.split('\n').filter(v => v.trim()),
            sizes: sizesText.split(',').map(s => s.trim()).filter(s => s),
            whatsapp_link: formData.get('whatsapp_link') || '',
            image: formData.get('image') || ''
        };

        try {
            if (this.currentProduct) {
                await supabase.from('products').update(productData).eq('id', this.currentProduct.id);
            } else {
                await supabase.from('products').insert([productData]);
            }

            await this.customDialog.alert('Product saved successfully!', 'Success');
            this.showList();
        } catch (error) {
            await this.customDialog.alert('Error saving product: ' + error.message, 'Error');
        }
    }

    async showList() {
        console.log('ProductManager: showList called');

        let container = document.getElementById('app-content-produk');
        if (!container) {
            const parent = document.getElementById('produk');
            if (parent) {
                container = document.createElement('div');
                container.id = 'app-content-produk';
                parent.appendChild(container);
            }
        }
        if (container) {
            container.innerHTML = await this.renderListView();
            this.attachEventListeners(container);
        }
    }

    showEditor(product = null) {
        console.log('ProductManager: showEditor called', product);

        let container = document.getElementById('app-content-produk');
        console.log('Container found:', container);

        if (!container) {
            const parent = document.getElementById('produk');
            if (parent) {
                container = document.createElement('div');
                container.id = 'app-content-produk';
                parent.appendChild(container);
            }
        }
        if (container) {
            container.innerHTML = this.renderEditorView(product);
            this.attachEventListeners(container);
        }
    }
}
