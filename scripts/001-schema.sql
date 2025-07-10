-- Enable pgroonga for full-text search if available, or use standard text search
-- CREATE EXTENSION IF NOT EXISTS pgroonga;

-- Profiles Table
-- Stores public user information.
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Event Types Enum
CREATE TYPE event_type AS ENUM ('education', 'work', 'location');

-- Events Table
-- Stores life events for each user, which are the basis for matching.
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type event_type NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  start_year INT NOT NULL,
  end_year INT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_start_year ON events(start_year);
CREATE INDEX IF NOT EXISTS idx_events_end_year ON events(end_year);
-- For full-text search on title and location
CREATE INDEX IF NOT EXISTS idx_events_text_search ON events USING GIN (to_tsvector('english', title || ' ' || location));


-- Connection Status Enum
CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'declined', 'blocked');

-- Connections Table
-- Manages relationships between users.
CREATE TABLE IF NOT EXISTS connections (
  id BIGSERIAL PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status connection_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_connections_requester_id ON connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_addressee_id ON connections(addressee_id);
