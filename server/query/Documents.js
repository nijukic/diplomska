const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
  connection.release();
});

async function getDocumentNumbersByType(type, idStrankeUporabnika) {
  if (idStrankeUporabnika == null) {
    const query = `SELECT DISTINCT CAST(${type} AS CHAR) as 'label' FROM Vlak_Vagon`;

    const [rows] = await pool.query(query);

    return rows;
  } else {
    const [rows] = await pool.query(
      `SELECT DISTINCT CAST(${type} AS CHAR) as 'label' FROM Vlak_Vagon WHERE idStrankeVagona = ?`,
      idStrankeUporabnika
    );

    return rows;
  }
}

module.exports = {
  getDocumentNumbersByType,
};
