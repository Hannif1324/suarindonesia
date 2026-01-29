import { supabase } from '../js/services/supabase-client.js';
import { logger } from '../debugs/logger.js';

export const homeData = {
    hero: {
        title: "STAND BY US, LETS MAKE THE WORLD BETTER",
        subtitle: "WE RISE THROUGH HELPING OTHERS",
        description: "Sebuah perjuangan tanpa batas ini adalah tekad kami yang akan selalu menjadi prinsip. Untuk tidak akan pernah membiarkan satupun insan berada pada lingkungan uncondusif. Semua berhak merdeka, semua berhak meraih masa depan.\n\nTerima kasih kami telah dipercaya, SUAR INDONESIA akan selalu menjaga amanah Anda!",
        image: "/public/Subject_artistic_profile_202512031251_webm.webm"
    },
    about: {
        title: "TENTANG KAMI",
        subtitle: "PENERIMA MANFAAT PROGRAM PTY SUAR INDONESIA",
        description: "Setiap indIvidu berhak atas kehidupan yang merdeka dan bebas dari eksploitasi. Bersama SUAR INDONESIA Mewujudkan perempuan, anak dan masyarakat marjinal yang berdaya, sehat dan bermartabat.",
        image: "/public/images/home/d8be2edf-1e8e-4191-a782-8bc687f5fd66.jpeg"
    },
    services: [
        {
            title: "PROGRAM HIV/AIDS PADA KELOMPOK RENTAN",
            description: "Advokasi kesehatan, psikis, dan sosial penderita",
            image: "/public/images/home/a1a02d6c-282d-4a4f-9f42-e4eb0d330076.jpeg",
            link: "/layanan#hiv-aids"
        },
        {
            title: "PROGRAM KEBENCANAAN",
            description: "Mempersiapkan masyarakat dalam menghadapi resiko bencana",
            image: "/public/images/home/ef6b8ce2-1476-4441-ad78-d8d880dfa0c5.jpg",
            link: "/layanan#kebencanaan"
        },
        {
            title: "PROGRAM PENDIDIKAN DAN PELATIHAN",
            description: "Memberikan sumbangsih pada gerakan memampukan komunitas yang menempatkan mereka sebagai subjek.",
            image: "/public/images/home/815794f5-6c53-4208-8413-745fb6c6577a.jpeg",
            link: "/layanan#pendidikan"
        },
        {
            title: "PROGRAM PENELITIAN",
            description: "Suar berkomitmen mengabdikan diri kepada masyarakat melalui riset terkait.",
            image: "/public/images/home/65293a91-5611-4783-bd0c-fe49c0d2c610.jpeg",
            link: "/layanan#penelitian"
        },
        {
            title: "PROGRAM PERLINDUNGAN ANAK",
            description: "Menciptakan lingkungan yang aman bagi anak - anak",
            image: "/public/images/home/ab6d5920-606b-4f19-aa46-68ccfb1eae33.jpeg",
            link: "/layanan#perlindungan-anak"
        },
        {
            title: "PROGRAM MAGANG",
            description: "Mewujudkan perempuan, anak dan masyarakat marginal yang berdaya, sehat dan bermartabat",
            image: "/public/images/home/24602b52-5b49-40a8-99a9-52df012dd8e5.jpeg",
            link: "/layanan#magang"
        }
    ],
    activities: [], // Will be populated from Supabase
    products: [],   // Will be populated from Supabase
    articles: [],   // Will be populated from Supabase
    newsletter: {
        title: "Update Berita Suar Indonesia",
        subtitle: "",
        placeholder: "Email Anda",
        buttonText: "KIRIM",
        image: ""
    },
    partners: [
        {
            name: "USAID",
            image: "/public/images/icons/d3PgV9l.png"
        },
        {
            name: "Partner 2",
            image: "/public/images/icons/a2JRE2o.jpeg"
        },
        {
            name: "Partner 3",
            image: "/public/images/icons/IoCuEEz.jpeg"
        },
        {
            name: "HWDI KEDIRI RAYA",
            image: "/public/images/icons/ejuk3FO.png"
        },
        {
            name: "PEMKAB KEDIRI",
            image: "/public/images/icons/ztvXXJd.jpeg"
        },
        {
            name: "PEMKOT KEDIRI",
            image: "/public/images/icons/IugKvpD.png"
        },
        {
            name: "Partner 7",
            image: "/public/images/icons/HlFtPWB.png"
        },
        {
            name: "Partner 8",
            image: "/public/images/icons/NVn2ShY.png"
        },
        {
            name: "Partner 9",
            image: "/public/images/icons/5B4TkNd.png"
        },
        {
            name: "Partner 10",
            image: "/public/images/icons/9jviY9L.jpeg"
        },
        {
            name: "Partner 11",
            image: "/public/images/icons/G5YfSho.jpeg"
        },
        {
            name: "Partner 12",
            image: "/public/images/icons/65CYkGm.png"
        },
        {
            name: "Partner 13",
            image: "/public/images/icons/Fgjh9Xa.png"
        },
        {
            name: "Partner 14",
            image: "/public/images/icons/1Do5pon.png"
        },
        {
            name: "Partner 15",
            image: "/public/images/icons/9iQzsxZ.png"
        }
    ]
};

export async function fetchHomeData() {
    try {
        // Fetch latest 3 activities
        const { data: activities, error: activitiesError } = await supabase
            .from('activities')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

        if (activitiesError) logger.error('Error fetching activities:', activitiesError);

        // Fetch latest 2 products
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(2);

        if (productsError) logger.error('Error fetching products:', productsError);

        // Fetch latest 3 articles
        const { data: articles, error: articlesError } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);

        if (articlesError) logger.error('Error fetching articles:', articlesError);

        // Update homeData with fetched data
        if (activities) homeData.activities = activities;
        if (products) {
            homeData.products = products.map(p => ({
                title: p.title,
                description: p.description,
                price: p.price,
                image: p.image,
                link: '/produk' // Or specific product link if available
            }));
        }
        if (articles) {
            homeData.articles = articles.map(a => ({
                title: a.title,
                subtitle: a.excerpt || '',
                date: a.date,
                readTime: a.read_time || '3 min read',
                image: a.image,
                link: `#/artikel/${a.slug}`
            }));
        }

        return homeData;
    } catch (error) {
        logger.error('Error in fetchHomeData:', error);
        return homeData; // Return static/fallback data on error
    }
}