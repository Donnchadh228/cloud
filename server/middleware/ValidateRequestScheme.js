const { validationResult } = require("express-validator")
const ApiError = require("./ErrorHandlingMiddleware.js")

function validateRequestScheme(req, res, next) {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ message: errors.array()[0].msg })
	}

	next()
}

module.exports = validateRequestScheme
