const server = require('express')()
const cors = require('cors')
const bodyParser = require('body-parser')
const getSelects = require('./utils/getSelects')


server.use(cors())
server.use(bodyParser.json())
server.post('/selects', async (req, res) => {
  res.status(200).send(await getSelects(req.body))
})


server.get('/test', async (req, res) => {
  res.status(200).send('<h1>TEST OK!!!</h1>')
})


server.listen(3004, console.log('ON 3004'))
