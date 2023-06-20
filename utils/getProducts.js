const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')


module.exports = async function getProducts(filtersObj) {
  try {
    await client.connect()
    const db = await client.db('ss')

    if (filtersObj.findObj?.price) {
      const startPrice = filtersObj.findObj.price[ '$in' ][0]
      const endPrice = filtersObj.findObj.price[ '$in' ][1]
      filtersObj.findObj.price[ '$in' ] = [...Array.from(Array(+endPrice - +startPrice + 1).keys(),x => x + +startPrice)]
    }

    const products = await db.collection(filtersObj.collection).find(filtersObj.findObj).project({
      id: 1,
      brand: 1,
      category_t: 1,
      color: 1,
      like: 1,
      link: 1,
      name: 1,
      images: 1,
      oldprice: 1,
      price: 1,
      sale: 1,
      shop: 1,
      sizes: 1
    }).sort(filtersObj.sortObj).toArray()

    const result = []
    const count = +filtersObj.pagination.show || 60
    for (let s = 0, e = count; s < products.length; s += count, e += count)
      result.push(products.slice(s, +e))

    return {
      products: result[+filtersObj.pagination.page - 1 || 0].map(prod => ({ ...prod, collection: filtersObj.collection })),
      quantity: products.length
    }
  } catch (e) {
    console.log(e);
  }
}
