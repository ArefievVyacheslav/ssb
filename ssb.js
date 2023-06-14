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
const cacheMiddleware = (req, res, next) => {
  const cacheKey = req.url;
  client.get(cacheKey, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        client.set(cacheKey, JSON.stringify(body));
        res.sendResponse(body);
      };
      next();
    }
  });
};

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

app.get('/clear-cache', async (req, res) => {
  try {
    client.flushdb((err, succeeded) => {
      if (err) {
        console.error('Ошибка при очистке кэша:', err);
        res.status(500).send('Ошибка при очистке кэша');
      } else {
        console.log('Кэш успешно очищен');
        res.status(200).send('Кэш успешно очищен');
      }
    });
  } catch (err) {
    console.error('Ошибка при очистке кэша:', err);
    res.status(500).send('Ошибка при очистке кэша');
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
