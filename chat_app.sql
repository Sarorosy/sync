-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 22, 2025 at 08:20 AM
-- Server version: 8.0.40
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `sender` varchar(255) NOT NULL,
  `receiver` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender`, `receiver`, `message`, `created_at`) VALUES
(1, 'user1', 'user2', 'Test', '2025-01-02 06:26:12'),
(2, 'user1', 'user2', 'hii', '2025-01-02 06:26:15'),
(3, 'user1', 'user2', 'Hello', '2025-01-02 06:26:21'),
(4, 'user1', 'user2', 'gbb', '2025-01-02 06:26:57'),
(5, 'user1', 'user2', 'Test', '2025-01-02 06:29:17'),
(6, 'user1', 'user2', 'hiii', '2025-01-02 06:31:15'),
(7, 'user1', 'user2', 'Hello', '2025-01-02 06:31:20'),
(8, 'user1', 'user2', 'hmm hmm', '2025-01-02 06:32:19'),
(9, 'user1', 'user2', 'ok', '2025-01-02 06:32:22'),
(10, 'user1', 'user2', 'done', '2025-01-02 06:33:37'),
(11, 'user1', 'user2', 'Sathish', '2025-01-02 06:35:58'),
(12, 'user1', 'user2', 'Saro', '2025-01-02 06:36:04'),
(13, 'user1', 'user2', 'hey', '2025-02-14 11:25:10'),
(14, 'user1', 'user2', 'test', '2025-02-14 11:26:05'),
(15, 'user1', 'user2', 'Arjun', '2025-03-03 09:18:07'),
(16, 'user1', 'user2', 'test', '2025-03-18 11:36:46');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_comments`
--

CREATE TABLE `tbl_comments` (
  `id` int NOT NULL,
  `task_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment` text COLLATE utf8mb4_bin NOT NULL,
  `islog` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `tbl_comments`
--

INSERT INTO `tbl_comments` (`id`, `task_id`, `user_id`, `comment`, `islog`, `created_at`) VALUES
(1, 3, 1, '<p><span data-mention-id=\"1\" data-mention-name=\"saravanan\" data-mention-email=\"codersaro12@gmail.com\" class=\"prosemirror-mention-node\">@saravanan</span>&nbsp;Test&nbsp;</p>', 0, '2025-03-20 12:43:29'),
(2, 3, 1, '<p>Test <span data-mention-id=\"21\" data-mention-name=\"Kavin Priya\" data-mention-email=\"kavinpriyagmail.com\" class=\"prosemirror-mention-node\">@Kavin Priya</span></p>', 0, '2025-03-20 13:01:59'),
(3, 3, 1, '<p><span data-mention-id=\"20\" data-mention-name=\"Deva\" data-mention-email=\"deva@gmail.com\" class=\"prosemirror-mention-node\">@Deva</span>&nbsp;Pls work on this&nbsp;</p>', 0, '2025-03-21 04:20:25'),
(4, 2, 1, '<p><span data-mention-id=\"20\" data-mention-name=\"Deva\" data-mention-email=\"deva@gmail.com\" class=\"prosemirror-mention-node\">@Deva</span>&nbsp;Check this kindly , fix design issues</p>', 0, '2025-03-21 04:29:45'),
(5, 3, 1, '<p><div class=\"imagePluginRoot\" imageplugin-align=\"center\" imageplugin-width=\"0\" imageplugin-height=\"0\" imageplugin-maxwidth=\"548\" imageplugin-src=\"https://img.uxwing.com/wp-content/themes/uxwing/download/hand-gestures/good-icon.png\" imageplugin-alt=\"Image\"></div></p>', 0, '2025-03-21 04:34:47'),
(6, 3, 1, '<p></p>', 0, '2025-03-21 04:40:06'),
(7, 3, 1, '<p><div class=\"imagePluginRoot\" imageplugin-align=\"center\" imageplugin-width=\"308\" imageplugin-height=\"182\" imageplugin-maxwidth=\"548\" imageplugin-src=\"blob:http://localhost:3001/43736d56-3344-4104-8938-763dfd6bec0a\" imageplugin-alt=\"Image\"></div></p>', 0, '2025-03-21 04:41:22'),
(8, 3, 1, '<p><span data-mention-id=\"20\" data-mention-name=\"Deva\" data-mention-email=\"deva@gmail.com\" class=\"prosemirror-mention-node\">@Deva</span>&nbsp;hii</p>', 0, '2025-03-21 05:27:19'),
(9, 3, 1, '<p><span data-mention-id=\"20\" data-mention-name=\"Deva\" data-mention-email=\"deva@gmail.com\" class=\"prosemirror-mention-node\">@Deva</span>&nbsp;hii&nbsp;<div class=\"imagePluginRoot\" imageplugin-align=\"center\" imageplugin-width=\"373\" imageplugin-height=\"218\" imageplugin-maxwidth=\"548\" imageplugin-src=\"http://localhost:5000/uploads/commentuploads/1742534940272.png\" imageplugin-alt=\"Image\"></div></p>', 0, '2025-03-21 05:29:04'),
(10, 3, 1, '<p><span data-mention-id=\"20\" data-mention-name=\"Deva\" data-mention-email=\"deva@gmail.com\" class=\"prosemirror-mention-node\">@Deva</span>&nbsp;hii&nbsp;<div class=\"imagePluginRoot\" imageplugin-align=\"center\" imageplugin-width=\"373\" imageplugin-height=\"218\" imageplugin-maxwidth=\"548\" imageplugin-src=\"http://localhost:5000/uploads/commentuploads/1742534940272.png\" imageplugin-alt=\"Image\"></div></p>', 0, '2025-03-21 05:31:11'),
(11, 3, 1, '<p><span data-mention-id=\"2\" data-mention-name=\"Purushoth\" data-mention-email=\"purushoth@gmail.com\" class=\"prosemirror-mention-node\">@Purushoth</span>&nbsp;kindly check this</p><p></p>', 0, '2025-03-21 06:18:32'),
(12, 3, 1, '<p>😂 Hello&nbsp;😄</p>', 0, '2025-03-21 11:21:58'),
(13, 3, 1, '<p>🫠 Hello</p>', 0, '2025-03-21 11:23:14'),
(22, 4, 1, '<p><span data-mention-id=\"2\" data-mention-name=\"Purushoth\" data-mention-email=\"purushoth@gmail.com\" class=\"prosemirror-mention-node\">@Purushoth</span>&nbsp;Test</p>', 0, '2025-03-21 12:18:22'),
(23, 2, 1, '<p><span data-mention-id=\"21\" data-mention-name=\"Kavin Priya\" data-mention-email=\"kavinpriyagmail.com\" class=\"prosemirror-mention-node\">@Kavin Priya</span>&nbsp;Kindly share the ETA</p>', 0, '2025-03-21 13:02:48'),
(24, 3, 1, '<p><span data-mention-id=\"20\" data-mention-name=\"Deva\" data-mention-email=\"deva@gmail.com\" class=\"prosemirror-mention-node\">@Deva</span>&nbsp;Test</p>', 0, '2025-03-22 07:03:28'),
(25, 3, 1, '<p><span data-mention-id=\"20\" data-mention-name=\"Deva\" data-mention-email=\"deva@gmail.com\" class=\"prosemirror-mention-node\">@Deva</span>&nbsp;Testttt</p>', 0, '2025-03-22 07:04:54'),
(26, 3, 1, '<p><span data-mention-id=\"21\" data-mention-name=\"Kavin Priya\" data-mention-email=\"kavinpriyagmail.com\" class=\"prosemirror-mention-node\">@Kavin Priya</span>&nbsp; Test&nbsp;</p>', 0, '2025-03-22 07:06:59'),
(27, 3, 1, '<p><span data-mention-id=\"2\" data-mention-name=\"Purushoth\" data-mention-email=\"purushoth@gmail.com\" class=\"prosemirror-mention-node\">@Purushoth</span>&nbsp;Hello</p>', 0, '2025-03-22 07:11:59'),
(28, 4, 1, 'Edited task title', 1, '2025-03-22 07:18:47'),
(29, 4, 1, 'Edited task title', 1, '2025-03-22 07:18:48'),
(30, 4, 1, 'Edited task title', 1, '2025-03-22 07:18:48'),
(31, 4, 1, 'Edited task title', 1, '2025-03-22 07:18:48'),
(32, 4, 1, 'Edited task title', 1, '2025-03-22 07:18:48'),
(33, 4, 1, 'Edited task title', 1, '2025-03-22 07:18:48');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_tasks`
--

CREATE TABLE `tbl_tasks` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `assigned_to` int DEFAULT NULL,
  `followers` text,
  `status` varchar(50) DEFAULT 'pending',
  `priority` varchar(50) DEFAULT 'medium',
  `due_date` date DEFAULT NULL,
  `due_time` time DEFAULT NULL,
  `image_url` text,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_tasks`
--

INSERT INTO `tbl_tasks` (`id`, `title`, `description`, `assigned_to`, `followers`, `status`, `priority`, `due_date`, `due_time`, `image_url`, `created_by`, `created_at`, `updated_at`) VALUES
(2, '99 CRM inReact', '{\"time\":1742627907035,\"blocks\":[{\"id\":\"Qv2IVow5du\",\"type\":\"header\",\"data\":{\"text\":\"<b>Test Need to create Full Implementation from Scratch of 99crm</b>\",\"level\":1}},{\"id\":\"UcouecwVyV\",\"type\":\"image\",\"data\":{\"caption\":\"\",\"withBorder\":false,\"withBackground\":false,\"stretched\":false,\"file\":{\"url\":\"http://localhost:5000/uploads/taskuploads/1742358451617.png\"}}}],\"version\":\"2.31.0-rc.7\"}', 1, '', 'pending', 'medium', '2025-03-19', '19:00:00', NULL, 1, '2025-03-19 04:31:24', '2025-03-22 07:18:27'),
(3, '99 CRM Full Website Implementation in React', '{\"time\":1742627907370,\"blocks\":[{\"id\":\"Qv2IVow5du\",\"type\":\"header\",\"data\":{\"text\":\"<b>Test Need to create Full Implementation from Scratch of 99crm</b>\",\"level\":1}},{\"id\":\"UcouecwVyV\",\"type\":\"image\",\"data\":{\"caption\":\"\",\"withBorder\":false,\"withBackground\":false,\"stretched\":false,\"file\":{\"url\":\"http://localhost:5000/uploads/taskuploads/1742358451617.png\"}}}],\"version\":\"2.31.0-rc.7\"}', 1, '', 'pending', 'medium', '2025-03-19', '19:00:00', NULL, 1, '2025-03-19 04:31:48', '2025-03-22 07:18:27'),
(4, 'Test', '{\"time\":1742628039294,\"blocks\":[{\"id\":\"Qv2IVow5du\",\"type\":\"header\",\"data\":{\"text\":\"<b>Need to create Full Implementation from Scratch of 99crm</b>\",\"level\":1}},{\"id\":\"UcouecwVyV\",\"type\":\"image\",\"data\":{\"caption\":\"\",\"withBorder\":false,\"withBackground\":false,\"stretched\":false,\"file\":{\"url\":\"http://localhost:5000/uploads/taskuploads/1742358451617.png\"}}}],\"version\":\"2.31.0-rc.7\"}', 1, '', 'pending', 'medium', '2025-03-19', '12:00:00', NULL, 1, '2025-03-19 08:39:45', '2025-03-22 07:20:40');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` text NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `admin_type` enum('user','admin') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `name`, `email`, `password`, `token`, `profile_pic`, `created_at`, `admin_type`) VALUES
(1, 'saravanan', 'codersaro12@gmail.com', 'sarorosy', '942296d039fa91ce1dc81b103a762167', NULL, '2025-01-02 05:05:18', 'user'),
(2, 'Purushoth', 'purushoth@gmail.com', 'sarorosy', '8d770d287c2fac12f9ec73bef4b37d3a', NULL, '2025-01-02 05:05:18', 'user'),
(20, 'Deva', 'deva@gmail.com', 'sarorosy', '8be209f681dba9f3e6dcf222dc6a46f3', NULL, '2025-01-02 05:05:18', 'user'),
(21, 'Kavin Priya', 'kavinpriyagmail.com', 'sarorosy', '8be209f681dba9f3e6dcf222dc6a46f3', NULL, '2025-01-02 05:05:18', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_comments`
--
ALTER TABLE `tbl_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbl_tasks`
--
ALTER TABLE `tbl_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tbl_comments`
--
ALTER TABLE `tbl_comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `tbl_tasks`
--
ALTER TABLE `tbl_tasks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_comments`
--
ALTER TABLE `tbl_comments`
  ADD CONSTRAINT `tbl_comments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tbl_tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tbl_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_tasks`
--
ALTER TABLE `tbl_tasks`
  ADD CONSTRAINT `tbl_tasks_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `tbl_users` (`id`),
  ADD CONSTRAINT `tbl_tasks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `tbl_users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
