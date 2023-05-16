import React, { FC, useState } from "react"
import s from "../PopUp/PopUp.module.less"
import WhiteInput from "../Input/WhiteInput/WhiteInput"
import MyForm from "../MyForm/MyForm"
import BlackButton from "../Button/BlackBtn/BlackButton"
import { queryFile } from "../../../store/reducers/actionCreators/file"
import { useAppDispatch, useAppSelector } from "../../../hooks/redux"
import fileReducer, { fileSlice } from "../../../store/reducers/fileReducer"
import { isButtonElement } from "react-router-dom/dist/dom"
import errorsReducer, {
	errorsSlice,
} from "../../../store/reducers/errorsReducer"

interface popUpInterface {}
const PopUpError: FC<popUpInterface> = ({}) => {
	const useDispatch = useAppDispatch()
	const { error, visible, isError } = useAppSelector(
		(state) => state.errorsSlice
	)

	const { setErrors } = errorsSlice.actions
	let handleClosePopup = () => {
		useDispatch(setErrors({ error: "", visible: false, isError: false }))
	}

	return (
		<>
			{visible && (
				<div className={s.popup} onClick={handleClosePopup}>
					<div
						className={s.popup_content}
						onClick={(event) => event.stopPropagation()}
					>
						<MyForm>
							<div className={s.popup_header}>
								<div className={s.popup_title}>
									{isError ? "Помилка" : "Повідомлення"}
								</div>
								<button className={s.popup_close} onClick={handleClosePopup}>
									X
								</button>
							</div>
							{!isError ? (
								<div className={s.notification}>{error}</div>
							) : (
								<div className={s.error}>{error}</div>
							)}
						</MyForm>
					</div>
				</div>
			)}
		</>
	)
}

export default PopUpError
