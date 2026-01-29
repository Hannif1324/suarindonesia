-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ARTICLES TABLE
create table if not exists articles (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  content jsonb, -- Stores the sections array
  image text,
  video text, -- Main article video URL
  date text, -- Storing as text to match existing format "10 November 2025"
  author text,
  category text,
  read_time text,
  tags text[],
  gallery jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ACTIVITIES TABLE
create table if not exists activities (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  date text,
  category text,
  location text,
  participants integer,
  description text,
  image text,
  highlights text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS TABLE
create table if not exists products (
  id text primary key, -- Using string ID from existing data (e.g. "sari-jahe")
  title text not null,
  description text,
  image text,
  price text,
  price_unit text,
  variants text[],
  sizes text[],
  whatsapp_link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PHOTO GALLERY TABLE
create table if not exists photo_gallery (
  id bigserial primary key,
  image text not null,
  caption text not null,
  date text not null,
  category text not null check (category in ('rapat', 'pelatihan', 'sosialisasi', 'lapangan', 'monev')),
  activity_id uuid references activities(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- VIDEOS TABLE
create table if not exists videos (
  id bigserial primary key,
  title text not null,
  description text not null,
  thumbnail text not null,
  video_url text not null,
  duration text,
  date text not null,
  activity_id uuid references activities(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CONTACT SUBMISSIONS TABLE
create table if not exists contact_submissions (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text not null,
  case_description text not null,
  status text default 'baru' check (status in ('baru', 'diproses', 'selesai')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- STAFF TABLE
-- Table untuk menyimpan data staff/anggota organisasi
create table if not exists staff (
  id uuid default uuid_generate_v4() primary key,            -- ID unik menggunakan UUID
  name text not null,                                         -- Nama lengkap staff (wajib)
  role text not null,                                         -- Jabatan/posisi staff (wajib)
  image text not null,                                        -- URL foto staff (wajib)
  location text not null default 'Kediri',                    -- Lokasi kerja: Kediri atau Jember
  image_position text default 'top',                          -- Posisi foto: 'top' atau 'center'
  staff_type text not null default 'staff'                    -- Tipe: 'management' atau 'staff'
    check (staff_type in ('management', 'staff')),            -- Validasi tipe yang diizinkan
  display_order integer default 0,                            -- Urutan tampilan (0 = default)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null  -- Waktu dibuat
);

-- ENABLE ROW LEVEL SECURITY
alter table articles enable row level security;
alter table activities enable row level security;
alter table products enable row level security;
alter table photo_gallery enable row level security;
alter table videos enable row level security;
alter table contact_submissions enable row level security;
alter table staff enable row level security;

-- POLICIES (Drop first to avoid "policy already exists" errors)

-- Articles
drop policy if exists "Public Articles are viewable by everyone" on articles;
create policy "Public Articles are viewable by everyone" on articles for select using ( true );

drop policy if exists "Users can insert articles" on articles;
create policy "Users can insert articles" on articles for insert with check ( auth.role() = 'authenticated' );

drop policy if exists "Users can update articles" on articles;
create policy "Users can update articles" on articles for update using ( auth.role() = 'authenticated' );

drop policy if exists "Users can delete articles" on articles;
create policy "Users can delete articles" on articles for delete using ( auth.role() = 'authenticated' );

-- Activities
drop policy if exists "Public Activities are viewable by everyone" on activities;
create policy "Public Activities are viewable by everyone" on activities for select using ( true );

drop policy if exists "Users can insert activities" on activities;
create policy "Users can insert activities" on activities for insert with check ( auth.role() = 'authenticated' );

drop policy if exists "Users can update activities" on activities;
create policy "Users can update activities" on activities for update using ( auth.role() = 'authenticated' );

drop policy if exists "Users can delete activities" on activities;
create policy "Users can delete activities" on activities for delete using ( auth.role() = 'authenticated' );

-- Products
drop policy if exists "Public Products are viewable by everyone" on products;
create policy "Public Products are viewable by everyone" on products for select using ( true );

drop policy if exists "Users can insert products" on products;
create policy "Users can insert products" on products for insert with check ( auth.role() = 'authenticated' );

drop policy if exists "Users can update products" on products;
create policy "Users can update products" on products for update using ( auth.role() = 'authenticated' );

drop policy if exists "Users can delete products" on products;
create policy "Users can delete products" on products for delete using ( auth.role() = 'authenticated' );

-- Photo Gallery
drop policy if exists "Public Photo Gallery are viewable by everyone" on photo_gallery;
create policy "Public Photo Gallery are viewable by everyone" on photo_gallery for select using ( true );

drop policy if exists "Users can insert photo gallery" on photo_gallery;
create policy "Users can insert photo gallery" on photo_gallery for insert with check ( auth.role() = 'authenticated' );

drop policy if exists "Users can update photo gallery" on photo_gallery;
create policy "Users can update photo gallery" on photo_gallery for update using ( auth.role() = 'authenticated' );

drop policy if exists "Users can delete photo gallery" on photo_gallery;
create policy "Users can delete photo gallery" on photo_gallery for delete using ( auth.role() = 'authenticated' );

-- Videos
drop policy if exists "Public Videos are viewable by everyone" on videos;
create policy "Public Videos are viewable by everyone" on videos for select using ( true );

drop policy if exists "Users can insert videos" on videos;
create policy "Users can insert videos" on videos for insert with check ( auth.role() = 'authenticated' );

drop policy if exists "Users can update videos" on videos;
create policy "Users can update videos" on videos for update using ( auth.role() = 'authenticated' );

drop policy if exists "Users can delete videos" on videos;
create policy "Users can delete videos" on videos for delete using ( auth.role() = 'authenticated' );

-- Contact Submissions
drop policy if exists "Public can insert contact submissions" on contact_submissions;
create policy "Public can insert contact submissions" on contact_submissions for insert with check ( true );

drop policy if exists "Only authenticated users can view contact submissions" on contact_submissions;
create policy "Only authenticated users can view contact submissions" on contact_submissions for select using ( auth.role() = 'authenticated' );

drop policy if exists "Only authenticated users can update contact submissions" on contact_submissions;
create policy "Only authenticated users can update contact submissions" on contact_submissions for update using ( auth.role() = 'authenticated' );

drop policy if exists "Only authenticated users can delete contact submissions" on contact_submissions;
create policy "Only authenticated users can delete contact submissions" on contact_submissions for delete using ( auth.role() = 'authenticated' );

-- Staff
-- Policy: Semua orang bisa melihat daftar staff (public)
drop policy if exists "Public Staff are viewable by everyone" on staff;
create policy "Public Staff are viewable by everyone" on staff for select using ( true );

-- Policy: Hanya user yang sudah login bisa menambah staff baru
drop policy if exists "Users can insert staff" on staff;
create policy "Users can insert staff" on staff for insert with check ( auth.role() = 'authenticated' );

-- Policy: Hanya user yang sudah login bisa mengupdate data staff
drop policy if exists "Users can update staff" on staff;
create policy "Users can update staff" on staff for update using ( auth.role() = 'authenticated' );

-- Policy: Hanya user yang sudah login bisa menghapus staff
drop policy if exists "Users can delete staff" on staff;
create policy "Users can delete staff" on staff for delete using ( auth.role() = 'authenticated' );

-- Create indexes (if not exists)
create index if not exists idx_photo_gallery_category on photo_gallery(category);
create index if not exists idx_photo_gallery_created_at on photo_gallery(created_at desc);
create index if not exists idx_photo_gallery_activity_id on photo_gallery(activity_id);
create index if not exists idx_videos_created_at on videos(created_at desc);
create index if not exists idx_videos_activity_id on videos(activity_id);

-- Index untuk staff: mempercepat query berdasarkan tipe dan urutan
create index if not exists idx_staff_type on staff(staff_type);
create index if not exists idx_staff_display_order on staff(display_order);

-- STORAGE BUCKETS SETUP
insert into storage.buckets (id, name, public)
values 
  ('photo-gallery-images', 'photo-gallery-images', true),
  ('video-thumbnails', 'video-thumbnails', true),
  ('activity-images', 'activity-images', true),
  ('staff-images', 'staff-images', true)  -- Bucket untuk foto staff
on conflict (id) do nothing;

-- Storage Policies (Drop first)

-- photo-gallery-images
drop policy if exists "Public Access Photo Gallery" on storage.objects;
create policy "Public Access Photo Gallery" on storage.objects for select using ( bucket_id = 'photo-gallery-images' );

drop policy if exists "Authenticated Upload Photo Gallery" on storage.objects;
create policy "Authenticated Upload Photo Gallery" on storage.objects for insert with check ( bucket_id = 'photo-gallery-images' and auth.role() = 'authenticated' );

drop policy if exists "Authenticated Update Photo Gallery" on storage.objects;
create policy "Authenticated Update Photo Gallery" on storage.objects for update using ( bucket_id = 'photo-gallery-images' and auth.role() = 'authenticated' );

drop policy if exists "Authenticated Delete Photo Gallery" on storage.objects;
create policy "Authenticated Delete Photo Gallery" on storage.objects for delete using ( bucket_id = 'photo-gallery-images' and auth.role() = 'authenticated' );

-- video-thumbnails
drop policy if exists "Public Access Video Thumbnails" on storage.objects;
create policy "Public Access Video Thumbnails" on storage.objects for select using ( bucket_id = 'video-thumbnails' );

drop policy if exists "Authenticated Upload Video Thumbnails" on storage.objects;
create policy "Authenticated Upload Video Thumbnails" on storage.objects for insert with check ( bucket_id = 'video-thumbnails' and auth.role() = 'authenticated' );

drop policy if exists "Authenticated Update Video Thumbnails" on storage.objects;
create policy "Authenticated Update Video Thumbnails" on storage.objects for update using ( bucket_id = 'video-thumbnails' and auth.role() = 'authenticated' );

drop policy if exists "Authenticated Delete Video Thumbnails" on storage.objects;
create policy "Authenticated Delete Video Thumbnails" on storage.objects for delete using ( bucket_id = 'video-thumbnails' and auth.role() = 'authenticated' );

-- activity-images
drop policy if exists "Public Access Activity Images" on storage.objects;
create policy "Public Access Activity Images" on storage.objects for select using ( bucket_id = 'activity-images' );

drop policy if exists "Authenticated Upload Activity Images" on storage.objects;
create policy "Authenticated Upload Activity Images" on storage.objects for insert with check ( bucket_id = 'activity-images' and auth.role() = 'authenticated' );

drop policy if exists "Authenticated Update Activity Images" on storage.objects;
create policy "Authenticated Update Activity Images" on storage.objects for update using ( bucket_id = 'activity-images' and auth.role() = 'authenticated' );

drop policy if exists "Authenticated Delete Activity Images" on storage.objects;
create policy "Authenticated Delete Activity Images" on storage.objects for delete using ( bucket_id = 'activity-images' and auth.role() = 'authenticated' );

-- staff-images
-- Policy: Semua orang bisa melihat foto staff
drop policy if exists "Public Access Staff Images" on storage.objects;
create policy "Public Access Staff Images" on storage.objects for select using ( bucket_id = 'staff-images' );

-- Policy: Hanya user authenticated yang bisa upload foto staff
drop policy if exists "Authenticated Upload Staff Images" on storage.objects;
create policy "Authenticated Upload Staff Images" on storage.objects for insert with check ( bucket_id = 'staff-images' and auth.role() = 'authenticated' );

-- Policy: Hanya user authenticated yang bisa update foto staff
drop policy if exists "Authenticated Update Staff Images" on storage.objects;
create policy "Authenticated Update Staff Images" on storage.objects for update using ( bucket_id = 'staff-images' and auth.role() = 'authenticated' );

-- Policy: Hanya user authenticated yang bisa hapus foto staff
drop policy if exists "Authenticated Delete Staff Images" on storage.objects;
create policy "Authenticated Delete Staff Images" on storage.objects for delete using ( bucket_id = 'staff-images' and auth.role() = 'authenticated' );
