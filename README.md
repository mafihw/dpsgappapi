# DPSG Gladbach APP API

## How to install the server
The following command installs and starts the API on Ubuntu/Debian Servers
```shell
sudo wget https://raw.githubusercontent.com/mafihw/dpsgappapi/development/installer.sh && sudo chmod +x installer.sh && sudo ./installer.sh
```

To stop the API, execute ```sudo pm2 stop server```

To start the API, execute ```sudo pm2 start server```

To restart the API, execute ```sudo pm2 restart```


To update the API, do a ```git pull``` in the "dpsgappapi" folder and restart the API
