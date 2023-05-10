import React, { ReactNode, memo } from "react"
import s from "./GreyButton.module.less"
interface button {
	children: ReactNode
	[props: string]: any
}
const GreyButton: React.FC<button> = ({ children, ...props }) => {
	return (
		<button {...props} className={`${s.greyBtn}`}>
			{children}
		</button>
	)
}

export default memo(GreyButton)
