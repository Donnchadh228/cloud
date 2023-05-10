import React, { ReactElement } from "react"
import { Routes, Route } from "react-router-dom"
import { authRoutes, publicRoutes } from "../routes"
import { useAppSelector } from "../hooks/redux"
import Error404 from "../pages/Error404/Error404"
import UnauthorizedError from "../pages/UnauthorizedError/UnauthorizedError"

const AppRouter: React.FC = () => {
	const { isAuth } = useAppSelector((state) => state.userReducer)
	return (
		<Routes>
			{authRoutes.map(({ path, Component }) => (
				<Route
					key={path}
					path={path}
					element={isAuth ? <Component /> : <UnauthorizedError />}
				/>
			))}
			{publicRoutes.map(({ path, Component }) => (
				<Route key={path} path={path} element={<Component />} />
			))}
			<Route path="*" element={<Error404 />} />
		</Routes>
	)
}

export default AppRouter
