const axios = require('axios')

module.exports = async function setMetrikaGoal (goal) {
  try {
    // Параметры запроса
    const apiUrl = `https://api-metrika.yandex.net/management/v1/counter/{counterId}/goals/{goalId}/events`;
    const counterId = '89951108';
    const goalId = '299218301';
    const accessToken = 'y0_AgAAAAA3QeKgAAoHKAAAAADlD9faTmCwibEaSEeAPIC-HAg3wbdLGRU';

    // Формирование данных для запроса
    const headers = { Authorization: 'OAuth ' + accessToken };
    const payload = {
      goalId,
      counterId,
      type: 'goal',
      orderId: goal.orderId,
      price: goal.orderAmount,
      currency: goal.orderCurrency,
      income: goal.income
    };
    console.log(payload)

    // Отправка запроса
    try {
      const response = await axios.post(apiUrl.replace('{counterId}', counterId).replace('{goalId}', goalId), payload, {
        headers,
      });

      if (response.status === 202) {
        console.log('Запрос успешно отправлен.');
      } else {
        console.log('Произошла ошибка при отправке запроса:', response.data);
      }
    } catch (error) {
      console.log('Произошла ошибка при отправке запроса:', error.message);
    }
  } catch (e) {
    console.log(e)
  }
}
