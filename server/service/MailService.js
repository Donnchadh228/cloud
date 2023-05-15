const nodemailer = require("nodemailer")
const ApiError = require("../error/ApiError")
class MailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			// secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		})
	}

	async sendActivationMail(to, link) {
		try {
			await this.transporter.sendMail({
				from: process.env.SMTP_USER,
				to,
				subject: "Активація акаунту на " + process.env.API_URL,
				text: "",
				html: `
            <div>
                <h1>АКТИВАЦІЯ</h1>
                <a href="${link}">${link}</a>
            </div>
            `,
			})
		} catch (e) {
			throw ApiError.badRequest(
				"There was an error sending the message to the mail, please try again later"
			)
			console.log(e)
		}
		console.log("AAAAA")
	}
}

module.exports = new MailService()
