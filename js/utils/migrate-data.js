
import { supabase } from '../services/supabase-client.js';
import { beritaData } from '../../../services/data-service-berita.js';
import { kegiatanData } from '../../../services/data-service-kegiatan.js';
import { produkData } from '../../../services/data-service-produk.js';

export async function migrateData() {
    const log = (msg) => {
        console.log(msg);
        const el = document.getElementById('logs');
        if (el) el.innerHTML += `<div>${msg}</div>`;
    };

    log('Starting migration...');

    // 1. Migrate Articles
    log('Migrating Articles...');
    for (const article of beritaData.articles) {
        const { error } = await supabase.from('articles').upsert({
            slug: article.slug,
            title: article.title,
            excerpt: article.excerpt,
            content: article.sections, // JSONB
            image: article.image,
            date: article.date,
            author: article.author,
            category: article.category,
            read_time: article.readTime,
            tags: article.tags,
            gallery: article.gallery // JSONB
        }, { onConflict: 'slug' });

        if (error) log(`Error article ${article.id}: ${error.message}`);
        else log(`Success article: ${article.title}`);
    }

    // 2. Migrate Activities
    log('Migrating Activities...');
    for (const activity of kegiatanData.activities) {
        const { error } = await supabase.from('activities').upsert({
            title: activity.title,
            date: activity.date,
            category: activity.category,
            location: activity.location,
            participants: activity.participants,
            description: activity.description,
            image: activity.image,
            highlights: activity.highlights
        }); // No unique slug, so upsert might duplicate if run multiple times without ID. Ideally we'd use ID but UUIDs are auto-gen.
        // For migration safety, we could check existence, but for now let's assume fresh DB.

        if (error) log(`Error activity ${activity.id}: ${error.message}`);
        else log(`Success activity: ${activity.title}`);
    }

    // 3. Migrate Products
    log('Migrating Products...');
    for (const product of produkData.products) {
        const { error } = await supabase.from('products').upsert({
            id: product.id,
            title: product.title,
            description: product.description,
            image: product.image,
            price: product.price,
            price_unit: product.priceUnit,
            variants: product.variants,
            sizes: product.sizes,
            whatsapp_link: product.whatsappLink
        });

        if (error) log(`Error product ${product.id}: ${error.message}`);
        else log(`Success product: ${product.title}`);
    }

    log('Migration Completed!');
}
