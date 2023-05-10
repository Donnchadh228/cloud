import React from "react"

import Container from "../../components/Container/Container"

import s from "./UnauthorizedError.module.less"
const UnauthorizedError = () => {
	document.title = "UnauthorizedError"
	return (
		<div className={`${s.Error404}  background-image`}>
			<Container>У вас немає доступу до даної сторінки</Container>
		</div>
	)
}

export default UnauthorizedError
