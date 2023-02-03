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

    const brand = [ ...new Set(products.map(productObj => productObj.brand)) ]

    const weights = { 'XXXS':-1, 'XXS':0, 'XXS/XS':1, 'XS':2, 'XS/S':3, 'S':4, 'S/M':5, 'M':6, 'M/L':7, 'L':8, 'XL':9, 'XXL':10, 'XXXL':11, 'XXXXL':12 }
    let size = [ ...new Set(products.map(productObj => productObj.sizes).flat(Infinity)) ]
    size = size.sort((a, b) => {
      if (!isNaN(a) && !isNaN(b)) return a - b
    })
    size = [ ...size.filter(el => isNaN(el)).sort((a, b) => {
      if (isNaN(a) && isNaN(b)) return weights[a] - weights[b]
    }), ...size.filter(el => !isNaN(el)).sort( (a, b) => a.localeCompare(b, undefined, { numeric:true }) ) ]


    return {
      subcat, brand, size
    }
  } catch (e) {
    console.log(e);
  }
}
