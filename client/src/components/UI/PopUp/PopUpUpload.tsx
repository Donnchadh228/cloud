import React, { FC, useState } from "react"
import s from "./PopUp.module.less"
import WhiteInput from "../Input/WhiteInput/WhiteInput"
import MyForm from "../MyForm/MyForm"
import BlackButton from "../Button/BlackBtn/BlackButton"
import { queryFile } from "../../../store/reducers/actionCreators/file"
import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import { fileSlice } from "../../../store/reducers/fileReducer"
import { userSlice } from "../../../store/reducers/userReducer"
import { uploadSlice } from "../../../store/reducers/uploaderReducer"

interface popUpInterface {
	title: string
	setClosePopup: (value: number) => void
}
const PopUpUpload: FC<popUpInterface> = ({ title, setClosePopup }) => {
	const [dirName, setDirName] = useState<string>("")
	const useDispatch = useAppDispatch()
	const { currentDir } = useAppSelector((state) => state.fileReducer)
	const { addFile: addFileRedux } = fileSlice.actions
	const { addUploadFile } = uploadSlice.actions
	const { changeSpace } = userSlice.actions
	const [error, setError] = useState<string>("")
	const [file, setFile] = useState<any>({})
	const asd = () => {
		// queryFile.uploadFile()
	}
	let handleClosePopup = () => {
		setClosePopup(0)
	}
	const fileUploadHandler = (event: any) => {
		// const files = [...event.target.files]
		const file = event.target!.files[0]

		setFile(file)

		console.log(file)
		setError("")
	}
	const addFile = async () => {
		if (file.name) {
			const isFile = await queryFile.uploadFile(
				file,
				currentDir!,
				setError,
				useDispatch
			)
			if (isFile) {
				useDispatch(addFileRedux(isFile))
				useDispatch(changeSpace(isFile.size))
			}
		} else {
			setError("select file")
		}
	}
	return (
		<div className={s.popup} onClick={handleClosePopup}>
			<div
				className={s.popup_content}
				onClick={(event) => event.stopPropagation()}
			>
				<MyForm>
					<div className={s.popup_header}>
						<div className={s.popup_title}>{title}</div>
						<button className={s.popup_close} onClick={handleClosePopup}>
							X
						</button>
					</div>
					<input
						// multiple={true}
						onChange={(event: any) => fileUploadHandler(event)}
						type="file"
						id="uploadFile"
					/>

					{/* <WhiteInput
						setValue={setDirName}
						placeholder="enter name dir"
						type="string"
						value={dirName}
					/> */}
					<div className={s.error}>{error}</div>
					<BlackButton onClick={addFile}>Upload</BlackButton>
				</MyForm>
			</div>
		</div>
	)
}

export default PopUpUpload
