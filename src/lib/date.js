const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function epochToText(epoch) {
	let current = new Date()
	let date = new Date(epoch)
	let str = 'Due '
	if (isToday(current, date)) {
		let diff = Math.floor((date - current) / 1000 / 60)
		if (diff > 0 && diff < 60) {
			str += `in ${diff} min`
		} else if (diff <= 0 && diff > -60) {
			str += `${Math.abs(diff)} min ago`
		} else {
			str += `at ${formatTime(date)}`
		}
	} else {
		if (isYesterday(current, date)) {
			str += 'yesterday '
		} else if (isTomorrow(current, date)) {
			str += 'tomorrow '
		} else {
			str += `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} `
		}
		str += `at ${formatTime(date)}`
	}
	return str
}

function formatTime(date) {
	let hours = date.getHours()
	let mins = String(date.getMinutes()).padStart(2, '0')
	if (hours === 0) {
		return `12:${mins} AM`
	}
	if (hours < 12) {
		return `${hours}:${mins} AM`
	}
	if (hours === 12) {
		return `12:${mins} PM`
	}
	if (hours > 12) {
		return `${hours - 12}:${mins} PM`
	}
}

function isToday(current, date) {
	return (
		current.getDate() === date.getDate() &&
		current.getMonth() === date.getMonth() &&
		current.getFullYear() === date.getFullYear()
	)
}

function isTomorrow(current, date) {
	let copy = new Date(date.getTime())
	copy.setDate(date.getDate() - 1)
	return isToday(current, copy)
}

function isYesterday(current, date) {
	let copy = new Date(date.getTime())
	copy.setDate(copy.getDate() + 1)
	return isToday(current, copy)
}
