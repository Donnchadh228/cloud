const sequelize = require("../bd")
const { DataTypes } = require("sequelize")

const File = sequelize.define("file", {
	name: { type: DataTypes.STRING, require: true },
	type: { type: DataTypes.STRING, require: true },
	accessLink: { type: DataTypes.STRING },
	size: { type: DataTypes.FLOAT, defaultValue: 0 },
	path: { type: DataTypes.STRING, defaultValue: "" },
})
module.exports = File
