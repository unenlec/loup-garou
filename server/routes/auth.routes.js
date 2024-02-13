const express = require("express");
const router = express.Router();
const User = require("../database/models/user.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken.js");
router.post("/login", async (req, res) => {
    try {
        const { email, password } = res.body;
        await User.findOne({ email: email }).then((result) => {
        })
    } catch (error) {
        console.log("ERROR: " + error.message);
    }
})

router.post("/register", async (req, res) => {
    //res.send("REGISTER");
    try {
        const { username, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Mot de passe différents" });
        }
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: "Utilisateur existant" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profilePicture: ""
        })
        if (newUser) {
            await generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({ success: "OK USER" });
        } else {
            res.status(400).json({ error: "INVALID USER" });
        }

    } catch (error) {
        console.log("Error: " + error.message);
    }
})

router.get("/logout", (req, res) => {
    res.send("LOGOUT");
})
module.exports = { router };