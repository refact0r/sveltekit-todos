const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function epochToText(epoch) {
	let date = new Date(epoch)
	let currentDate = new Date()
	let str = 'Due '
	if (
		date.getDate() === currentDate.getDate() &&
		date.getMonth() === currentDate.getMonth() &&
		date.getFullYear() === currentDate.getFullYear()
	) {
		let diff = Math.round((date - currentDate) / 1000 / 60)
		console.log(diff)
		if (diff > 0 && diff < 60) {
			str += `in ${diff} min`
		} else if (diff <= 0 && diff > -60) {
			str += `${Math.abs(diff)} min ago`
		} else {
			str += `at ${formatTime(date)}`
		}
	} else {
		if (
			date.getDate() === currentDate.getDate() - 1 &&
			date.getMonth() === currentDate.getMonth() &&
			date.getFullYear() === currentDate.getFullYear()
		) {
			str += 'yesterday '
		} else if (
			date.getDate() === currentDate.getDate() + 1 &&
			date.getMonth() === currentDate.getMonth() &&
			date.getFullYear() === currentDate.getFullYear()
		) {
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
