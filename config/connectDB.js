const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: "195.35.22.205",
  user: "universals",
  password: "universals",
  database: "universals",
  dateStrings: true
});

export default connection;
