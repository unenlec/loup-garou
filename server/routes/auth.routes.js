const express = require("express");
const router = express.Router();
const User = require("../database/models/user.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken.js");
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        const passOk = await bcrypt.compare(password, user?.password || "");
        if(!user || !passOk)
        {
            return res.status(400).json({error:"Utilisateur ou mot de passe incorrect"})
        }
        generateToken(user._id,res);
        res.status(200).json({
            message:"Connexion OK",username:user.username,email:user.email
        })
    } catch (error) {
        console.log("ERROR: " + error.message);
    }
})

router.post("/register", async (req, res) => {
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
            res.status(201).json({ success: "OK USER",username:username,email:email });
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