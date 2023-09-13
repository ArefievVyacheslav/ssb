const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

module.exports = async function getSearchResults(searchTerm) {
  try {
    await client.connect();
    const db = await client.db('ss');

    return await db.collection('all')
      .find({
        $text: {
          $search: searchTerm,
          $caseSensitive: false, // Регистронезависимый поиск
          $diacriticSensitive: false // Поиск без учёта диакритики
        }
      }, {
        projection: {
          id: 1, brand: 1, category: 1, color: 1, like: 1, link: 1, name: 1,
          images: 1, oldprice: 1, price: 1, sale: 1, shop: 1, sizes: 1, subcategory: 1
        }
      })
      .toArray();
  } catch (error) {
    console.error('Failed to get search results:', error);
    throw error;
  } finally {
    await client.close();
  }
}
