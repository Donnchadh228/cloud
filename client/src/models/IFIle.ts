import { returnExtension } from "../types/files"
export type propertiesFile = {
	id: number
	name: string
	type: returnExtension
	size: number
	path: string
	createdAt: string
	userId: number
	parentId: number
	accessLink: string | null
}
export interface IFile {
	files: propertiesFile[]
	currentDir?: number | null
}
