import stringHash from 'string-hash'
import * as cookie from 'cookie'
import { v4 as uuid } from 'uuid'
import clientPromise from '$lib/db'
import { ObjectId } from 'mongodb'

export const post = async ({ body }) => {
	const client = await clientPromise
	const db = client.db('Todos')

	const user = await db.collection('users').findOne({ email: body.email })

	if (!user) {
		return {
			status: 401,
			body: {
				message: 'Incorrect email or password'
			}
		}
	}

	if (user.password !== stringHash(body.password)) {
		return {
			status: 401,
			body: {
				message: 'Unauthorized'
			}
		}
	}

	delete user.password

	const cookieId = uuid()
	await db.collection('cookies').insertOne({
		_id: cookieId,
		userId: ObjectId(user._id)
	})

	// Set cookie
	const headers = {
		'Set-Cookie': cookie.serialize('sessionId', cookieId, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
			sameSite: 'strict',
			path: '/'
		})
	}

	return {
		status: 200,
		headers,
		body: {
			message: 'Success',
			user: user
		}
	}
}
