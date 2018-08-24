/*Those are the statements to create the tables of the used DB*/

CREATE TABLE `users` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `faName` varchar(45) NOT NULL,
  `fiName` varchar(45) NOT NULL,
  `pseudo` varchar(50) DEFAULT NULL,
  `email` varchar(70) NOT NULL,
  `password` varchar(128) NOT NULL,
  `inscriptionDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `balance` float(6,2) NOT NULL DEFAULT '0.00',
  `adherent` tinyint(4) NOT NULL DEFAULT '0',
  `admin` tinyint(4) NOT NULL DEFAULT '0',
  `superadmin` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


CREATE TABLE `items` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(70) NOT NULL,
  `price` float unsigned NOT NULL DEFAULT '0',
  `stock` smallint(5) unsigned NOT NULL DEFAULT '0',
  `onSale` tinyint(4) NOT NULL DEFAULT '1',
  `nOrders` mediumint(9) unsigned NOT NULL DEFAULT '0',
  `totalIncome` int(10) unsigned NOT NULL DEFAULT '0',
  `deleted` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

CREATE TABLE `orders` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `customerId` smallint(5) unsigned DEFAULT '0',
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `price` float unsigned NOT NULL,
  `content` text NOT NULL,
  `pending` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `shoppingList` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*Placeholder entries insertion commands*/
