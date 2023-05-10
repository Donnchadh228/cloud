import { FC, memo, useMemo } from "react"
import { NavLink } from "react-router-dom"
//COMPONENTS
import Container from "../../Container/Container"
import ProgressBar from "../../UI/ProgressBar/ProgressBar"
import { bytesConvertToGb } from "../../../utils/utils"
import GreyButton from "../../UI/Button/GreyBtn/GreyButton"
import WhiteButton from "../../UI/Button/WhiteBtn/WhiteButton"
//REDUX
import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import { userSlice } from "../../../store/reducers/userReducer"

import s from "./NavBar.module.less"
import {
	REGISTRATION_ROUTE,
	LOGIN_ROUTE,
	HOME_ROUTE,
} from "../../../utils/const"
import { fileSlice } from "../../../store/reducers/fileReducer"

const NavBar: FC = () => {
	const { isAuth, user } = useAppSelector((state) => state.userReducer)
	const { logout: logouts } = userSlice.actions
	const { logout: logoutFile } = fileSlice.actions
	const dispatch = useAppDispatch()
	const logout = () => {
		dispatch(logouts(false))
		dispatch(logoutFile(false))
	}
	const usedSpace = user ? bytesConvertToGb(user!.usedSpace) : 0
	const diskSpace = user ? bytesConvertToGb(user!.diskSpace) : 0
	return (
		<div className={s.navbar}>
			<Container className="flexbox space-between">
				<div className={s.navbar__left}>
					<NavLink to={HOME_ROUTE}>/CLOUD//</NavLink>
				</div>
				{isAuth ? (
					[
						<div className={s.navbar__center} key="1">
							<ProgressBar value={usedSpace} max={diskSpace} units="Gb" />
						</div>,
						<div className={s.navbar__right} key="2">
							<GreyButton onClick={logout}>Вийти</GreyButton>
						</div>,
					]
				) : (
					<div className={s.navbar__right}>
						<GreyButton tabIndex={-1}>
							<NavLink to={LOGIN_ROUTE}>Увійти</NavLink>
						</GreyButton>
						<WhiteButton tabIndex={-1}>
							<NavLink to={REGISTRATION_ROUTE}>Зареєструватись</NavLink>
						</WhiteButton>
					</div>
				)}
			</Container>
		</div>
	)
}

export default NavBar
