const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')


const unique = (array, propertyName) => array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i)


module.exports = async function getSelects(filtersObj) {
  try {
    await client.connect()
    const db = await client.db('ss')

    console.log(new Date().toString())
    if (filtersObj.findObj?.price) {
      const startPrice = filtersObj.findObj.price[ '$in' ][0]
      const endPrice = filtersObj.findObj.price[ '$in' ][1]
      filtersObj.findObj.price[ '$in' ] = [...Array.from(Array(+endPrice - +startPrice + 1).keys(),x => x + +startPrice)]
    }
    console.log(new Date().toString())
    console.log('Обработка селекта цен')

    console.log(new Date().toString())
    const products = await db.collection(filtersObj.collection).find(filtersObj.findObj).toArray()
    console.log(new Date().toString())
    console.log('Поиск товаров')

    console.log(new Date().toString())
    const subCat = unique(products.map(productObj => ({
      subcategory: productObj.subcategory,
      subcategory_t: productObj.subcategory_t,
    })), 'subcategory').map(subCat => {
      subCat.subcategory_t.replaceAll(' ', '-')
      return subCat
    })
    console.log(new Date().toString())
    console.log('Подготовка подкатегорий')

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

    const weights = { 'XXXS':-1, 'XXS':0, 'XXS/XS':1, 'XS':2, 'XS/S':3, 'S':4, 'S/M':5, 'M':6, 'M/L':7, 'L':8, 'L/XL':8.5, 'XL':9, 'XXL':10, 'XXXL':11, 'XXXXL':12 }
    let size = [ ...new Set(products.map(productObj => productObj.sizes).flat(Infinity)) ]
    size = size.sort((a, b) => {
      if (!isNaN(a) && !isNaN(b)) return a - b
    })
    result.size = [ ...size.filter(el => isNaN(el)).sort((a, b) => {
      if (isNaN(a) && isNaN(b)) return weights[a] - weights[b]
    }), ...size.filter(el => el && !isNaN(el)).sort( (a, b) => a.localeCompare(b, undefined, { numeric:true }) ) ]

    return result
  } catch (e) {
    console.log(e);
  }
}

