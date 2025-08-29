-- Add missing template columns
ALTER TABLE templates
ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT 'Ready to Find Your Dream Home?';

ALTER TABLE templates
ADD COLUMN IF NOT EXISTS hero_subtitle TEXT DEFAULT 'Let''s start your luxury real estate journey today. Our team is here to make your Nebraska home buying or selling experience exceptional.';

ALTER TABLE templates
ADD COLUMN IF NOT EXISTS contact_phone TEXT DEFAULT '(402) 522-6131';

ALTER TABLE templates
ADD COLUMN IF NOT EXISTS contact_phone_text TEXT DEFAULT 'Call or text anytime';

ALTER TABLE templates
ADD COLUMN IF NOT EXISTS office_address TEXT DEFAULT '331 Village Pointe Plaza';

ALTER TABLE templates
ADD COLUMN IF NOT EXISTS office_city TEXT DEFAULT 'Omaha';

ALTER TABLE templates
ADD COLUMN IF NOT EXISTS office_state TEXT DEFAULT 'NE';

ALTER TABLE templates
ADD COLUMN IF NOT EXISTS office_zip TEXT DEFAULT '68130';