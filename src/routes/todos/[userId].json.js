import clientPromise from '$lib/db'
import { v4 as uuid } from 'uuid'

export async function get(request) {
	try {
		const client = await clientPromise
		const db = client.db('Todos')
		const collection = db.collection('todos')
		const todos = await collection.find({ userId: request.params.userId }).toArray()

		return {
			status: 200,
			body: {
				todos
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
	try {
		const client = await clientPromise
		const db = client.db('Todos')
		const collection = db.collection('todos')
		const todo = JSON.parse(request.body)
		const todoId = uuid()
		await collection.insertOne({
			_id: todoId,
			name: todo.name,
			completed: false,
			userId: request.params.userId,
			listId: todo.listId
		})

		return {
			status: 200,
			body: {
				status: 'Success'
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
			status: 200,
			body: {
				status: 'Success'
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

export async function del(request) {
	try {
		const client = await clientPromise
		const db = client.db('Todos')
		const collection = db.collection('todos')
		const todo = JSON.parse(request.body)
		await collection.deleteOne({ _id: todo._id })

		return {
			status: 200,
			body: {
				status: 'Success'
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
