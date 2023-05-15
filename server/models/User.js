const sequelize = require("../bd")
const { DataTypes } = require("sequelize")
const File = require("./File")
const User = sequelize.define(
	"user",
	{
		login: { type: DataTypes.STRING, unique: true, require: true },
		email: { type: DataTypes.STRING, unique: true, require: true },
		password: { type: DataTypes.STRING, require: true },
		diskSpace: {
			type: DataTypes.BIGINT,
			defaultValue: 1024 ** 3 * 5,
			require: true,
		},
		usedSpace: { type: DataTypes.BIGINT, require: true, defaultValue: 0 },
		// avatar: { type: DataTypes.STRING },
		isActivated: {
			type: DataTypes.BOOLEAN,
			require: true,
			defaultValue: false,
		},
	},
	{
		updatedAt: false,
	}
)
module.exports = User
