const { param, query, body } = require("express-validator")

const loginScheme = [
	body("emailOrLogin").notEmpty().withMessage("Email of login is required"),
	body("password")
		.isLength({ min: 3, max: 12 })
		.withMessage("Password must be between 3 and 12 characters")
		.notEmpty()
		.withMessage("Password is required"),
]

module.exports = loginScheme
