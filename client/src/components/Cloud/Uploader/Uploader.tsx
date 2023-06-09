import React, { useEffect, useState } from "react"
import s from "./Uploader.module.less"
import ProgressBar from "../../UI/ProgressBar/ProgressBar"
import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import { uploadSlice } from "../../../store/reducers/uploaderReducer"
interface interfaceUp {
	files: any
}
const Uploader: React.FC<interfaceUp> = ({ files }) => {
	const { hideUploader, removeUploadFile, showUploader } = uploadSlice.actions
	const [bool, setBool] = useState<boolean>(false)
	const useDispatch = useAppDispatch()
	useEffect(() => {
		files.length == 0
			? useDispatch(hideUploader())
			: useDispatch(showUploader())
	}, [files.length])

	return (
		<div className={s.uploader}>
			<span className={s.close} onClick={() => useDispatch(hideUploader())}>
				X
			</span>
			<h1 className={s.title}>Історія </h1>
			<div className={s.block_items}>
				{files.map((file: any) => (
					<div key={file.id} className={s.file_item}>
						<span
							className={s.close_item}
							onClick={() => useDispatch(removeUploadFile(file.id))}
						>
							x
						</span>
						{file.name}
						<ProgressBar
							max={100}
							units="%"
							value={file.progress}
						></ProgressBar>
					</div>
				))}
			</div>
		</div>
	)
}

export default Uploader
