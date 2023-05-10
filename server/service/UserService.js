const UserModel = require("../models/User")
const FileModel = require("../models/File")
const TokenModel = require("../models/Token")
const ActivationLinkModel = require("../models/ActivationLink")
const bcrypt = require("bcryptjs")
const { Op, where } = require("sequelize")
const ApiError = require("../error/ApiError")
const uuid = require("uuid")
const UserDto = require("../dtos/UserDto")
const mailService = require("../service/MailService")
const tokenService = require("../service/TokenService")
const fileService = require("../service/fileService")
class userService {
	async registration(login, email, password) {
		const candidate = await UserModel.findOne({
			where: { [Op.or]: [{ login: login }, { email: email }] },
		})
		if (candidate) {
			if (candidate.login === login)
				throw ApiError.badRequest("this login already exists")
			if (candidate.email === email)
				throw ApiError.badRequest("this Email already exists")
		}
		const hashPassword = await bcrypt.hash(password, 5)
		const activationLink = uuid.v4()
		//УБРАТЬ КОММЕНТАРИИ
		// await mailService.sendActivationMail(
		// 	email,
		// 	`${process.env.API_URL}/api/user/activate/${activationLink}`
		// )
		const user = await UserModel.create({
			email: email,
			login: login,
			password: hashPassword,
		})
		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })

		const file = FileModel.create({
			name: user.id,
			type: "dir",
			path: userDto.id,
			userId: user.id,
		})
		console.log(file)
		await Promise.all([
			ActivationLinkModel.create({
				link: activationLink,
				userId: userDto.id,
			}),

			TokenModel.create({
				refreshToken: tokens.refreshToken,
				userId: user.id,
			}),
			fileService.createDir({ user: userDto.id, path: "" }),
		])

		return tokens
	}

	async login(emailOrLogin, password) {
		const user = await UserModel.findOne({
			where: { [Op.or]: [{ login: emailOrLogin }, { email: emailOrLogin }] },
		})

		if (!user) {
			throw ApiError.badRequest("User not found")
		}
		const isPassValid = await bcrypt.compareSync(password, user.password)

		if (!isPassValid) {
			throw ApiError.badRequest("Invalid password")
		}
		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}
	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken)
		return token
	}
	async refresh(refreshToken) {
		if (refreshToken === "undefined" || !refreshToken) {
			throw ApiError.UnauthorizedError("User not authorized")
		}
		const userData = tokenService.validateRefreshToken(refreshToken)
		const tokenFromDb = await tokenService.findToken(refreshToken)
		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError("User not authorized")
		}
		const user = await UserModel.findOne({ where: { id: userData.id } })
		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}
	async activate(activationLink) {
		const candidate = await ActivationLinkModel.findOne({
			where: { link: activationLink },
		})
		if (!candidate) {
			throw ApiError.badRequest("User not found")
		}
		await UserModel.update(
			{ isActivated: true },
			{ where: { id: candidate.id } }
		)
		await candidate.destroy()
	}
}

module.exports = new userService()