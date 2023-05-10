import { FC, memo } from "react"

import s from "./ProgressBar.module.less"

interface progress {
	value: number
	max: number
	units?: string | ""
}

const ProgressBar: FC<progress> = memo(({ value, max, units }) => {
	const percentage = Math.floor((value / max) * 100)
	return (
		<div className={s.progressBar}>
			<div className={s.progressBar__label}>
				{value}
				{units} / {max}
				{units}
			</div>
			<div
				className={s.progressBar__percent}
				style={{ width: `${percentage}%` }}
			></div>
		</div>
	)
})

export default ProgressBar
