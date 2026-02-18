-- Add hero column to catalog_volumes
ALTER TABLE catalog_volumes ADD COLUMN hero boolean DEFAULT false;

-- Partial unique index: at most one row can have hero = true
CREATE UNIQUE INDEX idx_catalog_volumes_hero
  ON catalog_volumes ((true))
  WHERE hero = true;

-- Atomically clear any existing hero and set the new one.
-- Only published volumes can be set as hero.
CREATE OR REPLACE FUNCTION set_hero_volume(volume_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE catalog_volumes SET hero = false WHERE hero = true;
  UPDATE catalog_volumes SET hero = true WHERE id = volume_uuid AND publication_status = 'published';
END;
$$ LANGUAGE plpgsql;

-- Clear the hero without setting a new one.
CREATE OR REPLACE FUNCTION clear_hero_volume()
RETURNS void AS $$
BEGIN
  UPDATE catalog_volumes SET hero = false WHERE hero = true;
END;
$$ LANGUAGE plpgsql;
