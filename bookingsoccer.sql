-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 04, 2025 lúc 12:31 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `bookingsoccer`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `pitch_id` int(11) NOT NULL,
  `time_slot_id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_status` enum('pending','completed') DEFAULT 'pending',
  `payment_date` timestamp NULL DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `pitch_id`, `time_slot_id`, `booking_date`, `status`, `created_at`, `payment_status`, `payment_date`, `total_price`) VALUES
(73, 15, 3, 3, '2025-06-05', 'confirmed', '2025-06-04 10:22:05', 'completed', NULL, 200000.00),
(74, 15, 3, 7, '2025-06-05', 'cancelled', '2025-06-04 10:22:05', 'pending', NULL, 200000.00),
(75, 15, 3, 7, '2025-06-06', 'cancelled', '2025-06-04 10:27:28', 'pending', NULL, 200000.00),
(76, 15, 3, 1, '2025-06-06', 'confirmed', '2025-06-04 10:27:28', 'completed', NULL, 200000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `comment` text NOT NULL,
  `rating` int(1) NOT NULL CHECK (`rating` between 1 and 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `username`, `comment`, `rating`, `created_at`) VALUES
(2, 1, 'Tùng', 'tốt', 5, '2025-06-03 11:48:29'),
(5, 3, 'Nguyễn Việt Anh', 'aaaaaaaaaaaaaaaa', 5, '2025-06-04 04:57:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `owners`
--

CREATE TABLE `owners` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `owners`
--

INSERT INTO `owners` (`id`, `name`, `email`, `password`, `phone`, `created_at`) VALUES
(1, 'Nguyen Van A', 'nva@example.com', '012345678', '0123456789', '2025-05-23 03:53:29'),
(2, 'Tran Thi B', 'ttb@example.com', '78945612', '22222222', '2025-05-23 03:53:29'),
(3, 'Le Van C', 'lvc@example.com', '21345678', '0987654321', '2025-05-23 03:53:29');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `pitches`
--

CREATE TABLE `pitches` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `location` varchar(255) NOT NULL,
  `price_per_hour` decimal(10,2) NOT NULL,
  `pitch_type_id` int(11) DEFAULT NULL,
  `status` enum('available','maintenance') DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `pitches`
--

INSERT INTO `pitches` (`id`, `owner_id`, `name`, `location`, `price_per_hour`, `pitch_type_id`, `status`, `created_at`, `avatar`) VALUES
(2, 2, 'Sân B2', '456 Đường Lê Lợi, TP. HCM', 250000.00, 2, 'maintenance', '2025-05-23 09:40:55', 'https://img5.thuthuatphanmem.vn/uploads/2021/07/09/hinh-nen-san-van-dong-cup-c1_025305307.jpg'),
(3, 3, 'Sân C3', '789 Đường Nguyễn Huệ, Đà Nẵng', 200000.00, 1, 'available', '2025-05-23 09:40:55', 'https://img5.thuthuatphanmem.vn/uploads/2021/12/11/hinh-anh-san-co-bong-da-tuyet-dep_101436722.jpg'),
(4, 1, 'Sân A', '123 Đường ABC, Quận 1, TP.HCM', 2000000.00, 2, 'available', '2025-05-24 03:00:59', 'https://img5.thuthuatphanmem.vn/uploads/2021/12/11/hinh-anh-san-co-bong-da_101641924.jpg'),
(5, 2, 'Sân B', '456 Đường XYZ, Quận 3, TP.HCM', 250000.00, 2, 'maintenance', '2025-05-24 03:00:59', 'https://img.lovepik.com/photo/40017/8904.jpg_wh860.jpg'),
(6, 1, 'Sân bóng Xuân Hồng', '123 Nguyễn Văn Cừ, Quận 5', 200000.00, 3, 'maintenance', '2025-05-24 14:48:36', 'https://co-nhan-tao.com/wp-content/uploads/2020/03/san-co-nhan-tao-7-1024x768.jpg'),
(7, 1, 'Sân bóng Hàng Đẫy', 'Hà Nội', 112000.00, 3, 'available', '2025-06-01 09:27:17', 'https://img5.thuthuatphanmem.vn/uploads/2021/12/11/hinh-anh-san-co-bong-da-nhan-tao_101640721.jpeg'),
(8, 1, 'Sân bóng Mỹ ', 'đường Lê Quang ', 11000000.00, 2, 'maintenance', '2025-06-03 12:17:31', 'https://image.sggp.org.vn/1200x630/Uploaded/2023/duaeymdrei/2023_01_08/cn6-1a-svd-my-dinh-5464.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `pitch_reviews`
--

CREATE TABLE `pitch_reviews` (
  `id` int(11) NOT NULL,
  `pitch_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `pitch_reviews`
--

INSERT INTO `pitch_reviews` (`id`, `pitch_id`, `user_id`, `rating`, `comment`, `created_at`) VALUES
(1, 2, 2, 3, 'Sân ổn nhưng cần cải thiện hệ thống đèn chiếu sáng.', '2025-06-02 14:20:39'),
(2, 2, 3, 5, 'Sân ổn nhưng cần cải thiện hệ thống đèn chiếu sáng.', '2025-06-03 03:44:09'),
(42, 2, 1, 4, 'eeeeeeeeeee', '2025-06-03 04:07:19'),
(43, 2, 14, 5, 'tốt', '2025-06-03 04:14:20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `time_slots`
--

CREATE TABLE `time_slots` (
  `id` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `time_slots`
--

INSERT INTO `time_slots` (`id`, `start_time`, `end_time`) VALUES
(1, '14:00:00', '15:30:00'),
(2, '15:30:00', '17:00:00'),
(3, '17:00:00', '18:30:00'),
(4, '18:30:00', '20:00:00'),
(5, '20:00:00', '21:30:00'),
(6, '21:30:00', '23:00:00'),
(7, '06:00:00', '07:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT 'male',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `avatar` varchar(255) DEFAULT NULL,
  `introduce` text DEFAULT NULL,
  `background` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `gender`, `created_at`, `avatar`, `introduce`, `background`) VALUES
(1, 'Nguyễn Văn D', 'nguyenvand@example.com', '12345678', '0987654321', 'male', '2025-05-23 02:24:32', NULL, NULL, NULL),
(2, 'Nguyễn Văn D', 'nguyenvane@example.com', '12345678', '0987654321', 'male', '2025-05-23 02:24:54', NULL, NULL, NULL),
(3, 'Nguyễn', 'vietanh221105@example.com', '12346678', '0376125555', 'female', '2025-05-23 03:02:54', 'http://thuthuatphanmem.vn/uploads/2018/05/18/hinh-nen-may-tinh-hd-hoa-hai-dep_024422439.jpg', '', 'http://thuthuatphanmem.vn/uploads/2018/05/18/hinh-nen-may-tinh-hd-hoa-hai-dep_024422439.jpg'),
(10, 'Nguyen Van A', 'nguyenvana@example.com', '12345678', '0901234567', 'male', '2025-05-24 08:13:05', NULL, NULL, NULL),
(13, 'Nguyễn Việt Anh', 'admin@example.com', '012345678', '0376125660', 'male', '2025-05-25 04:45:02', NULL, NULL, NULL),
(14, 'Việt Anh', 'c@gmail.com', '12345678', '0376125660', 'male', '2025-06-01 03:15:22', NULL, NULL, NULL),
(15, 'Việt Anh', 'a26489006@gmail.com', '22112005', '0376125660', 'male', '2025-06-03 15:18:25', 'https://img.meta.com.vn/Data/image/2022/06/06/anh-chill-15.jpg', 'cuộc đời là môt chuyến đi', 'https://khoinguonsangtao.vn/wp-content/uploads/2021/12/hinh-nen-may-tinh.jpg');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pitch_id` (`pitch_id`,`booking_date`,`time_slot_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `time_slot_id` (`time_slot_id`);

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `owners`
--
ALTER TABLE `owners`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `pitches`
--
ALTER TABLE `pitches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Chỉ mục cho bảng `pitch_reviews`
--
ALTER TABLE `pitch_reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pitch_id` (`pitch_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `time_slots`
--
ALTER TABLE `time_slots`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `owners`
--
ALTER TABLE `owners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `pitches`
--
ALTER TABLE `pitches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `pitch_reviews`
--
ALTER TABLE `pitch_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT cho bảng `time_slots`
--
ALTER TABLE `time_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`pitch_id`) REFERENCES `pitches` (`id`),
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`time_slot_id`) REFERENCES `time_slots` (`id`);

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `pitches`
--
ALTER TABLE `pitches`
  ADD CONSTRAINT `pitches_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `owners` (`id`);

--
-- Các ràng buộc cho bảng `pitch_reviews`
--
ALTER TABLE `pitch_reviews`
  ADD CONSTRAINT `pitch_reviews_ibfk_1` FOREIGN KEY (`pitch_id`) REFERENCES `pitches` (`id`),
  ADD CONSTRAINT `pitch_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
