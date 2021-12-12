import * as cookie from 'cookie'
import clientPromise from '$lib/db'

export async function post(request) {
	try {
		const cookies = cookie.parse(request.headers.cookie || '')
		const client = await clientPromise
		const db = client.db('Todos')
		await db.collection('cookies').deleteOne({ cookieId: cookies.session_id })

		return {
			headers: {
				'Set-cookie': cookie.serialize('session_id', '', {
					httpOnly: true,
					sameSite: 'strict',
					path: '/',
					expires: new Date(0)
				})
			},
			body: {
				ok: true
			}
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
