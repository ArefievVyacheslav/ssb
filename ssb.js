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

const server = express();
const redisClient = new Redis();

server.use(cors());
server.use(bodyParser.json());

const asyncGet = promisify(redisClient.get).bind(redisClient);
const asyncSet = promisify(redisClient.set).bind(redisClient);

// Middleware для кэширования
const cacheMiddleware = async (req, res, next) => {
  const key = req.baseUrl + req.path + JSON.stringify(req.body) + JSON.stringify(req.query);
  try {
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
  } catch (error) {
    console.error('Ошибка при получении данных из кэша', error);
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

server.get('/sitemap', async (req, res) => {
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
  try {
    await redisClient.flushall();
    res.send('Кэш успешно сброшен');
  } catch (error) {
    console.error('Ошибка при сбросе кэша', error);
    res.status(500).send('Ошибка при сбросе кэша');
  }
});

server.listen(3004, () => {
  console.log('Сервер запущен на порту 3004');
});
