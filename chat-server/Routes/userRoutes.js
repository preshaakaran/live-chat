const express = require('express');
const { registerController, loginController, fetchAllUsersController } = require('../Controllers/userController');
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.post('/login', loginController);
router.post('/register', registerController);
router.get('/fetchUsers',protect,fetchAllUsersController);
module.exports = router;