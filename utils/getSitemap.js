const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')
const transliteration = require('../utils/transliteration')
const { writeFileSync } = require('fs')

module.exports = async function getSitemap () {
  try {
    await client.connect()
    const db = await client.db('ss')
    const collections = [ 'clothes', 'shoes', 'accessories' ]
    const sitemap = []
    for (let collection of collections) {
      const products = await db.collection(collection).find({}).toArray()
      products.forEach(product => {
        sitemap.push(`/product/${transliteration(product.name.toLowerCase())}-${collection.toLowerCase()}-${product.id}`)
      })
    }
    await writeFileSync('../ssf/static/sitemap.txt', sitemap.reduce((acc, link) => acc += 'https://sales-search.ru' + link + '\n', ''), 'utf-8', (err) => {})
    return sitemap
  } catch (e) {
    console.log(e)
  }
}
