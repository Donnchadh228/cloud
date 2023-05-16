import React, { FC } from "react"
import s from "../Files.module.less"
import { convertSize, fileExtension } from "../../../utils/utils"
import BlackButton from "../../UI/Button/BlackBtn/BlackButton"
import { useAppDispatch } from "../../../hooks/redux"
import { fileSlice } from "../../../store/reducers/fileReducer"
import { queryFile } from "../../../store/reducers/actionCreators/file"
import { propertiesFile } from "../../../models/IFIle"
import { userSlice } from "../../../store/reducers/userReducer"
import { Link } from "react-router-dom"
import { errorsSlice } from "../../../store/reducers/errorsReducer"
interface FileItemInterface {
	name: string
	date: string
	size: number
	id: number
	type: string
	file?: propertiesFile
}
const FileItem: FC<FileItemInterface> = ({
	name,
	date,
	size,
	id,
	type,
	file,
}) => {
	const useDispatch = useAppDispatch()
	const { setCurrentDir, deleteFile: deleteFileRedux } = fileSlice.actions
	const { changeSpace } = userSlice.actions
	const { setErrors } = errorsSlice.actions
	const change = () => {
		if (isFolder) useDispatch(setCurrentDir(id))
	}
	let source: string
	let isFolder: any
	// console.log(name)
	const extension = fileExtension(type)
	if (type === "dir") {
		isFolder = s.files_item_folder
		source = "../../../folder.png"
	} else {
		source = fileExtension(type)
	}
	const downloadFile = async (e: Event) => {
		e.stopPropagation()
		queryFile.downloadFile(file)
	}
	const deleteFile = async (e: Event) => {
		e.stopPropagation()
		const response = await queryFile.deleteFile(file, useDispatch)
		if (response) {
			useDispatch(setErrors({ error: response, visible: true, isError: false }))
			useDispatch(deleteFileRedux(file!.id))
			useDispatch(changeSpace(-file!.size))
		}
	}
	const Links = async (id: number) => {
		file?.accessLink
			? navigator.clipboard
					.writeText(
						import.meta.env.VITE_APP_LINK_SARING + "?Link=" + file.accessLink
					)
					.then(() =>
						useDispatch(
							setErrors({
								error: "Посилання скопійоване",
								visible: true,
								isError: false,
							})
						)
					)
			: queryFile.getLinkFile(id, useDispatch)
	}
	return (
		<div className={`${s.files_item_rows} ${isFolder}`} onClick={change}>
			<div className={s.files_item_icon}>
				<img src={source} alt="#" />
			</div>
			<div className={s.files_item_name}>
				<span>{name}</span>
				{type == "dir" ? (
					""
				) : (
					<BlackButton onClick={downloadFile} tabIndex={-1}>
						скачати
					</BlackButton>
				)}
			</div>
			<div className={s.files_item_date}>
				{date.substring(0, 10)} {date.substring(19, 12)}
				<BlackButton onClick={deleteFile} tabIndex={-1}>
					Видалити
				</BlackButton>
			</div>
			<div className={s.files_item_size}>
				{type == "dir" ? "----" : convertSize(size)}
				{/* {convertSize(size)} */}
				{type == "dir" ? (
					""
				) : (
					<BlackButton onClick={() => Links(id)} tabIndex={-1}>
						{file?.accessLink ? "Скопіювати посилання" : "Поділитись"}
					</BlackButton>
				)}
			</div>
		</div>
	)
}

export default FileItem
