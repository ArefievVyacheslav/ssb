const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Redis = require('ioredis');
const { promisify } = require('util');

const getSelects = require('./utils/getSelects');
const getProducts = require('./utils/getProducts');
const getProduct = require('./utils/getProduct');
const getSitemap = require('./utils/getSitemap');
const setMetrikaGoal = require('./utils/setMetrikaGoal');
const setLike = require('./utils/setLike');
const setServiceData = require('./utils/setServiceData');

const redisClient = new Redis({
  host: 'localhost',
  port: 6379
});
const asyncGet = promisify(redisClient.get).bind(redisClient);
const asyncSet = promisify(redisClient.set).bind(redisClient);

const server = express();

server.use(cors());
server.use(bodyParser.json());

// Middleware для кэширования
const cacheMiddleware = async (req, res, next) => {
  const key = req.baseUrl + req.path + JSON.stringify(req.body) + JSON.stringify(req.query);
  const cachedData = await asyncGet(key);

  if (cachedData) {
    res.send(cachedData);
  } else {
    res.sendResponse = res.send;
    res.send = async (body) => {
      await asyncSet(key, body);
      res.sendResponse(body);
    };
    next();
  }
};

server.post('/selects', cacheMiddleware, async (req, res) => {
  res.status(200).send(await getSelects(req.body));
});

server.post('/products', cacheMiddleware, async (req, res) => {
  res.status(200).send(await getProducts(req.body));
});

server.post('/product', cacheMiddleware, async (req, res) => {
  res.status(200).send(await getProduct(req.body));
});

server.get('/sitemap', cacheMiddleware, async (req, res) => {
  res.status(200).send(await getSitemap());
});

server.post('/goal', async (req, res) => {
  res.status(200).send(await setMetrikaGoal(req.body));
});

server.post('/like', async (req, res) => {
  res.status(200).send(await setLike(req.body));
});

server.put('/service', async (req, res) => {
  res.status(200).send(await setServiceData(req.body));
});

server.get('/clearCache', async (req, res) => {
  await redisClient.flushall();
  res.send('Кэш успешно сброшен');
});

server.listen(3004, () => {
  console.log('ON 3004');
});
