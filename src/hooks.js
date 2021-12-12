import cookie from 'cookie'
import clientPromise from '$lib/db'

// Sets context in endpoints
// Try console logging context in your endpoints' HTTP methods to understand the structure
export const handle = async ({ request, resolve }) => {
	console.log('handle')
	// Connecting to DB
	// All database code can only run inside async functions as it uses await

	// Getting cookies from request headers - all requests have cookies on them
	const cookies = cookie.parse(request.headers.cookie || '')

	// If there are no cookies, the user is not authenticated
	if (cookies.session_id) {
		// Searching DB for the user with the right cookie
		// All database code can only run inside async functions as it uses await
		const client = await clientPromise
		const db = client.db('Todos')
		const cookie = await db.collection('cookies').findOne({ cookieId: cookies.session_id })
		console.log('getting cookie')

		// If there is that user, authenticate him and pass his email to context
		if (cookie) {
			request.locals.user = {
				uid: cookie.uid
			}
		}
	}

	const response = await resolve(request)

	return {
		...response,
		headers: {
			...response.headers
			// You can add custom headers here
			// 'x-custom-header': 'potato'
		}
	}
}

// Sets session on client-side
// try console logging session in routes' load({ session }) functions
export const getSession = async (request) => {
	// Pass cookie with authenticated & email properties to session
	console.log('getSession')
	return { user: request.locals.user }
}
