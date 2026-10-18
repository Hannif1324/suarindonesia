/**
 * @description : Script utility browser console untuk reload dan re-seed data database
 * @author      : Gemini Agent
 * @modified    : 2026-10-19
 */

// Add reload function to window
window.reloadData = async function () {
    console.log('[RELOAD] Reloading data...');

    try {
        // Import data service
        const { dataService } = await import('./services/seed-data.js');

        // Clear and re-seed
        await dataService.clearDatabase();
        await dataService.seedData();

        console.log('[SUCCESS] Data reloaded successfully!');
        console.log('[RELOAD] Refreshing page...');

        // Refresh page to show new data
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.error('[ERROR] Failed to reload data:', error);
    }
};

console.log('[INFO] To reload data with new images, run: window.reloadData()');
