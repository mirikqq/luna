import axios from "axios"
import { env } from "bun"

let token = ""

export const useAxios = axios.create({
	baseURL: env.SERVER_API,
})

useAxios.interceptors.response.use((response) => {
	const lowerCaseHeaders = Object.fromEntries(
		Object.entries(response.headers).map(([key, value]) => [key.toLowerCase(), value]),
	)
	token = lowerCaseHeaders["set-cookie"]?.findLast(
		(el: string) => el.split(";")[0].split("=")[0] === "3x-ui",
	)
	return response
})

useAxios.interceptors.request.use((request) => {
	request.headers.Cookie = [token]
	return request
})
