const server = require('express')();
const cors = require('cors');
const cache = require('express-redis-cache')({
  host: 'localhost', port: 6379,
});

const bodyParser = require('body-parser');
const getSelects = require('./services/getSelects');
const getProducts = require('./services/getProducts');
const setServiceData = require('./services/setServiceData');
const SelectsDto = require('./services/dto/selectsDto');
const PaginationDto = require('./services/dto/paginationDto');
const LoginDto = require('./services/dto/loginDto');
const login = require('./services/auth/authService');
const register = require('./services/auth/registerService');

server.use(cors());
server.use(bodyParser.json());

server.post('/login', async (req, res) => {
  res.status(200).send(await login(new LoginDto(req.body)));
});

server.post('/register', async (req, res) => {
  res.status(200).send(await register(new LoginDto(req.body)));
});

server.post('/selects', function (req, res, next) {
  res.express_redis_cache_name = 'select:' + JSON.stringify(req.body);
  next();
}, cache.route({expire: 60 * 60 * 24}), async (req, res) => {
  res.status(200).send(await getSelects(new SelectsDto(req.body.findObj, req.body.collection), new PaginationDto(req.body.pagination)));
});
server.post('/products', async (req, res) => {
  res.status(200).send(await getProducts(req.body));
});

server.put('/service', async (req, res) => {
  res.status(200).send(await setServiceData(req.body));
});

server.listen(3004, console.log('ON 3004'));
