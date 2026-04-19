CREATE TABLE users (
  user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  account_status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_users_status CHECK (account_status IN ('active', 'inactive', 'suspended'))
);

CREATE TABLE user_profiles (
  profile_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  phone VARCHAR(30),
  avatar_url VARCHAR(500),
  bio TEXT,
  date_of_birth DATE,
  emergency_contact_name VARCHAR(120),
  emergency_contact_phone VARCHAR(30),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_preferences (
  preference_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  spice_level VARCHAR(12) NOT NULL DEFAULT 'Medium',
  favorite_cuisine VARCHAR(80),
  newsletter_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_spice_level CHECK (spice_level IN ('Mild', 'Medium', 'Hot'))
);

CREATE TABLE dietary_preferences (
  dietary_preference_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  preference_id BIGINT NOT NULL REFERENCES user_preferences(preference_id) ON DELETE CASCADE,
  preference_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (preference_id, preference_name)
);

CREATE TABLE user_addresses (
  address_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  address_label VARCHAR(50) NOT NULL DEFAULT 'Primary',
  line_1 VARCHAR(200) NOT NULL,
  line_2 VARCHAR(200),
  city VARCHAR(80) NOT NULL,
  state_region VARCHAR(80) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(80) NOT NULL DEFAULT 'India',
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_primary ON user_addresses(user_id, is_primary);
CREATE INDEX idx_dietary_preferences_preference_id ON dietary_preferences(preference_id);
