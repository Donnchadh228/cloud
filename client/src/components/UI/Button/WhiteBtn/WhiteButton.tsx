import React, { ReactNode, memo } from "react"
import s from "./WhiteButton.module.less"

interface button {
	children: ReactNode
	[props: string]: any
}
const WhiteButton: React.FC<button> = ({ children, ...props }) => {
	return (
		<button {...props} className={s.whiteBtn}>
			{children}
		</button>
	)
}

export default memo(WhiteButton)
