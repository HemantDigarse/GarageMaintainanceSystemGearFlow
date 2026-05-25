CREATE DATABASE IF NOT EXISTS garage_db;
USE garage_db;

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'GARAGE_OWNER'
);

CREATE TABLE customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255)
);

CREATE TABLE vehicle (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    model VARCHAR(100),
    plate_number VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- SERVICE ITEMS TABLE
CREATE TABLE service_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL
);

-- INVOICES TABLE
CREATE TABLE invoices (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    invoice_id VARCHAR(50) UNIQUE,
    customer_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    services TEXT,
    status VARCHAR(50),
    total_amount DOUBLE,
    invoice_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(id) ON DELETE CASCADE
);

-- PAYMENTS TABLE
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    invoice_id BIGINT NOT NULL,
    amount DOUBLE NOT NULL,
    method VARCHAR(50),
    payment_date DATE NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- Insert sample admin user
INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@example.com', 'admin123', 'ADMIN');

-- Insert sample garage owner
INSERT INTO users (name, email, password, role)
VALUES ('Garage Owner', 'owner@example.com', 'owner123', 'GARAGE_OWNER');

INSERT INTO customers (name, phone, address)
VALUES ('John Doe', '9999999999', 'Pune');
