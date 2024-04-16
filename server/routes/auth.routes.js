const express = require("express");
const router = express.Router();
const User = require("../database/models/user.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken.js");
const multer = require("multer");
const path = require("path");
const fs =require("fs")
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'img/')
    },

    filename: (req,file,cb)=>{
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const imageFilter = (req,file,cb)=>{
    if(file.mimetype === "image/jpeg" || file.mimetype ==="image/png")
    {
        cb(null,true)

    }else{
        cb(new Error("Pas une image"),false);
    }
}


const upload = multer({storage: storage,fileFilter:imageFilter})

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


router.post("/profil", async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username: req.body.username });
        console.log(user)
        if(!user)
        {
            return res.status(400).json({error:"Interdit"})
        }
        res.status(200).json({
            message:"Connexion OK",username:user.username,email:user.email,profilePicture:user.profilePicture
        })
    } catch (error) {
        console.log("ERROR: " + error.message);
    }
})


router.use("/img",express.static(path.join(__dirname,'img')));

router.get('/getimg/:filename',(req,res)=>{
    const filename = req.params.filename;
    const imagePath = path.join(__dirname,'..','img',filename);
    if(fs.existsSync(imagePath))
    {
        res.sendFile(path.resolve(imagePath))
    }else{
        res.status(404).send("Image not found")
    }
})

router.post("/changement" , upload.single("avatar"), async (req, res) => {
    try {
        console.log(req.body)
        const { username, email, password } = req.body;
        const user = await User.findOne({ username:username });
        let salt=""
        let hashedPassword=""
        if(password!=="")
        {
            salt = await bcrypt.genSalt(10);
            hashedPassword= await bcrypt.hash(password, salt);
        }
        
        const isProfilePicture = req.file ? req.file.filename : "";
        console.log(req.file)
        if(user)
        {
            user.username = username;
            if(password!=="")
            {
                user.password = hashedPassword;
            }
            user.email= email;
            user.profilePicture= isProfilePicture;
            await user.save();
            res.status(201).json({ success: "OK USER",username:username,email:email });
        }else {
            res.status(400).json({ error: "INVALID USER" });
        }

    } catch (error) {
        console.log("Error: " + error.message);
    }
})


router.post("/register" , upload.single("avatar"), async (req, res) => {
    try {
        console.log(req.body)
        const { username, email, password, confirmPassword } = req.body;
        console.log(username)
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Mot de passe différents" });
        }
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: "Utilisateur existant" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const isProfilePicture = req.file ? req.file.filename : "";
        console.log(req.file)
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profilePicture: isProfilePicture
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