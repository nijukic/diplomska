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

async function getActiveTrains() {
  const [rows] = await pool.query(
    "SELECT Vlak.dodeljenaStevilkaVlaka, Vlak.datumZacetkaVoznjeVlaka, Vlak.statusVlaka, Vlak.tipVlaka, Vlak.zamudaVlaka, Vlak.razlogNeaktivnostiVlaka, Vlak.idLokomotiveVlaka, Vlak.idPrevoznikaVlaka, Vlak.idTrenutnaPostajaVlaka, Vlak.razlogNeaktivnostiVlaka, p1.nazivPostaje, Vlak.idZacetnaPostajaSZVlaka, p2.nazivPostaje AS nazivZacetnePostaje, Vlak.idKoncnaPostajaSZVlaka, p3.nazivPostaje AS nazivKoncnePostaje, pos.idPrejsnjePostajePostanka, p4.nazivPostaje AS nazivPrejsnjePostaje, pos.idNaslednjePostajePostanka, p5.nazivPostaje AS nazivNaslednjePostaje FROM Vlak LEFT JOIN Postaja p1 ON Vlak.idTrenutnaPostajaVlaka = p1.idPostaje LEFT JOIN Postaja p2 ON Vlak.idZacetnaPostajaSZVlaka = p2.idPostaje LEFT JOIN Postaja p3 ON Vlak.idKoncnaPostajaSZVlaka = p3.idPostaje LEFT JOIN Vlak_Postaja pos ON Vlak.idTrenutnaPostajaVlaka = pos.idPostajePostanka  AND  Vlak.dodeljenaStevilkaVlaka = pos.dodeljenaStevilkaVlakaPostanka AND Vlak.datumZacetkaVoznjeVlaka = pos.datumZacetkaVoznjeVlakaPostanka LEFT JOIN Postaja p4 ON pos.idPrejsnjePostajePostanka = p4.idPostaje LEFT JOIN Postaja p5 ON pos.idNaslednjePostajePostanka = p5.idPostaje"
  );
  return rows;
}

async function getActiveTrainsCustomer() {
  const [rows] = await pool.query(
    "SELECT Vlak.dodeljenaStevilkaVlaka, Vlak.datumZacetkaVoznjeVlaka, Vlak.statusVlaka, Vlak.tipVlaka, Vlak.zamudaVlaka, Vlak.razlogNeaktivnostiVlaka, Vlak.idLokomotiveVlaka, Vlak.idPrevoznikaVlaka, Vlak.idTrenutnaPostajaVlaka, Vlak.razlogNeaktivnostiVlaka, p1.nazivPostaje, Vlak.idZacetnaPostajaSZVlaka, p2.nazivPostaje AS nazivZacetnePostaje, Vlak.idKoncnaPostajaSZVlaka, p3.nazivPostaje AS nazivKoncnePostaje, pos.idPrejsnjePostajePostanka, p4.nazivPostaje AS nazivPrejsnjePostaje, pos.idNaslednjePostajePostanka, p5.nazivPostaje AS nazivNaslednjePostaje, viv.idStrankeVagona FROM Vlak LEFT JOIN Postaja p1 ON Vlak.idTrenutnaPostajaVlaka = p1.idPostaje LEFT JOIN Postaja p2 ON Vlak.idZacetnaPostajaSZVlaka = p2.idPostaje LEFT JOIN Postaja p3 ON Vlak.idKoncnaPostajaSZVlaka = p3.idPostaje LEFT JOIN Vlak_Postaja pos ON Vlak.idTrenutnaPostajaVlaka = pos.idPostajePostanka  AND  Vlak.dodeljenaStevilkaVlaka = pos.dodeljenaStevilkaVlakaPostanka AND Vlak.datumZacetkaVoznjeVlaka = pos.datumZacetkaVoznjeVlakaPostanka LEFT JOIN Postaja p4 ON pos.idPrejsnjePostajePostanka = p4.idPostaje LEFT JOIN Postaja p5 ON pos.idNaslednjePostajePostanka = p5.idPostaje INNER JOIN Vlak_Vagon viv ON viv.VIVdodeljenaStevilkaVlaka = Vlak.dodeljenaStevilkaVlaka"
  );
  return rows;
}

async function getTrainsBySearch(status, type, date) {
  const typeString = type ? "izredni" : "redni";
  const [rows] = await pool.query(
    "SELECT Vlak.dodeljenaStevilkaVlaka, Vlak.datumZacetkaVoznjeVlaka, Vlak.statusVlaka, Vlak.tipVlaka, Vlak.zamudaVlaka, Vlak.razlogNeaktivnostiVlaka, Vlak.idLokomotiveVlaka, Vlak.idPrevoznikaVlaka, Vlak.idTrenutnaPostajaVlaka, p1.nazivPostaje, Vlak.idZacetnaPostajaSZVlaka, p2.nazivPostaje AS nazivZacetnePostaje, Vlak.idKoncnaPostajaSZVlaka, p3.nazivPostaje AS nazivKoncnePostaje, pos.idPrejsnjePostajePostanka, p4.nazivPostaje AS nazivPrejsnjePostaje, pos.idNaslednjePostajePostanka, p5.nazivPostaje AS nazivNaslednjePostaje FROM Vlak LEFT JOIN Postaja p1 ON Vlak.idTrenutnaPostajaVlaka = p1.idPostaje LEFT JOIN Postaja p2 ON Vlak.idZacetnaPostajaSZVlaka = p2.idPostaje LEFT JOIN Postaja p3 ON Vlak.idKoncnaPostajaSZVlaka = p3.idPostaje LEFT JOIN Vlak_Postaja pos ON Vlak.idTrenutnaPostajaVlaka = pos.idPostajePostanka  AND  Vlak.dodeljenaStevilkaVlaka = pos.dodeljenaStevilkaVlakaPostanka AND Vlak.datumZacetkaVoznjeVlaka = pos.datumZacetkaVoznjeVlakaPostanka LEFT JOIN Postaja p4 ON pos.idPrejsnjePostajePostanka = p4.idPostaje LEFT JOIN Postaja p5 ON pos.idNaslednjePostajePostanka = p5.idPostaje WHERE Vlak.statusVlaka = ? AND Vlak.tipVlaka = ? AND DATE(Vlak.datumZacetkaVoznjeVlaka) = ?",
    [status, typeString, date]
  );
  return rows;
}

async function refreshDetailsTrain(dodeljenaStevilka, date) {
  const [rows] = await pool.query(
    "SELECT Vlak.dodeljenaStevilkaVlaka, Vlak.datumZacetkaVoznjeVlaka, Vlak.statusVlaka, Vlak.tipVlaka, Vlak.zamudaVlaka, Vlak.razlogNeaktivnostiVlaka, Vlak.idLokomotiveVlaka, Vlak.idPrevoznikaVlaka, Vlak.idTrenutnaPostajaVlaka, Vlak.razlogNeaktivnostiVlaka, p1.nazivPostaje, Vlak.idZacetnaPostajaSZVlaka, p2.nazivPostaje AS nazivZacetnePostaje, Vlak.idKoncnaPostajaSZVlaka, p3.nazivPostaje AS nazivKoncnePostaje, pos.idPrejsnjePostajePostanka, p4.nazivPostaje AS nazivPrejsnjePostaje, pos.idNaslednjePostajePostanka, p5.nazivPostaje AS nazivNaslednjePostaje FROM Vlak LEFT JOIN Postaja p1 ON Vlak.idTrenutnaPostajaVlaka = p1.idPostaje LEFT JOIN Postaja p2 ON Vlak.idZacetnaPostajaSZVlaka = p2.idPostaje LEFT JOIN Postaja p3 ON Vlak.idKoncnaPostajaSZVlaka = p3.idPostaje LEFT JOIN Vlak_Postaja pos ON Vlak.idTrenutnaPostajaVlaka = pos.idPostajePostanka  AND  Vlak.dodeljenaStevilkaVlaka = pos.dodeljenaStevilkaVlakaPostanka AND Vlak.datumZacetkaVoznjeVlaka = pos.datumZacetkaVoznjeVlakaPostanka LEFT JOIN Postaja p4 ON pos.idPrejsnjePostajePostanka = p4.idPostaje LEFT JOIN Postaja p5 ON pos.idNaslednjePostajePostanka = p5.idPostaje WHERE Vlak.dodeljenaStevilkaVlaka = ?",
    [dodeljenaStevilka, date]
  );
  return rows[0];
}

async function getSpecificTrain(dodeljenaStevilka, date) {
  const [rows] = await pool.query(
    "SELECT Vlak.dodeljenaStevilkaVlaka, Vlak.datumZacetkaVoznjeVlaka, Vlak.statusVlaka, Vlak.tipVlaka, Vlak.zamudaVlaka, Vlak.razlogNeaktivnostiVlaka, Vlak.idLokomotiveVlaka, Vlak.idPrevoznikaVlaka, Vlak.idTrenutnaPostajaVlaka, p1.nazivPostaje, Vlak.idZacetnaPostajaSZVlaka, p2.nazivPostaje AS nazivZacetnePostaje, Vlak.idKoncnaPostajaSZVlaka, p3.nazivPostaje AS nazivKoncnePostaje, pos.idPrejsnjePostajePostanka, p4.nazivPostaje AS nazivPrejsnjePostaje, pos.idNaslednjePostajePostanka, p5.nazivPostaje AS nazivNaslednjePostaje FROM Vlak LEFT JOIN Postaja p1 ON Vlak.idTrenutnaPostajaVlaka = p1.idPostaje LEFT JOIN Postaja p2 ON Vlak.idZacetnaPostajaSZVlaka = p2.idPostaje LEFT JOIN Postaja p3 ON Vlak.idKoncnaPostajaSZVlaka = p3.idPostaje LEFT JOIN Vlak_Postaja pos ON Vlak.idTrenutnaPostajaVlaka = pos.idPostajePostanka  AND  Vlak.dodeljenaStevilkaVlaka = pos.dodeljenaStevilkaVlakaPostanka AND Vlak.datumZacetkaVoznjeVlaka = pos.datumZacetkaVoznjeVlakaPostanka LEFT JOIN Postaja p4 ON pos.idPrejsnjePostajePostanka = p4.idPostaje LEFT JOIN Postaja p5 ON pos.idNaslednjePostajePostanka = p5.idPostaje WHERE Vlak.dodeljenaStevilkaVlaka = ? AND DATE(Vlak.datumZacetkaVoznjeVlaka) = ?",
    [dodeljenaStevilka, date]
  );
  return rows;
}

module.exports = {
  getActiveTrainsCustomer,
  refreshDetailsTrain,
  getActiveTrains,
  getTrainsBySearch,
  getSpecificTrain,
};
