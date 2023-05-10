import jwtDecode from "jwt-decode"
import { IUser } from "./../../models/IUser"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
interface UserState {
	user?: IUser
	isAuth: boolean
}
const initialState: UserState = {
	user: undefined,
	isAuth: false,
}

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		registration(state, action: PayloadAction<IUser>) {
			state.user = action.payload
			state.isAuth = true
		},
		login(state, action: PayloadAction<IUser>) {
			state.user = action.payload
			state.isAuth = true
		},
		changeSpace(state, action: PayloadAction<number>) {
			state.user!.usedSpace += action.payload
		},
		logout(state, action: PayloadAction<boolean>) {
			localStorage.removeItem("accessToken")
			state.user = undefined
			state.isAuth = action.payload
		},
	},
})

export default userSlice.reducer
