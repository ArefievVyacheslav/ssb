const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')


module.exports = async function getSelects(filtersObj) {
  try {
    await client.connect()
    const db = await client.db('ss')
    const products = await db.collection(filtersObj.collection).find(filtersObj.findObj).toArray()

    const productsTotal = products.map(productObj => ({
      benefit: productObj.benefit,
      brand: productObj.brand,
      link: productObj.link,
      name: productObj.name,
      images: productObj.images[0],
      oldprice: productObj.oldprice,
      price: productObj.price,
      sizes: productObj.sizes,
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
