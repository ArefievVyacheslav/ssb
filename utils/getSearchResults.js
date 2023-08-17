const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');
const stringSimilarity = require("string-similarity");

module.exports = async function getSearchResults(searchTerm) {
  try {
    await client.connect();
    const db = await client.db('ss');

    const [clothes, shoes, accessories] = await Promise.all([
      db.collection('clothes').find({})
        .project({ id: 1, brand: 1, category_t: 1, color: 1, gender: 1, like: 1, link: 1, name: 1, images: 1, oldprice: 1, price: 1, sale: 1, shop: 1, sizes: 1 })
        .toArray(),
      db.collection('shoes').find({})
        .project({ id: 1, brand: 1, category_t: 1, color: 1, gender: 1, like: 1, link: 1, name: 1, images: 1, oldprice: 1, price: 1, sale: 1, shop: 1, sizes: 1 })
        .toArray(),
      db.collection('accessories').find({})
        .project({ id: 1, brand: 1, category_t: 1, color: 1, gender: 1, like: 1, link: 1, name: 1, images: 1, oldprice: 1, price: 1, sale: 1, shop: 1, sizes: 1 })
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
        textSearch: product.gender + ' ' + product.subcategory + ' ' + product.brand + ' ' + collection + ' '
          + product.color + ' ' + product.shop + ' ' + 'со скидкой ' + product.sale + '% '
          + product.sizes.reduce((acc, size) => acc += size + ' размера ', '')
      }));

    const allResults = [
      ...combineAndMap(clothes, 'clothes'),
      ...combineAndMap(shoes, 'shoes'),
      ...combineAndMap(accessories, 'accessories')
    ];

    allResults.forEach(productObj => productObj.score = stringSimilarity
      .compareTwoStrings([...new Set(productObj.textSearch.toLowerCase().split(' '))].join(' '), searchTerm.toLowerCase()))
    // Сортировка по убыванию релевантности
    return allResults.sort((a, b) => b.score - a.score).filter(product => product.score > 0.15);
  } catch (error) {
    console.error('Failed to get search results:', error);
    throw error;
  } finally {
    await client.close();
  }
}
