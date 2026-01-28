/**
 * Router
 * Handles client-side routing for SPA
 */

import { logger } from '../debugs/logger.js';
import { ROUTES } from '../utils/constants.js';

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.params = {};
    }

    /**
     * Register a route
     */
    on(path, handler) {
        this.routes.set(path, handler);
        logger.debug('Route registered', path);
        return this;
    }

    /**
     * Navigate to a path
     */
    async navigate(path) {
        // Update browser history
        window.history.pushState({}, '', path);

        // Load the route
        await this.loadRoute(path);
    }

    /**
     * Load a route
     */
    async loadRoute(path) {
        logger.info('Loading route', path);

        // Extract hash if present
        let hash = '';
        if (path.includes('#')) {
            [path, hash] = path.split('#');
        }

        // Find matching route
        let handler = null;
        let params = {};

        // Try exact match first
        if (this.routes.has(path)) {
            handler = this.routes.get(path);
        } else {
            // Try pattern matching
            for (const [pattern, routeHandler] of this.routes) {
                const match = this.matchRoute(pattern, path);
                if (match) {
                    handler = routeHandler;
                    params = match.params;
                    break;
                }
            }
        }

        // Execute handler
        if (handler) {
            this.currentRoute = path;
            this.params = params;
            await handler(params);

            // Scroll to hash if present
            if (hash) {
                setTimeout(() => {
                    const targetElement = document.getElementById(hash);
                    if (targetElement) {
                        // Calculate offset for fixed navbar (80px = navbar height)
                        const navbarHeight = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        } else {
            logger.warn('No route found for', path);
            // Load 404 page
            if (this.routes.has('/404')) {
                await this.routes.get('/404')();
            }
        }
    }

    /**
     * Match route pattern with path
     */
    matchRoute(pattern, path) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');

        if (patternParts.length !== pathParts.length) {
            return null;
        }

        const params = {};

        for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const pathPart = pathParts[i];

            if (patternPart.startsWith(':')) {
                // Dynamic segment
                const paramName = patternPart.slice(1);
                params[paramName] = pathPart;
            } else if (patternPart !== pathPart) {
                // Segments don't match
                return null;
            }
        }

        return { params };
    }

    /**
     * Handle link clicks
     */
    handleLinkClick(event) {
        const link = event.target.closest('[data-link]');

        if (link) {
            event.preventDefault();
            const href = link.getAttribute('href');

            if (href && href !== '#') {
                // Check for Hash Route (starts with #/)
                if (href.startsWith('#/')) {
                    window.location.hash = href;
                    return;
                }

                // Check if href contains hash (Anchor link)
                if (href.includes('#')) {
                    const [path, hash] = href.split('#');
                    const currentPath = window.location.pathname;

                    // If we're already on the target page, just scroll
                    if (path === currentPath || path === '') {
                        const targetElement = document.getElementById(hash);
                        if (targetElement) {
                            // Calculate offset for fixed navbar (80px = navbar height)
                            const navbarHeight = 80;
                            const elementPosition = targetElement.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    } else {
                        // Navigate to page first, then scroll
                        this.navigate(path).then(() => {
                            setTimeout(() => {
                                const targetElement = document.getElementById(hash);
                                if (targetElement) {
                                    // Calculate offset for fixed navbar (80px = navbar height)
                                    const navbarHeight = 80;
                                    const elementPosition = targetElement.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth'
                                    });
                                }
                            }, 100);
                        });
                    }
                } else {
                    // Normal navigation
                    this.navigate(href);
                }
            }
        }
    }

    /**
     * Initialize router
     */
    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.loadCurrentRoute();
        });

        // Handle hash changes (for article navigation)
        window.addEventListener('hashchange', () => {
            this.loadCurrentRoute();
        });

        // Handle link clicks
        document.addEventListener('click', (e) => this.handleLinkClick(e));

        // Load initial route
        this.loadCurrentRoute();

        logger.info('Router initialized');
    }

    /**
     * Load current route based on hash or pathname
     */
    loadCurrentRoute() {
        // Priority: hash route (for articles) > pathname route (for pages)
        // Only treat as hash route if it starts with #/ (e.g. #/artikel/slug)
        // This prevents treating anchor links (e.g. #section) as routes
        if (window.location.hash && window.location.hash.startsWith('#/')) {
            // Hash routing (e.g., #/artikel/slug)
            const route = window.location.hash.substring(1);
            this.loadRoute(route);
        } else {
            // Pathname routing (e.g., /produk, /berita)
            const route = window.location.pathname + window.location.hash;
            this.loadRoute(route);
        }
    }

    /**
     * Get current route
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Get route parameters
     */
    getParams() {
        return this.params;
    }
}

// Export singleton instance
export const router = new Router();
