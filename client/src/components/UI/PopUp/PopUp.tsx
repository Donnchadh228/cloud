import React, { FC, useState } from "react"
import s from "./PopUp.module.less"
import WhiteInput from "../Input/WhiteInput/WhiteInput"
import MyForm from "../MyForm/MyForm"
import BlackButton from "../Button/BlackBtn/BlackButton"
import { queryFile } from "../../../store/reducers/actionCreators/file"
import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import fileReducer, { fileSlice } from "../../../store/reducers/fileReducer"

interface popUpInterface {
	title: string
	setClosePopup: (value: number) => void
}
const PopUp: FC<popUpInterface> = ({ title, setClosePopup }) => {
	const [dirName, setDirName] = useState<string>("")
	const { currentDir } = useAppSelector((state) => state.fileReducer)
	const [error, setError] = useState<string>("")
	const useDispatch = useAppDispatch()
	const { addFile } = fileSlice.actions
	const ff = async () => {
		const newFile = await queryFile.createDir(
			dirName,
			currentDir!,
			"dir",
			setError
		)
		if (newFile) {
			useDispatch(addFile(newFile))
			setDirName("")
			setClosePopup(0)
		}
	}

	let handleClosePopup = () => {
		setClosePopup(0)
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
					<WhiteInput
						setValue={setDirName}
						placeholder="enter name dir"
						type="string"
						value={dirName}
					/>
					<div className={s.error}>{error}</div>
					<BlackButton onClick={ff}>Create</BlackButton>
				</MyForm>
			</div>
		</div>
	)
}

export default PopUp
