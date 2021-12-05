import stringHash from 'string-hash'
import * as cookie from 'cookie'
import { v4 as uuid } from 'uuid'
import clientPromise from '$lib/db'

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

	const cookieId = uuid()

	/*
	// Look for existing email to avoid duplicate entries
	const duplicateUser = await db.collection('cookies').findOne({ uid: user._id })

	// If there is user with cookie, update the cookie, otherwise create a new DB entry
	if (duplicateUser) {
		await db
			.collection('cookies')
			.updateOne({ uid: user._id }, { $set: { cookieId: cookieId } })
	} else {
		await db.collection('cookies').insertOne({ cookieId: cookieId, uid: user._id })
	}
	*/
	await db.collection('cookies').insertOne({ cookieId: cookieId, uid: user._id })

	// Set cookie
	const headers = {
		'Set-Cookie': cookie.serialize('session_id', cookieId, {
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
			user: {
				uid: user._id,
				name: user.name,
				email: user.email
			}
		}
	}
}
