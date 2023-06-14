const server = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const getSelects = require('./utils/getSelects')
const getProducts = require('./utils/getProducts')
const getProduct = require('./utils/getProduct')
const getSitemap = require('./utils/getSitemap')
const setMetrikaGoal = require('./utils/setMetrikaGoal')
const setLike = require('./utils/setLike')
const setServiceData = require('./utils/setServiceData')


server.use(cors())
server.use(bodyParser.json())

server.post('/selects', async (req, res) => {
  res.status(200).send(await getSelects(req.body))
})
server.post('/products', async (req, res) => {
  res.status(200).send(await getProducts(req.body))
})
server.post('/product', async (req, res) => {
  res.status(200).send(await getProduct(req.body))
})
server.get('/sitemap', async (req, res) => {
  res.status(200).send(await getSitemap())
})
server.post('/goal', async (req, res) => {
  res.status(200).send(await setMetrikaGoal(req.body))
})
server.post('/like', async (req, res) => {
  res.status(200).send(await setLike(req.body))
})
server.put('/service', async (req, res) => {
  res.status(200).send(await setServiceData(req.body))
})


server.listen(3004, console.log('ON 3004'))
