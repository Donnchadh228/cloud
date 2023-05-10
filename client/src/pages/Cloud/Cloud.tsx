import React, { useState, useEffect } from "react"
import Container from "../../components/Container/Container"
import s from "./Cloud.module.less"
import BlackButton from "../../components/UI/Button/BlackBtn/BlackButton"
import Files from "../../components/Cloud/Files/Files"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { fileSlice } from "../../store/reducers/fileReducer"
import { queryFile } from "../../store/reducers/actionCreators/file"
import PopUp from "../../components/UI/PopUp/PopUp"
import { resizePath } from "../../utils/utils"
import PopUpUpload from "../../components/UI/PopUp/PopUpUpload"
const Cloud = () => {
	const [loading, setLoading] = useState<boolean>(true)
	const { currentDir, files } = useAppSelector((state) => state.fileReducer)
	const { user } = useAppSelector((state) => state.userReducer)
	const useDispatch = useAppDispatch()
	const { addFile, getFiles, setCurrentDir } = fileSlice.actions
	const [name, setName] = useState<string>("")
	const [type, setType] = useState<string>("dir")
	const [popup, setPopup] = useState<number>(0)
	const [path, setPath] = useState<string>("")
	const [objectCurrentFile, setObjectCurrentFile] = useState<any>({})
	// useEffect(() => {
	// 	const asd = async () => {
	// 		const paths = await queryFile.getCurrentPath(currentDir!)
	// 		console.log(paths)
	// 		if (paths) {
	// 			setObjectCurrentFile(paths)
	// 			setPath(resizePath(paths.path))
	// 		}
	// 	}
	// })
	useEffect(() => {
		const fetchFile = async () => {
			const query = await queryFile.getFiles(currentDir!)
			const paths = await queryFile.getCurrentPath(currentDir!)

			setPath(resizePath(paths.path))
			query.currentDir = currentDir
			if (query.files) {
				setLoading(false)
				useDispatch(getFiles(query))
			}
		}
		fetchFile()
	}, [currentDir])

	const backDir = async () => {
		const paths = await queryFile.getCurrentPath(currentDir!)
		console.log(paths.parentId)
		if (paths.parentId) {
			setObjectCurrentFile(paths)
			setPath(resizePath(paths.path))
			if (paths.parentId) {
				useDispatch(setCurrentDir(paths.parentId))
			}
		}
	}
	const openPopup = (event: Event, n: number) => {
		event.preventDefault()
		setPopup(n)
	}
	document.title = "/CLOUD//"
	return (
		<div className={s.cloud}>
			{loading ? (
				<div className={s.loading}>
					Loading...
					<span></span>
				</div>
			) : (
				<Container>
					<div className={s.button}>
						<BlackButton onClick={backDir}>
							<span>назад</span>
						</BlackButton>
						<BlackButton onClick={() => openPopup(event!, 1)}>
							Створити нову теку
						</BlackButton>
						<BlackButton onClick={() => openPopup(event!, 2)}>
							{" "}
							Завантажити файл
						</BlackButton>
					</div>
					<div className={s.direction}>
						{user?.login}\{path}
					</div>
					<div className={s.files}>
						<Files />
					</div>
				</Container>
			)}
			{popup == 1 ? (
				<PopUp setClosePopup={setPopup} title="Create dir"></PopUp>
			) : (
				""
			)}
			{popup == 2 ? (
				<PopUpUpload setClosePopup={setPopup} title="UploadFile"></PopUpUpload>
			) : (
				""
			)}
		</div>
	)
}

export default Cloud
