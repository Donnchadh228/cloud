const sequelize = require("../bd")
const { DataTypes } = require("sequelize")

const ActivationLink = sequelize.define("ActivationLink", {
	link: { type: DataTypes.STRING, require: true },
})
module.exports = ActivationLink
