/*Those are the statements to create the tables of the used DB*/

CREATE TABLE `items` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(70) NOT NULL,
  `price` float unsigned NOT NULL DEFAULT '0',
  `stock` smallint(5) unsigned NOT NULL DEFAULT '0',
  `on_sale` tinyint(4) NOT NULL DEFAULT '1',
  `n_orders` mediumint(9) unsigned NOT NULL DEFAULT '0',
  `total_income` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `orders` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` smallint(5) unsigned NOT NULL DEFAULT '0',
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `price` float unsigned NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `faname` varchar(45) NOT NULL,
  `finame` varchar(45) NOT NULL,
  `pseudo` varchar(50) DEFAULT NULL,
  `email` varchar(70) NOT NULL,
  `inscription_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `balance` float NOT NULL DEFAULT '0',
  `adherent` tinyint(4) NOT NULL DEFAULT '0',
  `admin` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*Incoming: Placeholder entries insertion commands*/

INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `on_sale`, `n_orders`) VALUES ('Cafe', '0.49', '40', '1', '');
INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `on_sale`) VALUES ('Coca-Cola', '1.19', '7', '1');
INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `on_sale`) VALUES ('Coca-Cola Cherry', '1.29', '4', '1');
INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `on_sale`) VALUES ('Ice Tea', '1.08', '9', '1');
INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `on_sale`) VALUES ('Kinder Bueno', '1.39', '12', '1');
INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `on_sale`) VALUES ('Skittles', '0.89', '9', '1');
INSERT INTO `snake`.`items` (`name`, `price`, `stock`, `on_sale`) VALUES ('Leffe Triple', '1.17', '6', '1');

INSERT INTO `snake`.`users` (`faname`, `finame`, `pseudo`, `email`, `inscription_date`, `balance`, `adherent`) VALUES ('Soursou', 'Serge', 'SergiSergio', 'serge.soursou@isty.uvsq.fr', '', '24.03', '1');
INSERT INTO `snake`.`users` (`faname`, `finame`, `pseudo`, `email`, `balance`) VALUES ('Calcado', 'Fabien', 'Fabinou', 'fabien.calcado@isty.uvsq.fr', '-238.0');
INSERT INTO `snake`.`users` (`faname`, `finame`, `pseudo`, `email`, `balance`, `adherent`, `admin`) VALUES ('Pian', 'Jean', 'The Punchline Master', 'jean.pian@isty.uvsq.fr', '999.99', '1', '1');
INSERT INTO `snake`.`users` (`faname`, `finame`, `pseudo`, `email`, `balance`, `adherent`) VALUES ('Sadre', 'Maxime', 'Oké?', 'maxime.sadre@isty.uvsq.fr', '654.58', '1');
