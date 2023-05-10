const fs = require("fs")
const File = require("../models/File")
const ApiError = require("../error/ApiError")

class FileService {
	createDir(file) {
		let filePath
		if (!file.user) {
			filePath = `${process.env.FILEPATH}\\${file.path}`
		} else {
			filePath = `${process.env.FILEPATH}\\${file.user}\\${file.path}`
		}
		return new Promise((resolve, reject) => {
			// try {
			if (!fs.existsSync(filePath)) {
				fs.mkdirSync(filePath)
				return resolve({ message: "success create folder" })
			} else {
				throw ApiError.badRequest("File already exist")

				return reject({ message: "File already exist" })
			}
			// } catch (e) {
			// 	throw ApiError.badRequest("file error")
			// 	return reject({ message: "file error" })
			// }
		})
	}
	UploadFile(file) {}
	deleteFile(file) {
		try {
			const path = process.env.FILEPATH + "\\" + file.path
			// throw ApiError.badRequest("File is not empty")
			if (file.type === "dir") {
				fs.rmdirSync(path)
			} else {
				fs.unlinkSync(path)
			}
		} catch (e) {
			throw ApiError.badRequest("AAAAAAAAAAAAA")
		}
	}
	crr(file) {
		console.log("ASDDSASDSAD")
		const filePath = `${process.env.FILEPATH}\\${file.user}\\${file.path}`
		console.log(filePath)
		// return new Promise((resolve, reject) => {
		// 	try {
		// 		if (!fs.existsSync(filePath)) {
		// 			fs.mkdirSync(filePath)
		// 			return resolve({ message: "success create folder" })
		// 		} else {
		// 			return reject({ message: "File already exist" })
		// 		}
		// 	} catch (e) {
		// 		return reject({ message: "file error" })
		// 	}
		// })
	}
}

module.exports = new FileService()
