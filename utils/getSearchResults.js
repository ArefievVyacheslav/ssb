const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

module.exports = async function getSearchResults(searchTerm) {
  try {
    await client.connect();
    const db = await client.db('ss');
    const clothes = await db.collection('clothes').find({ $text: { $search: searchTerm } })
      .project({ score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .toArray().map(product => ({
      id: product.id,
      brand: product.brand,
      category_t: product.category_t,
      category: 'clothes',
      color: product.color,
      like: product.like,
      link: product.link,
      name: product.name,
      images: product.images,
      oldprice: product.oldprice,
      price: product.price,
      sale: product.sale,
      shop: product.shop,
      sizes: product.sizes
    })) || [];

    const shoes = await db.collection('shoes').find({ $text: { $search: searchTerm } })
      .project({ score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .toArray().map(product => ({
      id: product.id,
      brand: product.brand,
      category_t: product.category_t,
      category: 'shoes',
      color: product.color,
      like: product.like,
      link: product.link,
      name: product.name,
      images: product.images,
      oldprice: product.oldprice,
      price: product.price,
      sale: product.sale,
      shop: product.shop,
      sizes: product.sizes
    })) || [];

    const accessories = await db.collection('accessories').find({ $text: { $search: searchTerm } })
      .project({ score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .toArray().map(product => ({
      id: product.id,
      brand: product.brand,
      category_t: product.category_t,
      category: 'accessories',
      color: product.color,
      like: product.like,
      link: product.link,
      name: product.name,
      images: product.images,
      oldprice: product.oldprice,
      price: product.price,
      sale: product.sale,
      shop: product.shop,
      sizes: product.sizes
    })) || [];

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
