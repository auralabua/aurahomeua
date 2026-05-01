-- Reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  rating SMALLINT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Validation trigger (avoid CHECK on mutable expressions; keep it simple)
CREATE OR REPLACE FUNCTION public.validate_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'rating must be between 1 and 5';
  END IF;
  IF length(trim(NEW.author_name)) = 0 OR length(NEW.author_name) > 80 THEN
    RAISE EXCEPTION 'author_name length must be 1..80';
  END IF;
  IF length(trim(NEW.comment)) = 0 OR length(NEW.comment) > 1000 THEN
    RAISE EXCEPTION 'comment length must be 1..1000';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER reviews_validate
BEFORE INSERT OR UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.validate_review();

CREATE TRIGGER reviews_set_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews public read"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Anyone can create reviews"
ON public.reviews FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins manage reviews"
ON public.reviews FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Randomize reviews count (0..12) and rating (4.0..5.0) for existing products
UPDATE public.products
SET
  reviews = floor(random() * 13)::int,
  rating  = round((4 + random())::numeric, 1);