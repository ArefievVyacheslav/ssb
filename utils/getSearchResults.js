const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
const stringSimilarity = require("string-similarity");

module.exports = async function getSearchResults(searchTerm) {
  try {
    await client.connect();
    const db = await client.db('ss');

    const allResults = (await db.collection('all')
      .find({}, {
        projection: {
          id: 1, brand: 1, category: 1, color: 1, like: 1, link: 1, name: 1,
          images: 1, oldprice: 1, price: 1, sale: 1, shop: 1, sizes: 1
        }
      })
      .toArray())
      .map(product => ({ ...product, textSearch: product.gender + ' ' + product.subcategory + ' '
          + product.brand + ' ' + product.category + ' ' + product.color + ' ' + product.shop + ' ' + 'со скидкой '
          + product.sale + '% ' + product.sizes.reduce((acc, size) => acc += size + ' размера ', '') }))

    allResults.forEach(productObj => productObj.score = stringSimilarity
      .compareTwoStrings([...new Set(productObj.textSearch.toLowerCase().split(' '))].join(' '), searchTerm.toLowerCase()))
    // Сортировка по убыванию релевантности
    return allResults.sort((a, b) => b.score - a.score).filter(product => product.score > searchTerm.length / 100);
  } catch (error) {
    console.error('Failed to get search results:', error);
    throw error;
  } finally {
    await client.close();
  }
}
