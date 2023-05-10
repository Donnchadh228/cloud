import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IFile, propertiesFile } from "../../models/IFIle"
import { IUser } from "../../models/IUser"
const initialState: IFile = {
	currentDir: null,
	files: [],
}

export const fileSlice = createSlice({
	name: "file",
	initialState,
	reducers: {
		setCurrentDir(state, action: PayloadAction<number>) {
			state.currentDir = action.payload
		},
		createDir(state, action: PayloadAction<propertiesFile>) {
			state.files = [...state.files, action.payload]
		},
		addFile(state, action: PayloadAction<propertiesFile>) {
			state.files = [...state.files, action.payload]
		},
		deleteFile(state, action: PayloadAction<number>) {
			state.files = [...state.files.filter((file) => file.id != action.payload)]
		},
		getFiles(state, action: PayloadAction<IFile>) {
			state.currentDir = action.payload.currentDir
			// console.log(action.payload)
			state.files = action.payload.files
		},
		logout(state, action: PayloadAction<boolean>) {
			state.currentDir = null
			state.files = []
		},
	},
})

export default fileSlice.reducer
