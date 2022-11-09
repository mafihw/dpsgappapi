-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Erstellungszeit: 09. Nov 2022 um 15:45
-- Server-Version: 10.9.3-MariaDB-1:10.9.3+maria~ubu2204
-- PHP-Version: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `dpsgapp`
--
CREATE DATABASE IF NOT EXISTS `dpsgapp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `dpsgapp`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `drinks`
--

CREATE TABLE `drinks` (
  `id` int(11) NOT NULL,
  `cost` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `userCreatedId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `inventoryDrink`
--

CREATE TABLE `inventoryDrink` (
  `id` int(11) NOT NULL,
  `drinkId` int(11) NOT NULL,
  `userCreatedId` varchar(255) NOT NULL,
  `amountActual` int(11) NOT NULL,
  `amountCalculated` int(11) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `newDrinks`
--

CREATE TABLE `newDrinks` (
  `id` int(11) NOT NULL,
  `drinkId` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `userCreatedId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `value` int(11) NOT NULL,
  `balanceAfter` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `permissions`
--

CREATE TABLE `permissions` (
  `id` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `drinkId` int(11) NOT NULL,
  `trinkitaetId` int(11) DEFAULT NULL,
  `inventoryId` int(11) DEFAULT NULL,
  `userId` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `cost` int(11) NOT NULL,
  `balanceAfter` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `roles`
--

CREATE TABLE `roles` (
  `id` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `role_permission`
--

CREATE TABLE `role_permission` (
  `roleId` varchar(255) NOT NULL,
  `permissionId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `trinkitaet`
--

CREATE TABLE `trinkitaet` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `drinksRemoved` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `userCreatedId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `roleId` varchar(255) NOT NULL DEFAULT 'none',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `balance` int(11) NOT NULL DEFAULT 0,
  `weight` int(11) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `registered` datetime NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `drinks`
--
ALTER TABLE `drinks`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_userCreatedId` (`userCreatedId`);

--
-- Indizes für die Tabelle `inventoryDrink`
--
ALTER TABLE `inventoryDrink`
  ADD PRIMARY KEY (`id`),
  ADD KEY `drinkId` (`drinkId`),
  ADD KEY `inventoryDrink_userCreatedId` (`userCreatedId`);

--
-- Indizes für die Tabelle `newDrinks`
--
ALTER TABLE `newDrinks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `newDrinks_ibfk_1` (`drinkId`),
  ADD KEY `newDrinks_userCreatedId` (`userCreatedId`);

--
-- Indizes für die Tabelle `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_userId` (`userId`);

--
-- Indizes für die Tabelle `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_drinkId` (`drinkId`),
  ADD KEY `purchase_trinkitaetId` (`trinkitaetId`),
  ADD KEY `purchase_inventoryId` (`inventoryId`),
  ADD KEY `purchase_userId` (`userId`);

--
-- Indizes für die Tabelle `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `role_permission`
--
ALTER TABLE `role_permission`
  ADD UNIQUE KEY `userRoleId` (`roleId`,`permissionId`),
  ADD KEY `role_permission_permissionId` (`permissionId`);

--
-- Indizes für die Tabelle `trinkitaet`
--
ALTER TABLE `trinkitaet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trinkitaet_userCreatedId` (`userCreatedId`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_roleId` (`roleId`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `drinks`
--
ALTER TABLE `drinks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `inventoryDrink`
--
ALTER TABLE `inventoryDrink`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `newDrinks`
--
ALTER TABLE `newDrinks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `trinkitaet`
--
ALTER TABLE `trinkitaet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_userCreatedId` FOREIGN KEY (`userCreatedId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `inventoryDrink`
--
ALTER TABLE `inventoryDrink`
  ADD CONSTRAINT `inventoryDrink_drinkId` FOREIGN KEY (`drinkId`) REFERENCES `drinks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inventoryDrink_userCreatedId` FOREIGN KEY (`userCreatedId`) REFERENCES `users` (`id`);

--
-- Constraints der Tabelle `newDrinks`
--
ALTER TABLE `newDrinks`
  ADD CONSTRAINT `newDrinks_ibfk_1` FOREIGN KEY (`drinkId`) REFERENCES `drinks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `newDrinks_userCreatedId` FOREIGN KEY (`userCreatedId`) REFERENCES `users` (`id`);

--
-- Constraints der Tabelle `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payment_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchase_drinkId` FOREIGN KEY (`drinkId`) REFERENCES `drinks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_inventoryId` FOREIGN KEY (`inventoryId`) REFERENCES `inventory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_trinkitaetId` FOREIGN KEY (`trinkitaetId`) REFERENCES `trinkitaet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `role_permission`
--
ALTER TABLE `role_permission`
  ADD CONSTRAINT `role_permission_permissionId` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `role_permission_roleId` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `trinkitaet`
--
ALTER TABLE `trinkitaet`
  ADD CONSTRAINT `trinkitaet_userCreatedId` FOREIGN KEY (`userCreatedId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `user_roleId` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
