import { returnExtension as ext } from "../types/files"
export const bytesConvertToGb = (byte: number = 0) => {
	return Math.round((byte / (1024 * 1024 * 1024)) * 100) / 100
}

export const fileExtension = (type: string): string => {
	switch (type.toLowerCase()) {
		case ext.txt:
			return "../../../fileText.png"
		case ext.ico:
		case ext.jpeg:
		case ext.png:
		case ext.tiff:
		case ext.webp:
		case ext.ico:
		case ext.jpg:
			return "../../img.png"

		default:
			return "../../../unknown.png"
	}
}
export const formatDate = (date: string) => {
	return date.substring(0, 10)
}
export const resizePath = (inputString: string): string => {
	const firstBackslashIndex = inputString.indexOf("\\")
	if (firstBackslashIndex === -1) {
		return ""
	}
	// возвращаем подстроку, начиная с символа после первого вхождения \
	return inputString.substring(firstBackslashIndex + 1)
}

export const convertSize = (sizeBytes: number): string => {
	const units = ["bytes", "KB", "MB", "GB", "TB"]
	let i = 0
	let size = sizeBytes

	while (size >= 1024 && i < units.length - 1) {
		size /= 1024
		i++
	}

	return `${size.toFixed(2)} ${units[i]}`
}
