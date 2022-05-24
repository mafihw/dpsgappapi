# DPSG Gladbach APP API

## How to start the server
- install node.js
- run ```npm install express mysql nodemon```
- to start the server run ```npm run dev```

<details>
<summary>MySQL Database configuration</summary>
  
```mysql  
-- phpMyAdmin SQL Dump
-- version 5.0.4deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 23. Mai 2022 um 20:29
-- Server-Version: 10.5.15-MariaDB-0+deb11u1
-- PHP-Version: 7.4.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Datenbank: `Appdb`
--
CREATE DATABASE IF NOT EXISTS `Appdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `Appdb`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Items`
--

DROP TABLE IF EXISTS `Items`;
CREATE TABLE IF NOT EXISTS `Items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Purchases`
--

DROP TABLE IF EXISTS `Purchases`;
CREATE TABLE IF NOT EXISTS `Purchases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` varchar(255) NOT NULL,
  `itemid` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Users`
--

DROP TABLE IF EXISTS `Users`;
CREATE TABLE IF NOT EXISTS `Users` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `registered` datetime NOT NULL DEFAULT current_timestamp(),
  `last_login` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `nickname` int(255) DEFAULT NULL,
  `balance` float NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
COMMIT;
```  
</details>
