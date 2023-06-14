const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();
const port = 3004;

app.use(cors());
app.use(bodyParser.json());

const client = redis.createClient();

client.on('connect', () => {
  console.log('Подключено к Redis');
});

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

app.post('/selects', cacheMiddleware, async (req, res) => {
  const cacheKey = req.url;
  const data = await getSelects(req.body);
  client.set(cacheKey, JSON.stringify(data)); // Кэширование навсегда
  res.status(200).send(data);
});

app.post('/products', cacheMiddleware, async (req, res) => {
  const cacheKey = req.url;
  const data = await getProducts(req.body);
  client.set(cacheKey, JSON.stringify(data)); // Кэширование навсегда
  res.status(200).send(data);
});

app.post('/product', cacheMiddleware, async (req, res) => {
  const cacheKey = req.url;
  const data = await getProduct(req.body);
  client.set(cacheKey, JSON.stringify(data)); // Кэширование навсегда
  res.status(200).send(data);
});

app.get('/sitemap', cacheMiddleware, async (req, res) => {
  const cacheKey = req.url;
  const data = await getSitemap();
  client.set(cacheKey, JSON.stringify(data)); // Кэширование навсегда
  res.status(200).send(data);
});

app.get('/clear-cache', (req, res) => {
  const tempClient = redis.createClient();

  tempClient.keys('*', (err, keys) => {
    if (err) {
      console.error('Ошибка при получении ключей из кэша:', err);
      res.status(500).send('Ошибка при очистке кэша');
      tempClient.quit();
      return;
    }

    if (keys.length === 0) {
      console.log('Кэш уже пустой');
      res.status(200).send('Кэш уже пустой');
      tempClient.quit();
      return;
    }

    tempClient.del(keys, (err, count) => {
      if (err) {
        console.error('Ошибка при удалении ключей из кэша:', err);
        res.status(500).send('Ошибка при очистке кэша');
      } else {
        console.log('Кэш успешно очищен');
        res.status(200).send(`Удалено ${count} ключей из кэша`);
      }
      tempClient.quit();
    });
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
