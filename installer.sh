#!/bin/sh

# This script installs the API
# All questions during the installation (e.g. "Which services should be restarted?") can be answered with yes/okay without making changes
# This script was tested with Ubuntu Server and Raspian on a RaspberryPi

# UPDATE THE SYSTEM
sudo apt update -y
sudo apt upgrade -y

# INSTALL DEPENDENCIES
sudo apt-get install mariadb-server -y
curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo rm nodesource_setup.sh
sudo apt-get install nodejs -y
sudo apt-get install git -y

# DOWNLOAD API SOURCECODE
git clone https://github.com/mafihw/dpsgappapi.git
cd dpsgappapi

# SETUP THE DATABASE
sudo mysql < dbconfig.sql

# INSTALL NODE PACKAGES
sudo npm install -g nodemon -y
sudo npm install -y
sudo npm install -g pm2 -y

# START AND DEAMONIZE THE SERVER
sudo pm2 startup | bash
sudo pm2 start server/server.js --watch
sudo pm2 save
