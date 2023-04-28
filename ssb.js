const server = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const getSelects = require('./utils/getSelects')
const getProducts = require('./utils/getProducts')
const getProduct = require('./utils/getProduct')
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
server.put('/service', async (req, res) => {
  res.status(200).send(await setServiceData(req.body))
})


server.listen(3004, console.log('ON 3004'))
