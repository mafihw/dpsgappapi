const express = require('express');
const http = require("http");
const https = require("https");
const path = require('path');
const fs = require("fs");
const apiRouter = require('./routes');
const authRouter = require('./routes/auth');
const config = require('./config.js')
const app = express();

const port = config.port;

var keyPath = path.join(__dirname, '/ssl/key.pem');
var certPath = path.join(__dirname, '/ssl/cert.pem')

if(fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    https
    .createServer(
        {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
        },
        app
    )
    .listen(port + 1, () => {
        console.log('Server is running in secure HTTPS mode at port ' + (port + 1));
    });
}

http.createServer(app).listen(port, () => {
    console.log('Server is running in HTTP mode at port ' + port);
});


app.use(express.json());
app.use('/api', apiRouter);
app.use('/auth', authRouter);
