require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT;
const app = express();

const router = require('./route/index');

app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//     credentials: true
// }));
app.use('/api', router);

const start = async () => {
    try {
        app.listen(PORT, () => console.log('server in ' + PORT))
    }catch (e) {
        console.log(e);
    }
};

start();