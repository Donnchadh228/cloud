import React, { useState, useEffect } from "react"
import Container from "../../components/Container/Container"
import s from "./Cloud.module.less"
import BlackButton from "../../components/UI/Button/BlackBtn/BlackButton"
import Files from "../../components/Cloud/Files/Files"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { fileSlice } from "../../store/reducers/fileReducer"
import { queryFile } from "../../store/reducers/actionCreators/file"
import PopUp from "../../components/UI/PopUp/PopUp"
import { convertSize, resizePath } from "../../utils/utils"
import PopUpUpload from "../../components/UI/PopUp/PopUpUpload"
import Uploader from "../../components/Cloud/Uploader/Uploader"
import WhiteInput from "../../components/UI/Input/WhiteInput/WhiteInput"
import Pagination from "../../components/Pagination/Pagination"
import PopUpError from "../../components/UI/PopUpError/PopUpError"
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
	const [sort, setSort] = useState<string>("")
	const [search, setSearch] = useState<string>("")
	const [searchTimeout, setSearchTimeout] = useState<any>(false)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [countPage, setCountPage] = useState<number>(1)
	const { isVisible, files: filesUpload } = useAppSelector(
		(state) => state.uploadSlice
	)

	const fetchFile = async () => {
		setLoading(true)
		const query: any = await queryFile.getFiles(
			currentDir!,
			sort,
			10,
			currentPage
		)
		const paths = await queryFile.getCurrentPath(currentDir!)

		setCountPage(Math.ceil(query.page / 10))

		setPath(resizePath(paths.path))
		query.currentDir = currentDir
		if (query.files) {
			setLoading(false)
			useDispatch(getFiles(query))
		}
	}
	useEffect(() => {
		fetchFile()
	}, [currentDir, sort, currentPage])

	const backDir = async () => {
		const paths = await queryFile.getCurrentPath(currentDir!)

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
	const searchFile = (e: any) => {
		setSearch(e.target.value)
		if (searchTimeout != false) {
			clearTimeout(searchTimeout)
		}

		if (e.target.value != "") {
			setLoading(true)
			setSearchTimeout(
				setTimeout(
					() => {
						queryFile.searchFiles(e.target.value, useDispatch).then(() => {
							setLoading(false)
							setCountPage(1)
						})
					},
					500,
					e.target.value
				)
			)
		} else {
			fetchFile()
		}
	}
	document.title = "/CLOUD//"

	return (
		<>
			{!user!.isActivated ? (
				<div className={s.activateEmail}>
					Підтвердіть свій обліковий запис через електронну пошту, щоб отримати
					повний доступ до сервісу. Перевірте папку "Спам" або "Нежадані
					повідомлення", якщо не знайшли лист від нас.
				</div>
			) : (
				<div className={s.cloud}>
					<Container>
						<div className={s.button}>
							<BlackButton onClick={backDir}>
								<span>Назад</span>
							</BlackButton>
							<BlackButton onClick={() => openPopup(event!, 1)}>
								Створити нову теку
							</BlackButton>
							<BlackButton onClick={() => openPopup(event!, 2)}>
								Завантажити файл
							</BlackButton>
						</div>
						<div className={s.sortSearch}>
							<select
								className={s.select}
								defaultValue={sort ? sort : "default"}
								onChange={(e) => setSort(e.target.value)}
							>
								<option value="default" disabled>
									Виберіть тип сортування
								</option>
								<option value="name">Name</option>
								<option value="type">type</option>
								<option value="createdAt">date</option>
								<option value="size">size</option>
							</select>
							<WhiteInput
								onChange={searchFile}
								setValue={setSearch}
								type="input"
								value={search}
								placeholder="Введіть назву файлу"
								title="Показує до 20 результатів"
							/>
						</div>
						<div className={s.direction}>
							{user?.login}\{path}
						</div>
						{loading ? (
							<div className={s.loading}>
								Loading...
								<span></span>
							</div>
						) : (
							<div className={s.files}>
								<Files />
							</div>
						)}
					</Container>
					{files.length != 0 ? (
						<Pagination
							count={countPage}
							activePage={currentPage}
							changePage={setCurrentPage}
						/>
					) : (
						""
					)}
					{popup == 1 ? (
						<PopUp setClosePopup={setPopup} title="Create dir"></PopUp>
					) : (
						""
					)}
					{popup == 2 ? (
						<PopUpUpload
							setClosePopup={setPopup}
							title="UploadFile"
						></PopUpUpload>
					) : (
						""
					)}

					<PopUpError />

					{isVisible && <Uploader files={filesUpload} />}
				</div>
			)}
		</>
	)
}

export default Cloud
