import clientPromise from '$lib/db'
import { v4 as uuid } from 'uuid'

export async function get(request) {
	if (!request.locals.user) {
		return {
			status: 401,
			body: {
				message: 'Unauthorized'
			}
		}
	}
	try {
		const client = await clientPromise
		const db = client.db('Todos')
		const collection = db.collection('lists')
		const lists = await collection.find({ userId: request.locals.user._id }).toArray()

		return {
			status: 200,
			body: {
				lists
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

export async function post(request) {
	if (!request.locals.user) {
		return {
			status: 401,
			body: {
				message: 'Unauthorized'
			}
		}
	}
	try {
		const client = await clientPromise
		const db = client.db('Todos')
		const collection = db.collection('lists')
		const list = JSON.parse(request.body)
		const listId = uuid()
		await collection.insertOne({
			_id: listId,
			name: list.name,
			userId: request.locals.user._id
		})

		return {
			status: 200,
			body: {
				list: {
					_id: listId,
					name: list.name,
					userId: request.locals.user._id
				}
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

export async function put(request) {
	if (!request.locals.user) {
		return {
			status: 401,
			body: {
				message: 'Unauthorized'
			}
		}
	}
	try {
		const client = await clientPromise
		const db = client.db('Todos')
		const collection = db.collection('lists')
		const list = JSON.parse(request.body)
		await collection.updateOne({ _id: list._id }, { $set: { name: list.name } })

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

export async function del(request) {
	if (!request.locals.user) {
		return {
			status: 401,
			body: {
				message: 'Unauthorized'
			}
		}
	}
	try {
		const client = await clientPromise
		const db = client.db('Todos')
		const list = JSON.parse(request.body)
		await db.collection('lists').deleteOne({ _id: list._id })
		await db.collection('todos').deleteMany({ listId: list._id })

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
