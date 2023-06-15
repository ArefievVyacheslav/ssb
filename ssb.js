const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cache = require('memory-cache');

const getSelects = require('./utils/getSelects');
const getProducts = require('./utils/getProducts');
const getProduct = require('./utils/getProduct');
const getSitemap = require('./utils/getSitemap');
const setLike = require('./utils/setLike');
const setServiceData = require('./utils/setServiceData');

const server = express();

server.use(cors());
server.use(bodyParser.json());

server.post('/selects', async (req, res) => {
  const cacheKey = 'selects';
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) {
    res.status(200).send(cachedResult);
  } else {
    const result = await getSelects(req.body);
    cache.put(cacheKey, result);
    res.status(200).send(result);
  }
});

server.post('/products', async (req, res) => {
  const cacheKey = 'products';
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) {
    res.status(200).send(cachedResult);
  } else {
    const result = await getProducts(req.body);
    cache.put(cacheKey, result);
    res.status(200).send(result);
  }
});

server.post('/product', async (req, res) => {
  const cacheKey = 'product_' + req.body.productId;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) {
    res.status(200).send(cachedResult);
  } else {
    const result = await getProduct(req.body);
    cache.put(cacheKey, result);
    res.status(200).send(result);
  }
});

server.get('/sitemap', async (req, res) => {
  const cacheKey = 'sitemap';
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) {
    res.status(200).send(cachedResult);
  } else {
    const result = await getSitemap();
    cache.put(cacheKey, result);
    res.status(200).send(result);
  }
});

server.post('/like', async (req, res) => {
  const result = await setLike(req.body);
  res.status(200).send(result);
});

server.put('/service', async (req, res) => {
  const result = await setServiceData(req.body);
  res.status(200).send(result);
});

server.post('/clear-cache', (req, res) => {
  clearCache();
  res.status(200).send('Cache cleared');
});

server.listen(3004, () => {
  console.log('Server is running on port 3004');
});

function clearCache() {
  cache.clear();
}
