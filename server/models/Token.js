const sequelize = require("../bd")
const { DataTypes } = require("sequelize")
const User = require("./User")
const Token = sequelize.define("token", {
	refreshToken: { type: DataTypes.TEXT, require: true },
})
module.exports = Token
