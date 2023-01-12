const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) res.status(403).json("Token isn't valid");
            req.user = user;
            next();
        });
    }
    else {
        return res.status(401).json("You're not authenticated");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next();
        }
        else {
            res.status(403).json("You're not allowed to do that");
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
}