const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const getBrands = require('./utils/getBrands')
const getSelects = require('./utils/getSelects');
const getProducts = require('./utils/getProducts');
const getProduct = require('./utils/getProduct');
const getSitemap = require('./utils/getSitemap');
const getSearchResults = require('./utils/getSearchResults');
const saveEmail = require('./utils/saveEmail');
const setLike = require('./utils/setLike');
const setServiceData = require('./utils/setServiceData');

const MONGO_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'mydatabase';
const COLLECTION_NAME = 'cache';

const server = express();

server.use(cors());
server.use(bodyParser.json());

let client;

async function connectToDatabase() {
  try {
    client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);

    server.get('/brands', async (req, res) => {
      try {
        const brands = await getBrands();
        res.status(200).send(brands);
      } catch (error) {
        res.status(500).send(error);
      }
    });

    server.post('/selects', async (req, res) => {
      try {
        const cacheKey = JSON.stringify({ route: 'selects', params: req.body });
        const cachedResult = await collection.findOne({ _id: cacheKey });

        if (cachedResult) {
          res.status(200).send(cachedResult.data);
        } else {
          const result = await getSelects(req.body);
          await collection.insertOne({ _id: cacheKey, data: result });
          res.status(200).send(result);
        }
      } catch (error) {
        res.status(500).send(error);
      }
    });

    server.post('/products', async (req, res) => {
      try {
        const cacheKey = JSON.stringify({ route: 'products', params: req.body });
        const cachedResult = await collection.findOne({ _id: cacheKey });

        if (cachedResult) {
          res.status(200).send(cachedResult.data);
        } else {
          const result = await getProducts(req.body);
          await collection.insertOne({ _id: cacheKey, data: result });
          res.status(200).send(result);
        }
      } catch (error) {
        res.status(500).send(error);
      }
    });

    server.post('/product', async (req, res) => {
      try {
        const cacheKey = JSON.stringify({ route: 'product', params: req.body });
        const cachedResult = await collection.findOne({ _id: cacheKey });

        if (cachedResult) {
          res.status(200).send(cachedResult.data);
        } else {
          const result = await getProduct(req.body);
          await collection.insertOne({ _id: cacheKey, data: result });
          res.status(200).send(result);
        }
      } catch (error) {
        res.status(500).send(error);
      }
    });

    server.get('/sitemap', async (req, res) => {
      try {
        const result = await getSitemap();
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send(error);
      }
    });

    server.post('/search', async (req, res) => {
      try {
        const searchTerm = req.body.searchTerm; // Получаем поисковый запрос из параметров запроса

        const cacheKey = JSON.stringify({ route: 'search', query: searchTerm });
        const cachedResult = await collection.findOne({ _id: cacheKey });

        if (cachedResult) {
          res.status(200).send(cachedResult.data);
        } else {
          const result = await getSearchResults(searchTerm); // Используйте соответствующую функцию для выполнения поиска
          await collection.insertOne({ _id: cacheKey, data: result });
          res.status(200).send(result);
        }
      } catch (error) {
        res.status(500).send(error);
      }
    })

    server.post('/subscribe', async (req, res) => {
      try {
        const email = req.body.email; // Получаем адрес электронной почты из параметров запроса
        await saveEmail(email);
        res.status(200).send('Email subscribed successfully');
      } catch (error) {
        res.status(500).send(error);
      }
    })

    server.post('/like', async (req, res) => {
      try {
        const result = await setLike(req.body);
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send(error);
      }
    });

    server.put('/service', async (req, res) => {
      try {
        const result = await setServiceData(req.body);
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send(error);
      }
    });

    server.get('/clear-cache', async (req, res) => {
      try {
        await collection.deleteMany({});
        res.status(200).send('Cache cleared');
      } catch (error) {
        res.status(500).send(error);
      }
    });

    server.listen(3004, () => {
      console.log('Server is running on port 3004');
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

connectToDatabase();
