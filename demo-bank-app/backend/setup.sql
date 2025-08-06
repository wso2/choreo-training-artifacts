-- Banking Microservice Database Setup
-- This script creates the database schema for the banking application

-- Drop existing tables to ensure clean slate
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `bank_accounts`;

-- Create bank_accounts table
CREATE TABLE `bank_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `owner` longtext,
  `account_no` varchar(191) DEFAULT NULL,
  `bank_name` longtext,
  `balance` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uni_bank_accounts_account_no` (`account_no`)
) CHARACTER SET=utf8mb4;

-- Create transactions table
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `from_account_id` int DEFAULT NULL,
  `to_account_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `currency` longtext,
  `created_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) CHARACTER SET=utf8mb4;

-- Optional: Add some sample data for testing
-- INSERT INTO bank_accounts (user_id, owner, account_no, bank_name, balance) VALUES
-- (1, 'John Doe', '123456789', 'Bank A', 1000.00),
-- (2, 'Jane Smith', '987654321', 'Bank B', 2000.00);

-- Show tables to confirm creation
SHOW TABLES;
