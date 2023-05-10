import React, { memo } from "react"
import Container from "../Container/Container"

import s from "./Footer.module.less"

const Footer: React.FC = () => {
	return (
		<footer id={s.footer}>
			<Container>The Privacy Company. Cloud All rights reserved© </Container>
		</footer>
	)
}

export default memo(Footer)
