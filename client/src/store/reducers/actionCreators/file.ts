import { AppDispatch, setupStore } from "./../../store"
import { prepareAutoBatched } from "@reduxjs/toolkit"
import { $authHost } from "../../../http"
import { IFile } from "../../../models/IFIle"
import { useAppDispatch } from "../../../hooks/redux"
import { fileSlice } from "../fileReducer"
import { uploadSlice } from "../uploaderReducer"
import { useDispatch } from "react-redux"
export class queryFile {
	static createDir = async (
		name: string,
		parentId: number,
		type: string = "dir",
		setError: Function
	) => {
		try {
			const response = await $authHost.post(
				import.meta.env.VITE_APP_API_URL + "/api/files/",
				{ name, type, parentId }
			)
			// console.log(response.data)
			return response.data
		} catch (e: any) {
			setError(e.response.data.message)
			return undefined
		}
	}

	static getFiles = async (
		parentId?: number,
		sort?: string
	): Promise<IFile> => {
		try {
			let url =
				import.meta.env.VITE_APP_API_URL +
				`/api/files?` +
				`${parentId ? "parentId=" + parentId : ""}&`
			if (sort) {
				url += "sort=" + sort
			}

			const response = await $authHost.get(url)
			const data: IFile = { files: response.data }
			return data
		} catch (e) {
			return { files: [], currentDir: null }
		}
	}
	static getCurrent = async (): Promise<number> => {
		try {
			const response = await $authHost.get(
				import.meta.env.VITE_APP_API_URL + "/api/files/getCurrentDir"
			)

			return response.data.id
		} catch (e) {
			return -1
		}
	}
	static getCurrentPath = async (id: number) => {
		try {
			const response = await $authHost.get(
				import.meta.env.VITE_APP_API_URL +
					"/api/files/getCurrentDirPath?id=" +
					id
			)

			return response.data
		} catch (e) {
			return ""
		}
	}
	static uploadFile = async (
		file: any,
		dirId: number,
		setError: Function,
		dispatch: any
	) => {
		try {
			const formData: any = new FormData()
			if (file.size > 2147483647) {
				setError("File size exceeds 2 GB")
				return ""
			}
			formData.append("file", file)
			formData.append("parentId", String(dirId))
			formData.append("name", formData.get("file").name)
			const { addUploadFile, showUploader, changeUploadFile } =
				uploadSlice.actions
			dispatch(showUploader())
			const uploadFile = { name: file.name, progress: 0, id: Date.now() }

			dispatch(addUploadFile(uploadFile))
			const response = await $authHost.post(
				import.meta.env.VITE_APP_API_URL + "/api/files/upload",
				formData,
				{
					onUploadProgress: (progressEvent: any) => {
						const totalLength = progressEvent.event.lengthComputable
							? progressEvent.event.total
							: progressEvent.event.target.getResponseHeader(
									"content-length"
							  ) ||
							  progressEvent.event.target.getResponseHeader(
									"x-decompressed-content-length"
							  )

						// console.log("total", totalLength)
						if (totalLength) {
							uploadFile.progress = Math.round(
								(progressEvent.loaded * 100) / totalLength
							)
							// console.log(uploadFile.progress)
							// alert(uploadFile.progress)
							dispatch(changeUploadFile(uploadFile))
							// console.log(uploadFile.progress)
						}
					},
				}
			)

			// console.log(response.data)

			return response.data
		} catch (e: any) {
			const { hideUploader, removeLast } = uploadSlice.actions
			dispatch(removeLast())
			setError(e.response.data.message)
			return ""
		}
	}
	static async downloadFile(file: any) {
		try {
			const response: any = await $authHost
				.get(
					import.meta.env.VITE_APP_API_URL +
						`/api/files/download?id=${file.id}`,
					{ responseType: "blob" }
				)
				.then()

			if (response.status === 200) {
				const blob = await response.data
				const downloadUrl = window.URL.createObjectURL(blob)
				const link = document.createElement("a")
				link.href = downloadUrl
				link.download = file.name
				document.body.appendChild(link)
				link.click()
				link.remove()
			}
		} catch (e) {
			console.log(e)
		}
	}
	static async deleteFile(file: any) {
		try {
			const response: any = await $authHost.delete(
				import.meta.env.VITE_APP_API_URL + `/api/files?id=${file.id}`
			)
			return response.data.message
		} catch (e: any) {
			console.log(e.response.data.message)
			// alert(e.response.data.message)
		}
	}
	static async searchFiles(search: string, dispatch: any) {
		try {
			const response: any = await $authHost.get(
				import.meta.env.VITE_APP_API_URL + `/api/files/search?search=` + search
			)
			const { setFile } = fileSlice.actions
			dispatch(setFile(response.data))

			return response.data.message
		} catch (e: any) {
			console.log(e)
			console.log(e.response.data.message)
			// alert(e.response.data.message)
		}
	}
	static async getLinkFile(fileId: number, dispatch: any) {
		try {
			const response: any = await $authHost.get(
				import.meta.env.VITE_APP_API_URL +
					`/api/files/getLinkFile?idFile=` +
					fileId
			)

			const { changeBeforeLink } = fileSlice.actions
			dispatch(changeBeforeLink(response.data))

			return response.data
		} catch (e: any) {
			return {}
			// console.log(e)
		}
	}
	static async getFileByLink(link: string) {
		try {
			const response: any = await $authHost.get(
				import.meta.env.VITE_APP_API_URL +
					`/api/files/getFileByLink?Link=` +
					link
			)
			return response.data == null ? {} : response.data
		} catch (e: any) {
			return {}
		}
	}
	static async downloadByLink(links: string, file: any) {
		try {
			const response: any = await $authHost
				.get(
					import.meta.env.VITE_APP_API_URL +
						`/api/files/downloadByLink?Link=` +
						links,
					{ responseType: "blob" }
				)
				.then()
			console.log(response.data)
			if (response.status === 200) {
				const blob = await response.data
				const downloadUrl = window.URL.createObjectURL(blob)
				const link = document.createElement("a")
				link.href = downloadUrl
				link.download = file.name
				document.body.appendChild(link)
				link.click()
				link.remove()
			}
		} catch (e: any) {
			return {}
		}
	}
}
