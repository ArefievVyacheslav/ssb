const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

module.exports = async function getSearchResults(searchTerm) {
  try {
    await client.connect();
    const db = await client.db('ss');
    const clothes = await db.collection('clothes').find({ $text: { $search: searchTerm } })
      .project({ score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .toArray() || [];

    const shoes = await db.collection('shoes').find({ $text: { $search: searchTerm } })
      .project({ score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .toArray() || [];

    const accessories = await db.collection('accessories').find({ $text: { $search: searchTerm } })
      .project({ score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .toArray() || [];

    const allResults = [...clothes, ...shoes, ...accessories];

    // Сортировка по убыванию релевантности
    const sortedResults = allResults.sort((a, b) => b.score - a.score);

    return sortedResults;
  } catch (error) {
    console.error('Failed to get search results:', error);
    throw error;
  } finally {
    client.close();
  }
}
