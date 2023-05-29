const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')


module.exports = async function getProduct (param) {
  try {
    await client.connect()
    const db = await client.db('ss')
    return await db.collection(param.category).findOne({ id: param.id })
  } catch (e) {
    console.log(e);
  }
}
