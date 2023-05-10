import { setupStore } from "./../../store"
import { prepareAutoBatched } from "@reduxjs/toolkit"
import { $authHost } from "../../../http"
import { IFile } from "../../../models/IFIle"
import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import { fileSlice } from "../fileReducer"
// import { useDispatch } from "react-redusx"
// const useDispatch = useAppDispatch()
const { addFile } = fileSlice.actions
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
			console.log(response.data)
			return response.data
		} catch (e: any) {
			setError(e.response.data.message)
			return undefined
		}
	}

	static getFiles = async (parentId?: number): Promise<IFile> => {
		try {
			const response = await $authHost.get(
				import.meta.env.VITE_APP_API_URL +
					`/api/files?${parentId ? "parentId=" + parentId : ""}`
			)
			const data: IFile = { files: response.data }
			return data
		} catch (e) {
			return { files: [], currentDir: null }
		}
	}
	static getCurrent = async (): Promise<number> => {
		try {
			console.log(import.meta.env.VITE_APP_API_URL + "api/files/getCurrentDir")
			const response = await $authHost.get(
				import.meta.env.VITE_APP_API_URL + "/api/files/getCurrentDir"
			)
			// console.log(response.data.id)
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
	static uploadFile = async (file: any, dirId: number, setError: Function) => {
		try {
			const formData: any = new FormData()

			formData.append("file", file)
			formData.append("parentId", String(dirId))
			formData.append("name", formData.get("file").name)
			const response = await $authHost.post(
				import.meta.env.VITE_APP_API_URL + "/api/files/upload",
				formData,
				{
					onUploadProgress: (progressEvent: any) => {
						console.log(progressEvent)
						const totalLength = progressEvent.event.lengthComputable
							? progressEvent.event.total
							: progressEvent.event.target.getResponseHeader(
									"content-length"
							  ) ||
							  progressEvent.event.target.getResponseHeader(
									"x-decompressed-content-length"
							  )

						console.log("total", totalLength)
						if (totalLength) {
							let progress = Math.round(
								(progressEvent.loaded * 100) / totalLength
							)
							console.log(progress)
						}
					},
				}
			)
			console.log(response.data)

			return response.data
		} catch (e: any) {
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
			alert(e.response.data.message)
		}
	}
}
