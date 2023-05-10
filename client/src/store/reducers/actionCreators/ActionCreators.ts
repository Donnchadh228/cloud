import axios from "axios"
import { AppDispatch } from "../../store"
interface asd {
	id: number
	text: string
}
export const fetchUser = () => async (dispatch: AppDispatch) => {
	try {
		const response = await axios.get<asd>("localhost:3000/api/user/zxc")
		console.log(response)
	} catch (e) {}
}
