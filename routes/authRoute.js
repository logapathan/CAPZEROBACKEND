const express = require('express');
const contest = require('./contest');
const authenticateToken = require('./authmiddleware');
const router = express.Router();

router.use("/contest", authenticateToken, contest);
module.exports = router;

