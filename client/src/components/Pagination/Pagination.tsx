import React, { useState } from "react"
import s from "./Pagination.module.less"
interface PaginationInterface {
	count: number
	activePage: number
	changePage: Function
}
const Pagination: React.FC<PaginationInterface> = ({
	count,
	activePage,
	changePage,
}) => {
	const pages = []
	let maxPagesToShow = 10
	const countSide = 4
	let currentCount = 0
	let check0or1 = count !== 1 && count !== 0
	if (count <= 10) {
		for (let i = 2; i < count; i++) {
			pages.push({ number: i, name: i })
		}
	} else {
		for (let i = activePage; i > activePage - countSide; i--) {
			if (i > 1 && i < count) {
				pages.unshift({ number: i, name: i })
				currentCount++
			}
		}
		for (let i = activePage + 1; i < activePage + countSide; i++) {
			if (i <= count - 1) {
				pages.push({ number: i, name: i })
				currentCount++
			}
		}
	}

	const handleChangePage = (n: number) => {
		changePage(n)
	}
	return (
		<div className={s.pagination}>
			<div
				onClick={() => handleChangePage(1)}
				className={`${1 == activePage ? s.div__active : ""} ${
					s.pagination__block
				}`}
			>
				1
			</div>
			{pages.map((item) => (
				<div
					onClick={() => handleChangePage(item.number)}
					key={item.number}
					className={`${item.number == activePage ? s.div__active : ""} ${
						s.pagination__block
					}`}
				>
					{item.name}
				</div>
			))}
			{count !== 1 && count !== 0 ? (
				<div
					onClick={() => handleChangePage(count)}
					className={`${count == activePage ? s.div__active : ""} ${
						s.pagination__block
					}`}
				>
					{count}
				</div>
			) : (
				""
			)}
		</div>
	)
}

export default Pagination
