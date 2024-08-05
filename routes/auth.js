const express = require("express");
const { getCode, login } = require("../controllers/auth");
const router = express.Router();

router.post("/login/:email/code", getCode);

router.post("/login/:email", login);

module.exports = router;
