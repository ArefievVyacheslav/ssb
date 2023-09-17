const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')

const unique = (array, propertyName) => array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i)


module.exports = async function getSelectsAll() {
  const filtersObj = {
    findObj: {
      age: 'Взрослый',
      delivery: { '$in': [ 'ru', 'rb', 'kz', 'am', 'kg', 'az', 'md', 'tj', 'uz', 'tm' ] },
      installment: { '$in': [ true, false ] }
    }
  }
  try {
    await client.connect()
    const db = await client.db('ss')

    if (filtersObj.findObj?.price) {
      const startPrice = filtersObj.findObj.price[ '$in' ][0]
      const endPrice = filtersObj.findObj.price[ '$in' ][1]
      filtersObj.findObj.price = {
        $gte: startPrice,
        $lte: endPrice
      }
    }

    let products;
    products = await db.collection(filtersObj.collection || 'all')
      .find(filtersObj.findObj, {
        projection: {
          subcategory: 1, subcategory_t: 1,
          brand: 1, brandCountry: 1, price: 1, sale: 1, sizes: 1, shop: 1,
          color: 1, color_t: 1,
          country: 1, country_t: 1,
          season: 1, season_t: 1,
          style: 1, style_t: 1
        }
      })
      .toArray();

    const subCat = unique(products.map(productObj => ({
      subcategory: productObj.subcategory,
      subcategory_t: productObj.subcategory_t.toLowerCase(),
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

    let size = [ ...new Set(products.map(productObj => productObj.sizes.map(size => size)).flat(Infinity)) ]
    let order = [ /^one size$/, /^4XS$/, /^3XS$/, /^2XS$/, /^2XS-XS$/, /^XS$/, /^XS-S$/, /^S$/, /^S-M$/, /^M$/, /^M-L$/, /^L$/, /^L-XL$/, /^XL$/, /^XXL$/, /^XL-2XL$/, /^2XL$/, /^2XL-3XL$/, /^3XL$/, /^XXXL$/, /^4XL$/, /^5XL$/, /^6XL$/, /^7XL$/, /^8XL$/, /^9XL$/, /^1$/, /^2$/, /^3$/, /^4$/, /^5$/, /^6$/, /^7$/, /^8$/, /^9$/, /^10$/, /^11$/, /^12$/, /^13$/, /^14$/, /^15$/, /^16$/, /^17$/, /^18$/, /^19$/, /^20$/, /^21$/, /^22$/, /^23$/, /^24$/, /^25$/, /^26$/, /^27$/, /^28$/, /^29$/, /^30$/, /^31$/, /^32$/, /^33$/, /^34$/, /^35$/, /^36$/, /^37$/, /^38$/, /^39$/, /^40$/, /^41$/, /^42$/, /^43$/, /^44$/, /^45$/, /^46$/, /^47$/, /^48$/, /^49$/, /^50$/, /^51$/, /^52$/, /^53$/, /^54$/, /^W\d+/, /^\d+\/\d+$/, /^\d+$/, /^\d+.\d+$/, /^\d+-\d+$/ ];
    if (filtersObj.collection === 'shoes') order = [/^34$/, /^34.5$/, /^35$/, /^35.5$/, /^36$/, /^36.5$/, /^37$/, /^37.5$/, /^38$/, /^38.5$/, /^39$/, /^39.5$/, /^40$/, /^40.5$/, /^41$/, /^41.5$/, /^42$/, /^42.5$/, /^43$/, /^43.5$/, /^44$/, /^44.5$/, /^45$/, /^45.5$/, /^46$/, /^46.5$/, /^47$/, /^47.5$/, /^48$/, /^48.5$/, /^49$/, /^49.5$/, /^50$/, /^4$/, /^4.5$/, /^5$/, /^5.5$/, /^6$/, /^6.5$/, /^7$/, /^7.5$/, /^8$/, /^8.5$/, /^9$/, /^9.5$/, /^10$/, /^10.5$/, /^11$/, /^11.5$/, /^12$/, /^12.5$/, /^13$/, /^13.5$/, /^14$/ ]

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
    return result
  } catch (e) {
    console.log(e);
  }
}

