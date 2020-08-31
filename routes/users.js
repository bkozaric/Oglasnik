const express = require("express");
const bcrypt = require('bcrypt');

const db = require("../database/connection");

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const router = express.Router();

const JWT_SECRET = process.env.jwt_secret;

router.put("/changeinfo", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(404).json({ message: "Not logged in" });
        }
        const { firstName, lastName, contact, address, city, zipcode } = req.body;
        const results = await db.updateUser(req.session.userId, firstName, lastName, contact, address, city, zipcode)
        res.status(200).json({ success: results.affectedRows > 0 ? 1 : 0 });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }

})


router.get("/userinfo", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(404).json({ message: "Not logged in" });
        }
        let results = await db.userInfo(req.session.userId);
        res.status(200).json(results);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

router.get("/checkSession", async (req, res) => {
    if (!req.session.user) {
        //return res.json({"logged": 1, "username":  "rooter", "userId": 61});
        return res.json({ "logged": 0 });
    }
    return res.json({ "logged": 1, "username": req.session.user, "userId": req.session.userId });
})

router.get("/logout", async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.sendStatus(404);
        }
    });
    sessionInfo = req.session;
    res.sendStatus(200);
})

router.get("/confirm/:token", async (req, res) => {
    try {
        jwt.verify(req.params.token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(404).json({ success: 0, message: "Invalid token" });
            } else {
                let results = await db.confirmUser(req.params.token);
                if (results.affectedRows === 0) {
                    return res.status(404).json({ success: 0, message: "Invalid token" });
                }
                else {
                    if (results.changedRows === 0) {
                        return res.status(200).json({ success: 0, message: "Email already verified." });
                    }
                    else {
                        return res.status(200).json({ success: 1, message: "Email succesfully verified. You can now login with your username and password." });
                    }
                }
            }
        });
    }
    catch (err) {
        res.sendStatus(500);
    }

})


router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        let results = await db.matchUser(username);
        if (results[0].broj > 0) {
            const correctPass = await bcrypt.compare(password, results[0].password)
            if (results[0].isConfirmed === 0) {
                return res.status(200).json({ login: 0, message: "Email not confirmed! Please check your email to verify your account." });
            }
            if (correctPass) {
                req.session.user = username;
                req.session.userId = results[0].id;
                req.session.save();
                return res.status(200).json({ login: 1, message: "Login successful!" });
            }
        }
        return res.status(200).json({ login: 0, message: "Incorrect username and/or password" });

    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

router.put("/password/:id", async (req, res) => {
    try {
        const { username, newPassword, oldPassword } = req.body;
        if (!req.session.userId) {
            return res.status(403).json({ message: "You are not logged in" });
        }
        if (parseInt(req.params.id) !== req.session.userId) {
            return res.status(403).json({ message: "Access denied" });
        }
        let results = await db.matchUser(username);
        if (results[0].broj > 0) {
            const correctPass = await bcrypt.compare(oldPassword, results[0].password)
            if (correctPass) {
                if (newPassword.length < 6) {
                    return res.status(500).json({ message: "New password too short." })
                }
                let hashedPass = await bcrypt.hash(newPassword, 10);
                const updatePassResults = await db.updatePassword(req.session.userId, hashedPass);
                req.session.destroy((err) => {
                    if (err) {
                        return res.status(404).json({ message: "Error occured while trying to destroy session" });
                    }
                });
                const { affectedRows: success } = updatePassResults;
                return res.status(200).json({ message: success === 1 ? 1 : 0 });
            }
            return res.status(403).json({ message: "Please enter the correct password" });
        }
        res.status(404).json({ message: "User not found" });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

router.post("/checkemail", async (req, res) => {
    try {

        const { email } = req.body;

        const fetchExisting = await db.matchEmail(email);
        if (fetchExisting[0].broj > 0) {
            return res.status(200).json({ message: "This email is taken.", success: 0 })
        }

        return res.status(200).json({ success: 1 });

    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

router.post("/checkuser", async (req, res) => {
    try {

        const { username } = req.body;

        const fetchExisting = await db.matchUser(username);
        if (fetchExisting[0].broj > 0) {
            return res.status(200).json({ message: "This username is taken.", success: 0 })
        }

        return res.status(200).json({ success: 1 });

    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

router.delete("/delete/:id", async (req, res) => {

    if (!req.session.userId) {
        return res.status(403).json({ message: "You are not logged in" });
    }
    if (parseInt(req.params.id) !== req.session.userId) {
        return res.status(403).json({ message: "Access denied." });
    }
    req.session.destroy((err) => {
        if (err) {
            return res.sendStatus(404);
        }
    });
    const results = await db.deleteUser(req.params.id);
    res.status(200).json(results)
})



router.post("/register", async (req, res) => {
    try {

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: process.env.email_user, // generated ethereal user
                pass: process.env.email_password
            },
        });

        const { email, username, password, firstName, lastName, contact, address, city, zipcode } = req.body;

        const token = jwt.sign({
            user: username
        }, JWT_SECRET, { expiresIn: '1d' });

        if (username.length < 4) {
            return res.status(500).json({ message: "Username too short." })
        }
        if (password.length < 6) {
            return res.status(500).json({ message: "Password too short." })
        }

        const fetchExisting = await db.matchUser(username);
        if (fetchExisting[0].broj > 0) {
            return res.status(500).json({ message: "This username is taken." })
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const results = await db.insertUser(username, hashedPass, email, firstName, lastName, contact, address, city, zipcode, token);

        const { affectedRows: success } = results;

        if (success) {
            await transporter.sendMail({
                from: '"eSell" <bymplayer213@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Please confirm your account", // Subject line
                html: `<h2>Hello ${username}</h2><p>To finish the registration process please verify your account by click on <a href="http://localhost:3000/confirm/${token}">this</a> link.</p><p>- eSell</p>`, // html body
            });
        }

        return res.status(200).json({ message: success == 1 ? 1 : 0 });

    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = router;