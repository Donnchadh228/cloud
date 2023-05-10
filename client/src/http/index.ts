import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

const baseURL = import.meta.env.VITE_APP_API_URL

const $host = axios.create({
	baseURL: baseURL,
})

const $authHost = axios.create({
	baseURL: baseURL,
})

const authInterceptor = (config: any) => {
	config.headers.authorization = `Bearer ${localStorage.getItem("accessToken")}`
	return config
}

$authHost.interceptors.request.use(authInterceptor)

export { $host, $authHost }
