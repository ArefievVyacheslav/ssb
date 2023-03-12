module.exports = class LoginDto {
  data;

  constructor(data) {
    this.data = data;
  }

  getEmail() {
    return this.data.email ?? this.data.login;
  }

  getPassword() {
    return this.data.password;
  }
};