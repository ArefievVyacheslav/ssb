const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

module.exports = async function getSearchResults(searchTerm) {
  try {
    await client.connect();
    const db = await client.db('ss');

    const [clothes, shoes, accessories] = await Promise.all([
      db.collection('clothes').find({ $text: { $search: searchTerm } })
        .project({ score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .toArray(),

      db.collection('shoes').find({ $text: { $search: searchTerm } })
        .project({ score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .toArray(),

      db.collection('accessories').find({ $text: { $search: searchTerm } })
        .project({ score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .toArray()
    ]);

    const combineAndMap = (products, collection) =>
      products.map(product => ({
        id: product.id,
        brand: product.brand,
        category_t: product.category_t,
        collection: collection,
        color: product.color,
        like: product.like,
        link: product.link,
        name: product.name,
        images: product.images,
        oldprice: product.oldprice,
        price: product.price,
        sale: product.sale,
        shop: product.shop,
        sizes: product.sizes,
        score: product.score
      }));

    const allResults = [
      ...combineAndMap(clothes, 'clothes'),
      ...combineAndMap(shoes, 'shoes'),
      ...combineAndMap(accessories, 'accessories')
    ];

    // Сортировка по убыванию релевантности
    return allResults.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Failed to get search results:', error);
    throw error;
  } finally {
    await client.close();
  }
}
