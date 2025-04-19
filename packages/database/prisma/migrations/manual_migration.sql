-- Make email optional
ALTER TABLE users 
ALTER COLUMN email DROP NOT NULL;

-- Make name required if it isn't already
ALTER TABLE users 
ALTER COLUMN name SET NOT NULL;

-- Add unique constraint to name column if it doesn't exist
ALTER TABLE users 
ADD CONSTRAINT users_name_key UNIQUE (name); 