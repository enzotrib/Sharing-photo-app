

-- Crear tabla uploads
create table uploads (
  id uuid default uuid_generate_v4() primary key,
  image_url text,
  comment text,
  approved bool default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS
alter table uploads enable row level security;

-- Políticas
-- Lectura pública
create policy "Enable read access for all users"
on uploads for select
using (true);

-- Cualquiera puede subir fotos
create policy "Allow public uploads"
on uploads for insert
with check (true);

-- Solo usuarios autenticados pueden aprobar/desaprobar
create policy "Authenticated users can approve photos"
on uploads for update
using (auth.role() = 'authenticated');

-- Solo usuarios autenticados pueden eliminar
create policy "Enable delete for authenticated users"
on uploads for delete
using (auth.role() = 'authenticated');


-- Crear la tabla carousel_settings
CREATE TABLE carousel_settings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    slide_interval integer DEFAULT 5000,
    photos_limit text DEFAULT '10',
    flash_enabled boolean DEFAULT true,
    flash_interval integer DEFAULT 15000,
    emojis_enabled boolean DEFAULT true,
    emoji_interval integer DEFAULT 3000,
    selected_emojis text DEFAULT '👏,❤️,✨,🎉',
    confetti_enabled boolean DEFAULT true,
    confetti_interval integer DEFAULT 20000,
    created_at timestamptz DEFAULT timezone('utc'::text, now()),
    updated_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Crear trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_carousel_settings_updated_at ON carousel_settings;
DROP FUNCTION IF EXISTS update_updated_at_column();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_carousel_settings_updated_at
    BEFORE UPDATE ON carousel_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar la configuración existente
INSERT INTO carousel_settings (
    id,
    slide_interval,
    photos_limit,
    flash_enabled,
    flash_interval,
    emojis_enabled,
    emoji_interval,
    selected_emojis,
    confetti_enabled,
    confetti_interval,
    created_at,
    updated_at
) VALUES (
    '35b59704-d22e-4e84-9c83-31e07c8df8ba',  -- id existente
    7000,                                     -- slide_interval
    '20',                                     -- photos_limit
    TRUE,                                     -- flash_enabled
    18000,                                    -- flash_interval
    TRUE,                                     -- emojis_enabled
    1500,                                     -- emoji_interval
    '👏,❤️,😍,🎉,💫,✨,🎈,🎊',                  -- selected_emojis
    TRUE,                                     -- confetti_enabled
    20000,                                    -- confetti_interval
    '2024-11-05 15:07:52.156213+00',         -- created_at
    '2024-11-05 15:07:52.156213+00'          -- updated_at
);

-- Habilitar RLS
alter table carousel_settings enable row level security;

-- Políticas
-- Lectura para usuarios autenticados
create policy "Allow authenticated read carousel_settings"
on carousel_settings for select
using (auth.role() = 'authenticated');

-- Modificación por usuarios autenticados
create policy "Allow authenticated user modifications"
on carousel_settings for all
using (auth.role() = 'authenticated');

-- Crear bucket para fotos
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true);

-- Políticas de storage
create policy "Imágenes son públicamente accesibles"
on storage.objects for select
using ( bucket_id = 'photos' );

create policy "Cualquiera puede subir imágenes"
on storage.objects for insert
with check ( bucket_id = 'photos' );

create policy "Solo usuarios autenticados pueden eliminar imágenes"
on storage.objects for delete
using (
  bucket_id = 'photos'
  and auth.role() = 'authenticated'
);


-- Función para actualizar updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Trigger para carousel_settings
create trigger update_carousel_settings_updated_at
    before update on carousel_settings
    for each row
    execute procedure update_updated_at_column();


-- Índices para mejorar el rendimiento
create index if not exists uploads_approved_idx on uploads(approved);

-- Insertar configuración inicial del carousel
insert into carousel_settings (
  slide_interval,
  photos_limit,
  fade_enabled,
  emoji_enabled,
  confetti_enabled
) values (
  5000,
  10,
  true,
  true,
  true
) on conflict do nothing;
