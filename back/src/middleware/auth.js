"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
;
module.exports = (req, res, next) => {
    const token = req.headers.bearer;
    if (!token)
        res.status(403).send("Unauthorized");
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.id = decoded.id;
        req.email = decoded.email;
        req.role = decoded.role;
        req.pseudo = decoded.pseudo;
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(403).send("Invalid Token");
    }
};
