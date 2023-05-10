import axios, { AxiosResponse } from "axios"
import { IUser } from "./models/IUser"
import jwtDecode from "jwt-decode"
interface userAuthorization {
	user: IUser
	accessToken: string
	refreshToken: string
}
export const registration = async (
	email: string,
	password: string,
	login: string,
	Error: Function
) => {
	try {
		const response = await axios.post(
			`http://localhost:3000/api/user/registration`,
			{
				email,
				password,
				login,
			}
		)
		Error("")
		console.log(response.data)
	} catch (e: any) {
		// console.log(e.response.data.message)
		Error(e.response.data.message)
	}
}

export const login = async (
	emailOrLogin: string,
	password: string,
	Error: Function
) => {
	try {
		const response = await axios.post<userAuthorization>(
			`http://localhost:3000/api/user/login`,
			{
				emailOrLogin,
				password,
			}
		)
		Error("")
		// console.log(response.data)
		localStorage.setItem("accessToken", response.data.accessToken)
		console.log(jwtDecode(response.data.accessToken))
		return response.data
	} catch (e: any) {
		Error(e.response.data.message)
	}
}
