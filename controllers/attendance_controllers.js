const attendances = require('../models/attendance');
const dotenv = require('dotenv');
var jwt = require('jsonwebtoken');
dotenv.config();

const listAttendances = async (req, res) => {
    let token;
    let dataToken;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    try {
        if (token) {
            dataToken = jwt.verify(token, process.env.SECRET_TOKEN);
            const projection = { created_at: 0, updated_at: 0 };
            const listAttendance = await attendances.find({ user_token: dataToken.userid }, projection);
            res.status(200).json({
                success: true,
                message: "Success Get Attendance List",
                data: listAttendance,
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Error! Token was not provided.",
                data: null,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
            data: null,
        });
    }
}

const inAttendances = async (req, res) => {
    let token;
    let dataToken;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        res.status(401).json({
            success: false,
            message: "Error! Token was not provided.",
            data: null,
        });
    }

    jwt.verify(token, process.env.SECRET_TOKEN, async function (error, dataToken) {
        if (error) {
            res.status(500).json({
                success: false,
                message: 'token',
                data: null,
            });
        }
        try {
            var newAttendances = new attendances();
            newAttendances.user_token = dataToken.userid;
            newAttendances.inAt = Date.now().toString();
            newAttendances.createdAt = Date.now().toString();
            await newAttendances.save();

            res.status(200).json({
                success: true,
                message: 'You have successfully attendance.',
                data: newAttendances,
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'An error occurred on the server : ' + error,
                data: null,
            });
        }
    });

}

const outAttendances = async (req, res) => {
    let token;
    let dataToken;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    try {
        if (token) {
            const projection = { created_at: 0, updated_at: 0 };
            dataToken = jwt.verify(token, process.env.SECRET_TOKEN);
            const user = await Users.findOneAndUpdate({ user_token: dataToken.userid, updated_at: null }, { updated_at: Date.now, out_at: Date.now, }, { new: true });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Data not found',
                    data: null,
                });
            }
            res.status(200).json({
                success: true,
                message: "Success Update Data attendances",
                data: user,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error,
            data: null,
        });
    }
}

module.exports = {
    listAttendances,
    inAttendances,
    outAttendances,
};