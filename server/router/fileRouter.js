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
router.delete("/", authMiddleware, fileController.deleteFile)
module.exports = router
