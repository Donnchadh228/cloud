import { combineReducers, configureStore } from "@reduxjs/toolkit"
import userReducer from "./reducers/userReducer"
import fileReducer from "./reducers/fileReducer"
const rootReducer = combineReducers({
	userReducer,
	fileReducer,
})

export const setupStore = () => {
	return configureStore({
		reducer: rootReducer,
		devTools: true,
	})
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore["dispatch"]
