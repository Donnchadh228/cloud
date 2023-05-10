import React, { useEffect, useState } from "react"
import NavBar from "./components/Header/NavBar/NavBar"
import Footer from "./components/Footer/Footer"
import { BrowserRouter } from "react-router-dom"
import AppRouter from "./components/AppRouter"
import { queryUser } from "./store/reducers/actionCreators/user"
import { useAppDispatch, useAppSelector } from "./hooks/redux"
import { userSlice } from "./store/reducers/userReducer"
import fileReducer, { fileSlice } from "./store/reducers/fileReducer"
import { queryFile } from "./store/reducers/actionCreators/file"

function App() {
	document.title = "/CLOUD//"
	//check Identification
	const dispatch = useAppDispatch()
	const { setCurrentDir } = fileSlice.actions
	const { login } = userSlice.actions
	useEffect(() => {
		async function checkAuthorization() {
			const check = await queryUser.checkToken()
			if (check) {
				const currentDirId = await queryFile.getCurrent()
				console.log(check)
				dispatch(login(check))
				dispatch(setCurrentDir(currentDirId))
			}
		}
		checkAuthorization()
	}, [])
	return (
		<BrowserRouter>
			<div className="App">
				<NavBar />

				<AppRouter />
				<Footer />
			</div>
		</BrowserRouter>
	)
}

export default App
