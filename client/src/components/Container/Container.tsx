import React, { ReactNode } from "react"
import s from "./Сontainer.module.less"
interface ContainerProps {
	children: ReactNode
	className?: string
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
	return <div className={`${s.container} ${className}`}>{children}</div>
}

export default Container
