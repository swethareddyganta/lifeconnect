-- This script seeds the database with sample users and events.
-- In a real Supabase project, you would use the dashboard or client libraries
-- to create users, as it involves auth.users table.
-- This is a simulation for demonstration.

-- Step 1: Create dummy users in auth.users.
-- This part is tricky to do in plain SQL without server-side functions.
-- We will assume users exist and insert their profiles and events.
-- Replace with actual UUIDs from your Supabase auth users.

-- Let's define some placeholder UUIDs.
-- In your project, get these from your signed-up users.
DO $$
DECLARE
    user1_id UUID := '00000000-0000-0000-0000-000000000001';
    user2_id UUID := '00000000-0000-0000-0000-000000000002';
    user3_id UUID := '00000000-0000-0000-0000-000000000003';
    user4_id UUID := '00000000-0000-0000-0000-000000000004';
    user5_id UUID := '00000000-0000-0000-0000-000000000005';
BEGIN

-- Step 2: Insert profiles for these users.
-- This would normally be handled by the trigger. We do it manually for seeding.
INSERT INTO public.profiles (id, full_name, avatar_url) VALUES
(user1_id, 'Jane Doe', 'https://i.pravatar.cc/150?u=jane_doe'),
(user2_id, 'John Smith', 'https://i.pravatar.cc/150?u=john_smith'),
(user3_id, 'Sarah Connor', 'https://i.pravatar.cc/150?u=sarah_connor'),
(user4_id, 'David Liu', 'https://i.pravatar.cc/150?u=david_liu'),
(user5_id, 'Emily White', 'https://i.pravatar.cc/150?u=emily_white')
ON CONFLICT (id) DO NOTHING;

-- Step 3: Insert events for each user.
INSERT INTO public.events (user_id, type, title, location, start_year, end_year, description) VALUES
-- Jane Doe's timeline
(user1_id, 'education', 'Northwood High School', 'Springfield, IL', 2004, 2008, 'Active in the drama club.'),
(user1_id, 'work', 'The Local Diner', 'Springfield, IL', 2007, 2008, 'Waitress during senior year.'),
(user1_id, 'education', 'State University', 'Metropolis, IL', 2008, 2012, 'Studied journalism.'),

-- John Smith's timeline
(user2_id, 'education', 'Northwood High School', 'Springfield, IL', 2003, 2007, 'Played on the basketball team.'),
(user2_id, 'work', 'Acme Inc.', 'Springfield, IL', 2008, 2015, 'Started as an intern.'),
(user2_id, 'location', 'Lived on Oak Street', 'Springfield, IL', 1995, 2015, 'Grew up here.'),

-- Sarah Connor's timeline
(user3_id, 'education', 'Northwood High School', 'Springfield, IL', 2005, 2009, 'Was in Mr. Clark''s chemistry class.'),
(user3_id, 'work', 'Cyberdyne Systems', 'Sunnyvale, CA', 2013, 2020, 'Research assistant.'),
(user3_id, 'location', 'Lived in Sunnyvale', 'Sunnyvale, CA', 2013, 2020, 'Moved for work.'),

-- David Liu's timeline
(user4_id, 'work', 'Acme Inc.', 'Springfield, IL', 2010, 2018, 'Worked in the marketing department.'),
(user4_id, 'education', 'Eastwood Community College', 'Springfield, IL', 2008, 2010, 'Associate''s Degree in Business.'),
(user4_id, 'location', 'Lived near Eastwood Park', 'Springfield, IL', 2008, 2018, 'Rented an apartment.'),

-- Emily White's timeline
(user5_id, 'education', 'State University', 'Metropolis, IL', 2008, 2012, 'Majored in Fine Arts.'),
(user5_id, 'work', 'Metropolis Art Gallery', 'Metropolis, IL', 2012, NULL, 'Curator.');

END $$;
