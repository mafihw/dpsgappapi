const express = require('express');
const apiRouter = require('./routes');
const authRouter = require('./routes/auth');
const app = express();

app.use(express.json());
app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.listen('4000', () => {
    console.log('Server is running on port 4000');
});
