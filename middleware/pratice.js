// const jwt = require("jsonwebtoken");
// const CryptoJS = require("crypto-js");

// const authenticateToken = (req, res, next) => {
//     const token = req.header("Authorization")?.split(" ")[1];

//     if (!token) return res.status(401).json({ error: "Access denied!" });

//     try {
//         // Decrypt the token
//         const decryptedToken = CryptoJS.AES.decrypt(token, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);

//         // Verify the JWT
//         const decoded = jwt.verify(decryptedToken, process.env.JWT_SECRET);
//         req.user = decoded;

//         next();
//     } catch (err) {
//         res.status(403).json({ error: "Invalid token!" });
//     }
// };

// module.exports = authenticateToken;

// const express = require("express");
// const jwt = require("jsonwebtoken");
// const CryptoJS = require("crypto-js");
// const authenticateToken = require("authMiddleware");

// const router = express.Router();

// // Mock user (replace with DB check)
// const USER = { id: 1, username: "naren", password: "password123" };

// // Login Route
// router.post("/login", (req, res) => {
//     const { username, password } = req.body;
//     if (username !== USER.username || password !== USER.password) {
//         return res.status(403).json({ error: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: USER.id, username: USER.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     // Encrypt JWT
//     const encryptedToken = CryptoJS.AES.encrypt(token, process.env.SECRET_KEY).toString();
    
//     res.json({ token: encryptedToken });
// });

// // Protected Route Example
// router.get("/protected", authenticateToken, (req, res) => {
//     res.json({ message: "This is a protected route!", user: req.user });
// });

// module.exports = router;

