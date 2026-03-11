const mysql = require("mysql2/promise");

// const connection = mysql.createPool({
//   host: "72.61.226.242",
//   user: "aladindemo",
//   password: "aladindemo",
//   database: "aladindemo",
// });

// export default connection;



const connection = mysql.createPool({
  host: "72.61.226.242",
  user: "newaladin",
  password: "newaladin",
  database: "newaladin",
  dateStrings: true
});

export default connection;