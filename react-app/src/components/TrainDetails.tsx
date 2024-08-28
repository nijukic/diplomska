import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tooltip,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import redniVlak from "../assets/redniVlak.png";
import postanekSlika from "../assets/railway-station (4).png";
import neaktiven from "../assets/neaktiven.png";
import prihajaVlak from "../assets/train1.gif";
import izredniVlak from "../assets/izredniVlak.png";
import arrow from "../assets/rightArrowLarge.png";
import niVlaka from "../assets/niVlaka.png";
import rid from "../assets/RID.png";
import vagonSlika from "../assets/wagon.png";
import zakljucil from "../assets/accept.png";

import { useTheme } from "@mui/material/styles";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import RefreshIcon from "@mui/icons-material/Refresh";
import MenuDrawer from "./MenuDrawer";
import { AuthContext } from "../helpers/AuthContext";

interface Train {
  datumZacetkaVoznjeVlaka: string;
  dodeljenaStevilkaVlaka: number;
  idLokomotiveVlaka: number;
  idPrevoznikaVlaka: number;
  statusVlaka: string;
  tipVlaka: string;
  zamudaVlaka: number;
  razlogNeaktivnostiVlaka: string;
  idTrenutnaPostajaVlaka: number;
  nazivPostaje: string;
  idZacetnaPostajaSZVlaka: number;
  nazivZacetnePostaje: string;
  idKoncnaPostajaSZVlaka: number;
  nazivKoncnePostaje: string;
  idPrejsnjePostajePostanka: number;
  nazivPrejsnjePostaje: string;
  idNaslednjePostajePostanka: number;
  nazivNaslednjePostaje: string;
}

interface Wagon {
  VIVidVagona: number;
  RIDTovoraVagona: boolean;
  stevilkaTovornegaListaVagona: number;
  stevilkaPosiljkeVagona: number;
  stevilkaPogodbeVagona: number;
  netoTezaVagona: number;
  dostavljenVagon: boolean;
  idStrankeVagona: number;
  kodaNHMVagona: number;
  odpravnaDrzavaVagona: number;
  namembnaDrzavaVagona: number;
  naslednjiPrevoznikVagona: number;
  nazivPrevoznika: string;
  taraVagona: number;
  lastnistvoVagona: string;
  serijaVagona: string;
  opisNHM: string;
  nazivOdpravneDrzave: string;
  nazivNamembneDrzave: String;
}

interface Stop {
  dodeljenaStevilkaVlakaPostanka: number;
  datumZacetkaVoznjeVlakaPostanka: string;
  idPostajePostanka: number;
  nazivPostaje: string;
  nacrtovanPrihod: string;
  dejanskiPrihod: string;
  zamuda: number;
  idPrejsnjePostajePostanka: number;
  nazivPrejsnjePostaje: string;
  idNaslednjePostajePostanka: number;
  nazivNaslednjePostaje: string;
}

interface searchStation {
  label: string;
  dodatno: string;
}

interface Props {
  showTrainDetails: boolean;
  showTrainDetailsTrain: Train;
  setShowTrainDetails: (value: boolean) => void;
  allStopsOfTrain: Stop[];
  setSearchStationValue: (value: searchStation) => void;
  setShowTrainDetailsTrain: (value: Train) => void;
  setAllStopsOfTrain: (value: Stop[]) => void;
  setShowActiveTrains: (value: boolean) => void;
}

function TrainDetails({
  showTrainDetails,
  showTrainDetailsTrain,
  setShowTrainDetails,
  allStopsOfTrain,
  setSearchStationValue,
  setShowTrainDetailsTrain,
  setAllStopsOfTrain,
  setShowActiveTrains,
}: Props) {
  const { vlogaUporabnika, idStrankeUporabnika } = useContext(AuthContext);
  const [wagonsOfTrain, setWagonsOfTrain] = useState<Wagon[]>([]);

  const theme = useTheme();

  const [value, setValue] = useState("1");

  useEffect(() => {
    const getAllWagons = async () => {
      try {
        const getWagons = await axios.post(
          "http://localhost:3001/wagon/getWagonsOfTrain",
          {
            dodeljenaStevilka: showTrainDetailsTrain.dodeljenaStevilkaVlaka,
            date: showTrainDetailsTrain.datumZacetkaVoznjeVlaka,
          }
        );
        setWagonsOfTrain(getWagons.data);
      } catch (error) {
        console.error("Wagons could not be fetched", error);
      }
    };

    getAllWagons();
  }, [showTrainDetailsTrain]);

  const handleClosePaperClick = () => {
    setShowTrainDetails(false);
    setShowTrainDetailsTrain({} as Train);
    setAllStopsOfTrain([]);
    setShowActiveTrains(true);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleRefresh = () => {
    const fetchData = async () => {
      try {
        const searchTrain = await axios.post(
          "http://localhost:3001/trains/refreshDetailsTrain",
          {
            dodeljenaStevilka: showTrainDetailsTrain.dodeljenaStevilkaVlaka,
            date: showTrainDetailsTrain.datumZacetkaVoznjeVlaka,
          }
        );
        setShowTrainDetailsTrain(searchTrain.data);
      } catch (error) {
        console.error("Trains could not be fetched", error);
      }
    };

    fetchData();
  };

  return (
    <Box>
      <Paper
        elevation={10}
        sx={{
          minWidth: "400px",
          height: "60vh",
          width: "40vw",
          maxWidth: "500px",
          zIndex: "drawer",
          position: "absolute",
          top: 0,
          left: 0,
          borderRadius: 0,
          borderBottomRightRadius: 10,
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "0.5em",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "0px",
            borderBottomRightRadius: "10px",
            boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "primary.light",
            borderRadius: "5px",
            border: "1px solid black",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "primary.main",
          },
        }}
      >
        <MenuDrawer></MenuDrawer>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                position: "relative",
              }}
            >
              <TabList
                onChange={handleChange}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Tab
                  label="POSTANKI"
                  value="1"
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    maxWidth: "45%",
                    mx: 1.8,
                  }}
                />
                <Tab
                  label="VAGONI"
                  value="2"
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    maxWidth: "45%",
                  }}
                />
              </TabList>
              <IconButton
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 6,
                  transform: "translateY(-50%)",
                }}
                onClick={handleClosePaperClick}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <TabPanel value="2">
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    mt: -1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {showTrainDetailsTrain.statusVlaka == "neaktiven" && (
                      <Tooltip
                        title={"Vlak neaktiven: ".concat(
                          showTrainDetailsTrain.razlogNeaktivnostiVlaka
                        )}
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -7],
                                },
                              },
                            ],
                          },
                        }}
                        arrow
                        placement="top"
                      >
                        <Box
                          component="img"
                          sx={{
                            height: 22,
                            width: 22,
                          }}
                          src={neaktiven}
                        />
                      </Tooltip>
                    )}
                    {showTrainDetailsTrain.statusVlaka == "zakljucil" && (
                      <Tooltip
                        title={"Zaključil"}
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -7],
                                },
                              },
                            ],
                          },
                        }}
                        arrow
                        placement="top"
                      >
                        <Box
                          component="img"
                          sx={{
                            height: 18,
                            width: 18,
                            mb: 0.1,
                          }}
                          src={zakljucil}
                        />
                      </Tooltip>
                    )}
                    {showTrainDetailsTrain.tipVlaka == "redni" ? (
                      <Chip
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor: theme.palette.secondary.main,
                            }}
                            variant="rounded"
                            src={redniVlak}
                          />
                        }
                        label={showTrainDetailsTrain.dodeljenaStevilkaVlaka}
                        color="secondary"
                        sx={{ mx: 1, padding: 2 }}
                      />
                    ) : (
                      <Chip
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor: theme.palette.secondary.main,
                            }}
                            variant="rounded"
                            src={izredniVlak}
                          />
                        }
                        label={showTrainDetailsTrain.dodeljenaStevilkaVlaka}
                        color="secondary"
                        sx={{ mx: 1 }}
                      />
                    )}

                    <Box
                      component="img"
                      sx={{
                        height: 40,
                        width: 40,
                      }}
                      src={arrow}
                    />

                    <Typography sx={{ mx: 1 }} variant="subtitle1">
                      {showTrainDetailsTrain.nazivKoncnePostaje}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderBottom: "5px solid #015194",
                    borderRadius: "10px",
                    width: "100%",
                    mb: 2,
                  }}
                >
                  <Divider />
                </Box>

                <Box>
                  <List>
                    {wagonsOfTrain.map((wagon) => {
                      if (
                        vlogaUporabnika != "stranka" ||
                        wagon.idStrankeVagona == idStrankeUporabnika
                      ) {
                        return (
                          <Box key={wagon.VIVidVagona}>
                            <ListItem disablePadding key={wagon.VIVidVagona}>
                              <ListItemIcon>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 180,
                                    ml: -5,
                                  }}
                                >
                                  <Box>
                                    {wagon.RIDTovoraVagona == true && (
                                      <Tooltip
                                        placement="top"
                                        title="Nevarni tovor"
                                        slotProps={{
                                          popper: {
                                            modifiers: [
                                              {
                                                name: "offset",
                                                options: {
                                                  offset: [0, -7],
                                                },
                                              },
                                            ],
                                          },
                                        }}
                                        arrow
                                      >
                                        <Box
                                          component="img"
                                          sx={{
                                            height: 20,
                                            width: 20,
                                          }}
                                          src={rid}
                                        />
                                      </Tooltip>
                                    )}
                                  </Box>
                                  <Box>
                                    <Chip
                                      avatar={
                                        <Avatar
                                          variant="rounded"
                                          src={vagonSlika}
                                        />
                                      }
                                      label={
                                        <Typography
                                          variant="subtitle2"
                                          sx={{ fontWeight: "bold" }}
                                        >
                                          {wagon.VIVidVagona}
                                        </Typography>
                                      }
                                      variant="outlined"
                                      sx={{
                                        borderWidth: 3,
                                        borderColor: "primary.main",
                                      }}
                                    />
                                  </Box>
                                  <Box>
                                    <Tooltip
                                      title="Lastnik vagona"
                                      slotProps={{
                                        popper: {
                                          modifiers: [
                                            {
                                              name: "offset",
                                              options: {
                                                offset: [0, -7],
                                              },
                                            },
                                          ],
                                        },
                                      }}
                                      arrow
                                    >
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ mt: 1, fontWeight: "bold" }}
                                      >
                                        {wagon.lastnistvoVagona == "zelezniski"
                                          ? "Slovenske železnice"
                                          : "Privatnik"}
                                      </Typography>
                                    </Tooltip>
                                  </Box>
                                </Box>
                              </ListItemIcon>
                              <ListItemText>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    ml: 2,
                                  }}
                                >
                                  <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2}>
                                      <Grid item xs={6} sm={6} md={6} lg={3}>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                        >
                                          <strong>Tov. list:</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                          {wagon.stevilkaTovornegaListaVagona}
                                        </Typography>
                                      </Grid>

                                      <Grid item xs={6} sm={6} md={6} lg={3}>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                        >
                                          <strong>Pošiljka:</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                          {wagon.stevilkaPosiljkeVagona}
                                        </Typography>
                                      </Grid>

                                      <Grid item xs={6} sm={6} md={6} lg={3}>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                        >
                                          <strong>Pogodba:</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                          {wagon.stevilkaPogodbeVagona}
                                        </Typography>
                                      </Grid>

                                      <Grid item xs={6} sm={6} md={6} lg={3}>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                        >
                                          <strong>Stranka:</strong>
                                        </Typography>
                                        <Typography variant="body2">
                                          {wagon.idStrankeVagona}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Box>

                                  <Divider
                                    sx={{ borderColor: "#ddd", mb: 2 }}
                                  />

                                  <Box sx={{ mb: 2 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: "bold", mr: 1 }}
                                      >
                                        Koda NHM:
                                      </Typography>
                                      <Typography
                                        variant="subtitle1"
                                        sx={{
                                          fontWeight: "bold",
                                          color: "primary.main",
                                        }}
                                      >
                                        {wagon.kodaNHMVagona}
                                      </Typography>
                                    </Box>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      {wagon.opisNHM}
                                    </Typography>
                                  </Box>

                                  <Divider
                                    sx={{ borderColor: "#ddd", mb: 2 }}
                                  />

                                  <Box
                                    sx={{
                                      mb: 2,
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 1,
                                    }}
                                  >
                                    <Typography variant="body2">
                                      <strong>Serija Vagona:</strong>{" "}
                                      {wagon.serijaVagona}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Tara:</strong> {wagon.taraVagona}{" "}
                                      kg
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Neto Teža:</strong>{" "}
                                      {wagon.netoTezaVagona} kg
                                    </Typography>
                                  </Box>

                                  <Divider
                                    sx={{ borderColor: "#ddd", mb: 2 }}
                                  />
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <Box>
                                      <strong>Odpr. drzava:</strong>
                                      <Tooltip
                                        placement="right"
                                        title={wagon.nazivOdpravneDrzave}
                                        slotProps={{
                                          popper: {
                                            modifiers: [
                                              {
                                                name: "offset",
                                                options: {
                                                  offset: [0, -15],
                                                },
                                              },
                                            ],
                                          },
                                        }}
                                        arrow
                                      >
                                        <Chip
                                          variant="outlined"
                                          sx={{ border: "0px", ml: -1 }}
                                          label={
                                            <Typography
                                              sx={{
                                                fontWeight: "bold",
                                                color: "primary.main",
                                              }}
                                            >
                                              {wagon.odpravnaDrzavaVagona}
                                            </Typography>
                                          }
                                        ></Chip>
                                      </Tooltip>
                                    </Box>
                                    <Box>
                                      <strong>Nam. drzava:</strong>
                                      <Tooltip
                                        placement="right"
                                        title={wagon.nazivNamembneDrzave}
                                        slotProps={{
                                          popper: {
                                            modifiers: [
                                              {
                                                name: "offset",
                                                options: {
                                                  offset: [0, -15],
                                                },
                                              },
                                            ],
                                          },
                                        }}
                                        arrow
                                      >
                                        <Chip
                                          variant="outlined"
                                          sx={{ border: "0px", ml: -1 }}
                                          label={
                                            <Typography
                                              sx={{
                                                fontWeight: "bold",
                                                color: "primary.main",
                                              }}
                                            >
                                              {wagon.namembnaDrzavaVagona}
                                            </Typography>
                                          }
                                        ></Chip>
                                      </Tooltip>
                                    </Box>
                                    {wagon.naslednjiPrevoznikVagona != null && (
                                      <Box>
                                        <strong>Nasl. prevoznik:</strong>
                                        <Tooltip
                                          placement="right"
                                          title={wagon.nazivPrevoznika}
                                          slotProps={{
                                            popper: {
                                              modifiers: [
                                                {
                                                  name: "offset",
                                                  options: {
                                                    offset: [0, -15],
                                                  },
                                                },
                                              ],
                                            },
                                          }}
                                          arrow
                                        >
                                          <Chip
                                            variant="outlined"
                                            sx={{ border: "0px", ml: -1 }}
                                            label={
                                              <Typography
                                                sx={{
                                                  fontWeight: "bold",
                                                  color: "primary.main",
                                                }}
                                              >
                                                {wagon.naslednjiPrevoznikVagona}
                                              </Typography>
                                            }
                                          ></Chip>
                                        </Tooltip>
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              </ListItemText>
                            </ListItem>
                            <Box
                              sx={{
                                borderBottom: "5px solid #015194",
                                borderRadius: "10px",
                                width: "100%",
                                my: 3,
                              }}
                            >
                              <Divider />
                            </Box>
                          </Box>
                        );
                      }
                    })}
                  </List>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value="1">
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                    mt: -1,
                  }}
                >
                  <Tooltip title="Osveži podatke" arrow>
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 65,
                        right: 6,
                        zIndex: 1000,
                      }}
                      onClick={() => {
                        handleRefresh();
                      }}
                    >
                      <RefreshIcon color="primary"></RefreshIcon>
                    </IconButton>
                  </Tooltip>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {showTrainDetailsTrain.statusVlaka == "neaktiven" && (
                      <Tooltip
                        title={"Vlak neaktiven: ".concat(
                          showTrainDetailsTrain.razlogNeaktivnostiVlaka
                        )}
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -7],
                                },
                              },
                            ],
                          },
                        }}
                        arrow
                        placement="top"
                      >
                        <Box
                          component="img"
                          sx={{
                            height: 22,
                            width: 22,
                          }}
                          src={neaktiven}
                        />
                      </Tooltip>
                    )}
                    {showTrainDetailsTrain.statusVlaka == "zakljucil" && (
                      <Tooltip
                        title={"Zaključil"}
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, -7],
                                },
                              },
                            ],
                          },
                        }}
                        arrow
                        placement="top"
                      >
                        <Box
                          component="img"
                          sx={{
                            height: 18,
                            width: 18,
                            mb: 0.1,
                          }}
                          src={zakljucil}
                        />
                      </Tooltip>
                    )}
                    {showTrainDetailsTrain.tipVlaka == "redni" ? (
                      <Chip
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor: theme.palette.secondary.main,
                            }}
                            variant="rounded"
                            src={redniVlak}
                          />
                        }
                        label={showTrainDetailsTrain.dodeljenaStevilkaVlaka}
                        color="secondary"
                        sx={{ mx: 1, padding: 2 }}
                      />
                    ) : (
                      <Chip
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor: theme.palette.secondary.main,
                            }}
                            variant="rounded"
                            src={izredniVlak}
                          />
                        }
                        label={showTrainDetailsTrain.dodeljenaStevilkaVlaka}
                        color="secondary"
                        sx={{ mx: 1 }}
                      />
                    )}

                    <Box
                      component="img"
                      sx={{
                        height: 40,
                        width: 40,
                      }}
                      src={arrow}
                    />

                    <Typography sx={{ mx: 1 }} variant="subtitle1">
                      {showTrainDetailsTrain.nazivKoncnePostaje}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <List>
                    {allStopsOfTrain.map((stop) => {
                      if (
                        stop.idPostajePostanka !=
                        showTrainDetailsTrain.idZacetnaPostajaSZVlaka
                      ) {
                        return (
                          <Box key={stop.idPostajePostanka}>
                            <Box
                              sx={{
                                borderBottom: "2px solid #015194",
                                borderRadius: "10px",
                                width: "100%",
                              }}
                            >
                              <Divider />
                            </Box>
                            <ListItem
                              disablePadding
                              key={stop.idPostajePostanka}
                            >
                              <ListItemButton
                                onClick={() => {
                                  setSearchStationValue({
                                    label: stop.idPostajePostanka.toString(),
                                    dodatno: stop.nazivPostaje,
                                  });
                                }}
                              >
                                <ListItemIcon>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 180,
                                      ml: -5,
                                    }}
                                  >
                                    <Box>
                                      <Chip
                                        avatar={
                                          <Avatar
                                            variant="rounded"
                                            src={
                                              stop.idPostajePostanka ==
                                                showTrainDetailsTrain.idNaslednjePostajePostanka &&
                                              showTrainDetailsTrain.idTrenutnaPostajaVlaka !=
                                                stop.idPostajePostanka
                                                ? prihajaVlak
                                                : stop.dejanskiPrihod == null
                                                ? niVlaka
                                                : postanekSlika
                                            }
                                          />
                                        }
                                        label={
                                          <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: "bold" }}
                                          >
                                            {stop.idPostajePostanka}
                                          </Typography>
                                        }
                                        variant="outlined"
                                        sx={{
                                          borderWidth: 3,
                                          borderColor: "primary.main",
                                        }}
                                      />
                                    </Box>
                                    <Box>
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ mt: 1, fontWeight: "bold" }}
                                      >
                                        {stop.nazivPostaje}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ my: -0.5 }}>
                                      {stop.zamuda !== null && (
                                        <Typography
                                          variant="subtitle2"
                                          sx={{ fontWeight: "bold" }}
                                        >
                                          {stop.zamuda < 0
                                            ? stop.zamuda.toString()
                                            : "+".concat(
                                                stop.zamuda.toString()
                                              )}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                </ListItemIcon>
                                <ListItemText>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",

                                      ml: 2,
                                    }}
                                  >
                                    <Box sx={{ mb: 1 }}>
                                      <Typography sx={{ fontWeight: "bold" }}>
                                        Načrtovan prihod:
                                      </Typography>
                                      <Typography>
                                        {stop.nacrtovanPrihod}
                                      </Typography>
                                    </Box>
                                    <Divider></Divider>
                                    <Box sx={{ mt: 1 }}>
                                      <Typography sx={{ fontWeight: "bold" }}>
                                        Dejanski prihod:
                                      </Typography>
                                      <Typography>
                                        {stop.dejanskiPrihod == null
                                          ? "/"
                                          : stop.dejanskiPrihod}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </ListItemText>
                              </ListItemButton>
                            </ListItem>
                          </Box>
                        );
                      }
                    })}
                  </List>
                </Box>
              </Box>
            </TabPanel>
          </TabContext>
        </Box>
      </Paper>
    </Box>
  );
}

export default TrainDetails;
