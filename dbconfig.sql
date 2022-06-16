-- phpMyAdmin SQL Dump
-- version 5.0.4deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 16. Jun 2022 um 20:08
-- Server-Version: 10.5.15-MariaDB-0+deb11u1
-- PHP-Version: 7.4.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Datenbank: `dpsgapp`
--
CREATE DATABASE IF NOT EXISTS `dpsgapp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `dpsgapp`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `drink`
--

DROP TABLE IF EXISTS `drink`;
CREATE TABLE `drink` (
  `id` int(11) NOT NULL,
  `cost` double NOT NULL,
  `name` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONEN DER TABELLE `drink`:
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `inventory`
--

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `userCreatedId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONEN DER TABELLE `inventory`:
--   `userCreatedId`
--       `user` -> `id`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `inventoryDrink`
--

DROP TABLE IF EXISTS `inventoryDrink`;
CREATE TABLE `inventoryDrink` (
  `drinkId` int(11) NOT NULL,
  `inventoryId` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONEN DER TABELLE `inventoryDrink`:
--   `drinkId`
--       `drink` -> `id`
--   `inventoryId`
--       `inventory` -> `id`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `payment`
--

DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `value` double NOT NULL,
  `balanceAfter` double NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONEN DER TABELLE `payment`:
--   `userId`
--       `user` -> `id`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `permission`
--

DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONEN DER TABELLE `permission`:
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `purchase`
--

DROP TABLE IF EXISTS `purchase`;
CREATE TABLE `purchase` (
  `id` int(11) NOT NULL,
  `drinkId` int(11) NOT NULL,
  `trinkitaetId` int(11) NOT NULL,
  `inventoryId` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `cost` double NOT NULL,
  `balanceAfter` double NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONEN DER TABELLE `purchase`:
--   `drinkId`
--       `drink` -> `id`
--   `inventoryId`
--       `inventory` -> `id`
--   `trinkitaetId`
--       `trinkitaet` -> `id`
--   `userId`
--       `user` -> `id`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `trinkitaet`
--

DROP TABLE IF EXISTS `trinkitaet`;
CREATE TABLE `trinkitaet` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `drinksRemoved` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `userCreatedId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONEN DER TABELLE `trinkitaet`:
--   `userCreatedId`
--       `user` -> `id`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `userRoleId` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `balance` double NOT NULL DEFAULT 0,
  `weight` double NOT NULL,
  `gender` varchar(1) NOT NULL,
  `registered` datetime NOT NULL DEFAULT current_timestamp(),
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONEN DER TABELLE `user`:
--   `userRoleId`
--       `userRole` -> `id`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `userRole`
--

DROP TABLE IF EXISTS `userRole`;
CREATE TABLE `userRole` (
  `id` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL,
  `description` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONEN DER TABELLE `userRole`:
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `userRole_permission`
--

DROP TABLE IF EXISTS `userRole_permission`;
CREATE TABLE `userRole_permission` (
  `userRoleId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONEN DER TABELLE `userRole_permission`:
--   `permissionId`
--       `permission` -> `id`
--   `userRoleId`
--       `userRole` -> `id`
--

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `drink`
--
ALTER TABLE `drink`
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
  ADD PRIMARY KEY (`drinkId`,`inventoryId`),
  ADD KEY `inventoryDrink_inventoryId` (`inventoryId`);

--
-- Indizes für die Tabelle `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_userId` (`userId`);

--
-- Indizes für die Tabelle `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_drinkId` (`drinkId`),
  ADD KEY `purchase_trinkitaetId` (`trinkitaetId`),
  ADD KEY `purchase_inventoryId` (`inventoryId`),
  ADD KEY `purchase_userId` (`userId`);

--
-- Indizes für die Tabelle `trinkitaet`
--
ALTER TABLE `trinkitaet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trinkitaet_userCreatedId` (`userCreatedId`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_userRoleId` (`userRoleId`);

--
-- Indizes für die Tabelle `userRole`
--
ALTER TABLE `userRole`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `userRole_permission`
--
ALTER TABLE `userRole_permission`
  ADD UNIQUE KEY `userRoleId` (`userRoleId`,`permissionId`),
  ADD KEY `userRole_permission_permissionId` (`permissionId`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `drink`
--
ALTER TABLE `drink`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `permission`
--
ALTER TABLE `permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `purchase`
--
ALTER TABLE `purchase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `trinkitaet`
--
ALTER TABLE `trinkitaet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `userRole`
--
ALTER TABLE `userRole`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_userCreatedId` FOREIGN KEY (`userCreatedId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `inventoryDrink`
--
ALTER TABLE `inventoryDrink`
  ADD CONSTRAINT `inventoryDrink_drinkId` FOREIGN KEY (`drinkId`) REFERENCES `drink` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inventoryDrink_inventoryId` FOREIGN KEY (`inventoryId`) REFERENCES `inventory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `purchase`
--
ALTER TABLE `purchase`
  ADD CONSTRAINT `purchase_drinkId` FOREIGN KEY (`drinkId`) REFERENCES `drink` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_inventoryId` FOREIGN KEY (`inventoryId`) REFERENCES `inventory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_trinkitaetId` FOREIGN KEY (`trinkitaetId`) REFERENCES `trinkitaet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `trinkitaet`
--
ALTER TABLE `trinkitaet`
  ADD CONSTRAINT `trinkitaet_userCreatedId` FOREIGN KEY (`userCreatedId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_userRoleId` FOREIGN KEY (`userRoleId`) REFERENCES `userRole` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `userRole_permission`
--
ALTER TABLE `userRole_permission`
  ADD CONSTRAINT `userRole_permission_permissionId` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userRole_permission_userRoleId` FOREIGN KEY (`userRoleId`) REFERENCES `userRole` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;