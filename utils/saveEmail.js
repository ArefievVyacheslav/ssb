const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')


module.exports = async function saveEmail (email) {
  try {
    await client.connect()
    const db = await client.db('ss')
    return await db.collection('emails').insertOne({ email })
  } catch (e) {
    console.log(e);
  }
}
