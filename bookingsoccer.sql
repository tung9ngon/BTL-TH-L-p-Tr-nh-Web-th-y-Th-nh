-- Người dùng đặt sân (khách)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chủ sân
CREATE TABLE owners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sân bóng
CREATE TABLE pitches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  price_per_hour DECIMAL(10,2) NOT NULL,
  pitch_type_id INT,
  status ENUM('available', 'maintenance') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES owners(id)
);

-- Khung giờ có thể đặt
CREATE TABLE time_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

-- Đặt sân
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  pitch_id INT NOT NULL,
  time_slot_id INT NOT NULL,
  booking_date DATE NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (pitch_id) REFERENCES pitches(id),
  FOREIGN KEY (time_slot_id) REFERENCES time_slots(id),
  UNIQUE (pitch_id, booking_date, time_slot_id) -- không cho trùng khung giờ
);
CREATE TABLE pitch_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  UNIQUE (booking_id)
);
INSERT INTO users (id, name, email, password, phone)
VALUES
(1, 'Tùng', 'pxl210801@gmail.com', '12345678', '0901234567'),
(2, 'Linh', 'linh@example.com', 'linh1234', '0902345678'),
(3, 'Minh', 'minh@example.com', 'minh1234', '0903456789');
INSERT INTO owners (id, name, email, password, phone)
VALUES
(1, 'Anh Nam', 'nam_owner@gmail.com', 'owner123', '0911111111'),
(2, 'Chị Hạnh', 'hanh_san@gmail.com', 'hanh123', '0922222222');
INSERT INTO pitches (id, owner_id, name, location, price_per_hour, pitch_type_id, status)
VALUES
(1, 1, 'Sân A1', '123 Đường ABC, Hà Nội', 200000, NULL, 'available'),
(2, 1, 'Sân A2', '123 Đường ABC, Hà Nội', 180000, NULL, 'maintenance'),
(3, 2, 'Sân B1', '456 Đường XYZ, TP.HCM', 220000, NULL, 'available');
INSERT INTO time_slots (id, start_time, end_time)
VALUES
(1, '07:00:00', '08:00:00'),
(2, '08:00:00', '09:00:00'),
(3, '09:00:00', '10:00:00');
INSERT INTO bookings (id, user_id, pitch_id, time_slot_id, booking_date, status)
VALUES
(1, 1, 1, 1, '2025-06-01', 'confirmed'),
(2, 2, 3, 2, '2025-06-01', 'pending'),
(3, 3, 1, 3, '2025-06-02', 'cancelled');
CREATE TABLE `comments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `comment` TEXT NOT NULL,
  `rating` INT(1) NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
