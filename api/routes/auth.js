const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: CryptoJS.AES.encrypt(
            req.body.password, process.env.PASS_SECRET
        ).toString(),
        role: req.body.role,
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        });

        !user && res.status(401).json("Wrong Username");

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET);

        const dbPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;

        dbPassword != inputPassword && res.status(401).json("Wrong Password");

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "3d" },
        )

        const { password, ...others } = user._doc;

        res.status(200).json({...others, accessToken});
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.post("/logout", async (req, res) => {
    try {
        req.session = null;
        res.status(200).send({ message: "You've been signed out!" });
    } 
    catch (err) {
        this.next(err);
    }
})

module.exports = router;