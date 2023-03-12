const server = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const getSelects = require('./services/getSelects')
const getProducts = require('./services/getProducts')
const setServiceData = require('./services/setServiceData')
const SelectsDto = require('./services/dto/selectsDto');
const PaginationDto = require('./services/dto/paginationDto');


server.use(cors())
server.use(bodyParser.json())

server.post('/selects', async (req, res) => {
  res.status(200).send(await getSelects(new SelectsDto(req.body.findObj), new PaginationDto(req.body.pagination)))
})
server.post('/products', async (req, res) => {
  res.status(200).send(await getProducts(req.body))
})

server.put('/service', async (req, res) => {
  res.status(200).send(await setServiceData(req.body))
})


server.listen(3004, console.log('ON 3004'))
