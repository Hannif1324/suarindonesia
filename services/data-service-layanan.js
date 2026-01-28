/**
 * Layanan Data Service
 * Provides services and programs information for Layanan page
 */

export const layananData = {
    hero: {
        quote: "Kamu kuat dan berharga, jangan pernah meragukan dirimu. Bermimpilah besar, jadilah pemberani, dan ingatlah bahwa senyummu bisa membuat dunia lebih baik.",
        title: "Layanan dan Program",
        subtitle: "Program-program SuaR Indonesia untuk Masyarakat"
    },

    navigation: [
        { id: 'hiv-aids', label: 'HIV/AIDS', icon: '🏥' },
        { id: 'kebencanaan', label: 'Kebencanaan', icon: '🆘' },
        { id: 'pendidikan', label: 'Pendidikan', icon: '📚' },
        { id: 'penelitian', label: 'Penelitian', icon: '🔬' },
        { id: 'perlindungan-anak', label: 'Perlindungan Anak', icon: '👶' },
        { id: 'magang', label: 'Magang', icon: '🎓' }
    ],

    services: {
        hivAids: {
            id: 'hiv-aids',
            title: 'Program HIV/AIDS pada Kelompok Rentan',
            subtitle: 'Isu HIV dalam Gerakan Sosial',
            icon: '🏥',
            image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,fit=crop/YZ9b16O2aksMXqwd/whatsapp-image-2024-10-07-at-14.19.09_5bc81605-YX4yLrOKqNS6Prly.jpg',
            description: 'Isu HIV masih menjadi perhatian utama Perkumpulan SuaR Indonesia dalam kerja membangun gerakan sosial.',
            content: `
                <p class="mb-4">Gerakan masyarakat, populasi kunci WPSL maupun WPSTL adalah potensi besar masyarakat yang memberikan impact dan daya hasil luar biasa untuk mencapai tujuan besar nasional tahun 2030 dengan <strong>3 zero</strong>:</p>
                <ul class="list-disc list-inside mb-4 space-y-2">
                    <li>Zero stigma & discrimination</li>
                    <li>Zero death related AIDS</li>
                    <li>Zero new infection</li>
                </ul>
                <p class="mb-4">Tujuan tersebut disandingkan dengan pencapaian <strong>90:90:90</strong>:</p>
                <ul class="list-disc list-inside mb-4 space-y-2">
                    <li>90% ODHA mengetahui statusnya HIV-nya</li>
                    <li>90% ODHA yang ditemukan mendapatkan terapi ARV</li>
                    <li>90% ODHA yang mendapat terapi ARV tidak terdeteksi virusnya</li>
                </ul>
                <p>Partisipasi aktif masyarakat luas memberikan semangat dan makna yang berarti dalam program pengendalian HIV-AIDS di Kediri Raya. Organisasi komunitas mulai mampu mengambil peran dalam mengembangkan dan pengelolaan program.</p>
            `
        },

        kebencanaan: {
            id: 'kebencanaan',
            title: 'Program Kebencanaan',
            subtitle: 'Respon Tanggap Darurat dan Ketangguhan Masyarakat',
            icon: '🆘',
            image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,fit=crop/YZ9b16O2aksMXqwd/whatsapp-image-2024-09-26-at-4.07.06-pm-dJo6V6ky7WfVJbnJ.jpeg',
            description: 'Merespon aksi tanggap darurat bencana untuk memenuhi kebutuhan dasar kelompok rentan di pengungsian.',
            highlights: [
                'Menggalang jejaring kemanusiaan nasional dan lokal untuk advokasi kebijakan',
                'Membangun gerakan pengurangan resiko bencana yang inklusif',
                'Menyediakan gudang stok contingency di 5 regional dalam jejaring mitra kemanusiaan (JMK)',
                'Membangun ketangguhan di fase kesiapsiagaan bagi masyarakat'
            ],
            caseStudy: {
                title: 'Respon Tanggap Darurat Bencana Alam Gempa, Tsunami dan Likuifaksi di Teluk Donggala',
                year: '2018-2019',
                description: 'SuaR tergabung dalam konsorsium kebencanaan nasional Knowledge Hub, melakukan respon bencana di Palu, Sigi dan Donggala selama 11 bulan.',
                focus: ['WASH', 'EFSVL', 'Kelompok rentan (perempuan, anak, disabilitas, lansia)']
            }
        },

        pendidikan: {
            id: 'pendidikan',
            title: 'Program Pendidikan dan Pelatihan',
            subtitle: 'Peningkatan Kapasitas dan Pengorganisasian',
            icon: '📚',
            image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,fit=crop/YZ9b16O2aksMXqwd/whatsapp-image-2024-09-26-at-2.52.56-pm-YNqyEnN3M2fe3q46.jpeg',
            description: 'SuaR Indonesia memiliki sumber daya manusia (SDM) yang terlatih sebagai pelatih/fasilitator nasional dan lokal.',
            programs: [
                'Pelatihan perubahan perilaku',
                'Pengorganisasian di berbagai sektor',
                'Penguatan komunitas',
                'Studi tematik',
                'Peningkatan kapasitas'
            ],
            goal: 'Memberikan sumbangsih pada gerakan memampukan komunitas yang menempatkan mereka sebagai subjek.'
        },

        penelitian: {
            id: 'penelitian',
            title: 'Program Penelitian',
            subtitle: 'Data untuk Kebijakan Sosial dan Kesehatan',
            icon: '🔬',
            image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,fit=crop/YZ9b16O2aksMXqwd/whatsapp-image-2024-09-26-at-2.53.29-pm-m7VwLN5wplho2ObM.jpeg',
            description: 'Program Penelitian SuaR Indonesia berfokus pada pengumpulan, analisis, dan diseminasi data yang relevan.',
            focus: [
                'Pengembangan kebijakan berbasis bukti',
                'Praktik terbaik dalam isu sosial, kesehatan, dan lingkungan',
                'Wawasan mendalam untuk tantangan masyarakat',
                'Solusi efektif berbasis penelitian'
            ]
        },

        perlindunganAnak: {
            id: 'perlindungan-anak',
            title: 'Program Perlindungan Perempuan & Anak',
            subtitle: 'Layanan Inklusi dan Lingkungan Ramah Anak',
            icon: '👶',
            image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,fit=crop/YZ9b16O2aksMXqwd/whatsapp-image-2024-09-26-at-4.12.26-pm-mk3zjzOwQvFBb4B9.jpeg',
            description: 'Upaya komprehensif untuk memberikan dukungan program pemenuhan hak-hak anak dan perempuan.',
            issues: [
                'Pencegahan kekerasan pada anak',
                'Perlindungan dari eksploitasi seksual',
                'Dukungan pendidikan anak',
                'Layanan inklusi di masyarakat',
                'Daerah, sekolah dan lingkungan ramah anak'
            ],
            impact: 'Mendorong adanya layanan inklusi di masyarakat dan dunia pendidikan sejalan dengan kebijakan pemerintah.'
        },

        magang: {
            id: 'magang',
            title: 'Program Magang',
            subtitle: 'Pembelajaran Terbaik untuk Pembuat Kebijakan',
            icon: '🎓',
            image: 'https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,fit=crop/YZ9b16O2aksMXqwd/magang-suar-1-AzG7b5338zfowBeO.PNG',
            description: 'SuaR Indonesia berkomitmen memberikan layanan kepada masyarakat dan pemangku kepentingan untuk memenuhi hak-hak kelompok marginal.',
            quote: 'Mewujudkan perempuan, anak dan masyarakat marginal yang berdaya, sehat dan bermartabat',
            facilities: {
                workshop: [
                    'Visi, Misi dan Statuta SuaR Indonesia',
                    'Pengorganisasian',
                    'Kerelawanan'
                ],
                fieldAssistance: [
                    'Kunjungan Hotspot',
                    'Analisis Sosial dan Diskusi Tematik',
                    'Sistem Layanan publik berbasis komunitas',
                    'Asistensi Pelaporan'
                ]
            },
            pricing: {
                amount: 'Rp. 250.000',
                duration: 'per orang selama 1 bulan'
            }
        }
    }
};
