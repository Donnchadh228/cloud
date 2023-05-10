import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

import { Provider } from "react-redux"

import "./main.less"
import { setupStore } from "./store/store"

const store = setupStore()
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<Provider store={store}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</Provider>
)
