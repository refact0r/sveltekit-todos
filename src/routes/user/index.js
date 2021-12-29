import clientPromise from '$lib/db'

export async function get(request) {
	const client = await clientPromise
	const db = client.db('Todos')

	if (!request.locals.user) {
		return {
			status: 401,
			body: {
				message: 'Unauthorized'
			}
		}
	}

	const user = await db.collection('users').findOne({ _id: request.locals.user._id })

	if (!user) {
		return {
			status: 404,
			body: {
				message: 'User not found'
			}
		}
	}

	delete user.password

	return {
		status: 200,
		body: user
	}
}

export async function put(request) {
	try {
		const client = await clientPromise
		const db = client.db('Todos')
		const collection = db.collection('todos')
		const todo = JSON.parse(request.body)
		await collection.updateOne(
			{ _id: todo._id },
			{ $set: { name: todo.name, completed: todo.completed } }
		)

		return {
			status: 200
		}
	} catch (err) {
		console.log(err)
		return {
			status: 500,
			body: {
				error: 'An error occured'
			}
		}
	}
}
