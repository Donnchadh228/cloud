import { PayloadAction, createSlice } from "@reduxjs/toolkit"

const initialState: any = {
	isVisible: false,
	files: [],
}

export const uploadSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		showUploader(state) {
			// state.user = action.payload
			state.isVisible = true
		},
		hideUploader(state) {
			state.isVisible = false
		},
		addUploadFile(state, action: PayloadAction<any>) {
			state.files = [...state.files, { ...action.payload }]
		},
		removeUploadFile(state, action: PayloadAction<number>) {
			state.files = [
				...state.files.filter((file: any) => file.id != action.payload),
			]
		},
		changeUploadFile(state, action: PayloadAction<any>) {
			state.files = [
				...state.files.map((file: any) =>
					file.id == action.payload.id
						? { ...file, progress: action.payload.progress }
						: { ...file }
				),
			]
		},
		removeLast(state) {
			const newArray = state.files.slice(0, -1)
			state.files = newArray
		},
	},
})

export default uploadSlice.reducer
