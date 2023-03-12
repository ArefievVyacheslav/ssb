module.exports = class PaginationDto {
  data;
  constructor(data) {
    this.data = data;
  }

  getLimit() {
    return this.data?.show ?? 60;
  }

  getPage() {
    return this.data?.page ?? 0;
  }
}