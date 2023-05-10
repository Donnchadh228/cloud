const User = require("./User")
const Token = require("./Token")
const File = require("./File")
const ActivationLink = require("./ActivationLink")

Token.belongsTo(User, { foreignKey: { name: "userId" } })
ActivationLink.belongsTo(User, { foreignKey: { name: "userId" } })
User.hasMany(File, { foreignKey: { name: "userId" } })
File.belongsTo(File, { foreignKey: { name: "parentId" } })
