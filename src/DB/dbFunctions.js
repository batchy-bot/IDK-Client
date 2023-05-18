import { MongoClient } from 'mongodb';

const getAllDataFromCollection = async () => {

    const mongoURI = 'mongodb://localhost:27017';
    const dbName = 'idk-socmed';
    const collectionName = 'idk-users';

    try {
        const client = new MongoClient(mongoURI);
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const data = await collection.find().toArray();

        await client.close();

        return data;
    } catch (error) {
        console.error('Error retrieving data:', error);
        return [];
    }
};

export default getAllDataFromCollection;
