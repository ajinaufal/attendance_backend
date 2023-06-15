const Users = require('../models/users');
const { faker } = require('@faker-js/faker');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// new Date(jwt.verify(token, process.env.SECRET_TOKEN).exp * 1000).toLocaleString()

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
        res.status(401).json();
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
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        res.status(401).json({
            success: false,
            message: "Error! Token was not provided.",
            data: null,
        });
    }

    if (token) {
        jwt.verify(token, process.env.SECRET_TOKEN, async function (error, dataToken) {
            if (error) {
                res.status(500).json({
                    success: false,
                    message: error,
                    data: null,
                });
            }
            res.status(200).json({
                success: true,
                message: "Success Logout",
                data: null,
            });
        });
    } else {
        res.status(401).json({
            success: false,
            message: "Error! Token was not provided.",
            data: null,
        });
    }
}

module.exports = {
    generate,
    login,
    logout,
};