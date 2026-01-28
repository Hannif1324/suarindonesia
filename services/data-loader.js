/**
 * Data Loader Service
 * Loads data from JSON files and populates IndexedDB
 */

import { db } from './db.js';
import { DB_STORES } from '../utils/constants.js';
import { logger } from '../debugs/logger.js';

class DataLoader {
    constructor() {
        this.dataPath = './data';
        this.loaded = false;
    }

    /**
     * Load summary data
     */
    async loadSummary() {
        try {
            const response = await fetch(`${this.dataPath}/summary.json`);
            const data = await response.json();
            logger.info('Summary data loaded', data);
            return data;
        } catch (error) {
            logger.error('Failed to load summary', error);
            throw error;
        }
    }

    /**
     * Load metadata for a specific page
     */
    async loadPageMeta(slug) {
        try {
            const response = await fetch(`${this.dataPath}/raw/www.suarindonesia.org/${slug}.html.meta.json`);
            const data = await response.json();
            logger.debug('Page metadata loaded', slug);
            return data;
        } catch (error) {
            logger.error(`Failed to load page metadata for ${slug}`, error);
            return null;
        }
    }

    /**
     * Load HTML content for a specific page
     */
    async loadPageHTML(slug) {
        try {
            const response = await fetch(`${this.dataPath}/cloned/www.suarindonesia.org/${slug}.html`);
            const html = await response.text();
            logger.debug('Page HTML loaded', slug);
            return html;
        } catch (error) {
            logger.error(`Failed to load page HTML for ${slug}`, error);
            return null;
        }
    }

    /**
     * Parse and store article data
     */
    async parseArticle(url) {
        const slug = url.split('/').pop();
        if (!slug || slug === 'www.suarindonesia.org') return null;

        try {
            const meta = await this.loadPageMeta(slug);
            if (!meta) return null;

            // Get cover image - accept ANY image source (URL, base64, local file)
            let coverImage = null;
            if (meta.assets && meta.assets.length > 0) {
                // Only filter out non-image assets (fonts, CSS, JS)
                const imageAssets = meta.assets.filter(asset => {
                    const lower = asset.toLowerCase();
                    // Skip fonts, CSS, and JS files
                    if (lower.includes('.woff') || lower.includes('.woff2') ||
                        lower.includes('.ttf') || lower.includes('.otf') ||
                        lower.includes('.css') || lower.includes('.js')) {
                        return false;
                    }
                    // Accept anything that looks like an image
                    return lower.includes('.jpg') || lower.includes('.jpeg') ||
                        lower.includes('.png') || lower.includes('.webp') ||
                        lower.includes('.gif') || lower.includes('.svg') ||
                        lower.includes('image') || lower.includes('img') ||
                        lower.startsWith('data:image'); // base64 images
                });

                // Prefer larger images (w=768, w=1440, w=1920)
                const largeImage = imageAssets.find(asset =>
                    asset.includes('w=768') || asset.includes('w=1440') ||
                    asset.includes('w=1920') || asset.includes('w=2048')
                );

                // Use large image, or first image, or any asset as fallback
                coverImage = largeImage || imageAssets[0] || null;
            }

            // Extract article information
            const article = {
                slug: slug,
                url: meta.url,
                title: meta.title,
                date: new Date().toISOString(), // Default date
                content: meta.description || '',
                coverImage: coverImage,
                categories: [],
                meta: meta
            };

            // Store in database
            await db.put(DB_STORES.ARTICLES, article);
            logger.debug('Article stored', slug, 'with image:', coverImage);

            return article;
        } catch (error) {
            logger.error(`Failed to parse article ${slug}`, error);
            return null;
        }
    }

    /**
     * Load all data into IndexedDB
     */
    async loadAll() {
        if (this.loaded) {
            logger.info('Data already loaded');
            return;
        }

        try {
            logger.group('Loading all data');

            // Load summary
            const summary = await this.loadSummary();

            // Store metadata
            await db.put(DB_STORES.METADATA, {
                key: 'summary',
                data: summary,
                loadedAt: new Date().toISOString()
            });

            // Load and parse articles
            const articlePromises = summary.crawled
                .filter(url => url.includes('/berita') || url.includes('dampak-negatif') ||
                    url.includes('training-of-trainer') || url.includes('jambore') ||
                    url.includes('workshop') || url.includes('perekrutan'))
                .slice(0, 50) // Increased limit to 50 articles
                .map(url => this.parseArticle(url));

            const articles = await Promise.all(articlePromises);
            const validArticles = articles.filter(a => a !== null);

            logger.info(`Loaded ${validArticles.length} articles`);

            // Store pages
            for (const url of summary.crawled.slice(0, 10)) {
                const slug = url.split('/').pop();
                if (slug && slug !== 'www.suarindonesia.org') {
                    const meta = await this.loadPageMeta(slug);
                    if (meta) {
                        await db.put(DB_STORES.PAGES, {
                            url: meta.url,
                            slug: slug,
                            title: meta.title,
                            meta: meta
                        });
                    }
                }
            }

            this.loaded = true;
            logger.groupEnd();
            logger.info('All data loaded successfully');

            return {
                articles: validArticles.length,
                pages: summary.crawled.length
            };
        } catch (error) {
            logger.error('Failed to load all data', error);
            throw error;
        }
    }

    /**
     * Check if data is already loaded
     */
    async isDataLoaded() {
        try {
            const count = await db.count(DB_STORES.ARTICLES);
            return count > 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * Reload all data (clear and load fresh)
     */
    async reload() {
        logger.info('Reloading all data');

        // Clear existing data
        await db.clear(DB_STORES.ARTICLES);
        await db.clear(DB_STORES.PAGES);
        await db.clear(DB_STORES.METADATA);

        this.loaded = false;
        return await this.loadAll();
    }
}

// Export singleton instance
export const dataLoader = new DataLoader();
