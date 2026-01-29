/**
 * Staff Data Service
 * Provides staff information for Staff page
 * Fetches dynamic data (management & staff) from Supabase
 * Keeps static data (hero & offices)
 */

import { supabase } from '../js/services/supabase-client.js';

export const StaffService = {
    // Static Data
    hero: {
        title: "Staff SuaR Indonesia",
        subtitle: "Mengenal Jajaran Staff SUAR Indonesia",
        description: "Tim profesional yang berdedikasi untuk mewujudkan perempuan, anak dan masyarakat marginal yang berdaya, sehat dan bermartabat."
    },

    offices: [
        {
            city: "Kediri",
            phone: "081314838361",
            address: "Pondok Doko Indah Blok A No. 1 Doko, Ngasem, Kabupaten Kediri"
        },
        {
            city: "Jember",
            phone: "082313958329",
            address: "Jalan Suren Dampar RT 002 RW 002 Desa Suren Ledokombo Kabupaten Jember"
        }
    ],

    /**
     * Fetch complete staff data
     * Combines static data with dynamic data from Supabase
     * @returns {Promise<Object>} Object containing hero, management, staff, and offices arrays
     */
    async getData() {
        try {
            // Fetch staff data from Supabase
            const { data: staffData, error } = await supabase
                .from('staff')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;

            // Filter data into management and staff arrays
            const management = staffData.filter(item => item.staff_type === 'management');
            const staff = staffData.filter(item => item.staff_type === 'staff');

            return {
                hero: this.hero,
                management: management,
                staff: staff,
                offices: this.offices
            };
        } catch (error) {
            console.error('Error fetching staff data:', error);
            // Fallback: return empty arrays for dynamic data to prevent crash
            return {
                hero: this.hero,
                management: [],
                staff: [],
                offices: this.offices
            };
        }
    }
};
