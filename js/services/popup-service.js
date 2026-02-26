/**
 * Popup Service
 * Mengambil data popup dari Supabase
 */

import { supabase, isSupabaseConfigured } from './supabase-client.js';
import { logger } from '../../debugs/logger.js';

export const popupService = {
    /**
     * Mengambil daftar gambar popup yang aktif
     * @returns {Promise<Array>} List of active popups sorted by sort_order
     */
    async getActivePopups() {
        // Tag: Mengecek koneksi Supabase
        // Cek apakah Supabase sudah terkonfigurasi
        if (!isSupabaseConfigured()) {
            logger.warn('Supabase not configured, skipping popup fetch');
            return [];
        }

        try {
            logger.info('Fetching active popups from Supabase');
            
            // Tag: Mengambil data dari tabel 'popups'
            // Mengambil baris yang is_active = true dan diurutkan berdasarkan sort_order
            const { data, error } = await supabase
                .from('popups')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (error) {
                // Tag: Error handling jika query gagal
                logger.error('Error fetching popups:', error);
                return [];
            }

            // Tag: Mengembalikan data array gambar
            return data || [];
        } catch (err) {
            // Tag: Catch-all error handling
            logger.error('Unexpected error in popupService:', err);
            return [];
        }
    }
};
