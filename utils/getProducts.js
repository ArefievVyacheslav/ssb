const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')


module.exports = async function getSelects(filtersObj) {
  try {
    await client.connect()
    const db = await client.db('ss')

    if (filtersObj.findObj?.price) {
      const startPrice = filtersObj.findObj.price[ '$in' ][0]
      const endPrice = filtersObj.findObj.price[ '$in' ][1]
      filtersObj.findObj.price[ '$in' ] = [...Array.from(Array(+endPrice - +startPrice + 1).keys(),x => x + +startPrice)]
    }

    const products = await db.collection(filtersObj.collection).find(filtersObj.findObj).sort(filtersObj.sortObj).toArray()

    const productsTotal = products.map(productObj => ({
      id: productObj.id,
      brand: productObj.brand,
      category_t: productObj.category_t,
      collection: filtersObj.collection,
      color: productObj.color,
      like: productObj.like,
      name: productObj.name,
      images: productObj.images[0],
      oldprice: productObj.oldprice,
      price: productObj.price,
      sale: productObj.sale,
      shop: productObj.shop,
      sizes: productObj.sizes
    }))

    const result = []
    const count = +filtersObj.pagination.show || 60
    for (let s = 0, e = count; s < productsTotal.length; s += count, e += count)
      result.push(productsTotal.slice(s, +e))

    return {
      products: result[+filtersObj.pagination.page - 1 || 0],
      quantity: productsTotal.length
    }
  } catch (e) {
    console.log(e);
  }
}
