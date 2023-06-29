const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')


const unique = (array, propertyName) => array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i)


module.exports = async function getSelects(filtersObj) {
  try {
    const startTime = new Date()
    await client.connect()
    const db = await client.db('ss')

    if (filtersObj.findObj?.price) {
      const startPrice = filtersObj.findObj.price[ '$in' ][0]
      const endPrice = filtersObj.findObj.price[ '$in' ][1]
      filtersObj.findObj.price[ '$in' ] = [...Array.from(Array(+endPrice - +startPrice + 1).keys(),x => x + +startPrice)]
    }

    const products = await db.collection(filtersObj.collection).find(filtersObj.findObj).project({
      subcategory: 1, subcategory_t: 1, brand: 1,
      price: 1,
      sale: 1,
      sizes: 1,
      shop: 1,
      color: 1, color_t: 1,
      brandCountry: 1,
      country: 1, country_t: 1,
      season: 1, season_t: 1,
      style: 1, style_t: 1
    }).toArray()

    console.log('Товары найдены за ' + (startTime - new Date()) / 1000 + 'sec.')

    const subCat = unique(products.map(productObj => ({
      subcategory: productObj.subcategory,
      subcategory_t: productObj.subcategory_t,
    })), 'subcategory').map(subCat => {
      subCat.subcategory_t.replaceAll(' ', '-')
      return subCat
    })

    const result = { subCat,brand:[],brandCountry:[],color:[],country:[],price:[],sale:[],season:[],shop:[],style:[] }

    products.map(productObj => {
      if (!result.brand.includes(productObj.brand.toUpperCase())) result.brand.push(productObj.brand.toUpperCase())
      if (!result.price.includes(productObj.price)) result.price.push(productObj.price)
      if (!result.sale.includes(productObj.sale)) result.sale.push(productObj.sale)
      if (!result.shop.includes(productObj.shop)) result.shop.push(productObj.shop.replaceAll(' ', '-'))
      if (!result.color.map(colorObj => colorObj.color).includes(productObj.color)
        && productObj.color && productObj.color !== 's' && productObj.color !== 'true black') result.color.push({
        color: productObj.color,
        color_t: productObj.color_t.replaceAll(' ', '-').replaceAll('/', '-')
      })
      if (productObj.brandCountry && !result.brandCountry.includes(productObj.brandCountry)) result.brandCountry.push(productObj.brandCountry)
      if (productObj.country && !result.country.map(countryObj => countryObj.country).includes(productObj.country)) result.country.push({
        country: productObj.country,
        country_t: productObj.country_t.replaceAll(' ', '-').replaceAll('/', '-')
      })
      if (!result.season.map(seasonObj => seasonObj.season).includes(productObj.season) && productObj.season) result.season.push({
        season: productObj.season,
        season_t: productObj.season_t.replaceAll(' ', '-').replaceAll('/', '-')
      })
      if (!result.style.map(styleObj => styleObj.style).includes(productObj.style) && productObj.style) result.style.push({
        style: productObj.style,
        style_t: productObj.style_t.replaceAll(' ', '-').replaceAll('/', '-')
      })
    })
    result.price = result.price.sort((a,b)=>a-b)
    result.price = [ result.price[ 0 ], result.price[ result.price.length - 1 ] ]
    result.sale = [ Math.min(...result.sale) - 1, Math.max(...result.sale) - 1 ]

    let size = [ ...new Set(products.map(productObj => productObj.sizes).flat(Infinity)) ]
    const order = [ /^one size$/, /^XXS$/, /^XS$/, /^S$/, /^S-M$/, /^M$/, /^M-L$/, /^L$/, /^L-XL$/, /^XL$/, /^XXL$/, /^2XL$/, /^3XL$/, /^XXXL$/, /^4XL$/, /^5XL$/, /^6XL$/, /^W\d+/, /^\d+\/\d+$/, /^\d+$/, /^\d+.\d+$/, /^\d+-\d+$/ ];

    function compareSizes(a, b) {
      const aIndex = order.findIndex(regex => regex.test(a));
      const bIndex = order.findIndex(regex => regex.test(b));

      if (aIndex === -1 && bIndex === -1) {
        return a.localeCompare(b);
      } else if (aIndex === -1) {
        return 1;
      } else if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    }
    result.size = size.sort(compareSizes)
    await client.close()
    return result
  } catch (e) {
    console.log(e);
  }
}

