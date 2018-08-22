#!/bin/bash

##############
# USER VARS  #
##############

# WARNING
#Default vars are adapted for the project https://github.com/Arveto/ultimate-snack-manager
#

#String to replace (ie. dev server's ip)
str="localhost:8080" #TODO : str array, for multiple replacements
#Path of the file to edit
pathToMainJS="./public/js/main.js" #TODO : < find ./ -name main.js > , stuff like that
#database creation file path
pathToDbCreationFile="./tables_creation.sql"


##############
# /USER VARS #
##############

bold=$(tput bold)
italic=$(tput sitm)
normal=$(tput sgr0)
green=$(tput setaf 2)
red=$(tput setaf 1)

  #REPLACE IPs
echo "${green}${bold}> Detecting string to replace...${normal}"
tput sitm; echo -n " "
grep "$str" ./public/js/main.js
tput sgr0
echo -n "${green}${bold}> ${normal}${green}Replace [${bold}$str${normal}${green}] by (${bold}enter${normal}${green} to edit manualy, ${bold}'nope'${normal}${green} to skip)> ${normal}${red}"
read replacement
tput sgr0

if [ $replacement = "" ]; then
  vi $pathToMainJS
elif [ $replacement = "nope" ]; then
  echo "${green}${bold}OK !${normal}"
else
  sed -i -e 's/'$str'/'$replacement'/g' $pathToMainJS
fi

  #INSTALL DEPENDENCIES
echo "${green}${bold}> Installing dependencies...${normal}"
npm i

  #CREATING DATABASE
echo "${green}${bold}> Database creation...${normal}"
echo -n "${green}${bold}> ${normal}${green}Mysql username (${bold}enter${normal}${green} to skip)> ${red}"
read mysqlUser
if [[ $mysqlUser != "" ]]; then
  echo -n "${green}${bold}> ${normal}${green}Database name > ${red}"
  read DBname
  tput sgr0
  mysql -u $mysqlUser -p -e "CREATE DATABASE $DBname;"
  mysql -u $mysqlUser -p $MysqlPassword $DBname < $pathToDbCreationFile
fi

echo "${green}${bold} >>> SETUP FINISHED !${normal}"
exit
