
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;

INSERT INTO public.categories (slug, name, description, icon, position, parent_id)
VALUES
  ('massagers-electric', 'Електричні масажери', 'Електричні масажери та вібромасажери', 'Zap', 1, 'c4d8a454-c934-4af3-8813-e6e95341f0fe'),
  ('massagers-manual', 'Ручні масажери', 'Ручні масажери, ролики та м''ячі', 'Activity', 2, 'c4d8a454-c934-4af3-8813-e6e95341f0fe')
ON CONFLICT (slug) DO UPDATE SET parent_id = EXCLUDED.parent_id, name = EXCLUDED.name, description = EXCLUDED.description;

-- Move electric products
UPDATE public.products
SET category_id = (SELECT id FROM public.categories WHERE slug = 'massagers-electric')
WHERE category_id = 'c4d8a454-c934-4af3-8813-e6e95341f0fe'
  AND (
    name ILIKE '%електр%' OR name ILIKE '%электр%' OR name ILIKE '%пістолет%'
  );

-- Move remaining massagers products to manual
UPDATE public.products
SET category_id = (SELECT id FROM public.categories WHERE slug = 'massagers-manual')
WHERE category_id = 'c4d8a454-c934-4af3-8813-e6e95341f0fe';
