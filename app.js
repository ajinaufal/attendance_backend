const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const port = 4000;

var authRouter = require('./routers/auth_routers');
var userRouter = require('./routers/user_routers');
var attendanceRouter = require('./routers/attendance_routers');

dotenv.config();
const database = process.env.MONGOLAB_URI;
mongoose.connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('Connect to databae'))
    .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
var corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}
app.use('/users', cors(corsOptions), userRouter);
app.use('/attendance', cors(corsOptions), attendanceRouter);
app.use('/auth', cors(corsOptions), authRouter);

app.on('error', (error) => {
    console.error('Server error:', error);
});

app.listen(port, () => console.log('Server is running on port ' + port));