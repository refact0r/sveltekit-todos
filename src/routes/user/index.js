import clientPromise from '$lib/db'

export const get = async (context) => {
	// Connecting to DB
	// All database code can only run inside async functions as it uses await
	const client = await clientPromise
	const db = client.db('Todos')

	// Checking for auth coming from hooks' handle({ request, resolve })
	if (!context.locals.user) {
		return {
			status: 401,
			body: {
				message: 'Unauthorized'
			}
		}
	}

	const user = await db.collection('users').findOne({ _id: context.locals.user.uid })

	if (!user) {
		return {
			status: 404,
			body: {
				message: 'User not found'
			}
		}
	}

	// Find a proper way in findOne(), I've run out of gas ;)
	delete user.password

	return {
		status: 200,
		body: user
	}
}
