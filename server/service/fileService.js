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
				return resolve({ message: "Успішно створено теку" })
			} else {
				throw ApiError.badRequest("Така тека вже є")

				return reject({ message: "File already exist" })
			}
		})
	}
	// UploadFile(file) {}
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
			throw ApiError.badRequest("Помилка при видаленні файлу")
		}
	}
}

module.exports = new FileService()
