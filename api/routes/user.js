const User = require("../models/User");
const CryptoJS = require("crypto-js");
const { verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");

const router = require("express").Router();

router.post("/create", verifyToken, async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: CryptoJS.AES.encrypt(
            req.body.password, process.env.PASS_SECRET
        ).toString(),
        profilePicture: req.body.profilePicture,
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

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SECRET
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );

        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get("/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.get("/", verifyToken, async (req, res) => {
    const query = req.query.new;

    try {
        const users = query 
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();
        
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id/follow', verifyToken, async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json('User has been followed');
            }
            else {
                res.status(403).json('You already follow this user');
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json('You cant follow yourself');
    }
})

router.put('/:id/unfollow', verifyToken, async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json('User has been unfollowed');
            }
            else {
                res.status(403).json('You dont follow this user');
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
    else {
        res.status(403).json('You cant unfollow yourself');
    }
})

router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return User.findById(friendId);
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture, role } = friend;
            friendList.push({ _id, username, profilePicture, role });
        });

        res.status(200).json(friendList);
    }
    catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;