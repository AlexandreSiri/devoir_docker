const { Router } = require("express");
const router = Router();
const User = require('../controllers/users.controller');

router.post('/create-account', User.createAccount);
router.post('/login', User.login);

module.exports = router;