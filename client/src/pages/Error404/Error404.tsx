import React from "react"

import Container from "../../components/Container/Container"

import s from "./Error404.module.less"
const Error404: React.FC = () => {
	document.title = "Error404"
	return (
		<div className={`${s.Error404}  background-image`}>
			<Container>
				Вибачте, але сторінка, яку ви шукаєте, не знайдена. Можливо, вона була
				видалена або переміщена. Будь ласка, перевірте правильність введеної
				адреси або перейдіть на головну сторінку сайту.
			</Container>
		</div>
	)
}

export default Error404
