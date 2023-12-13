const fetchData = async (url) => {
	return await fetch(url)
		.then(res => res.json())
		.then(data => { return data })
}

const getKeys = (obj) => {
	const keys = []
	for (const key in obj) {
		keys.push(key)
	}
	return keys
}

const changeLocalStorageData = (key, className, newParticipantsCount) => {
	const arr = JSON.parse(localStorage.getItem(key))
	arr.forEach(element => {
		if (element.name === className) {
			element.currentParticipants = newParticipantsCount
			localStorage.setItem(key, JSON.stringify(arr))
		}
	});
}

const createButton = (text, attributeName, attribute, className) => {
	const button = document.createElement('button')
	button.className = className
	button.textContent = text
	button.setAttribute(attributeName, attribute)
	return button
}

const createTable = (name, colNumber) => {
	const table = document.createElement('table')
	const thead = document.createElement('thead')
	const tr = document.createElement('tr')
	const th = document.createElement('th')
	th.colSpan = colNumber
	th.textContent = name

	table.appendChild(thead)
	thead.appendChild(tr)
	tr.appendChild(th)

	return table
}

const createTableHeaders = (headers) => {
	const tr = document.createElement('tr')

	headers.forEach(header => {
		const th = document.createElement('th')
		th.textContent = header
		tr.appendChild(th)
	});

	return tr
}

const fillTable = (headers, data) => {
	const tbody = document.createElement('tbody')

	data.forEach(obj => {
		const tr = document.createElement('tr')

		headers.forEach(element => {
			const td = document.createElement('td')
			const buttonSubscribe = createButton('Subscribe', 'subscribe-name', obj.name, 'subscribe')
			const buttonUnsubscribe = createButton('Unsubscribe', 'unsubscribe-name', obj.name, 'unsubscribe')


			td.textContent = obj[`${element}`]
			if (element === 'maxParticipants') {
				td.setAttribute('max-participants', obj.name)
			}
			if (element === 'currentParticipants') {
				td.setAttribute('class-name', obj.name)
			}
			if (element === 'Subscribe') {
				td.appendChild(buttonSubscribe)
			}
			if (element === 'Unsubscribe') {
				td.appendChild(buttonUnsubscribe)
			}

			tr.appendChild(td)
		});

		tbody.appendChild(tr)
	})
	return tbody
}


const data = await fetchData('./data/timetable.json')
const timetableKey = 'data'

if (!localStorage.getItem(timetableKey)) {
	localStorage.setItem(timetableKey, JSON.stringify(data))
}


const keys = getKeys(data[0])
keys.push('Subscribe')
keys.push('Unsubscribe')

const table = createTable('Timetable of classes', 7)
const tableHeaders = createTableHeaders(keys)
const tableBody = fillTable(keys, JSON.parse(localStorage.getItem('data')))

table.firstElementChild.appendChild(tableHeaders)
table.appendChild(tableBody)

document.body.appendChild(table)

const subscribeBtn = document.querySelectorAll('.subscribe')
const unsubscribeBtn = document.querySelectorAll('.unsubscribe')

subscribeBtn.forEach(button => {
	button.addEventListener('click', () => {
		const buttonAtr = button.getAttribute('subscribe-name')
		const maxParticipants = document.querySelector(`[max-participants="${buttonAtr}"]`)
		const participantsCount = document.querySelector(`[class-name="${buttonAtr}"]`)

		if (+maxParticipants.textContent > +participantsCount.textContent) {
			participantsCount.textContent = +participantsCount.textContent + 1
			changeLocalStorageData(timetableKey, buttonAtr, participantsCount.textContent)
		}
		if (+maxParticipants.textContent === +participantsCount.textContent) {
			button.disabled = true
		}
	})
})

unsubscribeBtn.forEach(button => {
	button.addEventListener('click', () => {
		const buttonAtr = button.getAttribute('unsubscribe-name')
		const btnSubscr = document.querySelector(`[subscribe-name=${buttonAtr}]`)
		const maxParticipants = document.querySelector(`[max-participants="${buttonAtr}"]`)
		const participantsCount = document.querySelector(`[class-name="${buttonAtr}"]`)

		if (+maxParticipants.textContent >= +participantsCount.textContent && +participantsCount.textContent > 0) {
			participantsCount.textContent = +participantsCount.textContent - 1
			changeLocalStorageData(timetableKey, buttonAtr, participantsCount.textContent)
		}

		if (+maxParticipants.textContent > +participantsCount.textContent) {
			btnSubscr.disabled = false
		}
	})
})
