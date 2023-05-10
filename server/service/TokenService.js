const jwt = require("jsonwebtoken")
const tokenModel = require("../models/Token")

class TokenServices {
	generateTokens(payload) {
		const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
			expiresIn: "2d",
		})
		const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_KEY, {
			expiresIn: "30d",
		})
		return {
			accessToken,
			refreshToken,
		}
	}

	validateAccessToken(token) {
		try {
			const userData = jwt.verify(token, process.env.SECRET_KEY)
			return userData
		} catch (e) {
			return null
		}
	}

	validateRefreshToken(token) {
		try {
			const userData = jwt.verify(token, process.env.SECRET_REFRESH_KEY)
			return userData
		} catch (e) {
			return null
		}
	}

	async saveToken(userId, refreshToken) {
		const tokenData = await tokenModel.findOne({ where: { userId: userId } })
		if (tokenData) {
			tokenData.refreshToken = refreshToken
			return tokenData.save()
		}

		const token = await tokenModel.create({
			userId: userId,
			refreshToken: refreshToken,
		})
		return token
	}

	async removeToken(refreshToken) {
		const tokenData = await tokenModel.destroy({
			where: { refreshToken: refreshToken },
		})
		return tokenData
	}

	async findToken(refreshToken) {
		const tokenData = await tokenModel.findOne({
			where: { refreshToken: refreshToken },
		})
		return tokenData
	}
}

module.exports = new TokenServices()
