module.exports = class UserDto {
	id
	login
	email
	diskSpace
	usedSpace
	avatar
	isActivated

	constructor(model) {
		this.id = model.id
		this.login = model.login
		this.email = model.email
		this.diskSpace = model.diskSpace
		this.usedSpace = model.usedSpace
		this.avatar = model.avatar
		this.isActivated = model.isActivated
	}
}
