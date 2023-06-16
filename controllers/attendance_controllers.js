const attendances = require('../models/attendance');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
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
                message: "Error! Token was not provided.",
                data: null,
            });
        }
        try {
            const noAbsen = await attendances.findOne({ user_token: dataToken.userid, updatedAt: null });
            if (!noAbsen) {
                var newAttendances = new attendances();
                newAttendances.user_token = dataToken.userid;
                newAttendances.inAt = new Date();
                newAttendances.createdAt = new Date();
                await newAttendances.save();

                res.status(200).json({
                    success: true,
                    message: 'You have successfully attendance.',
                    data: newAttendances,
                });
            } else {
                noAbsen.outAt = new Date();
                noAbsen.updatedAt = new Date();
                await noAbsen.save();
                res.status(200).json({
                    success: true,
                    message: "Success Update Data attendances",
                    data: noAbsen,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'An error occurred on the server : ' + error,
                data: null,
            });
        }
    });

}



module.exports = {
    listAttendances,
    inAttendances,
};