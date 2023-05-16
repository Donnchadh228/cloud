import { PayloadAction, createSlice } from "@reduxjs/toolkit"
interface Errors {
	error: string
	visible: boolean
	isError: boolean
}
const initialState: Errors = {
	error: "",
	visible: false,
	isError: false,
}

export const errorsSlice = createSlice({
	name: "errors",
	initialState,
	reducers: {
		setErrors(state, action: PayloadAction<Errors>) {
			state.error = action.payload.error
			state.visible = action.payload.visible
			state.isError = action.payload.isError
		},
	},
})

export default errorsSlice.reducer
