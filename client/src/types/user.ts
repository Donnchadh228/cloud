import { PayloadAction } from "@reduxjs/toolkit"
import { IUser } from "../models/IUser"

export interface UserState {
	user: IUser
}

export enum UserActionTypes {
	REGISTRATION = "REGISTRATION",
	AUTHORIZATION = "AUTHORIZATION",
	LOGOUT = "LOGOUT",
	CHECK_TOKEN = "CHECK_TOKEN",
}
interface UserRegistrationAction {
	type: UserActionTypes.REGISTRATION
	payload: {
		email: string
		password: string
		login: string
	}
}
interface UserAuthorizationAction {
	type: UserActionTypes.AUTHORIZATION
	payload: {
		emailOrLogin: string
		password: string
	}
}
interface UserLogoutAction {
	type: UserActionTypes.LOGOUT
}
interface UserCheckTokenAction {
	type: UserActionTypes.CHECK_TOKEN
	payload: {
		accessToken: string
	}
}

export type userAction =
	| UserRegistrationAction
	| UserAuthorizationAction
	| UserLogoutAction
	| UserCheckTokenAction
