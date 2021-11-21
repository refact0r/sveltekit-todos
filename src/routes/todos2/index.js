import clientPromise from '$lib/db';
import { ObjectId } from 'mongodb';

export async function get(request) {
    try {
        const client = await clientPromise;
        const db = client.db('Todos');
        const collection = db.collection('Todos');
        const todos = await collection.find({}).toArray();

        return {
            status: 200,
            body: {
                todos
            }
        }
    } catch (err) {
        console.log(err);
        return {
            status: 500,
            body: {
                error: 'An error occured'
            }
        }
    }
}

export async function post(request) {
    
}

export async function put(request) {
    
}

export async function del(request) {
    
}
