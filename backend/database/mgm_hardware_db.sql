-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 14, 2026 at 03:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mgm_hardware_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `description`) VALUES
(1, 'Power Tools', 'Electric and cordless power tools'),
(2, 'Hand Tools', 'Manual tools for construction and repair'),
(3, 'Fasteners', 'Nails, screws, bolts and related items'),
(4, 'Electrical', 'Electrical hardware and accessories'),
(5, 'Plumbing', 'Plumbing tools and materials'),
(6, 'Safety Equipment', 'Personal protective equipment'),
(7, 'Paint Supplies', 'Painting tools and accessories'),
(8, 'Construction Materials', 'General construction hardware'),
(9, 'Measuring Tools', 'Tools used for measurement'),
(10, 'Garden Tools', 'Tools and equipment for gardening');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `customer_name` varchar(150) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `customer_name`, `contact_person`, `phone`, `email`, `address`) VALUES
(1, 'Cebu Builders Inc.', 'Robert Lim', '09181111111', 'robert@cebubuilders.com', 'Cebu City'),
(2, 'Mandaue Construction', 'Kevin Tan', '09182222222', 'kevin@mandaueconstruction.com', 'Mandaue City'),
(3, 'ABC Renovation Services', 'Michael Go', '09183333333', 'michael@abcrenovation.com', 'Lapu-Lapu City'),
(4, 'HomePro Contractors', 'Steven Lee', '09184444444', 'steven@homepro.com', 'Cebu City'),
(5, 'Island Renovators', 'Paul Wong', '09185555555', 'paul@islandrenovators.com', 'Talisay City'),
(6, 'Cebu Electric Works', 'Andrew Lim', '09186666666', 'andrew@cebuelectric.com', 'Cebu City'),
(7, 'BuildRight Services', 'James Tan', '09187777777', 'james@buildright.com', 'Mandaue City'),
(8, 'Prime Home Builders', 'William Yu', '09188888888', 'william@primehome.com', 'Cebu City'),
(9, 'Modern Construction Co.', 'Edward Chua', '09189999999', 'edward@modernconstruction.com', 'Lapu-Lapu City'),
(10, 'City Maintenance Services', 'George Ong', '09180000000', 'george@citymaintenance.com', 'Cebu City');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `position` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employee_id`, `first_name`, `last_name`, `position`, `department`, `phone`, `email`) VALUES
(1, 'John', 'Dela Cruz', 'Manager', 'Management', '09170000001', 'john@smhardware.com'),
(2, 'Maria', 'Santos', 'Sales Clerk', 'Sales', '09170000002', 'maria@smhardware.com'),
(3, 'Pedro', 'Garcia', 'Warehouse Staff', 'Warehouse', '09170000003', 'pedro@smhardware.com'),
(4, 'Ana', 'Reyes', 'Cashier', 'Finance', '09170000004', 'ana@smhardware.com'),
(5, 'Jose', 'Ramos', 'Sales Clerk', 'Sales', '09170000005', 'jose@smhardware.com'),
(6, 'Carlo', 'Cruz', 'Inventory Clerk', 'Warehouse', '09170000006', 'carlo@smhardware.com'),
(7, 'Liza', 'Torres', 'Accountant', 'Finance', '09170000007', 'liza@smhardware.com'),
(8, 'Mark', 'Villanueva', 'Warehouse Supervisor', 'Warehouse', '09170000008', 'mark@smhardware.com'),
(9, 'Rosa', 'Mendoza', 'Sales Clerk', 'Sales', '09170000009', 'rosa@smhardware.com'),
(10, 'Daniel', 'Flores', 'Administrator', 'Management', '09170000010', 'daniel@smhardware.com');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_code` varchar(30) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `category_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `reorder_level` int(11) DEFAULT 5
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_code`, `product_name`, `category_id`, `supplier_id`, `unit_price`, `stock_quantity`, `reorder_level`) VALUES
(1, 'PT-001', 'Cordless Drill 18V', 1, 1, 4500.00, 23, 5),
(2, 'PT-002', 'Angle Grinder 4 inch', 1, 2, 3200.00, 18, 5),
(3, 'HT-001', 'Claw Hammer 16oz', 2, 3, 650.00, 40, 10),
(4, 'HT-002', 'Adjustable Wrench 10 inch', 2, 5, 550.00, 35, 10),
(5, 'FS-001', 'Wood Screws 2 inch', 3, 6, 180.00, 100, 20),
(6, 'EL-001', 'Electrical Tape', 4, 4, 75.00, 80, 20),
(7, 'PL-001', 'PVC Pipe Cutter', 5, 7, 850.00, 19, 5),
(8, 'SE-001', 'Safety Helmet', 6, 8, 350.00, 50, 10),
(9, 'MS-001', 'Digital Measuring Tape', 9, 9, 1200.00, 15, 5),
(10, 'GT-001', 'Garden Shovel', 10, 10, 950.00, 25, 5);

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `purchase_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `purchase_date` date NOT NULL,
  `total_amount` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`purchase_id`, `supplier_id`, `employee_id`, `purchase_date`, `total_amount`) VALUES
(1, 1, 3, '2026-01-05', 45000.00),
(2, 2, 6, '2026-01-12', 32000.00),
(3, 3, 3, '2026-01-20', 13000.00),
(4, 4, 6, '2026-02-02', 7500.00),
(5, 5, 3, '2026-02-10', 11000.00),
(6, 6, 8, '2026-02-18', 9000.00),
(7, 7, 6, '2026-03-01', 8500.00),
(8, 8, 3, '2026-03-10', 7000.00),
(9, 9, 8, '2026-03-18', 12000.00),
(10, 10, 6, '2026-03-25', 9500.00);

-- --------------------------------------------------------

--
-- Table structure for table `purchase_details`
--

CREATE TABLE `purchase_details` (
  `purchase_detail_id` int(11) NOT NULL,
  `purchase_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_cost` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_details`
--

INSERT INTO `purchase_details` (`purchase_detail_id`, `purchase_id`, `product_id`, `quantity`, `unit_cost`) VALUES
(1, 1, 1, 10, 4500.00),
(2, 2, 2, 10, 3200.00),
(3, 3, 3, 20, 650.00),
(4, 4, 6, 100, 75.00),
(5, 5, 4, 20, 550.00),
(6, 6, 5, 50, 180.00),
(7, 7, 7, 10, 850.00),
(8, 8, 8, 20, 350.00),
(9, 9, 9, 10, 1200.00),
(10, 10, 10, 10, 950.00);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `sale_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `sale_date` date NOT NULL,
  `total_amount` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`sale_id`, `customer_id`, `employee_id`, `sale_date`, `total_amount`) VALUES
(1, 1, 2, '2026-04-01', 9000.00),
(2, 2, 5, '2026-04-03', 6400.00),
(3, 3, 9, '2026-04-05', 1950.00),
(4, 4, 2, '2026-04-08', 1650.00),
(5, 5, 5, '2026-04-10', 3600.00),
(6, 6, 9, '2026-04-12', 1500.00),
(7, 7, 2, '2026-04-15', 2550.00),
(8, 8, 5, '2026-04-18', 2100.00),
(9, 9, 9, '2026-04-20', 2400.00),
(10, 10, 2, '2026-04-22', 1900.00),
(11, 1, 1, '2026-09-14', 9850.00);

-- --------------------------------------------------------

--
-- Table structure for table `sale_details`
--

CREATE TABLE `sale_details` (
  `sale_detail_id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_details`
--

INSERT INTO `sale_details` (`sale_detail_id`, `sale_id`, `product_id`, `quantity`, `unit_price`) VALUES
(1, 1, 1, 2, 4500.00),
(2, 2, 2, 2, 3200.00),
(3, 3, 3, 3, 650.00),
(4, 4, 4, 3, 550.00),
(5, 5, 5, 20, 180.00),
(6, 6, 6, 20, 75.00),
(7, 7, 7, 3, 850.00),
(8, 8, 8, 6, 350.00),
(9, 9, 9, 2, 1200.00),
(10, 10, 10, 2, 950.00),
(11, 11, 1, 2, 4500.00),
(12, 11, 7, 1, 850.00);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `supplier_id` int(11) NOT NULL,
  `supplier_name` varchar(150) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`supplier_id`, `supplier_name`, `contact_person`, `phone`, `email`, `address`) VALUES
(1, 'Cebu Hardware Supply', 'Juan Santos', '09171234567', 'juan@cebuahardware.com', 'Cebu City'),
(2, 'Metro Tools Trading', 'Maria Cruz', '09181234567', 'maria@metrotools.com', 'Mandaue City'),
(3, 'BuildPro Philippines', 'Pedro Garcia', '09191234567', 'pedro@buildpro.com', 'Cebu City'),
(4, 'Prime Electrical Supply', 'Ana Reyes', '09201234567', 'ana@primeelectrical.com', 'Lapu-Lapu City'),
(5, 'Ace Construction Supply', 'Jose Ramos', '09211234567', 'jose@aceconstruction.com', 'Cebu City'),
(6, 'Reliable Hardware Inc.', 'Carlo Dela Cruz', '09221234567', 'carlo@reliablehardware.com', 'Mandaue City'),
(7, 'HomeFix Trading', 'Liza Torres', '09231234567', 'liza@homefix.com', 'Talisay City'),
(8, 'ProBuild Hardware', 'Mark Villanueva', '09241234567', 'mark@probuild.com', 'Cebu City'),
(9, 'Island Hardware Supply', 'Rosa Mendoza', '09251234567', 'rosa@islandhardware.com', 'Cebu City'),
(10, 'Central Tools Distributor', 'Daniel Flores', '09261234567', 'daniel@centraltools.com', 'Mandaue City');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `setting_id` int(11) NOT NULL,
  `setting_name` varchar(100) NOT NULL,
  `setting_value` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`setting_id`, `setting_name`, `setting_value`, `description`) VALUES
(1, 'Company Name', 'SME Hardware Management System', 'Name of the business'),
(2, 'Currency', 'PHP', 'Default system currency'),
(3, 'Low Stock Alert', 'Enabled', 'Enable notifications when stock reaches reorder level');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD UNIQUE KEY `product_code` (`product_code`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`purchase_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `purchase_details`
--
ALTER TABLE `purchase_details`
  ADD PRIMARY KEY (`purchase_detail_id`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`sale_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `sale_details`
--
ALTER TABLE `sale_details`
  ADD PRIMARY KEY (`sale_detail_id`),
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`supplier_id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`setting_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `purchase_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `purchase_details`
--
ALTER TABLE `purchase_details`
  MODIFY `purchase_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `sale_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `sale_details`
--
ALTER TABLE `sale_details`
  MODIFY `sale_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`);

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`),
  ADD CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `purchase_details`
--
ALTER TABLE `purchase_details`
  ADD CONSTRAINT `purchase_details_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`purchase_id`),
  ADD CONSTRAINT `purchase_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `sale_details`
--
ALTER TABLE `sale_details`
  ADD CONSTRAINT `sale_details_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`sale_id`),
  ADD CONSTRAINT `sale_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
