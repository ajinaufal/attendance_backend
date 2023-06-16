const Users = require('../models/users');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const listEmployees = async (req, res) => {
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

    let { search } = req.body

    try {
        if (token) {
            dataToken = jwt.verify(token, process.env.SECRET_TOKEN);
            if (dataToken.admin) {
                const projection = { _id: 0, password: 0, isAdmin: 0, __v: 0, created_at: 0, updated_at: 0 };
                const listUsers = await Users.find({ isAdmin: false, name: { $regex: '.*' + search + '.*', $options: 'i' } }, projection);
                res.status(200).json({
                    success: true,
                    message: "Success Get Employe List",
                    data: listUsers,
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "Need a higher authority to enter here.",
                    data: null,
                });
            }
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

const profileUser = async (req, res) => {
    let token;

    if (!req.headers.authorization) {
        res.status(401).json({
            success: false,
            message: "Error! Token was not provided.",
            data: null,
        });
    } else {
        token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, process.env.SECRET_TOKEN, async function (error, dataToken) {
            if (error) {
                res.status(500).json({
                    success: false,
                    message: 'jwt : ' + error,
                    data: null,
                });
            } else {
                try {
                    const projection = { _id: 0, password: 0, isAdmin: 0, __v: 0, created_at: 0, updated_at: 0 };
                    const user = await Users.findOne({ token: dataToken.userid }, projection);
                    res.status(200).json({
                        success: true,
                        message: "Success Get Profile",
                        data: user,
                    });
                } catch (error) {
                    res.status(500).json({
                        success: false,
                        message: 'server : ' + error,
                        data: null,
                    });
                }
            }
        });
    }
}

const detailUser = async (req, res) => {
    let { id } = req.body;

    try {
        if (id) {
            const projection = { _id: 0, password: 0, isAdmin: 0, __v: 0, created_at: 0, updated_at: 0 };
            const user = await Users.findOne({ token: id }, projection);
            res.status(200).json({
                success: true,
                message: "Success Get Detail User",
                data: user,
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Error! User was not provided.",
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

const updateUser = async (req, res) => {
    let { id, name, email, handphone, position } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (handphone) updateFields.handphone = handphone;
    if (position) updateFields.position = position;

    try {
        const user = await Users.findOneAndUpdate({ token: id }, updateFields, { new: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: null,
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Success Update Data User",
                data: user, updateFields,
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

const createeUser = async (req, res) => {
    let { name, email, handpone, position, password } = req.body;
    const updateFields = {};
    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Name field cannot be empty.',
            data: null,
        });
    } else {
        updateFields.name = name;
    }
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email field cannot be empty.',
            data: null,
        });
    } else {
        updateFields.email = email;
    }
    if (!password) {
        return res.status(400).json({
            success: false,
            message: 'Password field cannot be empty.',
            data: null,
        });
    } else {
        updateFields.password = Buffer.from(password, 'utf8').toString('base64');
    }
    if (handpone) updateFields.handpone = handpone;
    if (position) updateFields.position = position;

    var newUser = new Users(updateFields);

    newUser
        .save()
        .then(res.status(200).json({
            success: true,
            message: 'You have successfully created a new user.',
            data: newUser,
        }))
        .catch((error) => res.status(500).json({
            success: false,
            message: error,
            data: null,
        }));
}

module.exports = {
    listEmployees,
    profileUser,
    detailUser,
    updateUser,
    createeUser,
};