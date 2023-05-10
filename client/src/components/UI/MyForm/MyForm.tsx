import React, { ReactNode } from "react"
import s from "./MyForm.module.less"
interface FormProps {
	children: ReactNode
}
const MyForm: React.FC<FormProps> = ({ children }) => {
	return <div className={s.form}>{children}</div>
}

export default MyForm
