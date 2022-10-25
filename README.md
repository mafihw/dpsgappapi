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

To generate a self-signed SSL certificate for the api, enter the following commands:

```sudo apt-get install openssl -y```

```cd dpsgappapi/server```

```sudo mkdir ssl```

```cd ssl```

```openssl genrsa -out key.pem```

```openssl req -new -key key.pem -out csr.pem```

```openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem```