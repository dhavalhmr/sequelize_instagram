require("dotenv").config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD, HOST, DIALECT } = process?.env

module.exports = {
  "development": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": HOST,
    "dialect": DIALECT
  },
  "test": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": "database_test",
    "host": HOST,
    "dialect": DIALECT
  },
  "production": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": "database_production",
    "host": HOST,
    "dialect": DIALECT
  }
}
