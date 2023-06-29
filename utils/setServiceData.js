const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')


module.exports = async function setServiceData(serviceDataObj) {
  try {
    await client.connect()
    const db = await client.db('ss')
    const collection = await db.collection('service')
    const userActiveData = await collection.findOne({}) || {}
    if (userActiveData.userBrands) await collection.updateOne(
      {},
      { $set: { userBrands: [ ...new Set([ ...userActiveData.userBrands, ...serviceDataObj.userBrands ]) ].sort() } }
    )
    else await collection.insertOne({ userBrands: serviceDataObj.userBrands.sort() })
    await client.close()
    return {
      type: 'success',
      msg: 'Ваше предложение по добавлению брендов успешно записано.'
    }
  } catch (e) {
    return {
      type: 'error',
      msg: 'При добавлении бренда(ов) возникла ошибка! Свяжитесь с нами на странице контакты.'
    }
  }
}
