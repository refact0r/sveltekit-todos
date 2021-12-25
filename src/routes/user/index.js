import clientPromise from '$lib/db'
import { ObjectId } from 'mongodb'

export const get = async (context) => {
	const client = await clientPromise
	const db = client.db('Todos')

	if (!context.locals.user) {
		return {
			status: 401,
			body: {
				message: 'Unauthorized'
			}
		}
	}	

	const user = await db.collection('users').findOne({ _id: ObjectId(context.locals.user._id) })

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
