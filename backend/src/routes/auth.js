const { Router } = require("express");
const { login, updateCredentials } = require("../controllers/authController");

const router = Router();

router.post("/login", login);
router.put("/credentials", updateCredentials);

module.exports = router;


