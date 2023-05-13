import { FC } from "react"
import s from "../Files.module.less"
import FileItem from "../fileItem/FileItem"
import { useAppSelector } from "../../../hooks/redux"
interface FilesInterface {}
const Files: FC<FilesInterface> = () => {
	const { currentDir, files } = useAppSelector((state) => state.fileReducer)

	return (
		<div className={`${s.files_item} ${s.noAnim}`}>
			{/* HEADER */}

			{files.length > 0 && (
				<div className={s.files_item_rows}>
					<div className={s.files_item_icon}>тип</div>
					<div className={s.files_item_name}>Назва</div>
					<div className={s.files_item_date}>Дата</div>
					<div className={s.files_item_size}>Розмір</div>
				</div>
			)}

			{files.length > 0 ? (
				files.map((item) => (
					<FileItem
						id={item.id}
						key={item.id}
						name={item.name}
						date={item.createdAt}
						size={item.size}
						type={item.type}
						file={item}
					/>
				))
			) : (
				<div className={s.no_file}>Файлів не знайдено</div>
			)}
			{/* <FileItem name="asd.txt" date="12.02.1223" size="2131" />
			<FileItem name="zxczx" date="12.02.1223" size="2131" />
			<FileItem name="zxczx" date="12.02.1223" size="2131" />
			<FileItem name="zxczx" date="12.02.1223" size="2131" />
			<FileItem name="zxczx" date="12.02.1223" size="2131" />
			<FileItem name="zxczx" date="12.02.1223" size="2131" />
			<FileItem name="zxczx" date="12.02.1223" size="2131" />
			<FileItem name="zxczx" date="12.02.1223" size="2131" />
			<FileItem name="zxczx" date="12.02.1223" size="2131" />
			<FileItem name="zxczx" date="12.02.1223" size="2131" /> */}
		</div>
	)
}

export default Files
