import stringHash from 'string-hash'
import * as cookie from 'cookie'
import { v4 as uuid } from 'uuid'
import { ObjectId } from 'mongodb'
import clientPromise from '$lib/db'

export const post = async ({ body }) => {
	// Connecting to DB
	// All database code can only run inside async functions as it uses await
	const client = await clientPromise
	const db = client.db('Todos')

	// Is there a user with such an email?
	const user = await db.collection('users').findOne({ email: body.email })

	// If there is, either send status 409 Conflict and inform the user that their email is already taken
	// or send status 202 or 204 and tell them to double-check on their credentials and try again - it is considered more secure
	if (user) {
		return {
			status: 409,
			body: {
				message: 'User with that email already exists'
			}
		}
	}

	// Add user to DB
	// All database code can only run inside async functions as it uses await
	const result = await db.collection('users').insertOne({
		name: body.name,
		email: body.email,
		password: stringHash(body.password)
	})

	result._id = result.insertedId
	delete result.insertedId
	delete result.password

	// Add cookie with user's email to DB
	// All database code can only run inside async functions as it uses await
	const cookieId = uuid()
	await db.collection('cookies').insertOne({
		_id: cookieId,
		userId: ObjectId(result._id)
	})

	// Set cookie
	const headers = {
		'Set-Cookie': cookie.serialize('sessionId', cookieId, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7,
			sameSite: 'strict',
			path: '/'
		})
	}

	return {
		status: 200,
		headers,
		body: {
			user: result
		}
	}
}
