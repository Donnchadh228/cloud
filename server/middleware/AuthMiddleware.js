const ApiError = require("../error/ApiError")
const tokenService = require("../service/TokenService")
module.exports = function (req, res, next) {
	try {
		const authorizationHeader = req.headers.authorization
		// console.log(authorizationHeader)
		if (!authorizationHeader) {
			return next(ApiError.UnauthorizedError("User not authorized"))
		}
		const accessToken = authorizationHeader.split(" ")[1]
		if (!accessToken) {
			return next(ApiError.UnauthorizedError("User not authorized"))
		}
		const userData = tokenService.validateAccessToken(accessToken)
		if (!userData) {
			return next(ApiError.UnauthorizedError("User not authorized"))
		}
		res.user = userData
		next()
	} catch (e) {
		return ApiError.UnauthorizedError("User not authorized")
	}
}
