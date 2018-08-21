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
  PRIMARY KEY (`id`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

CREATE TABLE `orders` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `customerId` smallint(5) unsigned NOT NULL DEFAULT '0',
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `price` float unsigned NOT NULL,
  `content` text NOT NULL,
  `pending` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*Placeholder entries insertion commands*/

INSERT INTO `users` VALUES (1,'Soursousky','Sergei','SergiSergio','Sergei','2b64f2e3f9fee1942af9ff60d40aa5a719db33b8ba8dd4864bb4f11e25ca2bee00907de32a59429602336cac832c8f2eeff5177cc14c864dd116c8bf6ca5d9a9','0000-00-00 00:00:00',24.03,1,0,0),
(2,'Calcado','Fabien','Fabinou','fabien.calcado@isty.uvsq.fr','2b64f2e3f9fee1942af9ff60d40aa5a719db33b8ba8dd4864bb4f11e25ca2bee00907de32a59429602336cac832c8f2eeff5177cc14c864dd116c8bf6ca5d9a9','2018-07-15 23:47:20',-238,0,0,0),
(3,'Pian','Jean','The Punchline Master','jean.pian@isty.uvsq.fr','2b64f2e3f9fee1942af9ff60d40aa5a719db33b8ba8dd4864bb4f11e25ca2bee00907de32a59429602336cac832c8f2eeff5177cc14c864dd116c8bf6ca5d9a9','2018-07-15 23:47:20',999.99,1,1,0),
(4,'Sadre','Maxime','Oké?','maxime.sadre@isty.uvsq.fr','2b64f2e3f9fee1942af9ff60d40aa5a719db33b8ba8dd4864bb4f11e25ca2bee00907de32a59429602336cac832c8f2eeff5177cc14c864dd116c8bf6ca5d9a9','2018-07-15 23:47:20',654.58,1,0,0),
(5,'De la Fuerte','Alberto','PurplePachyderm','Arveto','2b64f2e3f9fee1942af9ff60d40aa5a719db33b8ba8dd4864bb4f11e25ca2bee00907de32a59429602336cac832c8f2eeff5177cc14c864dd116c8bf6ca5d9a9','2018-07-16 21:07:56',99999,0,0,0),
(6,'ESSAIM','ESSAIM','ESSAIM','ESSAIM','2b64f2e3f9fee1942af9ff60d40aa5a719db33b8ba8dd4864bb4f11e25ca2bee00907de32a59429602336cac832c8f2eeff5177cc14c864dd116c8bf6ca5d9a9','2018-07-19 15:51:25',99999,1,1,1);

INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `onSale`, `nOrders`) VALUES ('Cafe', '0.49', '40', '1', '');
INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `onSale`) VALUES ('Coca-Cola', '1.19', '7', '1');
INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `onSale`) VALUES ('Coca-Cola Cherry', '1.29', '4', '1');
INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `onSale`) VALUES ('Ice Tea', '1.08', '9', '1');
INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `onSale`) VALUES ('Kinder Bueno', '1.39', '12', '1');
INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `onSale`) VALUES ('Skittles', '0.89', '9', '1');
INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `onSale`) VALUES ('Leffe Triple', '1.17', '6', '1');
