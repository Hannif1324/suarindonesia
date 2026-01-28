/**
 * Reload Data Script
 * Open browser console and run: window.reloadData()
 */

// Add reload function to window
// Add reload function to window
window.reloadData = async function () {
    console.log('🔄 Reloading data...');

    try {
        // Import data service
        const { dataService } = await import('./services/seed-data.js');

        // Clear and re-seed
        await dataService.clearDatabase();
        await dataService.seedData();

        console.log('✅ Data reloaded successfully!');
        console.log('🔄 Refreshing page...');

        // Refresh page to show new data
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.error('❌ Failed to reload data:', error);
    }
};

console.log('💡 To reload data with new images, run: window.reloadData()');
