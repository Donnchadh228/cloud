const User = require("../models/User")
const Token = require("../models/Token")
const File = require("../models/File")
const { Op } = require("sequelize")
const bcrypt = require("bcryptjs")
const { check, query, param, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const ApiError = require("../error/ApiError")

const valid = require("../scheme/registerScheme")
const scheme = require("../middleware/ValidateRequestScheme")

const validateRequestScheme = require("../middleware/ValidateRequestScheme")

const userService = require("../service/UserService")
const { validateAccessToken } = require("../service/TokenService")

class UserController {
	async registration(req, res, next) {
		try {
			const { login, email, password } = req.body
			const userData = await userService.registration(login, email, password)
			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			return res.json(userData.accessToken)
		} catch (e) {
			next(e)
		}
	}

	async login(req, res, next) {
		try {
			const { emailOrLogin, password } = req.body
			const userData = await userService.login(emailOrLogin, password)
			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			delete userData.refreshToken
			return res.send(userData)
		} catch (e) {
			next(e)
		}
	}
	async logout(req, res) {
		try {
			const { refreshToken } = req.cookies
			const token = await userService.logout(refreshToken)
			res.clearCookie("refreshToken")
			return res.json(token)
		} catch (e) {
			next(e)
		}
	}
	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const userData = await userService.refresh(refreshToken)
			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			})
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
	async activate(req, res, next) {
		try {
			const activationLink = req.params.link
			console.log(activationLink)
			await userService.activate(activationLink)
			return res.redirect(process.env.CLIENT_URL + "/cloud")
		} catch (e) {
			next(e)
		}
	}
	async validateAccessToken(req, res, next) {
		try {
			const authHeader = req.headers.authorization
			const token = authHeader && authHeader.split(" ")[1]
			const check = validateAccessToken(token)
			const person = await User.findOne({ where: { id: check.id } })
			return res.json(person)
		} catch (e) {
			next(e)
		}
	}
	async zxc(req, res) {
		try {
			const asd = {
				id: 2,
				text: "ASDASDASDASDASD",
			}
			return res.json(asd)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new UserController()
