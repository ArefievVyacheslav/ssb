module.exports = class SelectsDto {
  data;
  collection;

  constructor(data, collection) {
    this.data = data;
    this.collection = collection;
  }

  getCollection() {
    return this.collection ?? 'clothes';
  }

  getOldStyle() {

    if (this.data?.price) {
      const startPrice = this.data.price[ '$in' ][0]
      const endPrice = this.data.price[ '$in' ][1]
      this.data.price[ '$in' ] = [...Array.from(Array(+endPrice - +startPrice + 1).keys(),x => x + +startPrice)]
    }

    return this.data;
  }

  getPriceFrom() {
    return this.data.price[' $in '][0];
  }

  getPriceTo() {
    return this.data.price[' $in '][1];
  }
};