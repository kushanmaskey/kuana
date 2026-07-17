-- KUANA Database Schema

CREATE TABLE IF NOT EXISTS alumni (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  graduation_year INTEGER,
  degree VARCHAR(150),
  department VARCHAR(150),
  city VARCHAR(100),
  state_province VARCHAR(100),
  country VARCHAR(100) DEFAULT 'USA',
  bio TEXT,
  linkedin_url VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  end_date DATE,
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  country VARCHAR(100) DEFAULT 'USA',
  venue VARCHAR(255),
  venue_address TEXT,
  registration_url VARCHAR(255),
  image_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('photo', 'video')),
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
  year INTEGER,
  city VARCHAR(100),
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  alumni_id INTEGER REFERENCES alumni(id) ON DELETE SET NULL,
  donor_name VARCHAR(200) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  purpose VARCHAR(255),
  message TEXT,
  payment_reference VARCHAR(255),
  payment_method VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  donated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed events
INSERT INTO events (title, description, event_date, end_date, city, state_province, venue, venue_address, is_featured, is_published) VALUES
('KUANA Reunion 2025', 'Our second biennial reunion bringing together KU alumni from across the USA and Canada for two days of networking, cultural programs, and celebration.', '2025-08-30', '2025-08-31', 'Lewisville', 'TX', 'Hilton Garden Inn Dallas Lewisville', '785 State Hwy 121, Lewisville, TX 75067', true, true),
('KUANA Reunion 2023', 'Inaugural KUANA reunion — the first gathering of Kathmandu University Alumni in North America. A historic milestone for our community.', '2023-09-01', NULL, 'Trophy Club', 'TX', 'Holiday Inn Trophy Club by IHG', '725 Plaza Dr, Trophy Club, TX 76262', false, true),
('KUANA Reunion 2027', 'Third biennial reunion of Kathmandu University Alumni North America. Join us in Boston, MA for an unforgettable gathering.', '2027-08-30', '2027-08-31', 'Boston', 'MA', 'TBA', NULL, false, true)
ON CONFLICT DO NOTHING;
