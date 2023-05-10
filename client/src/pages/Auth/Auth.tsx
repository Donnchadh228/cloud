import React, { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { userSlice } from "../../store/reducers/userReducer"
import { CLOUD_ROUTE, REGISTRATION_ROUTE } from "../../utils/const"
import BlackButton from "../../components/UI/Button/BlackBtn/BlackButton"
import MyForm from "../../components/UI/MyForm/MyForm"
import WhiteInput from "../../components/UI/Input/WhiteInput/WhiteInput"
import { queryUser } from "../../store/reducers/actionCreators/user"
import s from "./auth.module.less"
import { useNavigate } from "react-router-dom"
import { queryFile } from "../../store/reducers/actionCreators/file"
import { fileSlice } from "../../store/reducers/fileReducer"

interface User {
	login: string
	email: string
	password: string
}
type GetUser = {
	data: User[]
}

const Auth = () => {
	const navigate = useNavigate()
	const needLogin = location.pathname === REGISTRATION_ROUTE
	document.title = needLogin ? "Реєстрація" : "Авторизація"

	const { isAuth } = useAppSelector((state) => state.userReducer)
	const { login: loginReducer, registration: registrationReducer } =
		userSlice.actions
	const { setCurrentDir } = fileSlice.actions
	const dispatch = useAppDispatch()
	const [login, setLogin] = useState<string>("")
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [emailOrLogin, setEmailOrLogin] = useState<string>("")
	const [error, setError] = useState<String>("")

	//ТУТ НАЧИНАЕМ
	useEffect(() => {
		if (isAuth) {
			console.log("asdasd")
			navigate(CLOUD_ROUTE)
		}
	}, [isAuth])
	const auth = async () => {
		if (needLogin) {
			let user = await queryUser.registration(email, login, password, setError)

			if (user) {
				dispatch(registrationReducer(user))
			}
		} else {
			let user
			user = await queryUser.authorization(emailOrLogin, password, setError)
			if (user) {
				dispatch(loginReducer(user))
			}
		}
		const currentDirId = await queryFile.getCurrent()
		dispatch(setCurrentDir(currentDirId))
	}

	return (
		<>
			<div className={s.backgroundImage}>
				<MyForm>
					<h2 className={s.auth_title}>
						{needLogin ? "Реєстрація" : "Увійти"}
					</h2>

					{needLogin ? (
						[
							<div key={"email"} className={s.auth_group}>
								<label htmlFor="email">Введіть пошту</label>
								<WhiteInput
									type="text"
									value={email}
									setValue={setEmail}
									name="email"
									id="email"
									placeholder="Введіть пошту"
								/>
							</div>,
							<div key={"login"} className={s.auth_group}>
								<label htmlFor="login">Введіть логін</label>
								<WhiteInput
									type="text"
									value={login}
									setValue={setLogin}
									name="login"
									id="login"
									placeholder="Введіть логін"
								/>
							</div>,
						]
					) : (
						<div className={s.auth_group}>
							<label htmlFor="emailOrLogin">Введіть логін або пошту</label>
							<WhiteInput
								type="text"
								value={emailOrLogin}
								setValue={setEmailOrLogin}
								name="emailOrLogin"
								id="emailOrLogin"
								placeholder="Введіть логін або пошту"
							/>
						</div>
					)}
					<div className={s.auth_group}>
						<label htmlFor="password">Введіть пароль</label>
						<WhiteInput
							type="password"
							value={password}
							setValue={setPassword}
							name="password"
							id="password"
							placeholder="Введіть пароль"
						/>
					</div>
					<div className={s.auth_error}>{error}</div>
					<BlackButton onClick={auth}>
						{needLogin ? "Зареєструватись" : "Увійти"}
					</BlackButton>
				</MyForm>
			</div>
		</>
	)
}

export default Auth
