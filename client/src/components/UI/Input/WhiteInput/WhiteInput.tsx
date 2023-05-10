import React, { ChangeEvent, memo } from "react"
import s from "./WhiteInput.module.less"
interface InputProps {
	setValue: (value: string) => void
	value: string
	type: string
	[props: string]: any
}

const WhiteInput: React.FC<InputProps> = ({
	setValue,
	value,
	type,
	...props
}) => {
	const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value)
	}
	return (
		<input
			className={s.whiteInput}
			onChange={handleOnChange}
			value={value}
			type={type}
			{...props}
		/>
	)
}

export default memo(WhiteInput)
