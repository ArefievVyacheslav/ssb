module.exports = class SelectsDto {
  data;
  constructor(data) {
    this.data = data;
  }

  getCollection() {
    return this.data.collection;
  }

  getOldStyle() {
    return this.data;
  }

  getPriceFrom() {
    return this.data.price[' $in '][0];
  }

  getPriceTo() {
    return this.data.price[' $in '][1];
  }
}