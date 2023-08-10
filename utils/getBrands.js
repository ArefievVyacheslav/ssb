const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

module.exports = async function getBrands() {
  try {
    await client.connect();
    const db = await client.db('ss');

    const clothesBrands = await db.collection('clothes').distinct('brand');
    const shoesBrands = await db.collection('shoes').distinct('brand');
    const accessoriesBrands = await db.collection('accessories').distinct('brand');

    const allBrands = [...clothesBrands, ...shoesBrands, ...accessoriesBrands];

    // Создаем объект для хранения брендов по первым буквам
    const brandsByLetter = {};

    // Обрабатываем каждый бренд и добавляем его в объект
    allBrands.forEach(brand => {
      const firstLetter = brand.charAt(0).toUpperCase();

      if (!brandsByLetter[firstLetter]) {
        brandsByLetter[firstLetter] = [];
      }

      if (!brandsByLetter[firstLetter].includes(brand)) {
        brandsByLetter[firstLetter].push(brand);
      }
    });

    return brandsByLetter;
  } catch (e) {
    console.log(e);
  }
}
