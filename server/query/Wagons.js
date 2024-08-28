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

async function getWagonsOfTrain(dodeljenaStevilka, date) {
  const [rows] = await pool.query(
    "SELECT viv.VIVidVagona, viv.RIDTovoraVagona, viv.stevilkaTovornegaListaVagona, viv.stevilkaPosiljkeVagona, viv.stevilkaPogodbeVagona, viv.netoTezaVagona, viv.dostavljenVagon, viv.idStrankeVagona, viv.kodaNHMVagona, viv.odpravnaDrzavaVagona, viv.namembnaDrzavaVagona, viv.naslednjiPrevoznikVagona, Prevoznik.nazivPrevoznika, Vagon.taraVagona, Vagon.lastnistvoVagona, Vagon.serijaVagona, KodaNHM.opisNHM, dr1.nazivDrzave AS nazivOdpravneDrzave, dr2.nazivDrzave AS nazivNamembneDrzave FROM Vlak_Vagon viv LEFT JOIN Prevoznik ON viv.naslednjiPrevoznikVagona = Prevoznik.idPrevoznika INNER JOIN Vagon ON viv.VIVidVagona = Vagon.idVagona INNER JOIN KodaNHM ON viv.kodaNHMVagona = KodaNHM.idNHM INNER JOIN Drzava dr1 ON viv.odpravnaDrzavaVagona = dr1.idDrzave INNER JOIN Drzava dr2 ON viv.odpravnaDrzavaVagona = dr2.idDrzave WHERE viv.VIVdodeljenaStevilkaVlaka = ?",
    [dodeljenaStevilka, date] //POPRAVI DATE!!!
  );
  return rows;
}

async function searchWagons(type, documentNumber) {
  const [rows] = await pool.query(
    `SELECT viv.VIVidVagona, viv.RIDTovoraVagona, viv.stevilkaTovornegaListaVagona, viv.stevilkaPosiljkeVagona, viv.stevilkaPogodbeVagona, viv.netoTezaVagona, viv.dostavljenVagon, viv.idStrankeVagona, viv.kodaNHMVagona, viv.odpravnaDrzavaVagona, viv.namembnaDrzavaVagona, viv.naslednjiPrevoznikVagona, viv.VIVdatumZacetkaVoznjeVlaka, viv.VIVdodeljenaStevilkaVlaka, Prevoznik.nazivPrevoznika, Vagon.taraVagona, Vagon.lastnistvoVagona, Vagon.serijaVagona, KodaNHM.opisNHM, dr1.nazivDrzave AS nazivOdpravneDrzave, dr2.nazivDrzave AS nazivNamembneDrzave, Vlak.idTrenutnaPostajaVlaka, Postaja.nazivPostaje FROM Vlak_Vagon viv LEFT JOIN Prevoznik ON viv.naslednjiPrevoznikVagona = Prevoznik.idPrevoznika INNER JOIN Vagon ON viv.VIVidVagona = Vagon.idVagona INNER JOIN KodaNHM ON viv.kodaNHMVagona = KodaNHM.idNHM INNER JOIN Drzava dr1 ON viv.odpravnaDrzavaVagona = dr1.idDrzave INNER JOIN Drzava dr2 ON viv.odpravnaDrzavaVagona = dr2.idDrzave INNER JOIN Vlak ON Vlak.dodeljenaStevilkaVlaka = viv.VIVdodeljenaStevilkaVlaka INNER JOIN Postaja ON Vlak.idTrenutnaPostajaVlaka = Postaja.idPostaje WHERE ${type} = ?`,
    [documentNumber]
  );
  return rows;
}

async function searchWagonsById(wagonNumber) {
  const [rows] = await pool.query(
    `SELECT viv.VIVidVagona, viv.RIDTovoraVagona, viv.stevilkaTovornegaListaVagona, viv.stevilkaPosiljkeVagona, viv.stevilkaPogodbeVagona, viv.netoTezaVagona, viv.dostavljenVagon, viv.idStrankeVagona, viv.kodaNHMVagona, viv.odpravnaDrzavaVagona, viv.namembnaDrzavaVagona, viv.naslednjiPrevoznikVagona, viv.VIVdatumZacetkaVoznjeVlaka, viv.VIVdodeljenaStevilkaVlaka, Prevoznik.nazivPrevoznika, Vagon.taraVagona, Vagon.lastnistvoVagona, Vagon.serijaVagona, KodaNHM.opisNHM, dr1.nazivDrzave AS nazivOdpravneDrzave, dr2.nazivDrzave AS nazivNamembneDrzave, Vlak.idTrenutnaPostajaVlaka, Postaja.nazivPostaje FROM Vlak_Vagon viv LEFT JOIN Prevoznik ON viv.naslednjiPrevoznikVagona = Prevoznik.idPrevoznika INNER JOIN Vagon ON viv.VIVidVagona = Vagon.idVagona INNER JOIN KodaNHM ON viv.kodaNHMVagona = KodaNHM.idNHM INNER JOIN Drzava dr1 ON viv.odpravnaDrzavaVagona = dr1.idDrzave INNER JOIN Drzava dr2 ON viv.odpravnaDrzavaVagona = dr2.idDrzave INNER JOIN Vlak ON Vlak.dodeljenaStevilkaVlaka = viv.VIVdodeljenaStevilkaVlaka INNER JOIN Postaja ON Vlak.idTrenutnaPostajaVlaka = Postaja.idPostaje WHERE viv.VIVidVagona = ?`,
    [wagonNumber]
  );
  return rows;
}

async function getCustomerWagons(idStrankeUporabnika) {
  const [rows] = await pool.query(
    `SELECT viv.VIVidVagona, viv.RIDTovoraVagona, viv.stevilkaTovornegaListaVagona, viv.stevilkaPosiljkeVagona, viv.stevilkaPogodbeVagona, viv.netoTezaVagona, viv.dostavljenVagon, viv.idStrankeVagona, viv.kodaNHMVagona, viv.odpravnaDrzavaVagona, viv.namembnaDrzavaVagona, viv.naslednjiPrevoznikVagona, viv.VIVdatumZacetkaVoznjeVlaka, viv.VIVdodeljenaStevilkaVlaka, Prevoznik.nazivPrevoznika, Vagon.taraVagona, Vagon.lastnistvoVagona, Vagon.serijaVagona, KodaNHM.opisNHM, dr1.nazivDrzave AS nazivOdpravneDrzave, dr2.nazivDrzave AS nazivNamembneDrzave, Vlak.idTrenutnaPostajaVlaka, Postaja.nazivPostaje FROM Vlak_Vagon viv LEFT JOIN Prevoznik ON viv.naslednjiPrevoznikVagona = Prevoznik.idPrevoznika INNER JOIN Vagon ON viv.VIVidVagona = Vagon.idVagona INNER JOIN KodaNHM ON viv.kodaNHMVagona = KodaNHM.idNHM INNER JOIN Drzava dr1 ON viv.odpravnaDrzavaVagona = dr1.idDrzave INNER JOIN Drzava dr2 ON viv.odpravnaDrzavaVagona = dr2.idDrzave INNER JOIN Vlak ON Vlak.dodeljenaStevilkaVlaka = viv.VIVdodeljenaStevilkaVlaka INNER JOIN Postaja ON Vlak.idTrenutnaPostajaVlaka = Postaja.idPostaje WHERE viv.idStrankeVagona = ?`,
    [idStrankeUporabnika]
  );
  return rows;
}

async function getWagonNumbers(idStrankeUporabnika) {
  if (idStrankeUporabnika == null) {
    const [rows] = await pool.query(
      "SELECT CAST(VIVidVagona AS CHAR) as 'label' FROM Vlak_Vagon"
    );
    return rows;
  } else {
    const [rows] = await pool.query(
      "SELECT CAST(VIVidVagona AS CHAR) as 'label' FROM Vlak_Vagon WHERE idStrankeVagona = ?",
      idStrankeUporabnika
    );
    return rows;
  }
}

module.exports = {
  getCustomerWagons,
  searchWagonsById,
  getWagonNumbers,
  searchWagons,
  getWagonsOfTrain,
};
