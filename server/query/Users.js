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

async function getAllCustomers() {
  const [rows] = await pool.query(
    "SELECT CAST(idStranke AS CHAR) as 'label' FROM Stranka LEFT JOIN Uporabnik ON  Stranka.idStranke = Uporabnik.idStrankeUporabnika WHERE Uporabnik.idStrankeUporabnika IS NULL"
  );
  return rows;
}

async function getUserByUsername(username) {
  const [rows] = await pool.query(
    "SELECT idUporabnika, uporabniskoImeUporabnika, vlogaUporabnika, idStrankeUporabnika FROM Uporabnik WHERE uporabniskoImeUporabnika = ?",
    [username]
  );
  return rows[0];
}

async function checkCustomerNumber(customerNumber) {
  const [rows] = await pool.query(
    "SELECT idUporabnika, uporabniskoImeUporabnika, vlogaUporabnika FROM Uporabnik WHERE idStrankeUporabnika = ?",
    [customerNumber]
  );
  return rows[0];
}

async function getPasswordByUsername(username) {
  const [rows] = await pool.query(
    "SELECT gesloUporabnika FROM Uporabnik WHERE uporabniskoImeUporabnika = ?",
    [username]
  );
  return rows[0].gesloUporabnika;
}

async function createUser(username, password, role) {
  await pool.query(
    "INSERT INTO Uporabnik (uporabniskoImeUporabnika, gesloUporabnika, vlogaUporabnika) VALUES (?, ?, ?)",
    [username, password, role]
  );
}

async function createUserCustomer(username, password, role, customerNumber) {
  await pool.query(
    "INSERT INTO Uporabnik (uporabniskoImeUporabnika, gesloUporabnika, vlogaUporabnika, idStrankeUporabnika) VALUES (?, ?, ?, ?)",
    [username, password, role, customerNumber]
  );
}

async function createRefreshToken(refreshToken) {
  await pool.query(
    "INSERT INTO Zeton (idOsvezitvenegaZetona, ustvarjen) VALUES (?, CURRENT_TIMESTAMP)",
    [refreshToken]
  );
}

async function getRefreshToken(refreshToken) {
  const [rows] = await pool.query(
    "SELECT idOsvezitvenegaZetona FROM Zeton WHERE idOsvezitvenegaZetona = ?",
    [refreshToken]
  );
  return rows[0].idOsvezitvenegaZetona;
}

async function deleteRefreshToken(refreshToken) {
  await pool.query("DELETE FROM Zeton WHERE idOsvezitvenegaZetona = ?", [
    refreshToken,
  ]);
}

module.exports = {
  getAllCustomers,
  checkCustomerNumber,
  getUserByUsername,
  getPasswordByUsername,
  createUser,
  createUserCustomer,
  createRefreshToken,
  deleteRefreshToken,
  getRefreshToken,
};
