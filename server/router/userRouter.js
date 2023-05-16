const Router = require("express")
const router = new Router()
const userController = require("../controllers/userController")
const { checkSchema, param } = require("express-validator")
const registerScheme = require("../scheme/registerScheme")
const ValidateRequestScheme = require("../middleware/ValidateRequestScheme")
const authMiddleware = require("../middleware/AuthMiddleware")
const loginScheme = require("../scheme/loginScheme")

router.post(
	"/registration",
	registerScheme,
	ValidateRequestScheme,
	userController.registration
)
router.post("/login", loginScheme, ValidateRequestScheme, userController.login)
router.post("/logout", authMiddleware, userController.logout)
router.post("/refresh", userController.refresh)
router.get("/activate/:link", userController.activate)
router.post("/checkAuth", userController.validateAccessToken)

module.exports = router
