const { param, query, body } = require("express-validator")

const registerScheme = [
	body("email").isEmail().withMessage("Email is invalid"),
	body("login").notEmpty().withMessage("Login is required"),
	body("password")
		.isLength({ min: 3, max: 12 })
		.withMessage("Password must be between 3 and 12 characters")
		.notEmpty()
		.withMessage("Password is required"),
]

module.exports = registerScheme
