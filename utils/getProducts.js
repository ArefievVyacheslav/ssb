const { MongoClient } = require('mongodb')

async function getProducts(filtersObj) {
  const client = new MongoClient('mongodb://localhost:27017')

  try {
    await client.connect()
    const db = client.db('ss')

    if (filtersObj.findObj?.price) {
      const startPrice = filtersObj.findObj.price['$in'][0]
      const endPrice = filtersObj.findObj.price['$in'][1]
      filtersObj.findObj.price = {
        $gte: startPrice,
        $lte: endPrice
      }
    }

    let products;
    let productCounts;

    products = await db.collection(filtersObj.collection || 'all')
      .find(filtersObj.findObj, {
        projection: {
          id: 1, brand: 1, category: 1, color: 1, like: 1, link: 1, name: 1, images: 1,
          oldprice: 1, price: 1, sale: 1, shop: 1, sizes: 1
        }
      })
      .sort(filtersObj.sortObj)
      .skip((filtersObj.pagination.page - 1) * filtersObj.pagination.show)
      .limit(filtersObj.pagination.show)
      .toArray()
    products = products.map(prod => ({ ...prod, collection: filtersObj.collection }));
    productCounts = await db.collection(filtersObj.collection || 'all').countDocuments(filtersObj.findObj)
    return {
      products: products,
      quantity: productCounts
    }
  } catch (e) {
    console.log(e);
  } finally {
    await client.close()
  }
}

module.exports = getProducts;
