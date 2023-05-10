import Auth from "./pages/Auth/Auth"
import Cloud from "./pages/Cloud/Cloud"
import Home from "./pages/Home/Home"
import {
	HOME_ROUTE,
	LOGIN_ROUTE,
	REGISTRATION_ROUTE,
	CLOUD_ROUTE,
} from "./utils/const"
interface Route {
	path: string
	Component: React.ComponentType<any>
}
export const authRoutes: Route[] = [{ path: CLOUD_ROUTE, Component: Cloud }]

export const publicRoutes: Route[] = [
	{
		path: LOGIN_ROUTE,
		Component: Auth,
	},
	{
		path: REGISTRATION_ROUTE,
		Component: Auth,
	},
	{
		path: HOME_ROUTE,
		Component: Home,
	},
]
