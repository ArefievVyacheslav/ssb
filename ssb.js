const server = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const getSelects = require('./utils/getSelects');
const getProducts = require('./utils/getProducts');
const getProduct = require('./utils/getProduct');
const getSitemap = require('./utils/getSitemap');
const setMetrikaGoal = require('./utils/setMetrikaGoal');
const setLike = require('./utils/setLike');
const setServiceData = require('./utils/setServiceData');
const NodeCache = require('node-cache');

const cache = new NodeCache();

server.use(cors());
server.use(bodyParser.json());

// Middleware для кэширования
const cacheMiddleware = (req, res, next) => {
  const key = req.baseUrl + req.path + JSON.stringify(req.query);
  const cachedData = cache.get(key);

  if (cachedData) {
    res.send(cachedData);
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.set(key, body);
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

// Роут для сброса всего кэша
server.get('/clearCache', (req, res) => {
  cache.flushAll();
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Expires', '0');
  res.send('Кэш успешно сброшен');
})

server.listen(3004, () => {
  console.log('ON 3004');
});
