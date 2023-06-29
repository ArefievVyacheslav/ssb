const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')


module.exports = async function setLike(productObj) {
  try {
    await client.connect()
    const db = await client.db('ss')
    const collection = await db.collection(productObj.collection)
    const product = await collection.findOne({ id: productObj.id })
    await collection.updateOne(
      { id: productObj.id },
      { $set: { like: product.like + 1 } }
    )
    await client.close()
  } catch (e) {}
}
