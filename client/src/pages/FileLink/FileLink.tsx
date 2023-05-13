import React, { useEffect, useState } from "react"
import s from "./FileLink.module.less"
import Container from "../../components/Container/Container"
import FileItem from "../../components/Cloud/fileItem/FileItem"
import { convertSize } from "../../utils/utils"
import BlackButton from "../../components/UI/Button/BlackBtn/BlackButton"
import styles from "./FileLink.module.less"
import { batch } from "react-redux"
import { queryFile } from "../../store/reducers/actionCreators/file"
const FileLink = () => {
	const [file, setFile] = useState<any>({})
	const [loading, setLoading] = useState<boolean>(true)
	let searchParams = new URLSearchParams(window.location.search)

	// Получаем значение параметра "Link"
	let linkParam: any = searchParams.get("Link")
	// console.log(linkParam)
	useEffect(() => {
		queryFile
			.getFileByLink(linkParam)
			.then((file) => setFile(file))
			.then(() => setLoading(false))
	}, [])

	return (
		<Container>
			{!loading ? (
				<>
					<div className={s.link}>
						<div>Назва</div>
						<div>Розмір</div>
					</div>
					<br />
					{file.name ? (
						[
							<div key={1} className={s.link}>
								<div>{file.name}</div>
								<div>{convertSize(file.size)}</div>
							</div>,
							<BlackButton
								onClick={() => queryFile.downloadByLink(linkParam, file)}
								key={2}
								style={{ color: "white", width: "100%" }}
							>
								Завантажити
							</BlackButton>,
						]
					) : (
						<div className={s.link}>
							<div>файлу немає</div>
						</div>
					)}
				</>
			) : (
				<div className={s.loading}>
					Loading...
					<span></span>
				</div>
			)}
		</Container>
	)
}

export default FileLink
