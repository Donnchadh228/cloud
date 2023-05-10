const FileService = require("../service/fileService")
const { Op } = require("sequelize")
const User = require("../models/User")
const File = require("../models/File")
const fs = require("fs")
const { userInfo } = require("os")
const ApiError = require("../error/ApiError")
const fileService = require("../service/fileService")
class FileController {
	async createDir(req, res, next) {
		try {
			const { name, type, parentId } = req.body
			const { id: idUser } = req.res.user
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
			// console.log(e)
			next(e)
		}
	}
	async getFiles(req, res, next) {
		try {
			const { parentId } = req.query
			console.log(req.query)
			const { id: idUser } = req.res.user
			let query
			if (parentId) {
				query = { userId: idUser, parentId: parentId }
			} else query = { userId: idUser, parentId: null }
			const files = await File.findAll({
				where: { ...query, path: { [Op.ne]: `${idUser}` } },
			})

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
			const { name } = req.body
			const { id: idUser } = req.res.user
			const parent = await File.findOne({
				where: { userId: idUser, id: req.body.parentId },
			})
			const user = await User.findOne({ where: { id: idUser } })
			if (user.usedSpace + file.size > user.diskSpace) {
				// throw ApiError.badRequest("There no space on the disk")
				return res.status(400).json({ message: "There no space on the disk" })
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
				return res.status(400).json({ message: "File already exist" })
			}
			file.mv(path)
			const type = name.split(".").pop()
			const dbFile = new File({
				name: name,
				type: type,
				size: file.size,
				path: pathBd,
				parentId: parent.id,
				userId: user.id,
			})
			await dbFile.save()
			await user.save()
			res.json(dbFile)
		} catch (e) {
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
			return res.status(400).json({ message: "Download Error" })
		} catch (e) {
			console.log(e)
			return res.status(500).json({ message: "Download error" })
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
			return res.json({ message: "File was deleted" })
		} catch (e) {
			console.log("AAAAAAAAAA")
			// next(e)
			// console.log(e)
			return res.status(400).json({ message: "File is not empty" })
		}
	}
	async ccr(req, res) {
		try {
			console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
			const { name, type, parentId } = req.body
			const { id } = req.res.user
			console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
			const file = await File.create({
				name: name,
				type: type,
				userId: id,
				parentId: parentId,
			})
			console.log(req.res.user.id)
			return res.status(400).json(req.res.user.id)
		} catch (e) {
			console.log(e)
			return res.status(400).json(e)
		}
	}
}

module.exports = new FileController()
