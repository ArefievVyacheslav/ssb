const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')


const unique = (array, propertyName) => array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i)


module.exports = async function getSelects(filtersObj) {
  try {
    await client.connect()
    const db = await client.db('ss')
    const products = await db.collection(filtersObj.collection).find(filtersObj.findObj).toArray()

    const subcat = unique(products.map(productObj => ({
      subcategory: productObj.subcategory,
      subcategory_t: productObj.subcategory_t,
    })), 'subcategory')

    const brand = [ ...new Set(products.map(productObj => productObj.brand), 'brand') ]

    return {
      subcat, brand
    }
  } catch (e) {
    console.log(e);
  }
}
