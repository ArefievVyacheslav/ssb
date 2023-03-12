const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {MongoClient} = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

const generateAccessToken = (id, email) => {
  const payload = {
    userId: id,
    email: email,
  };
  return jwt.sign(payload, 'Hello', {expiresIn: '24h'});
};

module.exports = async function login(loginData) {
  try {
    await client.connect();
    const db = await client.db('ss').collection('users');
    const user = await db.findOne({email: loginData.getEmail()}) || {};

    if (!user) {
      return {
        'status': false,
        'message': 'not_found',
      };
    }

    const validPassword = bcrypt.compareSync(loginData.getPassword(), user.password);

    if (!validPassword) {
      return {
        'status': false,
        'message': 'password_incorrect',
      };
    }

    const token = generateAccessToken(user._id, user.email);

    return {
      status: true,
      token: token,
    };
  } catch (e) {
    return {
      status: false,
      message: `error : ${ e.message }`,
    };
  }
};