/**
 * Application Constants
 */

export const APP_CONFIG = {
    NAME: 'SuaR Indonesia',
    VERSION: '1.0.0',
    DB_NAME: 'suarindonesia_db',
    DB_VERSION: 1
};

export const DB_STORES = {
    PAGES: 'pages',
    ARTICLES: 'articles',
    ASSETS: 'assets',
    METADATA: 'metadata'
};

export const ROUTES = {
    HOME: '/',
    BERITA: '/berita',
    TENTANG: '/suar-indonesia',
    LAYANAN: '/layanan',
    KEGIATAN: '/kegiatan-suar-indonesia',
    KONTAK: '/kontak-tim-suar-indonesia',
    STAFF: '/staff-suar-indonesia',
    ARTICLE: '/berita/:slug'
};

export const API_ENDPOINTS = {
    DATA_PATH: './data'
};

export const UI_CONFIG = {
    ITEMS_PER_PAGE: 9,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300
};

export const COLORS = {
    PRIMARY: '#673de6',
    SECONDARY: '#a04ff7',
    ACCENT: '#e2b9ff',
    DARK: '#1d1e20',
    LIGHT: '#f2f3f6'
};
