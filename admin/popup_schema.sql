-- Tabel untuk menyimpan data gambar popup carousel
CREATE TABLE IF NOT EXISTS public.popups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kebijakan RLS (Row Level Security) - Agar publik bisa membaca
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON public.popups FOR SELECT 
USING (is_active = TRUE);

-- Kebijakan untuk Admin (Full access)
CREATE POLICY "Allow admin full access" 
ON public.popups FOR ALL 
USING (auth.role() = 'authenticated');
