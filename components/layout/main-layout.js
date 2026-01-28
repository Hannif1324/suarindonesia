/**
 * Main Layout Component
 */

import { Navbar } from '../ui/navbar.js';
import { Footer } from '../ui/footer.js';
import { DOM } from '../../utils/helpers.js';

export class MainLayout {
    constructor() {
        this.navbar = new Navbar();
        this.footer = new Footer();
    }

    render(content) {
        const layout = DOM.create('div', {
            className: 'min-h-screen flex flex-col'
        });

        // Add navbar
        layout.appendChild(this.navbar.render());

        // Add main content with padding for fixed navbar
        const main = DOM.create('main', {
            className: 'flex-grow pt-20'
        });

        if (typeof content === 'string') {
            main.innerHTML = content;
        } else {
            main.appendChild(content);
        }

        layout.appendChild(main);

        // Add footer
        layout.appendChild(this.footer.render());

        return layout;
    }

    updateNavbar(path) {
        this.navbar.setActive(path);
    }
}
