import React from "react"
import { NavLink } from "react-router-dom"
import { REGISTRATION_ROUTE } from "../../utils/const"

import s from "./home.module.less"
import Container from "../../components/Container/Container"

const Home = () => {
	return (
		<div className={s.home}>
			<Container>
				<h2 className={s.h2}>Зберігайте свої файли у безпеці та доступі</h2>

				<div className={s.info}>
					Наше хмарне сховище надає надійний та безпечний спосіб зберігання
					ваших файлів у Інтернеті. Ми забезпечуємо швидкий доступ до ваших
					файлів з будь-якого пристрою та максимальний рівень захисту даних.
				</div>
				<h3 className={s.free}>
					<span className={s.red}>5 Gb</span> безкоштовного зберігання даних
				</h3>

				<NavLink className={s.button} to={REGISTRATION_ROUTE}>
					Спробувати
				</NavLink>
			</Container>
		</div>
	)
}

export default Home
