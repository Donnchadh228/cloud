const Router = require("express")
const router = new Router()

const authMiddleware = require("../middleware/AuthMiddleware")
const FileController = require("../controllers/fileController")
const fileController = require("../controllers/fileController")

router.post("", authMiddleware, fileController.createDir)
router.get("", authMiddleware, fileController.getFiles)
router.get("/getCurrentDir", authMiddleware, fileController.getCurrentDir)
router.get(
	"/getCurrentDirPath",
	authMiddleware,
	fileController.getCurrentDirPath
)

router.post("/upload", authMiddleware, fileController.uploadFile)
router.get("/download", authMiddleware, fileController.downloadFile)
router.get("/search", authMiddleware, fileController.searchFile)
router.delete("/", authMiddleware, fileController.deleteFile)
router.get("/getLinkFile", authMiddleware, fileController.getLinkFile)
router.get("/getFileByLink", fileController.getFileByLink)
router.get("/downloadByLink", fileController.downloadByLink)
module.exports = router
