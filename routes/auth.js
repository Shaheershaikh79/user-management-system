const express = require('express')
const { registerSchema, loginSchema } = require('../validations/schemas')
const validate = require('../validations/middleware') // ← IMPORT VALIDATION
const authController = require('../controllers/authController')

const router = express.Router()

// ✅ ADD VALIDATION BEFORE CONTROLLERS
router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)


module.exports = router