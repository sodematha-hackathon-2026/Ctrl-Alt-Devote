-- =====================================================
-- Sode Sri Vadiraja Matha
-- =====================================================

BEGIN;

-- =====================================================
-- ENUM TYPES
-- =====================================================
CREATE TYPE booking_status AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'FAILED'
);

CREATE TYPE payment_status AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED'
);

CREATE TYPE payment_mode AS ENUM (
    'UPI',
    'CARD',
    'NETBANKING'
);

CREATE TYPE seva_location AS ENUM (
    'SODE',
    'UDUPI_PARYAYA'
);

-- =====================================================
-- USERS
-- =====================================================
CREATE TABLE users (
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number                    VARCHAR(15) NOT NULL UNIQUE,
    full_name                       VARCHAR(150),
    email                           VARCHAR(150) UNIQUE,
    gothra                          VARCHAR(100),
    rashi                           VARCHAR(100),
    nakshatra                       VARCHAR(100),
    address                         TEXT,
    city                            VARCHAR(100),
    state                           VARCHAR(100),
    pincode                         VARCHAR(10),
    role                            VARCHAR(20) NOT NULL DEFAULT 'USER',
    consent_data_storage            BOOLEAN DEFAULT FALSE,
    consent_communications          BOOLEAN DEFAULT FALSE,
    fcm_token                       TEXT,
    is_volunteer                    BOOLEAN DEFAULT FALSE,
    volunteer_request               BOOLEAN DEFAULT FALSE,
    is_admin                        BOOLEAN DEFAULT FALSE,
    created_at                      TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX index_users_phone_number ON users(phone_number);
CREATE INDEX index_users_email ON users(email);

-- =====================================================
-- SEVAS
-- =====================================================
CREATE TABLE sevas (
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_english                   VARCHAR(150) NOT NULL,
    title_kannada                   VARCHAR(150),
    amount                          NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    description                     TEXT,
    image_url                       VARCHAR(500),
    category                        seva_location NOT NULL,
    is_active                       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX index_sevas_category ON sevas(category);
CREATE INDEX index_sevas_active ON sevas(is_active);

-- =====================================================
-- SEVA BOOKINGS
-- =====================================================
CREATE TABLE seva_bookings (
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                         UUID NOT NULL,
    seva_id                         UUID NOT NULL,
    seva_date                       TIMESTAMP WITHOUT TIME ZONE,
    status                          booking_status NOT NULL DEFAULT 'PENDING',
    razorpay_order_id               VARCHAR(100),
    razorpay_payment_id             VARCHAR(100),
    razorpay_signature              VARCHAR(500),
    amount_paid                     NUMERIC(10,2),
    prasada_delivery_mode           VARCHAR(50),
    devotee_name                    VARCHAR(150),
    devotee_rashi                   VARCHAR(100),
    devotee_nakshatra               VARCHAR(100),
    devotee_gothra                  VARCHAR(100),
    payment_status                  payment_status NOT NULL DEFAULT 'PENDING',
    created_at                      TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT foreign_key_seva_booking_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT foreign_key_seva_booking_seva
        FOREIGN KEY (seva_id)
        REFERENCES sevas(id)
        ON DELETE RESTRICT
);

CREATE INDEX index_seva_bookings_user_id ON seva_bookings(user_id);
CREATE INDEX index_seva_bookings_seva_id ON seva_bookings(seva_id);
CREATE INDEX index_seva_bookings_status ON seva_bookings(status);
CREATE INDEX index_seva_bookings_date ON seva_bookings(seva_date);

-- =====================================================
-- ROOM BOOKINGS
-- =====================================================
CREATE TABLE room_bookings (
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                         VARCHAR(36), -- UUID stored as string for flexibility
    check_in_date                   DATE NOT NULL,
    check_out_date                  DATE NOT NULL,
    number_of_guests                INTEGER,
    number_of_rooms                 INTEGER,
    consent                         BOOLEAN DEFAULT FALSE,
    created_at                      TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status                          VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    CONSTRAINT check_room_booking_dates
        CHECK (check_out_date > check_in_date)
);

CREATE INDEX index_room_bookings_user_id ON room_bookings(user_id);
CREATE INDEX index_room_bookings_dates ON room_bookings(check_in_date, check_out_date);
CREATE INDEX index_room_bookings_status ON room_bookings(status);

-- =====================================================
-- GURU / PARAMPARA
-- =====================================================
CREATE TABLE guru_parampara (
    id                              BIGSERIAL PRIMARY KEY,
    name                            VARCHAR(150) NOT NULL,
    name_kannada                    VARCHAR(150),
    order_index                     INTEGER,
    ashrama_guru                    VARCHAR(150),
    ashrama_shishya                 VARCHAR(150),
    photo_url                       VARCHAR(500),
    period                          VARCHAR(50),
    poorvashrama_name               VARCHAR(150),
    aaradhane                       VARCHAR(100),
    peetarohana                     VARCHAR(100),
    key_works                       VARCHAR(2000),
    description                     TEXT,
    vrindavana_location             TEXT,
    vrindavana_map_link             VARCHAR(500),
    vrindavana_lat                  NUMERIC(9,6),
    vrindavana_long                 NUMERIC(9,6),
    is_bhootarajaru                 BOOLEAN DEFAULT FALSE,
    start_year                      INTEGER,
    end_year                        INTEGER,
    short_highlight                 VARCHAR(500),
    ashrama_guru_id                 BIGINT,
    ashrama_shishya_id              BIGINT,

    CONSTRAINT foreign_key_previous_guru
        FOREIGN KEY (ashrama_guru_id)
        REFERENCES guru_parampara(id)
        ON DELETE SET NULL,

    CONSTRAINT foreign_key_next_guru
        FOREIGN KEY (ashrama_shishya_id)
        REFERENCES guru_parampara(id)
        ON DELETE SET NULL
);

CREATE INDEX index_guru_parampara_name ON guru_parampara(name);
CREATE INDEX index_guru_parampara_order ON guru_parampara(order_index);

-- =====================================================
-- ALBUMS
-- =====================================================
CREATE TABLE albums (
    id                              BIGSERIAL PRIMARY KEY,
    title                           VARCHAR(255),
    description                     TEXT,
    cover_image                     VARCHAR(500)
);

CREATE INDEX index_albums_title ON albums(title);

-- =====================================================
-- BRANCHES
-- =====================================================
CREATE TABLE branches (
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                            VARCHAR(255),
    address                         TEXT,
    city                            VARCHAR(100),
    state                           VARCHAR(100),
    pincode                         VARCHAR(10),
    phone                           VARCHAR(20),
    map_link                        VARCHAR(500),
    latitude                        NUMERIC(9,6),
    longitude                       NUMERIC(9,6)
);

CREATE INDEX index_branches_name ON branches(name);
CREATE INDEX index_branches_city ON branches(city);

-- =====================================================
-- DAILY ALANKARA
-- =====================================================
CREATE TABLE daily_alankara (
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url                       TEXT,
    uploaded_at                     TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX index_daily_alankara_uploaded_at ON daily_alankara(uploaded_at);

-- =====================================================
-- EVENTS
-- =====================================================
CREATE TABLE events (
    id                              BIGSERIAL PRIMARY KEY,
    title                           VARCHAR(255),
    date                            DATE,
    tithi                           VARCHAR(100),
    description                     TEXT,
    image_url                       VARCHAR(500),
    category                        VARCHAR(100),
    notification_sent               BOOLEAN DEFAULT FALSE
);

CREATE INDEX index_events_date ON events(date);
CREATE INDEX index_events_category ON events(category);

-- =====================================================
-- FLASH UPDATES
-- =====================================================
CREATE TABLE flash_updates (
    id                              BIGSERIAL PRIMARY KEY,
    message                         TEXT,
    link                            VARCHAR(500),
    is_active                       BOOLEAN DEFAULT TRUE,
    expiry_date                     DATE
);

CREATE INDEX index_flash_updates_active ON flash_updates(is_active);
CREATE INDEX index_flash_updates_expiry ON flash_updates(expiry_date);

-- =====================================================
-- MEDIA ITEMS
-- =====================================================
CREATE TABLE media_items (
    id                              BIGSERIAL PRIMARY KEY,
    album_id                        BIGINT,
    type                            VARCHAR(10) CHECK (type IN ('PHOTO', 'VIDEO')),
    url                             VARCHAR(500),

    CONSTRAINT foreign_key_media_album
        FOREIGN KEY (album_id)
        REFERENCES albums(id)
        ON DELETE CASCADE
);

CREATE INDEX index_media_items_album_id ON media_items(album_id);
CREATE INDEX index_media_items_type ON media_items(type);

-- =====================================================
-- TIMINGS
-- =====================================================
CREATE TABLE timings (
    id                              BIGSERIAL PRIMARY KEY,
    location                        VARCHAR(100),
    darshan_time                    VARCHAR(100),
    prasada_time                    VARCHAR(100),
    is_active                       BOOLEAN DEFAULT TRUE
);

CREATE INDEX index_timings_location ON timings(location);
CREATE INDEX index_timings_active ON timings(is_active);

-- =====================================================
-- VOLUNTEERS
-- =====================================================
CREATE TABLE volunteers (
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                         UUID,
    name                            VARCHAR(255),
    phone_number                    VARCHAR(20),
    email                           VARCHAR(255),
    hobbies_or_talents              TEXT,
    past_experience                 TEXT,
    created_at                      TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT foreign_key_volunteer_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX index_volunteers_user_id ON volunteers(user_id);
CREATE INDEX index_volunteers_name ON volunteers(name);

-- =====================================================
-- VOLUNTEER OPPORTUNITIES
-- =====================================================
CREATE TABLE volunteer_opportunities (
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title                           VARCHAR(255),
    description                     TEXT,
    required_skills                 TEXT,
    image_url                       VARCHAR(500),
    application_count               INTEGER DEFAULT 0,
    status                          VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
    created_at                      TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                      TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX index_volunteer_opportunities_status ON volunteer_opportunities(status);
CREATE INDEX index_volunteer_opportunities_created_at ON volunteer_opportunities(created_at);

-- =====================================================
-- VOLUNTEER APPLICATIONS
-- =====================================================
CREATE TABLE volunteer_applications (
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                         UUID NOT NULL,
    opportunity_id                  UUID NOT NULL,
    status                          VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    applied_at                      TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                      TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT foreign_key_volunteer_application_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT foreign_key_volunteer_application_opportunity
        FOREIGN KEY (opportunity_id)
        REFERENCES volunteer_opportunities(id)
        ON DELETE CASCADE
);

CREATE INDEX index_volunteer_applications_user_id ON volunteer_applications(user_id);
CREATE INDEX index_volunteer_applications_opportunity_id ON volunteer_applications(opportunity_id);
CREATE INDEX index_volunteer_applications_status ON volunteer_applications(status);

-- =====================================================
-- Enable UUID extension
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

COMMIT;
