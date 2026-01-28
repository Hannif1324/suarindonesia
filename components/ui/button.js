/**
 * Button Component
 */

import { DOM } from '../../utils/helpers.js';

export class Button {
    /**
     * Create a primary button
     */
    static primary(text, onClick = null, className = '') {
        const button = DOM.create('button', {
            className: `bg-primary hover:bg-secondary text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ${className}`
        });

        button.textContent = text;

        if (onClick) {
            button.addEventListener('click', onClick);
        }

        return button;
    }

    /**
     * Create a secondary button
     */
    static secondary(text, onClick = null, className = '') {
        const button = DOM.create('button', {
            className: `bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ${className}`
        });

        button.textContent = text;

        if (onClick) {
            button.addEventListener('click', onClick);
        }

        return button;
    }

    /**
     * Create a link button
     */
    static link(text, href, className = '') {
        const button = DOM.create('a', {
            href: href,
            className: `inline-block bg-primary hover:bg-secondary text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ${className}`,
            dataset: { link: '' }
        });

        button.textContent = text;

        return button;
    }
}
