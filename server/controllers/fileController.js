const FileService = require("../service/fileService")
const { Op } = require("sequelize")
const User = require("../models/User")
const File = require("../models/File")
const fs = require("fs")
const { userInfo } = require("os")
const ApiError = require("../error/ApiError")
const fileService = require("../service/fileService")
const uuid = require("uuid")
class FileController {
	async createDir(req, res, next) {
		try {
			const { name, type, parentId } = req.body
			const { id: idUser } = req.res.user
			if (name.length > 40) {
				name = name.substring(0, 40)
			}
			const file = new File({
				name: name,
				type: type,
				userId: idUser,
				parentId: parentId,
			})

			const parentFile = await File.findOne({ where: { id: parentId } })

			if (!parentFile) {
				file.path = name
				await FileService.createDir(file.dataValues)
			} else {
				file.path = `${parentFile.path}\\${file.name}`
				await FileService.createDir(file.dataValues)
			}
			await file.save()
			return res.json(file)
		} catch (e) {
			next(e)
		}
	}
	async getFiles(req, res, next) {
		try {
			const { parentId, sort } = req.query
			let { limit, page } = req.query
			page = Number(page || 1)
			limit = Number(limit || 10)
			let offset = page * limit - limit
			let files
			console.log(req.query)

			const { id: idUser } = req.res.user
			let query
			if (parentId) {
				query = { userId: idUser, parentId: parentId }
			} else query = { userId: idUser, parentId: null }
			switch (sort) {
				case "name":
					files = await File.findAndCountAll({
						where: { ...query, path: { [Op.ne]: `${idUser}` } },
						order: [["name", "DESC"]],
						offset: offset,
						limit: limit,
					})
					break
				case "type":
					files = await File.findAndCountAll({
						where: { ...query, path: { [Op.ne]: `${idUser}` } },
						order: [["type", "DESC"]],
						offset: offset,
						limit: limit,
					})
					break
				case "data":
					files = await File.findAndCountAll({
						where: { ...query, path: { [Op.ne]: `${idUser}` } },
						order: [["createdAt", "DESC"]],
						offset: offset,
						limit: limit,
					})
					break
				case "size":
					files = await File.findAndCountAll({
						where: { ...query, path: { [Op.ne]: `${idUser}` } },
						order: [["size", "DESC"]],
						offset: offset,
						limit: limit,
					})
					break
				default:
					files = await File.findAndCountAll({
						where: { ...query, path: { [Op.ne]: `${idUser}` } },
						offset: offset,
						limit: limit,
					})
					break
			}

			return res.status(200).json(files)
		} catch (e) {
			console.log(e)
			// return res.status(400).json({ message: "ERROR fetchFiles" })
			next(e)
		}
	}
	async getCurrentDir(req, res, next) {
		try {
			const { id: idUser } = req.res.user
			const file = await File.findOne({
				where: { path: idUser },
			})
			return res.status(200).json(file)
		} catch (e) {
			next(e)
		}
	}
	async getCurrentDirPath(req, res, next) {
		try {
			const { id } = req.query
			const file = await File.findOne({
				where: { id: id },
			})
			return res.status(200).json(file)
		} catch (e) {
			next(e)
		}
	}
	async uploadFile(req, res, next) {
		try {
			const { file } = req.files
			console.log(file.size)
			console.log(file.size > 2147483647)
			if (file.size > 2147483647) {
				// throw ApiError.badRequest("File already exist")
				return res
					.status(400)
					.json({ message: "Файл не може бути більше 2 GB" })
			}
			const { name } = req.body
			const { id: idUser } = req.res.user
			const parent = await File.findOne({
				where: { userId: idUser, id: req.body.parentId },
			})
			if (name.length > 40) {
				name = name.substring(0, 40)
				file.name = name.substring(0, 40)
			}
			const user = await User.findOne({ where: { id: idUser } })
			if (user.usedSpace + file.size > user.diskSpace) {
				// throw ApiError.badRequest("There no space on the disk")
				return res.status(400).json({ message: "У Вас немає місця на диску" })
			}
			user.usedSpace = user.usedSpace + file.size

			let path
			let pathBd
			if (parent) {
				path = process.env.FILEPATH + `\\${parent.path}\\${name}`
				pathBd = `${parent.path}\\${name}`
			} else {
				path = process.env.FILEPATH + `\\${user.id}\\${name}`
			}
			if (fs.existsSync(path)) {
				// throw ApiError.badRequest("File already exist")
				return res.status(400).json({ message: "Файл з такою назвою вже є" })
			}
			file.mv(path)
			// console.log(file)
			const type = name.split(".").pop()
			const dbFile = new File({
				name: name,
				type: type,
				size: file.size,
				path: pathBd,
				parentId: parent.id,
				userId: user.id,
			})
			console.log(2930625922 == file.size)
			await dbFile.save()
			await user.save()
			res.json(dbFile)
		} catch (e) {
			console.log(e)
			next(e)
			// console.log(e)
			// return res.status(500).json({ message: "Upload error" })
		}
	}
	async downloadFile(req, res) {
		try {
			const { id } = req.query
			const { id: idUser } = req.res.user
			const file = await File.findOne({ where: { id: id, userId: idUser } })

			const path = process.env.FILEPATH + "\\" + file.path

			if (fs.existsSync(path)) {
				return res.download(path, file.name)
			}
			return res.status(400).json({ message: "Помилка при завантаженні файлу" })
		} catch (e) {
			console.log(e)
			return res.status(500).json({ message: "Помилка при завантаженні файлу" })
		}
	}
	async deleteFile(req, res, next) {
		try {
			const { id } = req.query
			const { id: idUser } = req.res.user
			const file = await File.findOne({ where: { id: id, userId: idUser } })
			const user = await User.findOne({ where: { id: idUser } })
			fileService.deleteFile(file)
			await file.destroy()
			user.usedSpace = user.usedSpace - file.size
			user.save()
			console.log("AAAAAAAA")
			return res.json({ message: "Файл видалений" })
		} catch (e) {
			// next(e)
			return res.status(400).json({ message: "Тека не пуста" })
		}
	}
	async searchFile(req, res) {
		try {
			const { search } = req.query
			const { id: idUser } = req.res.user
			console.log(search)
			let files = await File.findAll({ where: { userId: idUser } })
			files = files.filter((file) => file.name.includes(search))
			console.log(files)
			return res.json(files.slice(0, 20))
		} catch (e) {
			console.log("AAAAAAAAAA")
			return res.status(400).json({ message: "Помилка при пошуку файлу" })
		}
	}
	async getLinkFile(req, res) {
		try {
			const { idFile } = req.query
			const { id: idUser } = req.res.user
			const file = await File.findOne({ where: { id: idFile } })
			file.accessLink = uuid.v4()
			await file.save()
			// console.log(search)
			// let files = await File.findAll({ where: { userId: idUser } })
			// files = files.filter((file) => file.name.includes(search))
			return res.json(file)
		} catch (e) {
			console.log("AAAAAAAAAA")
			// console.log(e)
			return res.status(400).json({ message: "Файл не знайдено" })
		}
	}
	async getFileByLink(req, res) {
		try {
			const { Link } = req.query
			const file = await File.findOne({ where: { accessLink: Link } })

			const path = process.env.FILEPATH + "\\" + file.path
			console.log("AAAA")
			if (fs.existsSync(path)) {
				res.download(path, file.name)
			}
			return res.json(file)
		} catch (e) {
			return res.status(400).json({ message: "Файл не знайдено" })
		}
	}
	async downloadByLink(req, res) {
		try {
			const { Link } = req.query
			const file = await File.findOne({ where: { accessLink: Link } })

			const path = process.env.FILEPATH + "\\" + file.path

			if (fs.existsSync(path)) {
				res.download(path, file.name)
			}
			return res.json(file)
		} catch (e) {
			console.log(e)
			return res.status(400).json(e)
		}
	}
}

module.exports = new FileController()
