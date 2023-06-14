const server = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const getSelects = require('./utils/getSelects');
const getProducts = require('./utils/getProducts');
const getProduct = require('./utils/getProduct');
const getSitemap = require('./utils/getSitemap');
const setLike = require('./utils/setLike');
const setServiceData = require('./utils/setServiceData');
const redis = require('redis');
const client = redis.createClient();

client.on('connect', () => {
  console.log('Подключено к Redis');
});

server.use(cors());
server.use(bodyParser.json());

// Middleware для кэширования
function cacheMiddleware(req, res, next) {
  const cacheKey = req.url;

  client.get(cacheKey, (err, data) => {
    if (err) {
      console.error('Ошибка при получении данных из кэша:', err);
      next();
    }

    if (data !== null) {
      console.log('Данные найдены в кэше');
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
}

// Роут для удаления глобального кэша
server.get('/clear-cache', (req, res) => {
  client.flushdb((err, succeeded) => {
    if (err) {
      console.error('Ошибка при очистке кэша:', err);
      res.status(500).send('Ошибка при очистке кэша');
    } else {
      console.log('Глобальный кэш успешно очищен');
      res.status(200).send('Глобальный кэш очищен');
    }
  });
});

server.post('/selects', cacheMiddleware, async (req, res) => {
  const cacheKey = req.url;
  const data = await getSelects(req.body);
  client.set(cacheKey, JSON.stringify(data)); // Кэширование навсегда
  res.status(200).send(data);
});

server.post('/products', cacheMiddleware, async (req, res) => {
  const cacheKey = req.url;
  const data = await getProducts(req.body);
  client.set(cacheKey, JSON.stringify(data)); // Кэширование навсегда
  res.status(200).send(data);
});

server.post('/product', cacheMiddleware, async (req, res) => {
  const cacheKey = req.url;
  const data = await getProduct(req.body);
  client.set(cacheKey, JSON.stringify(data)); // Кэширование навсегда
  res.status(200).send(data);
});

server.get('/sitemap', cacheMiddleware, async (req, res) => {
  const cacheKey = req.url;
  const data = await getSitemap();
  client.set(cacheKey, JSON.stringify(data)); // Кэширование навсегда
  res.status(200).send(data);
});

server.post('/like', async (req, res) => {
  res.status(200).send(await setLike(req.body));
});

server.put('/service', async (req, res) => {
  res.status(200).send(await setServiceData(req.body));
});

server.listen(3004, console.log('ON 3004'));
