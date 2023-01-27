const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')


function unique (array, propertyName) {
  return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i)
}


module.exports = async function getSelects(filtersObj) {
  try {
    await client.connect()
    const db = await client.db('ss')
    const products = await db.collection(filtersObj.collection).find(filtersObj.findObj).toArray()

    const subcat = unique(products.map(productObj => ({
      subcategory: productObj.subcategory,
      subcategoryT: productObj.subcategoryT,
    })), 'subcategory')

    return {
      subcat
    }
  } catch (e) {
    console.log(e);
  }
}
