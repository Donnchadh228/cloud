import jwtDecode from "jwt-decode"
import axios from "axios"
import { userAction, UserActionTypes } from "../../../types/user"

import { $authHost, $host } from "../../../http/index"
import { IUser } from "../../../models/IUser"

import { userSlice } from "../userReducer"
import { useAppDispatch } from "../../../hooks/redux"

export class queryUser {
	static registration = async (
		email: string,
		login: string,
		password: string,
		Error: Function
	): Promise<IUser | undefined> => {
		try {
			const response = await $host.post(
				import.meta.env.VITE_APP_API_URL + "/api/user/registration",
				{ email, password, login }
			)
			localStorage.setItem("accessToken", response.data)
			const user: IUser = await jwtDecode(response.data)

			Error("")

			return user
		} catch (e: any) {
			// alert(e)
			Error(e.response.data.message)
			return undefined
		}
	}

	static authorization = async (
		emailOrLogin: string,
		password: string,
		Error: Function
	): Promise<IUser | undefined> => {
		try {
			const response = await $host.post(
				import.meta.env.VITE_APP_API_URL + "/api/user/login",
				{ emailOrLogin, password }
			)
			localStorage.setItem("accessToken", response.data.accessToken)
			const user: IUser = response.data.user
			return user
		} catch (e: any) {
			Error(e.response.data.message)
			return undefined
		}
	}
	static checkToken = async (): Promise<IUser | null> => {
		try {
			// console.log(localStorage.getItem("accessToken"))
			console.log(import.meta.env.VITE_APP_API_URL + "/api/user/checkAuth")
			const response = await $authHost.post(
				import.meta.env.VITE_APP_API_URL + "/api/user/checkAuth"
			)

			if (response.data === null) {
				return null
			} else {
				return response.data
			}
		} catch (e) {
			console.log(e)
			return null
		}
	}
}
