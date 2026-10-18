export class CustomDialog {
    constructor() {
        this.overlay = null;
    }

    _createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center opacity-0 transition-opacity duration-300';
        return overlay;
    }

    /**
     * @description : Mengamankan string dari potensi XSS dengan HTML entity escaping
     * @param       : {string} str - String yang akan di-escape
     * @return      : {string} - String yang aman dimasukkan ke innerHTML
     * @throws      : Tidak melempar exception
     * @author      : Gemini Agent
     * @modified    : 2026-10-18
     */
    _escape(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    _createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'bg-[#1e1e1e] text-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 transform scale-90 opacity-0 transition-all duration-300 border border-gray-700';
        modal.innerHTML = content;
        return modal;
    }

    /**
     * @description : Menampilkan modal konfirmasi dengan sanitasi XSS
     * @param       : {string} message - Pesan konfirmasi
     * @param       : {string} title - Judul konfirmasi
     * @return      : {Promise<boolean>} - True jika user klik OK, False jika Cancel
     * @throws      : Tidak melempar exception
     * @author      : Gemini Agent
     * @modified    : 2026-10-18
     */
    async confirm(message, title = 'Confirmation') {
        return new Promise((resolve) => {
            const overlay = this._createOverlay();
            const safeTitle = this._escape(title);
            const safeMessage = this._escape(message);
            const content = `
                <h3 class="text-lg font-semibold mb-2 text-gray-100">${safeTitle}</h3>
                <p class="text-gray-300 mb-6 text-sm leading-relaxed">${safeMessage}</p>
                <div class="flex justify-end space-x-3">
                    <button id="dialog-cancel" class="px-5 py-2 rounded-full border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-200 text-sm font-medium">Cancel</button>
                    <button id="dialog-ok" class="px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 text-sm font-medium transform hover:-translate-y-0.5">OK</button>
                </div>
            `;
            const modal = this._createModal(content);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Animate in
            requestAnimationFrame(() => {
                overlay.classList.remove('opacity-0');
                modal.classList.remove('scale-90', 'opacity-0');
                modal.classList.add('scale-100', 'opacity-100');
            });

            const close = (result) => {
                overlay.classList.add('opacity-0');
                modal.classList.remove('scale-100', 'opacity-100');
                modal.classList.add('scale-90', 'opacity-0');
                setTimeout(() => {
                    overlay.remove();
                    resolve(result);
                }, 300);
            };

            overlay.querySelector('#dialog-cancel').addEventListener('click', () => close(false));
            overlay.querySelector('#dialog-ok').addEventListener('click', () => close(true));
        });
    }

    /**
     * @description : Menampilkan modal notifikasi alert dengan sanitasi XSS
     * @param       : {string} message - Pesan notifikasi
     * @param       : {string} title - Judul notifikasi
     * @return      : {Promise<void>} - Resolves ketika dialog ditutup
     * @throws      : Tidak melempar exception
     * @author      : Gemini Agent
     * @modified    : 2026-10-18
     */
    async alert(message, title = 'Notification') {
        return new Promise((resolve) => {
            const overlay = this._createOverlay();
            const safeTitle = this._escape(title);
            const safeMessage = this._escape(message);
            const content = `
                <h3 class="text-lg font-semibold mb-2 text-gray-100">${safeTitle}</h3>
                <p class="text-gray-300 mb-6 text-sm leading-relaxed">${safeMessage}</p>
                <div class="flex justify-end">
                    <button id="dialog-ok" class="px-5 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 text-sm font-medium transform hover:-translate-y-0.5">OK</button>
                </div>
            `;
            const modal = this._createModal(content);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Animate in
            requestAnimationFrame(() => {
                overlay.classList.remove('opacity-0');
                modal.classList.remove('scale-90', 'opacity-0');
                modal.classList.add('scale-100', 'opacity-100');
            });

            const close = () => {
                overlay.classList.add('opacity-0');
                modal.classList.remove('scale-100', 'opacity-100');
                modal.classList.add('scale-90', 'opacity-0');
                setTimeout(() => {
                    overlay.remove();
                    resolve();
                }, 300);
            };

            overlay.querySelector('#dialog-ok').addEventListener('click', close);
        });
    }
}
