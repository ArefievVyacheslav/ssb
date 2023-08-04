const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
const DATABASE_NAME = 'mydatabase';

module.exports = async function getSearchResults(searchTerm) {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collections = ['clothes', 'shoes', 'accessories'];
    const results = [];

    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const result = await collection.find({ $text: { $search: `"${searchTerm}"` } }).toArray();
      results.push(...result);
    }

    console.log(results);
    return results;
  } catch (error) {
    console.error('Failed to get search results:', error);
    throw error;
  } finally {
    client.close();
    console.log('Отключено от MongoDB');
  }
};
