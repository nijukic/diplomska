const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    timezone: "+01:00",
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

async function getAllStations() {
  const [rows] = await pool.query(
    "SELECT nazivPostaje as 'label', CAST(idPostaje AS CHAR) as 'dodatno' FROM Postaja"
  );
  const [rows2] = await pool.query(
    "SELECT CAST(idPostaje AS CHAR) as 'label', nazivPostaje as 'dodatno' FROM Postaja"
  );
  return rows.concat(rows2);
}

async function getAllStops(dodeljenaStevilka, date) {
  const [rows] = await pool.query(
    "SELECT pos.dodeljenaStevilkaVlakaPostanka, pos.datumZacetkaVoznjeVlakaPostanka, pos.idPostajePostanka, p1.nazivPostaje as nazivPostaje, pos.nacrtovanPrihod, pos.dejanskiPrihod, pos.zamuda, pos.idPrejsnjePostajePostanka, p2.nazivPostaje as nazivPrejsnjePostaje, pos.idNaslednjePostajePostanka, p3.nazivPostaje as nazivNaslednjePostaje FROM Vlak INNER JOIN Vlak_Postaja pos ON Vlak.datumZacetkaVoznjeVlaka = pos.datumZacetkaVoznjeVlakaPostanka AND Vlak.dodeljenaStevilkaVlaka = pos.dodeljenaStevilkaVlakaPostanka LEFT JOIN Postaja p1 ON pos.idPostajePostanka = p1.idPostaje LEFT JOIN Postaja p2 ON pos.idPrejsnjePostajePostanka = p2.idPostaje LEFT JOIN Postaja p3 ON pos.idNaslednjePostajePostanka = p3.idPostaje WHERE Vlak.dodeljenaStevilkaVlaka = ? ORDER BY pos.nacrtovanPrihod",
    [dodeljenaStevilka, date]
  );
  return rows;
}

module.exports = {
  getAllStops,
  getAllStations,
};
