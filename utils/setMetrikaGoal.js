const https = require('https');

module.exports = async function setMetrikaGoal (goal) {
  try {
    // Параметры запроса
    const counterId = '89951108';
    const goalId = '299218301';
    const token = '703d9270549a4abe92400392ec46f233';

    const conversionData = {
      order_id: goal.orderId, // Идентификатор заказа
      goal_id: goalId, // Идентификатор цели
      datetime: new Date().toISOString(), // Дата и время конверсии
      revenue: goal.orderAmount, // Сумма заказа
      currency: 'RUB', // Валюта заказа
      income: goal.income // Дополнительная информация о доходе
    };
    console.log(conversionData)

    const options = {
      hostname: 'api-metrika.yandex.net',
      path: `/management/v1/counter/${ counterId }/offline_conversions?oauth_token=${ token }`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      console.log(`Status code: ${ res.statusCode }`);

      res.on('data', (data) => {
        console.log(data.toString());
      });
    });

    req.on('error', (error) => {
      console.error('Произошла ошибка при отправке данных офлайн конверсии:', error);
    });

    req.write(JSON.stringify(conversionData));
    req.end();
  } catch (e) {
    console.log(e)
  }
}
