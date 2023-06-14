const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis');
const { promisify } = require('util');

const getSelects = require('./utils/getSelects');
const getProducts = require('./utils/getProducts');
const getProduct = require('./utils/getProduct');
const getSitemap = require('./utils/getSitemap');
const setMetrikaGoal = require('./utils/setMetrikaGoal');
const setLike = require('./utils/setLike');
const setServiceData = require('./utils/setServiceData');

const client = redis.createClient();
const asyncGet = promisify(client.get).bind(client);
const asyncSet = promisify(client.set).bind(client);

const server = express();

server.use(cors());
server.use(bodyParser.json());

// Middleware для кэширования
const cacheMiddleware = async (req, res, next) => {
  const key = req.baseUrl + req.path + JSON.stringify(req.body) + JSON.stringify(req.query);
  const cachedData = await asyncGet(key);

  if (cachedData) {
    await res.send(cachedData);
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

// Роут для сброса всего кэша
server.get('/clearCache', (req, res) => {
  client.flushall((err, reply) => {
    if (err) {
      res.status(500).send('Ошибка при сбросе кэша');
    } else {
      // Выполняем команду для сброса кэша Redis через redis-cli
      const { exec } = require('child_process');
      exec('redis-cli flushall', (error, stdout, stderr) => {
        if (error) {
          res.status(500).send('Ошибка при сбросе кэша');
        } else {
          res.send('Кэш успешно сброшен');
        }
      });
    }
  });
});

server.listen(3004, () => {
  console.log('ON 3004');
});
