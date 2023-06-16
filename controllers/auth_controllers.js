const Users = require('../models/users');
const { faker } = require('@faker-js/faker');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generate = async (req, res) => {
    try {
        var token = faker.string.uuid();
        var name = faker.person.fullName();
        var email = faker.internet.email();
        var password = Buffer.from(faker.internet.password(), 'utf8').toString('base64');
        var photo = faker.internet.avatar();
        var handpone = faker.phone.number('08##########');
        var posisiton = faker.person.jobTitle();

        var newUser = new Users({
            token, name, email, password, photo, handpone, posisiton,
        });

        await newUser
            .save()
            .then(res.status(200).json(newUser))
            .catch((err) => res.status(500).json(err));
    } catch (error) {
        res.status(500).json(error)
    }
}

const login = async (req, res) => {
    let { email, password } = req.body;
    let existingUser;
    let token;
    if (!email) {
        res.status(401).json({
            success: false,
            message: "Please try again, the password or email is incorrect.",
            data: null,
            token: null,
        });
    } else {
        try {
            existingUser = await Users.findOne({ email: email });
            if (existingUser && (password == Buffer.from(existingUser.password, 'base64').toString('utf8'))) {
                token = jwt.sign(
                    { id: existingUser.id, email: existingUser.email, userid: existingUser.token, admin: existingUser.isAdmin, },
                    process.env.SECRET_TOKEN,
                    { expiresIn: "7d" }
                );
                res.status(200).json({
                    success: true,
                    message: "Success get token",
                    data: null,
                    token: token,
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "Please try again, the password or email is incorrect.",
                    data: null,
                    token: null,
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "An error occurred on the server.",
                data: null,
                token: null,
            });
        }
    }
}

const logout = async (req, res) => {
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
                    message: error,
                    data: null,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "Success Logout",
                    data: null,
                });
            }

        })
    }
}

const changePassword = async (req, res) => {
    let token;
    let { password, currentPassword } = req.body;

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
                    message: error,
                    data: null,
                });
            } else {
                var user = await Users.findOne({ token: dataToken.userid });
                if (currentPassword == Buffer.from(user.password, 'base64').toString('utf8')) {
                    user.password = Buffer.from(password, 'utf8').toString('base64');
                    await user.save();
                    res.status(200).json({
                        success: true,
                        message: "Success Logout",
                        data: user,
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: "Please try again, the password is incorrect.",
                        data: null,
                    });
                }
            }

        })
    }
}

module.exports = {
    generate,
    login,
    logout,
    changePassword,
};