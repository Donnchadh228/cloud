import React, { ReactNode, memo } from "react"
import s from "./BlackButton.module.less"
interface button {
	children: ReactNode
	[props: string]: any
}
const BlackButton: React.FC<button> = ({ children, ...props }) => {
	return (
		<button {...props} className={`${s.blackBtn}`}>
			{children}
		</button>
	)
}

export default memo(BlackButton)
