CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    type TEXT NOT NULL,
    phonenumber TEXT NOT NULL
);

CREATE TABLE properties (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    address TEXT NOT NULL,
    type TEXT NOT NULL,
    bedrooms INTEGER NOT NULL,
    rented BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    landlord INTEGER NOT NULL,
    tenant INTEGER,
    edited BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (landlord) REFERENCES users (id),
    FOREIGN KEY (tenant) REFERENCES users (id)
);

CREATE TABLE property_drafts (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    address TEXT NOT NULL,
    type TEXT NOT NULL,
    bedrooms INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    landlord INTEGER NOT NULL,
    FOREIGN KEY (landlord) REFERENCES users (id)
);



CREATE TABLE images (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    url TEXT NOT NULL,
    property_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE,
);

CREATE TABLE image_drafts (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    url TEXT NOT NULL,
    property_draft INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (property_draft) REFERENCES property_drafts (id) ON DELETE CASCADE
);

CREATE TABLE property_requests (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    property_id INTEGER NOT NULL,
    tenant_id INTEGER NOT NULL,
    landlord_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (property_id) REFERENCES properties (id),
    FOREIGN KEY (tenant_id) REFERENCES users (id),
    FOREIGN KEY (landlord_id) REFERENCES users (id)
);

CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    property_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (property_id) REFERENCES properties (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);


CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE chats (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (sender_id) REFERENCES users (id),
    FOREIGN KEY (receiver_id) REFERENCES users (id)
);

CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    property_id INTEGER NOT NULL,
    tenant_id INTEGER NOT NULL,
    landlord_id INTEGER NOT NULL,
    amount TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (property_id) REFERENCES properties (id),
    FOREIGN KEY (tenant_id) REFERENCES users (id),
    FOREIGN KEY (landlord_id) REFERENCES users (id)
);


CREATE TABLE property_likes (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    property_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (property_id) REFERENCES properties (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);