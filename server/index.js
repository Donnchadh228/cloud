require("dotenv").config()
const express = require("express")
const sequelize = require("./bd")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const router = require("./router")
const PORT = process.env.SERVER_PORT || 5000
const fileUpload = require("express-fileupload")
const app = express()
const relation = require("./models/FileRelation")
const errorHandler = require("./middleware/ErrorHandlingMiddleware")

app.use(fileUpload({}))
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use("/api", router)

app.use(errorHandler)
const start = async () => {
	try {
		await sequelize.authenticate()
		await sequelize.sync()

		app.listen(PORT, () => console.log("SERVER START PORT - " + PORT))
	} catch (e) {
		console.log(e)
	}
}

start()
