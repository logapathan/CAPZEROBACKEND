const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if("Bearer" === token) return res.status(401).json({ error: "Access Denaied" });

    if (!token) {
        return res.status(401).json({ error: "Access Denaied" });
}

    try {
        const decryptedToken = CryptoJS.AES.decrypt(token, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        const decoded = jwt.verify(decryptedToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid token!" });
    }

    module.exports = authenticateToken;

}