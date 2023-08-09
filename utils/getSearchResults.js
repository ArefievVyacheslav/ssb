const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

module.exports = async function getSearchResults(searchTerm) {
  try {
    await client.connect();
    const db = await client.db('ss');

    const pipeline = [
      {
        $search: {
          index: 'name_text', // Replace with the name of your text search index
          text: {
            query: searchTerm,
            path: ['name', 'subcategory', 'description', 'gender', 'brand', 'color'] // Fields to search in
          }
        }
      },
      {
        $project: {
          score: { $meta: 'searchScore' },
          data: '$$ROOT'
        }
      },
      {
        $sort: { score: -1 } // Sort by search score in descending order
      }
    ];

    const result = await db.collection('shoes').aggregate(pipeline).toArray();

    return result;
  } catch (error) {
    console.error('Failed to get search results:', error);
    throw error;
  } finally {
    client.close();
  }
}
